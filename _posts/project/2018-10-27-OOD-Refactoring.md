---
layout: post
title: "OOD-Refactoring"
date: 2018-10-27 23:00:00 +0900
category: project
isprogress: true
period: 2018.08.27~진행중
description: 콘솔로 구현했던 객체지향설계 프로젝트 리펙토링(by Spring)
more_details: ["java", "spring"]
---

객체지향설계(Object Oriented Design) 프로젝트 리펙토링 (개인프로젝트)

## Environment

PL | front-end | back-end | DB | IDE
--- | --- | --- | --- | ---
java (JDK 1.8) | HTML5 & CSS3 & javascript & jQuery | Spring 4.3.4 | MySQL | Eclipse Oxyzen

## 개발개요

이 repository는 2017년도 가을학기 객체지향설계를 수강하고 나온 결과물을 Spring framework로 다시 구현하기 위한 repository입니다.

객체지향설계 팀 프로젝트에서 예매 시스템 중 영화 예매 시스템으로 팀 프로젝트를 하였지만 당시 콘솔로 구현한 것이 끝이였기 때문에 최근에 익힌 Spring framework를 이용하여 당시 설계했던 영화 예매 시스템을 구현하는 것이 목표입니다.


## DB 설계

![](/assets/img/project/OOD-Refactoring/class-diagram.PNG)

## 주요 사용 기능

### Spring Security

Spring Security가 제공해주는 login, logout으로 구현하였습니다.

※ Spring Security를 이용할 때 주로 자바설정을 이용하며 Config 클래스에서 WebSecurityConfigurerAdapter를 상속받아 설정을 해줍니다.

아래는 configure에서 설정한 login 및 logout입니다.

{% highlight java linenos %}
@Override
protected void configure(HttpSecurity http) throws Exception {
	// TODO Auto-generated method stub
	http
		.authorizeRequests()
		.antMatchers("/login", "/join", "/").permitAll()
		.anyRequest().authenticated()
		.and()
		.formLogin().loginPage("/login")
    .usernameParameter("accountId").passwordParameter("accountPw")
    .defaultSuccessUrl("/", true)
		.and()
		.logout().logoutUrl("/logout").logoutSuccessUrl("/")
		.and().exceptionHandling();
}
{% endhighlight %}

먼저 요청 url에 대해 index 페이지, 로그인 페이지, 회원가입 페이지는 권한이 없더라도 누구나 접근 가능하도록 만들었습니다. 그 외 모든 url은 로그인을 통해 인증을 받아야합니다.

login 페이지는 Spring Security가 기본으로 제공하는 form 페이지보다는 직접 구현한 로그인 페이지를 사용하기 위해 loginPage("/login") 메서드를 호출하여 "/login" url 요청이 들어오면 구현한 로그인 페이지가 나타나도록 했습니다. 그리고 Spring Security에서는 기본적으로 username과 password를 각각 username과 password라는 이름으로 값을 받아옵니다. 이를 바꿔주기 위해 usernameParameter와 passwordParameter 메서드로 바꿔줬습니다.

logout은 logoutUrl 메서드로 "/logout"으로 지정하여 로그아웃이 되도록 만들었습니다.

form으로 들어온 로그인 정보에 대한 인증은 JDBC 인증을 사용하였습니다.

Spring에서 login을 직접 구현하는데 사용하는 인터페이스로 UserDetailsService와 AuthenticationProvider가 있습니다.

이 때, login 로직을 커스텀하기 위해서는 UserDetails와 UserDetailsService를 구현해야합니다. 따라서 이 두 클래스를 상속받은 객체를 구현하였고 인증은 Spring이 제공하는 AuthenticationProvider를 이용하였습니다.

다음은 설정코드, UserDetailsService 구현객체, UserDetails 구현객체 코드입니다.

{% highlight java linenos %}
// Security 설정
@Override
protected void configure(AuthenticationManagerBuilder auth) throws Exception {
  // TODO Auto-generated method stub
  auth.inMemoryAuthentication()
    .withUser("pkch").password("1234").roles("USER", "ADMIN").and()
    .withUser("user").password("1234").roles("USER");  
  auth.userDetailsService(accountService);
}
{% endhighlight %}

위 코드를 보면 inMemoryAuthentication과 userDetailsService가 있습니다.
inMemoryAuthentication은 메모리에 아래 chaining으로 호출한 메소드들로 설정한 User들을 등록하여 애플리케이션의 테스트용으로 사용했습니다.

그리고 JDBC 인증을 위해 userDetailsService의 인자로 userDetailsService의 구현체인 AccountService를 넣어주었습니다.

{% highlight java linenos %}
// UserDetailsService 구현
@Service
public class AccountService implements UserDetailsService {

  // ...(이전 중략)
	@Override
	public UserDetails loadUserByUsername(String accountId)
  throws UsernameNotFoundException {
		Account account = accountDAO.read(accountId);
		if(account == null) {
			throw new UsernameNotFoundException(accountId);
		}
		return account;
	}
}
{% endhighlight %}

{% highlight java linenos %}
// UserDetails 구현
@Component
@Data
public class Account implements UserDetails{
	private String accountId;
	private String accountPassword;
	private String accountName;
	private Integer age;
	private String phone;
	private String address;
	private boolean isAdmin;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// TODO Auto-generated method stub
		ArrayList<SimpleGrantedAuthority> authorities = new ArrayList<>();
		if(isAdmin) {
			authorities.add(new SimpleGrantedAuthority("ADMIN"));
		}
		authorities.add(new SimpleGrantedAuthority("USER"));
		return authorities;
	}
  // ...
}
{% endhighlight %}

위는 권한 설정을 위한 getAuthorities 메소드입니다.

만약 해당 로그인한 account의 isAdmin 속성이 true라면 관리자라는 의미이므로 "ADMIN" 권한을 부여해주고 그렇지 않다면 일반 "USER"로 권한을 부여해줍니다.

### Mybatis

DB를 다루는데는 Mybatis를 사용하였습니다.

아래는 Mybatis를 사용하기 위한 설정을 자바설정으로 한 코드입니다.

{% highlight java linenos%}
@Configuration
@ComponentScan(excludeFilters=@Filter(type=FilterType.ANNOTATION, classes=EnableWebMvc.class))
public class RootConfig {
	@Bean
	public DataSource dataSource() {
		DriverManagerDataSource dm = new DriverManagerDataSource();
		dm.setDriverClassName("com.mysql.cj.jdbc.Driver");
		dm.setUrl("jdbc:mysql://localhost:3306/ood?"
     + "SSLuse=false&serverTimezone=UTC&useUnicode=true"
     + "&characterEncoding=utf8");
		dm.setUsername("park");
		dm.setPassword("1234");
		return dm;
	}

	@Bean
	public SqlSessionFactory sqlSessionFactory() throws Exception {
		DataSource dataSource = dataSource();
		SqlSessionFactoryBean sqlSessionFactory = new SqlSessionFactoryBean();
		sqlSessionFactory.setDataSource(dataSource);
		sqlSessionFactory.setMapperLocations(
              new PathMatchingResourcePatternResolver()
              .getResources("com/moviereserve/park/DAO/mapper/*.xml")
            );
		return (SqlSessionFactory) sqlSessionFactory.getObject();
	}

	@Bean
	public SqlSession sqlSession() throws Exception {
		SqlSessionTemplate session = new SqlSessionTemplate(sqlSessionFactory());
		return session;
	}
}
{% endhighlight %}

이를 통해 xml파일로 Mapper를 설정하여 DB를 조작할 수 있습니다. 아래는 Account 정보에 대하여 Mapper를 설정한 xml파일입니다.

{% highlight xml linenos %}
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
  PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.moviereserve.park.DAO.AccountDAO">
  <insert id="create">
  	INSERT INTO ACCOUNT VALUES
  	(#{accountId}, #{accountPw}, #{accountName},
  	#{phone}, #{address}, #{isAdmin})
  </insert>
  <select id="read" resultType="com.moviereserve.park.DTO.Account">
  	SELECT * FROM ACCOUNT WHERE ACCOUNTID = #{accountId}
  </select>
  <delete id="delete">
  	DELETE FROM ACCOUNT WHERE ACCOUNTID = #{accountId}
  </delete>
  <select id="login" resultType="com.moviereserve.park.DTO.Account">
  	SELECT * FROM ACCOUNT WHERE ACCOUNTID = #{accountId} and ACCOUNTPW = #{accountPw}
  </select>
</mapper>
{% endhighlight %}

이를 통해 AccountDAO객체의 인스턴스로 데이터를 조작할 수 있습니다.

## 구현기능

아직 진행중인 프로젝트입니다 ㅠㅠ 추후 업로드 하겠습니다!
