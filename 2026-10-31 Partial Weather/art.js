'use strict';
(()=>{
const c=document.getElementById('field'),g=c.getContext('2d');
const ui=Object.fromEntries(['position','pause','reveal','reset','status'].map(k=>[k,document.getElementById(k)]));
const media=matchMedia('(prefers-reduced-motion: reduce)'),capture=new URLSearchParams(location.search).has('capture');
let width=1,height=1,dpr=1,t=0,center=.5,reveal=false,paused=media.matches||capture,raf=0,last=null,painted=null,frames=0;
let visits=[{x:.5,time:0}];const lifetime=18,maxVisits=24;
const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
function updateStatus(){ui.pause.textContent=paused?'Resume':'Pause';ui.pause.setAttribute('aria-pressed',String(paused));ui.reveal.textContent=reveal?'Hide field':'Show field';ui.reveal.setAttribute('aria-pressed',String(reveal));ui.position.value=String(Math.round(center*100));const label='Position '+Math.round(center*100)+'% · '+visits.length+' recent '+(visits.length===1?'position':'positions');if(ui.status.textContent!==label)ui.status.textContent=label;}
function move(x){center=clamp(x,0,1);visits=visits.filter(v=>t-v.time<lifetime);visits.push({x:center,time:t});if(visits.length>maxVisits)visits.shift();paint();updateStatus();}
function paint(){
 g.setTransform(dpr,0,0,dpr,0,0);g.fillStyle='#121c30';g.fillRect(0,0,width,height);
 const left=width*.085,right=width*.915,top=capture?height*.12:72,bottom=capture?height-65:document.querySelector('footer').getBoundingClientRect().top-48,h=Math.max(70,bottom-top),span=right-left;
 g.lineWidth=.7;g.strokeStyle='#344151';g.strokeRect(left,top,span,h);
 const win=.12;
 const alpha=x=>{let v=reveal?.55:0;for(const p of visits){const age=t-p.time;if(age>=0&&age<lifetime&&Math.abs(x-p.x)<win/2)v=Math.max(v,.55*(1-age/lifetime));}return Math.abs(x-center)<win/2?1:v;};
 for(let i=0;i<108;i++){
  const y=i/107;
  const point=x=>[left+x*span,top+h*(.10+y*.80+.045*Math.sin(x*9+y*5+t*.23)+.025*Math.cos(x*17-y*9-t*.16))];
  for(let j=0;j<120;j++){
   const x=j/120,n=(j+1)/120,v=alpha((x+n)/2);if(v<=.018)continue;
   const p=point(x),q=point(n);g.beginPath();g.moveTo(...p);g.lineTo(...q);
   g.strokeStyle=i%5===0?'rgba(229,185,120,'+v+')':'rgba(151,181,183,'+(v*.66)+')';g.stroke();
  }
 }
 const wx=left+center*span,ww=span*win;
 g.strokeStyle='#e7bb7d';g.lineWidth=1;g.strokeRect(wx-ww/2,top-5,ww,h+10);
 g.fillStyle='#e7bb7d';g.font='10px monospace';g.textAlign='center';g.fillText(String(Math.round(center*100)).padStart(2,'0'),wx,top+h+28);
 g.strokeStyle='#44505d';g.beginPath();for(let k=0;k<=20;k++){const x=left+k*span/20;g.moveTo(x,top+h+8);g.lineTo(x,top+h+(k%5===0?15:11));}g.stroke();
 frames++;window.__artReady=true;
}
function stop(){if(raf)cancelAnimationFrame(raf);raf=0;last=null;painted=null;}
function tick(now){raf=0;if(paused||document.hidden)return;const dt=last===null?0:Math.min(.1,(now-last)/1000);last=now;t+=dt;const count=visits.length;visits=visits.filter(v=>t-v.time<lifetime);if(count!==visits.length)updateStatus();if(painted===null||now-painted>=1000/30){paint();painted=now;}raf=requestAnimationFrame(tick);}
function start(){if(!paused&&!document.hidden&&!raf)raf=requestAnimationFrame(tick);}
function toggle(){paused=!paused;stop();updateStatus();paint();start();}
function reset(){t=0;center=.5;visits=[{x:.5,time:0}];reveal=false;stop();updateStatus();paint();start();}
function resize(){width=Math.max(1,innerWidth);height=Math.max(1,innerHeight);dpr=Math.min(2,devicePixelRatio||1);c.width=Math.round(width*dpr);c.height=Math.round(height*dpr);paint();}
ui.position.addEventListener('input',()=>move(Number(ui.position.value)/100));ui.pause.addEventListener('click',toggle);ui.reveal.addEventListener('click',()=>{reveal=!reveal;updateStatus();paint();});ui.reset.addEventListener('click',reset);
c.addEventListener('pointerdown',e=>{const r=c.getBoundingClientRect();move((e.clientX-r.left-width*.085)/(width*.83));c.focus({preventScroll:true});});
c.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight',' ','Escape'].includes(e.key))e.preventDefault();if(e.key==='ArrowLeft')move(center-.04);if(e.key==='ArrowRight')move(center+.04);if(e.key===' ')toggle();if(e.key==='Escape'){reveal=false;updateStatus();paint();}});
media.addEventListener('change',()=>{if(media.matches){paused=true;stop();updateStatus();}});document.addEventListener('visibilitychange',()=>{stop();start();});addEventListener('resize',resize);addEventListener('pagehide',stop);
window.artState=()=>({time:t,paused,center,reveal,visits:visits.length,maxVisits,lifetime,width,height,frames,reducedMotion:media.matches});
window.renderAt=s=>{if(!Number.isFinite(s)||s<0)throw Error('invalid time');t=s;visits=visits.filter(v=>t-v.time>=0&&t-v.time<lifetime);paint();updateStatus();return window.artState();};
if(capture){document.body.classList.add('capture');visits=[{x:.18,time:0},{x:.32,time:1},{x:.65,time:2},{x:.81,time:3}];}resize();updateStatus();start();
})();
