'use strict';
const $ = id => document.getElementById(id);
let works = [], selected = null, live = false;
const localWork = u => typeof u === 'string' && /^\.\/\d{4}-\d{2}-\d{2}%20[^/]+\/index\.html$/.test(u);
const localThumb = u => typeof u === 'string' && /^\.\/\d{4}-\d{2}-\d{2}%20[^/]+\/thumbnail\.png$/.test(u);
const safeHttps = u => {try{const v=new URL(u);return v.protocol==='https:'&&!v.username&&!v.password;}catch{return false;}};
function node(tag, text, className) {const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(className)e.className=className;return e;}
function stopLive() {
  const frame=$('live-frame');frame.removeAttribute('src');frame.hidden=true;live=false;
  $('viewport').setAttribute('data-live','false');$('work-image').hidden=false;$('activate').textContent='啟動即時作品 ↗';$('activate').setAttribute('aria-pressed','false');
  $('view-state').textContent='CAPTURE / 擷取畫面';$('view-hint').textContent='先看一張畫面。準備好時，再讓時間進來。';
}
function selectWork(w, updateAddress=false) {
  stopLive();selected=w;$('exhibition').hidden=false;
  const number=String(works.length-works.indexOf(w)).padStart(3,'0');
  $('work-number').textContent='WORK / '+number;
  $('work-image').src=w.thumbnail;$('work-image').alt=w.title+' — 實際瀏覽器擷取畫面';
  $('work-date').textContent=w.date;$('work-date').dateTime=w.date;
  $('work-engine').textContent=w.engine;$('work-title').textContent=w.title;
  const c=w.concept||{};$('work-subtitle').textContent=c.subtitle||'';$('work-subtitle').hidden=!c.subtitle;
  $('work-description').textContent=c.summary||w.description;$('work-tags').textContent=w.tags.join(' / ');
  $('open-work').href=w.url;
  const folder=w.url.slice(2,-'/index.html'.length);
  $('source-folder').href='https://github.com/piyellowclaw/piyellow-daily-coding/tree/main/'+folder;
  const body=$('concept-body');body.replaceChildren();
  for(const [key,label] of [['question','01 / 提問'],['form','02 / 視覺語法'],['time','03 / 時間'],['interaction','04 / 參與']]){
    if(typeof c[key]!=='string'||!c[key].trim())continue;
    const block=node('section',undefined,'concept-block');block.append(node('h3',label),node('p',c[key]));body.append(block);
  }
  if(!body.children.length){const p=node('p','這件作品的完整創作筆記可由「程式與創作筆記」閱讀。');body.append(p);}
  $('concept-title').textContent=c.heading||'讓形式說明它的理由。';
  const refs=$('work-sources');refs.replaceChildren();
  for(const url of (w.sources||[]).filter(safeHttps)){
    const li=node('li'),a=node('a',decodeURIComponent(new URL(url).pathname.split('/').filter(Boolean).at(-1)||new URL(url).hostname).replaceAll('-',' ')+' ↗');a.href=url;a.rel='noopener noreferrer';li.append(a);refs.append(li);
  }
  if(updateAddress){const url=new URL(location.href);url.searchParams.set('work',w.date);url.hash='exhibition';history.replaceState(null,'',url);$('work-title').setAttribute('tabindex','-1');$('work-title').focus({preventScroll:true});$('exhibition').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}
  renderIndex();
}
function renderIndex(){
  const query=$('search').value.toLowerCase().trim();
  const shown=works.filter(w=>[w.title,w.description,w.engine,...w.tags,w.concept?.subtitle||''].join(' ').toLowerCase().includes(query));
  const list=$('gallery');list.replaceChildren();
  for(const w of shown){
    const row=node('article',undefined,'index-row');const n=node('span',String(works.length-works.indexOf(w)).padStart(3,'0'),'index-number');
    const a=node('a');a.href=w.url;a.setAttribute('aria-label','獨立開啟 '+w.title);const img=node('img');img.src=w.thumbnail;img.alt=w.title+' — 擷取畫面';img.width=104;img.height=78;img.loading='lazy';a.append(img);
    const title=node('div'),h=node('h3',undefined,'index-title'),link=node('a',w.title);link.href=w.url;h.append(link);title.append(h,node('p',w.engine+' / '+w.tags.join(' · '),'index-caption'));
    const date=node('time',w.date,'index-date');date.dateTime=w.date;
    const button=node('button',selected===w?'目前展出':'在展間觀看 ↗');button.type='button';button.setAttribute('aria-current',String(selected===w));button.addEventListener('click',()=>selectWork(w,true));
    row.append(n,a,title,date,button);list.append(row);
  }
  $('no-results').hidden=shown.length>0||works.length===0;$('empty').hidden=works.length>0;
}
$('search').addEventListener('input',renderIndex);
$('activate').addEventListener('click',()=>{
  if(!selected)return;if(live){stopLive();return;}
  const frame=$('live-frame');frame.src=selected.url;frame.hidden=false;frame.title=selected.title+' — 即時作品';live=true;
  $('viewport').setAttribute('data-live','true');$('work-image').hidden=true;$('activate').textContent='停止並回到擷取畫面';$('activate').setAttribute('aria-pressed','true');
  $('view-state').textContent='LIVE / 即時執行';$('view-hint').textContent='這是正在運行的作品，不是影片。停止後會移除執行頁面；重新啟動將重置狀態。';
});
window.addEventListener('pagehide',stopLive);
$('year').textContent=String(new Date().getFullYear());
fetch('works.json',{cache:'no-cache'}).then(r=>{if(!r.ok)throw Error('manifest');return r.json();}).then(data=>{
  if(!Array.isArray(data)||data.some(w=>!w||!localWork(w.url)||!localThumb(w.thumbnail)||typeof w.title!=='string'||typeof w.description!=='string'||typeof w.engine!=='string'||!Array.isArray(w.tags)||w.tags.some(t=>typeof t!=='string')))throw Error('invalid manifest');
  works=data;$('count').textContent=String(works.length).padStart(3,'0')+' WORK'+(works.length===1?'':'S');$('total').textContent=String(works.length).padStart(3,'0');
  const date=new URL(location.href).searchParams.get('work');if(works.length)selectWork(works.find(w=>w.date===date)||works[0]);else renderIndex();
}).catch(()=>{stopLive();$('exhibition').hidden=true;$('count').textContent='ARCHIVE TEMPORARILY UNAVAILABLE';$('error').hidden=false;});
