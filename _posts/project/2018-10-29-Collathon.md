---
layout: post
title: "Collathon"
date: 2018-10-29 13:40:00 +0900
category: project
period: 2018.09.12~2018.10.16
description: 반려동물의 혈통 및 족보를 관리 및 분양 알선 플랫폼
more_details: ["html5", "css3", "js", "java", "spring", "spring-boot", "thymeleaf", "h2-database"]
---
충남대학교 컴퓨터공학과 모션 동아리에서 주최하는 Collathon 대회 프로젝트

## Environment

front-end | back-end | DB
--- | --- | ---
thymeleaf & jQuery | Spring boot | H2

## Member

박경철 | 김진현 | 정재성 | 장종원
--- | --- | --- | ---
팀장 & 개발자 | 디자이너 | 기획자 & 발표 | 기획자

## 개발 개요

펫팸족(Pet+Family) 100만, 반려동물 수 1000만 시대가 도래했다!

1인 가구 증가, 인구 고령화, 혼족 등이 증가함에 따라 취미삼아 기르던 애완동물이 삶을 나누는 반려동물로 인식되며 1인 가구의 필수 가족 구성원으로 자리잡아 가고 있습니다.

반려동물 분양에 대한 관심 또한 크게 증가 하여 반려동물 분양 시 어떤 종의 어떤 브리더에게서 분양 받았으며 어떻게 사는지, 어떤 성격과 어떤 특성의 종이 만나 자신의 반려동물로 되었는지, 아니면 분양 해 주었던 자신의 반려견의 후손들이 어떻게 살고 있는지에 대한 호기심을 갖는 사람들 또한 증가 하고 있습니다.

이에 따라 반려동물의 혈통 및 족보를 추적해주고 지금 현황을 알려주며, 분양까지 알선 해 주는 서비스를 개발하고자 합니다.

## DB 설계

![](/assets/img/diagram/Collathon/class-diagram.PNG)

## 주요 사용 기능

### JPA & Hibernate

Java에서 ORM을 지원해주는 JPA에 관심이 많아 실제로 프로젝트에서 사용해보았습니다.

{% highlight xml linenos%}
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
{% endhighlight %}

위와 같이 의존성을 주입하면 JPA 관련 의존성이 모두 들어옵니다.

이를 사용하여 Entity 설정과 JpaRepository를 활용한 데이터 조작을 할 수 있습니다.

아래는 Users Entity와 Users 데이터 조작을 위한 JpaRepository입니다.

{% highlight java linenos %}
@Entity
@Data
@Validated
public class Users {
    @Id @Column(name="USER_ID")
    private Long id;
    private String name;
    private String email;
    private String age;
    private String gender;
    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Pet> pets;
}
{% endhighlight %}

`@Entity` 어노테이션으로 Users 클래스를 테이블로 설정합니다. `@Data`는 Lombok을 사용한 것으로 자동으로 getter/setter, constructor, toString, hashCode 등을 생성해줍니다.

이렇게 만든 Entity의 데이터를 조작하기 위해 UserRepository라는 인터페이스를 만들고 JpaRepository를 상속받아 사용합니다. 제네릭 변수의 첫번째는 엔티티 객체, 두번째는 primary key의 타입을 적어줍니다.

아래는 UserRepository의 코드입니다.

{% highlight java linenos %}
@Repository
public interface UserRepository extends JpaRepository<Users, Long> {
}
{% endhighlight %}

### 네이버 아이디로 로그인 API

네이버 아이디로 로그인 API를 적용하기 위해 `com.github.scribejava.core.builder.api.DefaultApi20` 모듈을 가져와 사용하였습니다.

아래는 적용 코드입니다.

{% highlight java linenos %}
public class NaverLoginApi extends DefaultApi20 {

    private static class InstanceHolder{
        private static final NaverLoginApi INSTANCE = new NaverLoginApi();
    }

    public static NaverLoginApi instance(){
        return InstanceHolder.INSTANCE;
    }
    @Override
    public String getAccessTokenEndpoint() {
        return "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code";
    }

    @Override
    protected String getAuthorizationBaseUrl() {
        return "https://nid.naver.com/oauth2.0/authorize";
    }
}
{% endhighlight %}

{% highlight java linenos %}
@Service
public class NaverLoginBO {

    @Autowired
    UserRepository userRepository;

    private final static String CLIENT_ID = "CLIENT_ID";
    private final static String CLIENT_SECRET = "CLIENT_SECRET";
    private final static String REDIRECT_URL = "http://localhost:8080/callback";
    private final static String SESSION_STATE = "oauth_state";
    private final static String PROFILE_API_URL = "https://openapi.naver.com/v1/nid/me";

    public String getAuthorizationUrl(HttpSession session){

        String state = generateRandomString();
        setSession(session, state);

        OAuth20Service oAuth = new ServiceBuilder()
                .apiKey(CLIENT_ID)
                .apiSecret(CLIENT_SECRET)
                .callback(REDIRECT_URL)
                .state(state)
                .build(NaverLoginApi.instance());
        return oAuth.getAuthorizationUrl();
    }

    public OAuth2AccessToken getAccessToken
    (HttpSession session, String code, String state) throws IOException {
        String sessionState = getSession(session);
        if(StringUtils.equals(sessionState, state)){
            OAuth20Service oAuth = new ServiceBuilder()
                    .apiKey(CLIENT_ID)
                    .apiSecret(CLIENT_SECRET)
                    .callback(REDIRECT_URL)
                    .state(state)
                    .build(NaverLoginApi.instance());

            OAuth2AccessToken token = oAuth.getAccessToken(code);
            return token;
        }
        return null;
    }

    public Users getUserProfile(OAuth2AccessToken oauthToken)
     throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        OAuth20Service oAuthService = new ServiceBuilder()
                .apiKey(CLIENT_ID)
                .apiSecret(CLIENT_SECRET)
                .callback(REDIRECT_URL)
                .build(NaverLoginApi.instance());
        OAuthRequest request = new OAuthRequest(Verb.GET, PROFILE_API_URL, oAuthService);
        oAuthService.signRequest(oauthToken, request);
        String result = request.send().getBody();
        Map<String, Object> map = mapper.readValue(result,
          new TypeReference<Map<String, Object>>(){});
        Users user = mapper.readValue
        (mapper.writeValueAsString(map.get("response")),Users.class);
        Long searchId = user.getId();
        if(!userRepository.existsById(searchId)) userRepository.save(user);
        return user;
    }

    private String generateRandomString(){
        return UUID.randomUUID().toString();
    }

    private void setSession(HttpSession session, String state){
        session.setAttribute(SESSION_STATE, state);
    }

    private String getSession(HttpSession session){
        return (String) session.getAttribute(SESSION_STATE);
    }
}
{% endhighlight %}

네이버 아이디로 로그인 시 반환값이 Json 형태의 String인데 이를 객체로 만들어 주기 위해
jackson을 사용했습니다.

그리고 만약 가져온 User 값이 DB에 저장되어있다면 그대로 user를 반환해주고 아니라면 DB에 user 정보를 저장하도록 구현했습니다.

### AWS S3

저희 서비스에 애완동물 프로필 사진을 담아야 하는데 담을 저장소를 AWS의 S3 저장소로 설정하는 코드를 작성하였습니다.

아래는 S3 저장소에 업로드하기 위해 AmazonS3Client 클래스를 활용한 코드입니다.

{% highlight java linenos %}
@RequiredArgsConstructor
@Component
public class S3Uploader {

    private final AmazonS3Client amazonS3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    public String upload(MultipartFile multipartFile, String dirName) throws IOException {
        File uploadFile = convert(multipartFile).orElseThrow(()
        -> new IllegalArgumentException("MultipartFile -> File로 전환이 실패했습니다."));
        return upload(uploadFile, dirName);
    }

    private String upload(File uploadFile, String dirName) {
        String fileName = dirName + "/" + uploadFile.getName();
        String uploadImageUrl = putS3(uploadFile, fileName);
        removeNewFile(uploadFile);
        return uploadImageUrl;
    }

    private String putS3(File uploadFile, String fileName) {
        amazonS3Client.putObject(new PutObjectRequest(bucket, fileName, uploadFile)
        .withCannedAcl(CannedAccessControlList.PublicRead));
        return amazonS3Client.getUrl(bucket, fileName).toString();
    }

    private void removeNewFile(File targetFile) {
        targetFile.delete();
    }

    private Optional<File> convert(MultipartFile file) throws IOException {
        File convertFile = new File(file.getOriginalFilename());
        if(convertFile.createNewFile()) {
            try (FileOutputStream fos = new FileOutputStream(convertFile)) {
                fos.write(file.getBytes());
            }
            return Optional.of(convertFile);
        }
        return Optional.empty();
    }
}

{% endhighlight %}

## 구현 기능

### 로그인 및 로그아웃

저희 프로젝트의 로그인은 네이버 로그인으로만 가능하게 설정하였습니다. `com.github.scribejava.core.builder.api.DefaultApi20` 모듈로 API를 적용하여 로그인을 구현하였습니다.

로그아웃의 경우 `/logout`으로 요청이 들어오면 session 값을 비워서 구현하였습니다.

{% highlight java linenos %}
public String logout(HttpSession session){
    session.invalidate();
    return "redirect:/";
}
{% endhighlight %}

### 애완동물 검색기능

애완동물 정보로는 동물종류, 품종, 이름 등이 있습니다. 검색은 동물종류, 품종, 이름으로 할 수 있도록 구현했습니다.

form에서 method값으로 검색 방법(동물종류, 품종, 이름 중 하나)과 query로 검색자가 검색하려는 문자를 보내 검색을 실행합니다.

{% highlight java linenos %}
public List<Pet> searchPets(String method, String query){
    List<Pet> searchResult = null;
    if (method.equals("name")) searchResult = petRepository.findByNameLike(query);
    else if (method.equals("category")) searchResult = petRepository.findByCategory(query);
    else if (method.equals("breed")) searchResult = petRepository.findByBreed(query);
    return searchResult;
}
{% endhighlight %}

위에 각각 method에 맞는 정보를 찾기 위해서 petRepository에 메소드를 추가로 지정해주었습니다.

{% highlight java linenos %}
@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
    @Query("select u from Pet u where u.name like %?1%")
    List<Pet> findByNameLike(String name); // 이름 검색
    List<Pet> findByUserName(String name); // 유저이름 검색
    List<Pet> findByCategory(String category); // 분류 검색
    List<Pet> findByBreed(String breed); //품종 검색
}
{% endhighlight %}

### 애완동물 등록, 정보수정, 이별 기능

회원이 애완동물을 등록할 수 있도록 합니다. 애완동물정보는 이름, 종류, 품종, 소개글, 사진, 분양여부를 회원에게서 받으며 이름, 종류, 품종은 필수입력정보로 구성하였습니다.

수정은 이름, 종류, 품종과 같은 필수정보를 수정하는 공간, multipart를 이용하여 file을 업로드하기 위한 사진, 소개글, 분양여부를 각각 수정할 수 있는 form을 두어 수정기능을 구현했습니다.

이별은 단순히 DB에서 User와 연관된 Pet을 삭제하는 기능입니다.

### 이력 등록 기능

회원이 등록한 팻과의 생활, 좋았던 일 등을 기록하는 기능입니다.
