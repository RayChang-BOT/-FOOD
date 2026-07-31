(()=>{const ui=window.HFUI,st=window.HFStorage,w=window.HFWheel;let data={},current=null,deferredPrompt=null;
const pick=a=>a[Math.floor(Math.random()*a.length)],now=()=>new Date().toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"});
function eligible(list){const blocked=st.blocked();const filtered=list.filter(x=>!blocked.includes(x));return filtered.length?filtered:list}
async function hunt(){if(!Object.keys(data).length)return;ui.setHunting(true);
const regions=Object.keys(data),region=pick(regions);ui.setStage(0);await w.spin(regions,"第一階段・地區",region,1450);ui.setText("regionResult",region);
const cuisines=Object.keys(data[region]),cuisine=pick(cuisines);ui.setStage(1);await w.spin(cuisines,"第二階段・菜系",cuisine,1550);ui.setText("cuisineResult",cuisine);
const dishes=eligible(data[region][cuisine]),dish=pick(dishes);ui.setStage(2);await w.spin(dishes,"第三階段・料理",dish,1750);ui.setText("dishResult",dish);
current={region,cuisine,dish,time:now()};window.HFMaps.setDish(dish);ui.renderList("historyList",st.addHistory(current),"尚無紀錄");ui.setFavorite(st.favorites().some(x=>x.dish===dish));ui.reveal();window.HFSound.success();ui.setHunting(false);setTimeout(()=>ui.setStage(-1),600)}
function refresh(){ui.renderList("historyList",st.history(),"尚無紀錄");ui.renderList("favoritesList",st.favorites(),"尚無收藏");document.getElementById("soundToggle").checked=st.sound()}
document.getElementById("huntButton").onclick=hunt;
document.getElementById("favoriteButton").onclick=()=>{if(!current)return;const f=st.toggleFavorite(current);ui.renderList("favoritesList",f,"尚無收藏");ui.setFavorite(f.some(x=>x.dish===current.dish))};
document.getElementById("blockButton").onclick=()=>{if(!current)return;st.block(current.dish);document.getElementById("blockButton").textContent="✓ 已排除"};
document.getElementById("clearHistoryButton").onclick=()=>{st.clearHistory();refresh()};
document.getElementById("clearFavoritesButton").onclick=()=>{st.clearFavorites();refresh()};
document.getElementById("soundToggle").onchange=e=>st.setSound(e.target.checked);
addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;document.getElementById("installButton").hidden=false});
document.getElementById("installButton").onclick=async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null};
(async()=>{
      refresh();
      try{
        const r=await fetch("./data/foods.json");
        if(!r.ok)throw new Error("料理資料載入失敗");
        data=await r.json();
        w.render(Object.keys(data));
      }catch(error){
        console.error(error);
        ui.setText("dishResult","資料載入失敗");
      }
      if("serviceWorker"in navigator){
        addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(console.error));
      }
    })()})();
