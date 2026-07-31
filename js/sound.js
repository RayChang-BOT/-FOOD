window.HFSound=(()=>{
let ctx=null;
function tone(freq=440,duration=.08,volume=.04){
if(!window.HFStorage.settings().sound)return;
ctx=ctx||new(window.AudioContext||window.webkitAudioContext)();
const o=ctx.createOscillator(),g=ctx.createGain();o.type="triangle";o.frequency.value=freq;g.gain.value=volume;o.connect(g);g.connect(ctx.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);o.stop(ctx.currentTime+duration)}
return{tick:()=>tone(220,.035,.02),stop:()=>tone(520,.1,.045),success:()=>{tone(330,.12,.045);setTimeout(()=>tone(660,.18,.04),110)}}})();
