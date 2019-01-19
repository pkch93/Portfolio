---
layout: post
title: "ruby on rails"
date: 2018-10-29 13:00:00 +0900
period: 약 6개월
category: skills
more_details: ruby on rails
---

2018년 3월에 멋쟁이사자처럼 활동을 시작한 후로 배우게 된 프레임워크입니다.

rails로 controller, model 생성하는 방법에 대해 이해하고 사용할 수 있습니다.

ex1> rails g controller [Controller name] [...method name]

ex2> rails g model [Model name] [...column name:type]

위와 같이 cli에서 rails 명령어를 사용하여 controller와 model를 생성할 수 있습니다.

그리고 gemfile과 bundler에 대해 이해하고 있으며 gem 명령어를 통해 devise 같은 외부 ruby 모듈을 받아와서 사용할 수 있습니다.

rails의 필터기능(before_action과 after_action)을 활용하여 로그인 전처리, 인증이 안될시 접근 제한 등의 기능을 구현할 수 있습니다.

rails의 템플릿 엔진인 erb를 이용하여 스크립트릿 (&lt;% ... %>)과 표현식 (&lt;%=...%>)을 사용할 수 있습니다. 또한 rails가 제공해주는 helper인 form_for와 form_tag의 차이를 이해하고 사용할 수 있습니다.

> ※ form_for와 form_tag의 차이

> form_for는 주로 어떤 Model의 데이터를 조작할 떄 사용하며 form_tag는 검색 등의 범용적인 기능을 구현할 때 사용합니다. 이는 form_for는 생성시 model 객체를 인자로 등록하여 사용하지만 form_tag는 그렇지 않기 때문입니다.

이렇게 이해한 rails 개념을 이용하여 멋쟁이사자처럼 해커톤에 참가했고 rails 애플리케이션을 개발할 수 있었습니다. ([확인하기](https://pkch93.github.io/project/2018/10/29/likelion-hackerthon/))
