'use strict';
(() => {
  const canvas=document.getElementById('field'),ctx=canvas.getContext('2d');
  const ids=['previous','next','hold','pause','reset','status'];
  const ui=Object.fromEntries(ids.map(id=>[id,document.getElementById(id)]));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const capture=new URLSearchParams(location.search).has('capture');
  const N=12,BUDGET=3.8,CAP=.98,faces=['#243f4a','#34504d','#444551','#6c493d'];
  let width=1,height=1,dpr=1,time=0,selected=0,held=-1,paused=reduced.matches||capture;
  let raf=0,last=null,painted=null,frames=0;
  const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
  function allocate(weights) {
    let low=0,high=1;
    while(weights.reduce((s,w)=>s+Math.min(CAP,high*w),0)<BUDGET)high*=2;
    for(let n=0;n<48;n++){const mid=(low+high)/2;const sum=weights.reduce((s,w)=>s+Math.min(CAP,mid*w),0);if(sum<BUDGET)low=mid;else high=mid;}
    return weights.map(w=>Math.min(CAP,(low+high)*.5*w));
  }
  function targets(t) {
    const center=(t/3.8)%N;
    return allocate(Array.from({length:N},(_,i)=>{
      const raw=Math.abs(i-center),distance=Math.min(raw,N-raw);
      if(i===held)return 12;
      return .075+.88*Math.exp(-distance*distance/1.8)+.08*(1+Math.sin(i*1.71+t*.43));
    }));
  }
  let openings=targets(0);
  function geometry() {
    const margin=width*.065,step=(width-margin*2)/N;
    const top=Math.max(capture?48:67,height*.13),base=Math.max(top+75,height-(capture?76:175));
    return {margin,step,top,base};
  }
  function polygon(points,fill,stroke) {
    ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
    if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=.65;ctx.stroke();}
  }
  function render() {
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#ede6d8';ctx.fillRect(0,0,width,height);
    const g=geometry();
    ctx.strokeStyle='#c7c4b7';ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(g.margin*.7,g.base+24);ctx.lineTo(width-g.margin*.45,g.base+24);ctx.stroke();
    for(let i=0;i<N;i++){
      const x=g.margin+i*g.step,w=g.step*.83;
      const y=g.top+Math.sin(i*.63)*height*.026,b=g.base+Math.cos(i*.79)*height*.014;
      const o=openings[i],angle=o*1.42,edge=w*Math.cos(angle),depth=g.step*.23*Math.sin(angle);
      // The rear plane stays put; a narrow front plane reveals more of it.
      ctx.fillStyle=i%3===0?'#d79b62':i%3===1?'#dcb57c':'#cfaa73';ctx.fillRect(x,y,w,b-y);
      ctx.fillStyle='rgba(252,232,188,'+(.12+o*.5)+')';ctx.fillRect(x+edge,y,w-edge,b-y);
      ctx.strokeStyle='rgba(73,68,53,.19)';ctx.lineWidth=.6;
      for(let line=1;line<7;line++){const yy=y+(b-y)*line/7;ctx.beginPath();ctx.moveTo(x+edge,yy);ctx.lineTo(x+w,yy);ctx.stroke();}
      polygon([[x,y],[x+edge,y+depth],[x+edge,b-depth*.7],[x,b]],faces[i%4],'#243b43');
      ctx.strokeStyle='rgba(234,228,207,.17)';
      for(let mark=1;mark<5;mark++){const xx=x+edge*mark/5;ctx.beginPath();ctx.moveTo(xx,y+depth*mark/5+5);ctx.lineTo(xx,b-depth*.7*mark/5-5);ctx.stroke();}
      polygon([[x+edge,y+depth],[x+edge+depth*.5,y+depth*.83],[x+edge+depth*.5,b-depth*.85],[x+edge,b-depth*.7]],'#172d35');
      polygon([[x,b],[x+w,b],[x+w+depth*1.7,b+21+o*8],[x+depth*.4,b+14]],'rgba(38,53,55,'+(.035+.075*(1-o))+')');
      ctx.strokeStyle='rgba(49,62,60,.35)';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,b+3);ctx.stroke();
      if(!capture&&i===selected){ctx.fillStyle=i===held?'#a54d31':'#314953';ctx.beginPath();ctx.moveTo(x+w*.5,g.base+34);ctx.lineTo(x+w*.5-3,g.base+40);ctx.lineTo(x+w*.5+3,g.base+40);ctx.fill();}
    }
    frames++;window.__artReady=true;
  }
  function status() {
    ui.pause.textContent=paused?'Resume':'Pause';ui.pause.setAttribute('aria-pressed',String(paused));
    ui.hold.textContent=held===selected?'Release light':'Hold light';ui.hold.setAttribute('aria-pressed',String(held===selected));
    ui.status.textContent='Shutter '+String(selected+1).padStart(2,'0')+' selected · '+(held<0?'no light held':'light held at '+String(held+1).padStart(2,'0'));
  }
  function interact() {if(paused)openings=targets(time);render();status();}
  function stop() {if(raf)cancelAnimationFrame(raf);raf=0;last=null;painted=null;}
  function tick(now) {
    raf=0;if(paused||document.hidden)return;
    if(last===null)last=now;const dt=Math.min(.1,Math.max(0,(now-last)/1000));last=now;time+=dt;
    const next=targets(time),mix=1-Math.exp(-dt*7);
    openings=openings.map((v,i)=>v+(next[i]-v)*mix);
    if(painted===null||now-painted>=1000/30){render();painted=now;}
    raf=requestAnimationFrame(tick);
  }
  function start() {if(!paused&&!document.hidden&&!raf)raf=requestAnimationFrame(tick);}
  function select(delta) {selected=(selected+delta+N)%N;interact();}
  function toggleHold() {held=held===selected?-1:selected;interact();}
  function pause() {paused=!paused;stop();status();start();render();}
  function reset() {held=-1;selected=0;time=0;openings=targets(0);stop();interact();start();}
  function resize() {width=Math.max(1,innerWidth);height=Math.max(1,innerHeight);dpr=Math.min(2,devicePixelRatio||1);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);render();}
  canvas.addEventListener('pointerdown',e=>{const rect=canvas.getBoundingClientRect();const x=(e.clientX-rect.left)*width/rect.width;const g=geometry();selected=clamp(Math.floor((x-g.margin)/g.step),0,N-1);canvas.focus({preventScroll:true});toggleHold();});
  canvas.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Enter',' ','Escape'].includes(e.key))e.preventDefault();if(e.key==='ArrowLeft')select(-1);if(e.key==='ArrowRight')select(1);if(e.key==='Enter')toggleHold();if(e.key===' ')pause();if(e.key==='Escape'){held=-1;interact();}});
  ui.previous.addEventListener('click',()=>select(-1));ui.next.addEventListener('click',()=>select(1));ui.hold.addEventListener('click',toggleHold);ui.pause.addEventListener('click',pause);ui.reset.addEventListener('click',reset);
  reduced.addEventListener('change',()=>{if(reduced.matches){paused=true;stop();interact();}});
  document.addEventListener('visibilitychange',()=>{stop();start();});addEventListener('resize',resize);addEventListener('pagehide',stop);
  if(capture)document.body.classList.add('capture');
  window.renderAt=t=>{if(!Number.isFinite(t)||t<0)throw Error('Time must be finite and non-negative');time=t;openings=targets(t);render();return window.artState();};
  window.artState=()=>({time,paused,selected,held,openings:[...openings],total:openings.reduce((s,v)=>s+v,0),budget:BUDGET,cap:CAP,panels:N,width,height,frames,reducedMotion:reduced.matches,capture});
  resize();status();start();
})();
