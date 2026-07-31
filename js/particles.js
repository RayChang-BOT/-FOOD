(()=>{const canvas=document.getElementById("particles");if(!canvas)return;
const ctx=canvas.getContext("2d");let particles=[],w=0,h=0,dpr=1;
function particle(){return{x:Math.random()*w,y:Math.random()*h,size:Math.random()*1.5+.4,speed:Math.random()*.25+.08,drift:(Math.random()-.5)*.12,alpha:Math.random()*.38+.08}}
function resize(){dpr=Math.min(window.devicePixelRatio||1,2);w=innerWidth;h=innerHeight;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);
canvas.style.width=w+"px";canvas.style.height=h+"px";ctx.setTransform(dpr,0,0,dpr,0,0);particles=Array.from({length:Math.min(80,Math.max(28,Math.floor(w/8)))},particle)}
function draw(){ctx.clearRect(0,0,w,h);for(const p of particles){p.y-=p.speed;p.x+=p.drift;if(p.y<-5){p.y=h+5;p.x=Math.random()*w}
if(p.x<-5)p.x=w+5;if(p.x>w+5)p.x=-5;ctx.beginPath();ctx.fillStyle=`rgba(214,190,145,${p.alpha})`;ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill()}requestAnimationFrame(draw)}
addEventListener("resize",resize,{passive:true});resize();draw()})();
