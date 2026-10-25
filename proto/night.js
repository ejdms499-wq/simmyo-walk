/* 밤 모드: 저녁 7시 ~ 아침 6시에는 화면을 어둡게(등잔불 아래 신문처럼). 소리 단추 옆 「밤/낮」 단추로 바꿀 수 있음 */
(function(){
var h=new Date().getHours(),auto=(h>=19||h<6),pick=null;try{pick=sessionStorage.getItem('simmyo_night')}catch(e){}
var on=pick===null?auto:pick==='1',de=document.documentElement;
var st=document.createElement('style');st.textContent=
 'html.night body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:2147483000;background:radial-gradient(120% 90% at 50% 35%,rgba(255,196,110,.10),rgba(8,14,34,.30) 70%),rgba(12,20,44,.34);mix-blend-mode:multiply;transition:opacity .6s}'+
 'html.night body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:2147483001;background:radial-gradient(70% 55% at 50% 30%,rgba(255,200,120,.08),transparent 70%);mix-blend-mode:screen}'+
 '.nightbtn{cursor:pointer;margin-right:6px;white-space:nowrap}'+
 '@media (prefers-reduced-motion:reduce){html.night body::after{transition:none}}';
document.head.appendChild(st);
function set(v,save){on=v;de.classList.toggle('night',on);if(btn){btn.textContent=on?'☾ 밤':'☀ 낮';btn.setAttribute('aria-pressed',on?'true':'false');btn.setAttribute('aria-label',on?'밤 화면 (누르면 낮으로)':'낮 화면 (누르면 밤으로)')}if(save){pick=on?'1':'0';try{sessionStorage.setItem('simmyo_night',pick)}catch(e){}}}
var btn=null;
function mount(){var s=document.querySelector('.sndbtn');btn=document.createElement('button');btn.type='button';btn.className='nightbtn';
  if(s){var cs=getComputedStyle(s);['font','padding','border','borderRadius','background','color','lineHeight','minHeight'].forEach(function(k){btn.style[k]=cs[k]});
    if(parseFloat(cs.fontSize)<8){btn.style.fontSize='12px';btn.style.padding='6px 9px';btn.style.height=cs.height}btn.style.width='auto';btn.style.paddingLeft=btn.style.paddingRight='10px';
    if(cs.position==='fixed'){btn.style.position='fixed';btn.style.zIndex=cs.zIndex;btn.style.margin='0';btn.style.paddingLeft=btn.style.paddingRight='10px';document.body.appendChild(btn);
      var place=function(){var r=s.getBoundingClientRect();btn.style.top=r.top+'px';var lx=r.left-btn.offsetWidth-6;btn.style.left=(lx>=6?lx:r.right+6)+'px';btn.style.height=r.height+'px'};place();addEventListener('resize',function(){setTimeout(place,60)});setTimeout(place,400);setTimeout(place,1500);btn.addEventListener('click',function(){setTimeout(place,0)});
      btn.addEventListener('click',function(e){e.stopPropagation();set(!on,true);window.snd&&window.snd('tink')});set(on,false);return}
    var wr=document.createElement('span');wr.style.cssText='display:inline-flex;align-items:center;gap:6px;flex:none';s.parentNode.insertBefore(wr,s);wr.appendChild(btn);wr.appendChild(s);btn.style.marginRight='0';
    /* 소리 단추와 한 묶음으로 */
    if(getComputedStyle(s.parentNode).display.indexOf('flex')<0){btn.style.display='inline-block'}}
  else{btn.style.cssText='position:fixed;right:10px;bottom:calc(10px + env(safe-area-inset-bottom));z-index:2147483002;font:13px/1 "Gowun Dodum",sans-serif;padding:8px 11px;border-radius:16px;border:1px solid #211c17;background:#f3ecdb;color:#211c17';document.body.appendChild(btn)}
  btn.addEventListener('click',function(e){e.stopPropagation();set(!on,true);window.snd&&window.snd('tink')});set(on,false)}
set(on,false);
if(document.readyState!=='loading')mount();else document.addEventListener('DOMContentLoaded',mount);
/* 밤이 되는 순간을 넘기면(창을 켜 둔 채) 저절로 */
setInterval(function(){if(pick!==null)return;var hh=new Date().getHours(),a=(hh>=19||hh<6);if(a!==on)set(a,false)},60000);
})();
