window.HuntersFeastUI={
setText(id,value){const el=document.getElementById(id);if(el)el.textContent=value},
revealResult(){const panel=document.getElementById("resultPanel");if(!panel)return;panel.classList.remove("is-revealed");void panel.offsetWidth;panel.classList.add("is-revealed")},
setHunting(active){const button=document.getElementById("huntButton");if(!button)return;button.disabled=active;
button.querySelector(".button-label").textContent=active?"HUNTING...":"BEGIN HUNT";
button.querySelector(".button-zh").textContent=active?"狩獵進行中":"開始狩獵"}
};
