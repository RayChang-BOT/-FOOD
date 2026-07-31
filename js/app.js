if('serviceWorker'in navigator){navigator.serviceWorker.register('sw.js')}
const d={台灣:{夜市:['雞排','鹽酥雞']},日本:{拉麵:['豚骨拉麵','味噌拉麵']}};
hunt.onclick=()=>{const r=Object.keys(d);let R=r[Math.random()*r.length|0],c=Object.keys(d[R])[0],f=d[R][c][Math.random()*d[R][c].length|0];result.innerHTML=`<h2>${R}</h2><h3>${c}</h3><p>${f}</p>`}