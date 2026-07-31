(()=>{const ui=window.HuntersFeastUI;const huntButton=document.getElementById("huntButton");
const installButton=document.getElementById("installButton");let data={},deferredPrompt=null;
const pick=list=>list[Math.floor(Math.random()*list.length)];const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function load(){const res=await fetch("./data/foods.json");if(!res.ok)throw new Error("料理資料載入失敗");data=await res.json()}
async function hunt(){if(!Object.keys(data).length)return;ui.setHunting(true);
const region=pick(Object.keys(data));ui.setText("regionResult",region);await sleep(430);
const cuisine=pick(Object.keys(data[region]));ui.setText("cuisineResult",cuisine);await sleep(480);
const dish=pick(data[region][cuisine]);ui.setText("dishResult",dish);ui.setText("resultQuote","May good food guide your night.");
if("vibrate"in navigator)navigator.vibrate([30,40,60]);ui.revealResult();ui.setHunting(false)}
addEventListener("beforeinstallprompt",event=>{event.preventDefault();deferredPrompt=event;installButton.hidden=false});
installButton.addEventListener("click",async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;installButton.hidden=true});
addEventListener("appinstalled",()=>installButton.hidden=true);huntButton.addEventListener("click",hunt);
(async()=>{try{await load()}catch(err){console.error(err);ui.setText("dishResult","資料載入失敗")}
if("serviceWorker"in navigator)addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(console.error))})()})();
