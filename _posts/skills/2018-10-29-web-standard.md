---
layout: post
title: "Web Standard"
date: 2018-10-29 12:58:00 +0900
period: 약 1년
category: skills
more_details: html5 & css3 & javascript
---

*이 포스트에서는 웹 표준 기술인 HTML5, CSS3, JS에 대해 제가 할 수 있는 것을 기술합니다.*

## HTML5 & CSS3

HTML5의 박스모델에 대해 이해하고 있습니다. ( margin - border - padding - content)

이를 통해 CSS 스타일링 시 layout을 잡을 수 있습니다.

또한, block 속성과 inline 속성의 차이를 알고 있으며 각각 속성에서 사용 가능한 CSS 속성에 대해서도 알고 있습니다. (ex> margin, padding은 block 속성에서는 사용 가능한 반면 inline 속성에서는 적용되지 않는다.)

HTML5가 되면서 생긴 시멘틱 웹 태그(main, section, article, aside, nav, header, footer 등)에 대해서 이해하고 사용하고 있습니다.

CSS의 경우는 선택자 (태그, #id, .class) 지정법, 자식선택자, 가상선택자(:hover, :focus) 등 선택자 지정 방법에 대해 이해하고 사용하고 있습니다.

### SASS/SCSS

CSS 전처리기로 주로 {}을 쓰는 SCSS를 사용하고 있습니다. SCSS의 변수 선언, Partials와 import, 연산자 사용에 대해 이해하고 있으며 사용가능합니다.

### BEM

CSS 클래스 명명법입니다. BEM의 Block-Element-Modifier에 대해 이해하고 사용할 수 있습니다. (다만, 어떻게 해야 잘쓸 수 있을지 고민하고 있습니다.)

BEM을 알게 된 후부터는 최대한 CSS 클래스 명명시 BEM 명명법을 사용하려고 하고 있습니다.

## Javascript

Client Side에서 javascript DOM 구조를 이해하고 있으며 document.getElementById, document.getElementByClasses, document.querySelector를 사용하여 DOM Node를 조작할 수 있습니다.

또한, addEventListener를 활용하여 javascript에서 이벤트 등록을 할 수 있으며 반대로 removeEventListner로 등록한 이벤트를 삭제할 수 있습니다.

javascript에서 발생하는 이벤트 버블링에 대해 이해하고 있으며 stopPropagation()으로 버블링을 제거할 수 있습니다.

> ※ 버블링

> 자식 DOM Node에 적용한 이벤트가 부모 DOM Node에도 적용되는 현상

이 외에도 호이스팅, 함수 선언식 & 변수식, 클로저, prototype 객체 등에 대해 이해하고 있습니다.

### ES6

Javascript 진영에서 가장 획기적인 변화를 가져온 버전 (ECMAScript 2015)

let과 const를 이해하고 사용할 수 있습니다. (let은 중간에 값이 변하는 변수 const는 상수처럼 값이 변하지 않는 변수)

> var은 기본적으로 변수 스코프를 가지지 않는데 let을 사용하면 변수 스코프를 가져 반복문에서 클로저를 피할 수 있다.

arrow function으로 Javascript에서 lambda를 사용할 수 있습니다.

Array를 다룰 때 ... (Spread Operator, 전개 연산자), {} (destructuring, 비구조화)를 사용할 수 있습니다.

또한 비동기처리를 위한 Promise와 async/await (ES7)를 사용할 수 있습니다.

### jQuery

$ 키워드를 사용하여 jQuery를 사용할 수 있습니다. 주로 ajax 통신과 on 메서드를 사용하여 이벤트 등록을 하는데 jQuery를 사용하고 있습니다.
