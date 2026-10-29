// Original Canvas 2D drawing. No dependencies, requests or persistent visitor data.
const canvas = document.querySelector('#field');
const ctx = canvas.getContext('2d', { alpha: false });
const pauseButton = document.querySelector('#pause');
const status = document.querySelector('#status');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const capture = new URLSearchParams(location.search).has('capture');
if (capture) document.body.classList.add('capture');
const PAPER = '#efe9da';
let width = 960, height = 720, time = 0, paused = reduced.matches;
let paths = [], stones = [], lastGeometry = -Infinity, frameId = 0, previous = 0;
let keyboard = false, cursor = { x: .5, y: .5 };
const colors = ['#314d4b', '#314d4b', '#69857a', '#ad7542', '#314d4b', '#bd9859'];
const clamp = (x,a,b) => Math.max(a,Math.min(b,x));
function layout() {
  const portrait = width < height * .8;
  return { left: width * .055, right: width * .945, top: height * (portrait ? .25 : .26), bottom: height * (portrait ? .73 : .79), portrait };
}
function islands() {
  const b = layout(), w = b.right-b.left, h = b.bottom-b.top;
  const r = Math.min(w*.105,h*.245);
  const fixed = [{x:b.left+w*.28,y:b.top+h*.46,r:r*.9}, {x:b.left+w*.61,y:b.top+h*.59,r:r*1.25}, {x:b.left+w*.83,y:b.top+h*.24,r:r*.48}];
  return fixed.concat(stones.map(s=>({x:s.x*width,y:s.y*height,r:s.r*Math.min(width,height)*Math.pow(Math.max(0,1-(time-s.born)/65),.7)})));
}
// A bounded superposition of cylinder-like velocity fields, not a fluid simulation.
function velocity(x,y,obs) {
  let u=1, v=.012*Math.sin(x/width*7);
  for(const o of obs) {
    const dx=x-o.x,dy=y-o.y,d2=Math.max(dx*dx+dy*dy,o.r*o.r*.62);
    const k=o.r*o.r/(d2*d2);
    u+=k*(dy*dy-dx*dx); v-=k*2*dx*dy;
  }
  const speed=Math.hypot(u,v);
  return [u/Math.max(.65,speed),v/Math.max(.65,speed)];
}
function geometry() {
  const b=layout(), obs=islands(), count=b.portrait?102:138;
  const step=(b.right-b.left)/350;
  paths=[];
  for(let i=0;i<count;i++) {
    let x=b.left-20,y=b.top+(b.bottom-b.top)*(i+.5)/count;
    const points=[];
    for(let k=0;k<620;k++) {
      points.push([x,y]);
      const a=velocity(x,y,obs),m=velocity(x+a[0]*step*.5,y+a[1]*step*.5,obs);
      x+=m[0]*step;y+=m[1]*step;
      if(x>b.right+20||x<b.left-60||y<b.top-100||y>b.bottom+100)break;
    }
    paths.push({points,color:colors[Math.floor(i/9)%colors.length],index:i});
  }
  lastGeometry=time;
}
function draw(t) {
  time=Math.max(0,t);
  stones=stones.filter(s=>time-s.born<65);
  if(time-lastGeometry>.24||time<lastGeometry||!paths.length)geometry();
  const b=layout(),obs=islands();
  ctx.fillStyle=PAPER;ctx.fillRect(0,0,width,height);
  // Quiet registration marks keep the drawing distinct from a full-bleed simulation.
  ctx.strokeStyle='#c8c6b4';ctx.lineWidth=.65;
  for(const x of [b.left,b.right])for(const y of [b.top-16,b.bottom+16]){ctx.beginPath();ctx.moveTo(x-4,y);ctx.lineTo(x+4,y);ctx.moveTo(x,y-4);ctx.lineTo(x,y+4);ctx.stroke();}
  ctx.save();ctx.beginPath();ctx.rect(b.left,b.top,b.right-b.left,b.bottom-b.top);ctx.clip();
  for(const p of paths){
    ctx.strokeStyle=p.color;ctx.globalAlpha=p.index%9===0?.75:.48;ctx.lineWidth=p.index%9===0?1.05:.56;
    ctx.beginPath();p.points.forEach(([x,y],j)=>j?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();
    // Sparse moving lengths make the passage of time visible without flashing.
    if(p.index%5===0){const n=p.points.length,j=Math.floor(((time*.027+p.index*.073)%1)*Math.max(1,n-11));ctx.globalAlpha=.9;ctx.strokeStyle=p.index%2?'#b46f36':'#243c3c';ctx.lineWidth=1.35;ctx.beginPath();for(let k=j;k<Math.min(n,j+10);k++){const [x,y]=p.points[k];k===j?ctx.moveTo(x,y):ctx.lineTo(x,y);}ctx.stroke();}
  }
  ctx.globalAlpha=1;
  for(let i=0;i<obs.length;i++){
    const o=obs[i];ctx.fillStyle=PAPER;ctx.beginPath();ctx.arc(o.x,o.y,o.r*.94,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=i<3?'#a6ad99':'#b88650';ctx.lineWidth=.65;ctx.beginPath();ctx.arc(o.x,o.y,o.r*.94,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle=i<3?'#8c957f':'#a16e3f';ctx.beginPath();ctx.arc(o.x,o.y,1.1,0,Math.PI*2);ctx.fill();
    if(i<3){ctx.fillStyle='#798675';ctx.font='9px ui-monospace, monospace';ctx.textAlign='center';ctx.fillText('0'+(i+1),o.x,o.y+14);}
  }
  if(keyboard){const x=cursor.x*width,y=cursor.y*height;ctx.strokeStyle='#a55c36';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,8,0,Math.PI*2);ctx.moveTo(x-13,y);ctx.lineTo(x+13,y);ctx.moveTo(x,y-13);ctx.lineTo(x,y+13);ctx.stroke();}
  ctx.restore();
  window.__artReady=true;
}
function addStone(x,y){
  const b=layout();x=clamp(x,b.left/width+.025,b.right/width-.025);y=clamp(y,b.top/height+.025,b.bottom/height-.025);
  if(stones.length>=4)stones.shift();stones.push({x,y,r:.043,born:time});lastGeometry=-Infinity;draw(time);
  status.textContent='Space added. '+stones.length+' temporary '+(stones.length===1?'trace':'traces')+'.';
}
function resize(){width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);lastGeometry=-Infinity;draw(time);}
function tick(now){frameId=0;if(!previous)previous=now;const dt=Math.min(.05,(now-previous)/1000);previous=now;if(!paused&&!capture&&!document.hidden)draw(time+dt);if(!paused&&!capture&&!document.hidden)frameId=requestAnimationFrame(tick);}
function schedule(){if(!frameId&&!paused&&!capture&&!document.hidden){previous=0;frameId=requestAnimationFrame(tick);}}
function setPaused(value){paused=value;pauseButton.textContent=paused?'Resume':'Pause';pauseButton.setAttribute('aria-pressed',String(paused));if(paused&&frameId){cancelAnimationFrame(frameId);frameId=0;}schedule();}
pauseButton.addEventListener('click',()=>setPaused(!paused));
document.querySelector('#clear').addEventListener('click',()=>{stones=[];lastGeometry=-Infinity;draw(time);status.textContent='Temporary traces cleared.';});
canvas.addEventListener('pointerdown',e=>{const b=layout();if(e.clientY<b.top||e.clientY>b.bottom)return;keyboard=false;addStone(e.clientX/width,e.clientY/height);});
canvas.addEventListener('keydown',e=>{const d={ArrowLeft:[-.025,0],ArrowRight:[.025,0],ArrowUp:[0,-.025],ArrowDown:[0,.025]}[e.key];if(d){e.preventDefault();keyboard=true;const b=layout();cursor.x=clamp(cursor.x+d[0],b.left/width+.03,b.right/width-.03);cursor.y=clamp(cursor.y+d[1],b.top/height+.03,b.bottom/height-.03);draw(time);}else if(e.key==='Enter'){e.preventDefault();keyboard=true;addStone(cursor.x,cursor.y);}else if(e.key===' '){e.preventDefault();setPaused(!paused);}});
canvas.addEventListener('blur',()=>{keyboard=false;draw(time);});
addEventListener('resize',resize);document.addEventListener('visibilitychange',()=>{if(document.hidden&&frameId){cancelAnimationFrame(frameId);frameId=0;}else schedule();});
reduced.addEventListener('change',()=>setPaused(reduced.matches));
window.renderAt=seconds=>{lastGeometry=-Infinity;draw(seconds);};
// Read-only diagnostics for bounded rendering checks.
window.artState=()=>({time,paused,traces:stones.length,paths:paths.length,width,height,reducedMotion:reduced.matches});
resize();setPaused(paused);
