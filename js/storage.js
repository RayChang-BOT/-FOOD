window.HFStorage=(()=>{const K={history:"hf-history",favorites:"hf-favorites",blocked:"hf-blocked",sound:"hf-sound"};
const read=(k,d=[])=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
return{
history:()=>read(K.history),addHistory:e=>{const v=[e,...read(K.history)].slice(0,8);write(K.history,v);return v},clearHistory:()=>localStorage.removeItem(K.history),
favorites:()=>read(K.favorites),toggleFavorite:e=>{let v=read(K.favorites);const i=v.findIndex(x=>x.dish===e.dish);if(i>=0)v.splice(i,1);else v.unshift(e);write(K.favorites,v);return v},clearFavorites:()=>localStorage.removeItem(K.favorites),
blocked:()=>read(K.blocked),block:d=>{const v=[...new Set([...read(K.blocked),d])];write(K.blocked,v);return v},
sound:()=>read(K.sound,true),setSound:v=>write(K.sound,v)
}})();
