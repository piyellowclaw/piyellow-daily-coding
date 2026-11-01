'use strict';
(()=>{
const c=document.getElementById('plate'),g=c.getContext('2d');
const ui=Object.fromEntries(['offset','align','pause','reset','status'].map(k=>[k,document.getElementById(k)]));
const media=matchMedia('(prefers-reduced-motion: reduce)'),capture=new URLSearchParams(location.search).has('capture');
let w=1,h=1,dpr=1,t=0,amount=19,aligned=false,paused=media.matches||capture,cx=.53,cy=.46,raf=0,last=null,painted=null,frames=0;
const clamp=x=>Math.max(.05,Math.min(.95,x));
function status(){ui.offset.value=String(amount);ui.align.textContent=aligned?'Separate plates':'Align plates';ui.align.setAttribute('aria-pressed',String(aligned));ui.pause.textContent=paused?'Resume':'Pause';ui.pause.setAttribute('aria-pressed',String(paused));const s=(aligned?'Registered':'Offset '+amount)+' · centre '+Math.round(cx*100)+', '+Math.round(cy*100);if(ui.status.textContent!==s)ui.status.textContent=s;}
function point(u,v,plate){const dx=u-cx,dy=v-cy,fall=Math.exp(-4*(dx*dx+dy*dy));const baseX=u+.035*Math.sin(v*6.4+u*2),baseY=v+.03*Math.sin(u*7-v*3);const a=plate&&!aligned?amount/1000:0;return[baseX+a*(Math.sin(v*10+t*.27)+fall*1.7),baseY+a*(Math.cos(u*8-t*.19)-fall*.8)];}
function paint(){g.setTransform(dpr,0,0,dpr,0,0);g.fillStyle='#f2eedf';g.fillRect(0,0,w,h);const span=Math.min(w*.79,h*.85),left=(w-span)/2,top=(h-span)/2;g.lineWidth=Math.max(.55,span/850);for(let p=0;p<2;p++){g.strokeStyle=p?'rgba(169,72,47,.66)':'rgba(36,72,76,.55)';for(let axis=0;axis<2;axis++)for(let line=0;line<=24;line++){g.beginPath();for(let j=0;j<=48;j++){const a=axis?j/48:line/24,b=axis?line/24:j/48,q=point(a,b,p),x=left+q[0]*span,y=top+q[1]*span;if(j===0)g.moveTo(x,y);else g.lineTo(x,y);}g.stroke();}}frames++;window.__artReady=true;}
function stop(){if(raf)cancelAnimationFrame(raf);raf=0;last=null;painted=null;}
function tick(now){raf=0;if(paused||document.hidden)return;t+=last===null?0:Math.min(.1,(now-last)/1000);last=now;if(painted===null||now-painted>=1000/30){paint();painted=now;}raf=requestAnimationFrame(tick);}
function start(){if(!paused&&!document.hidden&&!raf)raf=requestAnimationFrame(tick);}
function toggle(){paused=!paused;stop();status();paint();start();}
function resize(){const r=c.getBoundingClientRect();w=Math.max(1,r.width);h=Math.max(1,r.height);dpr=Math.min(2,devicePixelRatio||1);c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);paint();}
function reset(){t=0;amount=19;cx=.53;cy=.46;aligned=false;stop();status();paint();start();}
ui.offset.addEventListener('input',()=>{const n=Number(ui.offset.value);amount=Number.isFinite(n)?Math.max(0,Math.min(32,n)):19;status();paint();});ui.align.addEventListener('click',()=>{aligned=!aligned;status();paint();});ui.pause.addEventListener('click',toggle);ui.reset.addEventListener('click',reset);
c.addEventListener('pointerdown',e=>{const r=c.getBoundingClientRect(),span=Math.min(w*.79,h*.85);cx=clamp((e.clientX-r.left-(w-span)/2)/span);cy=clamp((e.clientY-r.top-(h-span)/2)/span);status();paint();c.focus({preventScroll:true});});
c.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key))e.preventDefault();if(e.key===' ')toggle();if(e.key==='ArrowLeft')cx=clamp(cx-.04);if(e.key==='ArrowRight')cx=clamp(cx+.04);if(e.key==='ArrowUp')cy=clamp(cy-.04);if(e.key==='ArrowDown')cy=clamp(cy+.04);status();paint();});
media.addEventListener('change',()=>{if(media.matches){paused=true;stop();status();paint();}});document.addEventListener('visibilitychange',()=>{stop();start();});addEventListener('resize',resize);addEventListener('pagehide',stop);
window.artState=()=>({time:t,amount,aligned,paused,cx,cy,width:w,height:h,frames,reducedMotion:media.matches});window.artPoint=(u,v,p)=>point(u,v,p);
window.renderAt=s=>{if(!Number.isFinite(s)||s<0)throw Error('invalid time');t=s;paint();return window.artState();};
if(capture)document.body.classList.add('capture');resize();status();start();
})();
