window.HFMaps=(()=>{
  let coords=null;
  let currentDish="";
  const status=document.getElementById("locationStatus");
  const locateButton=document.getElementById("locateButton");
  const nearbyButton=document.getElementById("nearbyButton");
  const mapsButton=document.getElementById("mapsButton");
  const hint=document.getElementById("restaurantHint");

  function updateButtons(){
    const readyDish=Boolean(currentDish);
    nearbyButton.disabled=!readyDish;
    mapsButton.disabled=!readyDish;
  }

  function setDish(dish){
    currentDish=dish||"";
    hint.textContent=currentDish
      ? `目前搜尋目標：${currentDish}`
      : "完成一次狩獵後即可搜尋。";
    updateButtons();
  }

  function query(){
    return encodeURIComponent(`${currentDish} 餐廳`);
  }

  function openMaps(useCoords){
    if(!currentDish)return;
    let url=`https://www.google.com/maps/search/?api=1&query=${query()}`;
    if(useCoords && coords){
      url += `&center=${coords.latitude},${coords.longitude}`;
    }
    window.open(url,"_blank","noopener,noreferrer");
  }

  locateButton.addEventListener("click",()=>{
    if(!navigator.geolocation){
      status.textContent="裝置不支援定位";
      status.className="location-status error";
      return;
    }

    status.textContent="定位中…";
    status.className="location-status";
    locateButton.disabled=true;

    navigator.geolocation.getCurrentPosition(
      pos=>{
        coords={
          latitude:pos.coords.latitude,
          longitude:pos.coords.longitude
        };
        status.textContent="位置已取得";
        status.className="location-status ready";
        locateButton.textContent="✓ 已取得位置";
        locateButton.disabled=false;
      },
      err=>{
        console.error(err);
        status.textContent="定位失敗";
        status.className="location-status error";
        locateButton.disabled=false;
      },
      {enableHighAccuracy:true,timeout:10000,maximumAge:300000}
    );
  });

  nearbyButton.addEventListener("click",()=>openMaps(true));
  mapsButton.addEventListener("click",()=>openMaps(false));

  updateButtons();
  return{setDish};
})();
