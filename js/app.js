(()=>{const ui=window.HuntersFeastUI,storage=window.HuntersFeastStorage,wheel=window.HuntersFeastWheel;
const huntButton=document.getElementById("huntButton"),installButton=document.getElementById("installButton"),clearButton=document.getElementById("clearHistoryButton");
let data={},deferredPrompt=null;const pick=list=>list[Math.floor(Math.random()*list.length)];
async function load(){const res=await fetch("./data/foods.json");if(!res.ok)throw new Error("料理資料載入失敗");data=await res.json()}
async function hunt(){if(!Object.keys(data).length)return;ui.setHunting(true);
const regions=Object.keys(data),region=pick(regions);ui.setStage(0);await wheel.spin(regions,"第一階段・地區",region,1450);ui.setText("regionResult",region);
const cuisines=Object.keys(data[region]),cuisine=pick(cuisines);ui.setStage(1);await wheel.spin(cuisines,"第二階段・菜系",cuisine,1550);ui.setText("cuisineResult",cuisine);
const dishes=data[region][cuisine],dish=pick(dishes);ui.setStage(2);await wheel.spin(dishes,"第三階段・料理",dish,1750);ui.setText("dishResult",dish);ui.setText("resultQuote","Tonight's hunt has been revealed.");
const now=new Date();const time=now.toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit"});ui.renderHistory(storage.addHistory({region,cuisine,dish,time}));
ui.revealResult();ui.setHunting(false);setTimeout(()=>ui.setStage(-1),700)}
huntButton.addEventListener("click",hunt);clearButton.addEventListener("click",()=>{storage.clearHistory();ui.renderHistory([])});
addEventListener("beforeinstallprompt",event=>{event.preventDefault();deferredPrompt=event;installButton.hidden=false});
installButton.addEventListener("click",async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;installButton.hidden=true});
(async()=>{ui.renderHistory(storage.getHistory());try{await load()}catch(err){console.error(err);ui.setText("dishResult","資料載入失敗")}
if("serviceWorker"in navigator)addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(console.error))})()})();
