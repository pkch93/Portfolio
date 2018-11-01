---
layout: post
title: "멋쟁이사자처럼 해커톤"
date: 2018-10-29 11:36:30 +0900
category: project
period: 2018.07.14~2018.08.24
description: 피드백을 받아보기 어려운 강사들을 위한 서비스 개발
more_details: ["ruby", "rails", "jquery"]
---

멋쟁이사자처럼 해커톤 프로젝트 **궁금한 강사** by <!DOCTYPE>

## Environment

front-end | back-end | DB
--- | :---: | ---
html5 & css3 & javascript & jquery | ruby on rails | SQLite

## Member

이세록 | 박경철 | 김유리 | 이동혁
--- | :---: | :---: | ---
기획 & front-end | 개발 총괄 (front-end & back-end) | UI Design & front-end | back-end

## 개발 개요

일반적으로 강사들이 자신의 강의에 대한 피드백을 받아보기 어렵습니다.

일부 강사들은 피드백을 받기 위해서 아르바이트를 고용하면서까지 피드백을 받아보려 하고 있습니다.

이런 강사들의 불편을 덜어주기 위한 아이디어로 '궁금한 강사'를 생각했습니다.

강사들이 강연 말미에 페이지 url 또는 QR코드를 관객에게 제공하여 관객들이 연령대, 배경지식과 같은 최소한의 정보만을 입력하여 리뷰를 작성하게하고 그 리뷰는 강사와 해당 강사의 강연을 궁금해하는 일반 사용자들이 참고할 수 있는 서비스를 생각하였습니다.

## DB 설계

![](/assets/img/project/LikeLion/Like-Lion-Hackerthon.PNG)

## 구현 기능

 *제가 구현한 기능 위주로 작성하였습니다.*

### 로그인 및 로그아웃

  devise gem을 쓰지 않고 session을 사용하여 직접 구현하였습니다.

  회원의 아이디는 lec_id라는 이름으로, 비밀번호는 lec_pw로 받아 검증합니다.

  만약 아이디가 없거나, 있더라도 비밀번호가 다른 경우 *flash attribute* 를 활용하여 "아이디 또는 비밀번호가 일치하지 않습니다"라는 경고 메세지를 login 창에 띄워줍니다.

  그렇지 않다면 session에 id라는 key안에 회원의 아이디를 넣어 로그인을 구현합니다.

  로그인 완료시 홈 화면으로 돌아갑니다.

  아래는 로그인을 구현한 코드입니다.

  {% highlight ruby linenos %}
  def logincheck
    lec_id = params[:lec_id]
    lec_pw = params[:lec_pw]
    temp = Lecturer.find_by lec_id: lec_id
    if temp && temp.pw == lec_pw
      session[:id] = lec_id
      redirect_to '/' and return
    else
      flash[:alert] = "아이디 또는 비밀번호가 일치하지 않습니다."
      render "login" and return
    end
  end
  {% endhighlight %}

  로그아웃은 단순히 해당 회원이 접속한 브라우저의 session[:id] 값을 null로 만들어 구현하였습니다.

  로그아웃 이후에는 홈 화면으로 넘어갑니다.

  {% highlight ruby linenos %}
  def logout
    session[:id] = nil
    @current_user = nil
    redirect_to '/'
  end
  {% endhighlight %}

### 회원가입

  이번 프로젝트의 주 대상은 **강사** 입니다. 강사가 본 애플리케이션에서 강연을 등록하고 청중들의 리뷰를 볼 수 있도록 만드는 게 주 목표입니다.

  따라서, 회원가입의 대상은 **강사** 로만 받습니다.

  phone과 email은 각각 정보가 나눠져 있기 때문에 따로 처리를 해주어 lecturer 정보로 구성하고 다른 이름, 아이디, 성별, 비밀번호, 소개글, 강사 카테고리, 프로필 사진은 rails의 Strong Parameter를 사용하여 받아왔습니다. lecturer_params 부분이 Strong Parameter로 회원정보를 받아온 부분입니다.

  {% highlight ruby linenos %}
  def create
    @lecturer = Lecturer.new(lecturer_params)
    @lecturer.phone = params[:phone1] + params[:phone2] + params[:phone3]
    @lecturer.email = params[:email] + "@" + params[:email_domain]
    lecturer_categories = params.require(:lecturer_categories).permit(:category)
    respond_to do |format|
      if @lecturer.save
        lecturer_categories[:category].split(",").each do |ctg|
          LecturerCategory.new(lecturer_id: @lecturer.id, category: ctg).save
        end
        format.html { redirect_to @lecturer, notice: 'Lecturer was successfully created.' }
        format.json { render :show, status: :created, location: @lecturer }
      else
        format.html { render :new }
        format.json { render json: @lecturer.errors, status: :unprocessable_entity }
      end
    end
  end

  # ...(중략)

  def lecturer_params
    params.require(:lecturer).permit(:lec_id, :pw,
       :pw_confirmation, :name, :sex, :age, :career, :region,
       :shortintro, :intro, :lec_img)
  end
  {% endhighlight %}

  또한 아래와 같이 Lecturer 정보를 검증하기 위한 validates를 지정하였습니다.

  {% highlight ruby linenos %}
  class Lecturer < ActiveRecord::Base
    has_many :lectures, dependent: :delete_all
    has_many :lecturer_categories, dependent: :delete_all

    mount_uploader :lec_img, ImageUploader
    validates :lec_id, :pw, :name, :phone, :email, :shortintro, presence: true

    validates :lec_id,
        presence: true, # 값이 비었는지 확인
        uniqueness: true,
        length: {minimum: 6, maximum: 20,
        too_short: "아이디는 6~20글자를 가집니다. 수정해주세요!",
        too_long: "아이디는 6~20글자를 가집니다. 수정해주세요!" }

    validates :pw,
        presence: true,
        confirmation: true,
        length: {minimum: 8, maximum: 20}

    validates :sex,
        inclusion: {in: ["남","여"]}

    validates :career,
        numericality: {only_integer: true, greater_than_or_equal_to: 0, less_than: 50}

    validates :shortintro,
        length: {maximum: 15}
  end
  {% endhighlight %}

### 회원 정보 수정

  등록된 회원의 정보를 수정하는 경우도 있습니다. 따라서 정보 수정 기능을 구현하였습니다.

  방식은 회원가입과 유사하게 구현하였습니다.

  {% highlight ruby linenos %}
    def update
    @lecturer.phone = params[:phone1] + params[:phone2] + params[:phone3]
    @lecturer.email = params[:email] + "@" + params[:email_domain]
    lecturer_categories = params.require(:lecturer_categories).permit(:category)
    respond_to do |format|
      if @lecturer.update(lecturer_params)
        current_ctg = LecturerCategory.where(lecturer_id: @lecturer.id)
        lecturer_categories[:category].split(",").each do |ctg|
            count = 0
            if current_ctg[count].nil?
              LecturerCategory.new(category: ctg, lecturer_id: @lectruer.id).save
            else
              current_ctg[count].update(category: ctg)
              count += 1
            end
        end
        format.html { redirect_to @lecturer, notice: 'Lecturer was successfully updated.' }
        format.json { render :show, status: :ok, location: @lecturer }
      else
        format.html { render :edit }
        format.json { render json: @lecturer.errors, status: :unprocessable_entity }
      end
    end
  end
  {% endhighlight %}

### 회원 탈퇴

  회원이 본 서비스를 더이상 이용하지 않을 수도 있습니다. 이를 위해 탈퇴기능을 구현하였습니다.

  {% highlight ruby linenos %}
  def destroy
    @lecturer.destroy
    respond_to do |format|
      format.html { redirect_to lecturers_url,
        notice: 'Lecturer was successfully destroyed.' }
      format.json { head :no_content }
    end
    session[:id] = nil
    @current_user = nil
  end
  {% endhighlight %}

  여기서 만약 회원 탈퇴시 `session[:id]` 값을 비워주지 않는다면 여전히 로그인 된 상태가 됩니다. 따라서 회원값을 삭제한 후 `session[:id]`값을 비워 로그아웃까지 완료합니다.

### 아이디 / 비밀번호 찾기

  회원이 아이디 및 비밀번호를 까먹었을 경우도 있습니다. 이를 위한 아이디 / 비밀번호 찾기 기능입니다.

  아이디 찾기는 검증을 위해 회원의 이름, 휴대폰번호, 이메일을 입력받아 검증합니다. 입력한 세가지 정보와 DB의 강사 정보가 일치한다면 회원에게 가입한 아이디를 알려줍니다.

  비밀번호 찾기는 아이디, 이름, 이메일을 입력받습니다. 이 세가지 정보가 일치한다면 새로운 비밀번호를 설정할 수 있도록 만들어줍니다.

  {% highlight ruby linenos %}
  def idfind
    name = params[:name]
    phonenumber = params[:phone1] + params[:phone2] + params[:phone3]
    email = params[:email]

    @lec = Lecturer.where(name: name, phone: phonenumber, email: email)
    # 일치하지 않더라도 빈 객체가 return
    @user_name = name
    if @lec.empty?
      flash[:alert] = "입력하신 정보가 일치하지 않습니다."
      render "find"
    end
  end

  def pwfind
    id = params[:id]
    name = params[:pw_name]
    email = params[:pw_email]

    @lec = Lecturer.where(lec_id: id, name: name, email: email)
    @user_name = name
    if @lec.empty?
      flash[:alert] = "입력하신 정보가 일치하지 않습니다."
      render "find"
    end
  end
  {% endhighlight %}

### 강연 등록 & 조회 & 수정 & 삭제

강연은 우리 프로젝트의 존재 이유입니다. 강사가 강연을 등록, 조회, 수정, 삭제할 수 있는 기능을 제공합니다.

{% highlight ruby linenos %}
def create
  @lecture = Lecture.new(set_lecture)
  @lecture.lecturer_id = params[:lecture][:lecturer]
  lecture_categories = params.require(:lecture_categories).permit(:category)
  # params 정보 가져오는 방법
  respond_to do |format|
    if @lecture.save
      lecture_categories[:category].split(",").each do |ctg|
        LectureCategory.new(lecture_id: @lecture.id, lec_category: ctg).save
      end
      format.html { redirect_to @lecture, notice: 'Lecturer was successfully created.' }
      format.json { render :show, status: :created, location: @lecturer }
    else
      format.html { render :new }
      format.json { render json: @lecture.errors, status: :unprocessable_entity }
    end
  end
end

def edit
  @lecture = Lecture.find(params[:id])
end

def destroy
  Lecture.find(params[:id]).destroy
  redirect_to :back
end

def show
  @lecture = Lecture.find_by(id: params[:id])
  @reviews = Review.where(lecture_id: params[:id])
  @review = Review.new
end
{% endhighlight %}

### 리뷰 작성

청중이 리뷰를 작성할 수 있도록 기능을 제공합니다.

익명으로 리뷰를 쓰며 간단한 인적사항(성별, 나이, 해당 강좌의 배경지식)과 추천여부, 평점, 코멘트를 작성합니다.

{% highlight ruby linenos%}
def create_review
  @review = Review.new(params.require(:review).permit(:sex,
     :age, :background, :point, :recommend, :content))
  @review.lecture_id = params[:review][:lecture]
  @review.save
  redirect_to lecture_path(params[:review][:lecture])
end
{% endhighlight %}

### 강사 검색

본 사이트를 찾아주는 사람들이 찾고 싶은 강사가 있을 수 있습니다. 강사 이름과 카테고리를 통해 검색하는 기능을 구현했습니다. 강사의 이름 중 검색 단어가 포함된 강사를 모두 검색 결과로 보여줍니다.

카테고리는 검색하고 싶은 카테고리를 선택하여 검색하면 해당하는 카테고리가 포함된 강사를 모두 검색결과로 보여줍니다.

{% highlight ruby linenos %}
def search
  @lecturers = Lecturer.where("NAME LIKE ?", "%#{params[:search_lec]}%").order(:name)
end

def ctgsearch
  categories = params.permit(:category)
  keywords = categories[:category].split(",")
  @lecturers = Lecturer.where(id: LecturerCategory.includes(:lecturer).
  select(:lecturer_id).where(category: keywords))
  render lecturers_search_path
end
{% endhighlight %}

### 강연 목록 보기

강사가 진행하고, 했던 강연들의 목록을 보여줍니다. (강사가 등록한 강연 모두 보여줌)

{% highlight ruby linenos %}
def show
 @lectures = Lecture.where(lecturer: @lecturer.id)
end
{% endhighlight %}
