window.HFStorage=(()=>{
const K={history:"hf8-history",favorites:"hf8-favorites",blocked:"hf8-blocked",settings:"hf8-settings"};
const read=(k,d)=>{try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch{return d}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const defaults={sound:true,vibration:true,avoidRepeat:true,speed:"normal"};
return{
history:()=>read(K.history,[]),
addHistory:e=>{const v=[e,...read(K.history,[])].slice(0,30);write(K.history,v);return v},
clearHistory:()=>localStorage.removeItem(K.history),
favorites:()=>read(K.favorites,[]),
toggleFavorite:e=>{let v=read(K.favorites,[]);const i=v.findIndex(x=>x.dish===e.dish);i>=0?v.splice(i,1):v.unshift(e);write(K.favorites,v);return v},
clearFavorites:()=>localStorage.removeItem(K.favorites),
blocked:()=>read(K.blocked,[]),
block:e=>{let v=read(K.blocked,[]);if(!v.some(x=>x.dish===e.dish))v.unshift(e);write(K.blocked,v);return v},
unblock:dish=>{const v=read(K.blocked,[]).filter(x=>x.dish!==dish);write(K.blocked,v);return v},
clearBlocked:()=>localStorage.removeItem(K.blocked),
settings:()=>({...defaults,...read(K.settings,{})}),
setSettings:v=>write(K.settings,{...defaults,...v}),
reset:()=>Object.values(K).forEach(k=>localStorage.removeItem(k))
}})();
