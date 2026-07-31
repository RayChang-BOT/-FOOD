(()=>{const st=HFStorage,ui=HFUI,w=HFWheel;let data={},current=null,deferredPrompt=null;
const $=id=>document.getElementById(id),pick=a=>a[Math.floor(Math.random()*a.length)],now=()=>new Date().toLocaleString("zh-TW",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit"});
const speedMap={fast:[850,950,1050],normal:[1300,1450,1650],slow:[1800,2100,2400]};
function allEntries(){const out=[];for(const[region,cuisines]of Object.entries(data))for(const[cuisine,dishes]of Object.entries(cuisines))for(const dish of dishes)out.push({region,cuisine,...dish});return out}
function filters(){return{time:$("timeFilter").value,price:$("priceFilter").value,spicy:$("spicyFilter").checked,soup:$("soupFilter").checked,veg:$("vegFilter").checked}}
function eligibleEntries(){const f=filters(),blocked=st.blocked().map(x=>x.dish),recent=st.settings().avoidRepeat?st.history().slice(0,6).map(x=>x.dish):[];let list=allEntries().filter(x=>!blocked.includes(x.name));if(f.time)list=list.filter(x=>x.tags.includes(f.time));if(f.price)list=list.filter(x=>x.price===f.price);if(f.spicy)list=list.filter(x=>x.spicy);if(f.soup)list=list.filter(x=>x.soup);if(f.veg)list=list.filter(x=>x.vegetarian);const noRecent=list.filter(x=>!recent.includes(x.name));return noRecent.length?noRecent:list}
function updateCount(){const n=eligibleEntries().length;$("filterCount").textContent=`可抽選料理：${n} 道`;$("huntButton").disabled=n===0}
function vibrate(pattern){if(st.settings().vibration&&"vibrate"in navigator)navigator.vibrate(pattern)}
async function hunt(){const pool=eligibleEntries();if(!pool.length)return;ui.setHunting(true);const target=pick(pool);const settings=st.settings(),dur=speedMap[settings.speed]||speedMap.normal;
const regions=[...new Set(pool.map(x=>x.region))];ui.setStage(0);await w.spin(regions,"第一階段・地區",target.region,dur[0]);ui.setText("regionResult",target.region);vibrate([20,25,35]);
const cuisines=[...new Set(pool.filter(x=>x.region===target.region).map(x=>x.cuisine))];ui.setStage(1);await w.spin(cuisines,"第二階段・菜系",target.cuisine,dur[1]);ui.setText("cuisineResult",target.cuisine);vibrate([20,25,35]);
const dishes=pool.filter(x=>x.region===target.region&&x.cuisine===target.cuisine).map(x=>x.name);ui.setStage(2);await w.spin(dishes,"第三階段・料理",target.name,dur[2]);ui.setText("dishResult",target.name);vibrate([25,35,60]);
current={region:target.region,cuisine:target.cuisine,dish:target.name,time:now()};st.addHistory(current);HFMaps.setDish(target.name);ui.setFavorite(st.favorites().some(x=>x.dish===target.name));ui.reveal();HFSound.success();ui.setHunting(false);renderAll();setTimeout(()=>ui.setStage(-1),500)}
function renderList(id,items,type){const q=$("collectionSearch")?.value.trim().toLowerCase()||"";const filtered=items.filter(x=>`${x.region} ${x.cuisine} ${x.dish}`.toLowerCase().includes(q));$(id).innerHTML=filtered.length?filtered.map(x=>`<li><span>${x.region}・${x.cuisine}・${x.dish}</span>${type==="blocked"?`<button data-unblock="${x.dish}">解除</button>`:`<small>${x.time||""}</small>`}</li>`).join(""):`<li class="empty">沒有資料</li>`}
function renderStats(){const h=st.history(),f=st.favorites(),b=st.blocked();$("statTotal").textContent=h.length;$("statFavorites").textContent=f.length;$("statBlocked").textContent=b.length;const counts={};h.forEach(x=>counts[x.region]=(counts[x.region]||0)+1);$("statTopRegion").textContent=Object.keys(counts).sort((a,b)=>counts[b]-counts[a])[0]||"—"}
function renderAll(){renderList("favoritesList",st.favorites(),"favorites");renderList("blockedList",st.blocked(),"blocked");renderList("historyList",st.history(),"history");renderStats();updateCount()}
document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===`view-${b.dataset.view}`))});
$("huntButton").onclick=hunt;$("favoriteButton").onclick=()=>{if(!current)return;st.toggleFavorite(current);ui.setFavorite(st.favorites().some(x=>x.dish===current.dish));renderAll()};
$("blockButton").onclick=()=>{if(!current)return;st.block(current);$("blockButton").textContent="✓ 已排除";renderAll()};
$("resetFiltersButton").onclick=()=>{["timeFilter","priceFilter"].forEach(id=>$(id).value="");["spicyFilter","soupFilter","vegFilter"].forEach(id=>$(id).checked=false);updateCount()};
["timeFilter","priceFilter","spicyFilter","soupFilter","vegFilter"].forEach(id=>$(id).onchange=updateCount);
$("collectionSearch").oninput=renderAll;$("favoritesList").onclick=e=>{};$("blockedList").onclick=e=>{const d=e.target.dataset.unblock;if(d){st.unblock(d);renderAll()}};
$("clearFavoritesButton").onclick=()=>{st.clearFavorites();renderAll()};$("clearBlockedButton").onclick=()=>{st.clearBlocked();renderAll()};$("clearHistoryButton").onclick=()=>{st.clearHistory();renderAll()};
function loadSettings(){const s=st.settings();$("soundToggle").checked=s.sound;$("vibrationToggle").checked=s.vibration;$("avoidRepeatToggle").checked=s.avoidRepeat;$("speedSetting").value=s.speed}
["soundToggle","vibrationToggle","avoidRepeatToggle","speedSetting"].forEach(id=>$(id).onchange=()=>st.setSettings({sound:$("soundToggle").checked,vibration:$("vibrationToggle").checked,avoidRepeat:$("avoidRepeatToggle").checked,speed:$("speedSetting").value}));
$("resetAppButton").onclick=()=>{if(confirm("確定要清除所有收藏、黑名單、紀錄與設定？")){st.reset();location.reload()}};

document.addEventListener("hf-database-updated",event=>{
  data=event.detail;
  w.render(Object.keys(data));
  renderAll();
});
$("resetDatabaseButton").onclick=async()=>{
  if(!confirm("確定要刪除所有自訂變更並恢復預設料理資料？"))return;
  st.clearCustomData();
  const r=await fetch("./data/foods.json",{cache:"no-store"});
  data=await r.json();
  window.HFDatabase.init(data);
  w.render(Object.keys(data));
  renderAll();
};

addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;$("installButton").hidden=false});$("installButton").onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null};
(async()=>{loadSettings();try{const r=await fetch("./data/foods.json");if(!r.ok)throw new Error("資料載入失敗");const defaultData=await r.json();data=st.customData()||defaultData;w.render(Object.keys(data));window.HFDatabase.init(data);renderAll()}catch(e){console.error(e);ui.setText("dishResult","資料載入失敗")}if("serviceWorker"in navigator)addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(console.error))})()})();
