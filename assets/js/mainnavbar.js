var navbar = document.getElementById("navbar");
var navMenus = document.getElementById("menu");
var hbgMenus = document.getElementById("hamburger");
var introImg = document.getElementById("intro");

// var navMenuResize = function() {
//     if (window.innerWidth < 650){
//         hbgMenus.style.display = "block";
//         navMenus.style.display = "none";
//     }
//     else {
//         hbgMenus.style.display = "none";
//         navMenus.style.display = "block";
//     }
// };

// window.onload = navMenuResize;

window.onscroll = function(){
    if(introImg.scrollHeight < window.scrollY){
        navbar.style.backgroundColor = "black";
    }
    else {
        navbar.style.backgroundColor = "transparent";
    }
}

// window.addEventListener("resize", navMenuResize);

hbgMenus.addEventListener("click", function() {
    alert("helloworld!");
});