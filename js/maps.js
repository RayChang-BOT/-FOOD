window.HFMaps=(()=>{
let coords=null,currentDish="";
const status=document.getElementById("locationStatus"),locate=document.getElementById("locateButton"),nearby=document.getElementById("nearbyButton"),maps=document.getElementById("mapsButton"),hint=document.getElementById("restaurantHint");
function update(){nearby.disabled=!currentDish;maps.disabled=!currentDish;hint.textContent=currentDish?`搜尋目標：${currentDish}`:"完成一次狩獵後即可搜尋。"}
function setDish(d){currentDish=d||"";update()}
function open(useCoords){if(!currentDish)return;let url=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentDish+" 餐廳")}`;if(useCoords&&coords)url+=`&center=${coords.latitude},${coords.longitude}`;window.open(url,"_blank","noopener,noreferrer")}
locate.onclick=()=>{if(!navigator.geolocation){status.textContent="不支援定位";status.className="status-chip error";return}status.textContent="定位中…";navigator.geolocation.getCurrentPosition(p=>{coords={latitude:p.coords.latitude,longitude:p.coords.longitude};status.textContent="位置已取得";status.className="status-chip ready"},()=>{status.textContent="定位失敗";status.className="status-chip error"},{enableHighAccuracy:true,timeout:10000,maximumAge:300000})};
nearby.onclick=()=>open(true);maps.onclick=()=>open(false);update();return{setDish}})();
