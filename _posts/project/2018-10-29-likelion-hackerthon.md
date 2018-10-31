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
  {% endhighlight %}
### 회원 정보 수정

### 회원 탈퇴

### 아이디 / 비밀번호 찾기

### 강연 등록 & 수정 & 삭제

### 리뷰 작성

### 강사 검색

### 강연 목록 보기

## 시연 화면
