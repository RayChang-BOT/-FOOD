window.HuntersFeastUI={
setText(id,value){const el=document.getElementById(id);if(el)el.textContent=value},
setStage(index){document.querySelectorAll(".stage-item").forEach((el,i)=>{el.classList.toggle("active",i===index);el.classList.toggle("done",i<index)})},
setHunting(active){const button=document.getElementById("huntButton");button.disabled=active;button.querySelector(".button-label").textContent=active?"HUNTING...":"BEGIN HUNT";button.querySelector(".button-zh").textContent=active?"三階段狩獵進行中":"開始三階段狩獵"},
revealResult(){const panel=document.getElementById("resultPanel");panel.classList.remove("is-revealed");void panel.offsetWidth;panel.classList.add("is-revealed")},
renderHistory(items){const list=document.getElementById("historyList");if(!items.length){list.innerHTML='<li class="history-empty">尚無狩獵紀錄</li>';return}
list.innerHTML=items.map(item=>`<li><span>${item.region}・${item.cuisine}・${item.dish}</span><time>${item.time}</time></li>`).join("")}
};
