---
layout: post
title: Card Share
date: 2019-02-06 15:50:00 +0900
category: project
period: 2018.12.25~2018.12.31
description: 신년 맞이 카드 작성 및 공유 서비스
more_details: ["python", "flask", "postgres"]
---

# Card Share Project

신년 맞이 카드 작성 및 공유 서비스

## MEMBER

이름 | 역할
:--: | :--:
김호현 | 서비스 기획 / 홍보
박경철 | Back-End 개발
노우제 | Front-End 개발

## ENVIRONMENT

- Front-End

    > HTML5
    >
    > CSS3
    >
    > Javascript

- Back-End

    > Python 3.6.7
    >
    > Flask 1.0.2
    >
    > jinja template engine

- DB

    > postgresql 10.6

- Cloud

    > AWS S3
    >
    > Heroku server

## 기획

### 행복 카드 공유 서비스

> *평소 전하지 못한 말이나 안부를 추억의 사진과 함께 나누어 행복한 삶을 살아가자*

- Background (이 서비스를 생각하게 된 배경)

    - 크리스마스 카드를 보내려고 했는데 온라인으로 만들기 번거로움

    - 많은 사람들에게 쉽고 빠르게 공유할 수 있는 카드를 만들기 위함

- How it Works (누구를, 어디서, 어떻게)

    Who? 
    
    새해, 기념일, 생일, 명절 등 안부 인사를 전하려는 사람들 대상

    Where?

    자주 사용하는 메신저에 링크를 통해 공유

    How?

    전하는 사람과의 추억이 담긴 사진, 의미있는 사진을 글과 함께 작성한다.

    공유한 링크를 클릭했을 때 스스로 만든 온라인 카드가 보여진다.

- Key benefits (기대효과)

    - 많은 사람들이 쉽고 빠르게 추억을 공유할 수 있을 것으로 기대

    - 따뜻한 말 한마디로 인간관계 유지 및 회복

- Marketing (홍보)

    - 지인들에게 카카오톡 공유 및 소개

    - 페이스북 페이지 홍보

    - 커뮤니티 사이트 및 채팅방 홍보

## Use-Case

![유스케이스 다이어그램](/assets/img/project/cardshare/Use-case.PNG)

> ※ 로그인 없이 간단히 카드를 만들고 메신저를 통해 공유하는 기능의 서비스 

## DB 설계

![클래스 다이어그램](/assets/img/project/cardshare/Class-diagram.PNG)

> 1. 회원 관리할 필요가 없이 사용자가 작성한 Card 정보를 DB에 저장 후 카드 템플릿에 렌더링하는 방식이므로 Card Table 한 개만 존재
>
> 2. id가 primary key, secret_code는 unique 값으로 uuid를 이용
>
> 3. card_type에 따라 사용자가 선택한 card template에 정보를 랜더링
>
> 4. img_url은 업로드하는 이미지가 AWS S3에 저장되므로 존재

## URL 설계

1. {baseurl}/ (index 페이지)

맨 처음 cardshare를 소개하는 페이지로 이동한다. cardshare가 제공하는 다양한 card template를 볼 수 있고 해당 template을 클릭하면 글을 쓸 수 있는 폼으로 이동한다.

- card type 1

![카드 타입 1](/assets/img/project/cardshare/card1.png)

- card type 2

![카드 타입 2](/assets/img/project/cardshare/card2.png)

- card type 3

![카드 타입 3](/assets/img/project/cardshare/card3.png)

- card type 4

![카드 타입 4](/assets/img/project/cardshare/card4.png)



2. {baseurl}/card/create (form 페이지)

메인 페이지에서 만들고자 하는 card template를 클릭하면 이동하는 페이지

card type은 url querystring으로 type이라는 키로 값을 전달한다.

form에서는 카드를 받는 사람, 쓰는 사람, 제목, 내용, 사진을 기입해야하며 이 값들을 모두 넣어야만 **미리보기**와 **카드 작성**이 가능하다.

### ※ 미리보기 예시

![미리보기 예시](/assets/img/project/cardshare/preview-ex.PNG)

이때 카드에 들어가는 사진의 비율은 1:1이 최적이므로 cropper.js를 통해 올리는 사진을 1:1로 자를 수 있도록 제공해준다. (사진 업로드 시 등장)

### ※ Cropper 예시

![Cropper 예시](/assets/img/project/cardshare/cropper-ex.PNG)

3. {baseurl}/card/<card.secret_code> (작성한 카드의 url)

위 url로는 작성한 카드를 볼 수 있다. card에 저장된 **secret_code**로 url을 구분한다.

작성한 카드 밑에는 ***카드 만들기*** 와 ***카드 공유하기*** 가 존재하며 카드 만들기는 index 페이지로 카드 공유하기는 카카오톡 링크를 이용하여 전하고 싶은 상대의 카카오톡 채팅방으로 링크를 전달하도록 해준다.

### ※ 완성 카드 예시

![카드 앞면](/assets/img/project/cardshare/card-front-ex.PNG)

![카드 뒷면](/assets/img/project/cardshare/card-back-ex.PNG)

### ※ 카카오톡 공유 예시

![카카오톡 공유 예시](/assets/img/project/cardshare/share-preview.PNG)

## Contact

site url : [http://cardshare.space](http://cardshare.space)

> email : cardshare.space@gmail.com
>
> by 김호현, 박경철, 노우제