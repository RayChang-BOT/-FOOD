window.HFUI={
setText(id,v){const e=document.getElementById(id);if(e)e.textContent=v},
setStage(i){document.querySelectorAll(".stage-item").forEach((e,n)=>{e.classList.toggle("active",n===i);e.classList.toggle("done",n<i)})},
setHunting(a){const b=document.getElementById("huntButton");b.disabled=a;b.querySelector(".button-label").textContent=a?"HUNTING...":"BEGIN HUNT";b.querySelector(".button-zh").textContent=a?"三階段狩獵進行中":"開始三階段狩獵"},
reveal(){const p=document.getElementById("resultPanel");p.classList.remove("is-revealed");void p.offsetWidth;p.classList.add("is-revealed")},
setFavorite(a){const b=document.getElementById("favoriteButton");b.classList.toggle("active",a);b.textContent=a?"★ 已收藏":"☆ 加入收藏"}
};
