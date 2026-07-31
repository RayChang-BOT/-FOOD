window.HuntersFeastWheel=(()=>{
const wheel=document.getElementById("wheel");const label=document.getElementById("wheelStageLabel");const value=document.getElementById("wheelCurrentValue");let rotation=0;
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function spin(options,stageLabel,finalValue,duration=1500){
wheel.classList.add("is-spinning");label.textContent=stageLabel;
const ticker=setInterval(()=>{value.textContent=options[Math.floor(Math.random()*options.length)]},75);
rotation+=720+Math.floor(Math.random()*540);wheel.style.transform=`rotate(${rotation}deg)`;
await wait(duration);clearInterval(ticker);value.textContent=finalValue;wheel.classList.remove("is-spinning");
if("vibrate"in navigator)navigator.vibrate([22,28,45]);await wait(280)}
return{spin}
})();
