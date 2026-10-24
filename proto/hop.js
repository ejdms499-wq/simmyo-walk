/* 심묘한 산책 — 장면 넘김: 고양이 머리 모양 창이 닫혔다가(떠날 때) 열리오(들어올 때).
   <body> 바로 다음에 넣으시오. window.hopTo(url, x, y) · <a data-hop> 도 자동으로 씀. */
(function(){
var K='simmyo_hop',RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var HEAD='M-50,-6 C-52,-30 -50,-48 -44,-66 C-34,-58 -22,-48 -13,-41 C-5,-43 5,-43 13,-41 C22,-48 34,-58 44,-66 C50,-48 52,-30 50,-6 C50,26 28,44 0,44 C-28,44 -50,26 -50,-6Z';
function make(){
  var old=document.getElementById('hopv');if(old)old.remove();
  var d=document.createElement('div');d.id='hopv';d.setAttribute('aria-hidden','true');
  d.style.cssText='position:fixed;inset:0;z-index:9999;pointer-events:none';
  d.innerHTML='<svg width="100%" height="100%" style="display:block"><defs><mask id="hopm" maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%"><rect width="100%" height="100%" fill="#fff"/><path id="hopg" d="'+HEAD+'" fill="#000"/></mask></defs><rect width="100%" height="100%" fill="#1d1915" mask="url(#hopm)"/><g id="hope" opacity="0"><ellipse cx="0" cy="0" rx="9" ry="9" fill="#e7a43a"/><ellipse cx="0" cy="0" rx="2.4" ry="7" fill="#1d1915"/></g></svg>';
  (document.body||document.documentElement).appendChild(d);return d}
function run(x,y,a,b,ms,done){
  var d=make(),g=d.querySelector('#hopg'),eye=d.querySelector('#hope'),t0=0;
  function f(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/ms),e=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2,s=a+(b-a)*e;
    g.setAttribute('transform','translate('+x+','+y+') scale('+Math.max(s,0.0001)+')');
    /* 다 닫히기 직전, 어둠 속에서 꿀빛 눈 두 개가 한 번 깜빡 */
    var o=a>b?Math.max(0,(k-.78)/.22):Math.max(0,1-k/.25);eye.setAttribute('opacity',o.toFixed(2));
    eye.setAttribute('transform','translate('+x+','+(y-6)+')');
    eye.innerHTML='<g transform="translate(-16,0) scale(1,'+(o>.9&&a>b?.25:1)+')"><ellipse rx="9" ry="9" fill="#e7a43a"/><ellipse rx="2.4" ry="7" fill="#1d1915"/></g><g transform="translate(16,0) scale(1,'+(o>.9&&a>b?.25:1)+')"><ellipse rx="9" ry="9" fill="#e7a43a"/><ellipse rx="2.4" ry="7" fill="#1d1915"/></g>';
    if(k<1)requestAnimationFrame(f);else if(done)done(d)}
  requestAnimationFrame(f)}
function big(x,y){var w=innerWidth,h=innerHeight,r=Math.max(Math.hypot(x,y),Math.hypot(w-x,y),Math.hypot(x,h-y),Math.hypot(w-x,h-y));return r/34}
window.hopTo=function(url,x,y){
  if(x==null){x=innerWidth/2;y=innerHeight/2}
  try{sessionStorage.setItem(K,'1')}catch(e){}
  if(RM){location.href=url;return}
  run(x,y,big(x,y),0,560,function(){setTimeout(function(){location.href=url},140)})};
document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a[data-hop]');if(!a||e.metaKey||e.ctrlKey||e.shiftKey)return;
  e.preventDefault();var r=a.getBoundingClientRect();hopTo(a.href,r.left+r.width/2,r.top+r.height/2)});
var came=false;try{came=sessionStorage.getItem(K)==='1';sessionStorage.removeItem(K)}catch(e){}
if(came&&!RM){var x=innerWidth/2,y=innerHeight*.45;run(x,y,0,big(x,y),760,function(d){d.remove()})}
function reveal(){
  if(RM||!('IntersectionObserver' in window))return;
  var els=document.querySelectorAll('.sheet .h,ol.facts li,.sense button,.arc figure,.side .note,.post,.cs,.leave');if(!els.length)return;
  document.documentElement.classList.add('rvon');
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var t=e.target;setTimeout(function(){t.classList.add('in')},(+t.dataset.rd||0));io.unobserve(t)}})},{rootMargin:'0px 0px -6% 0px'});
  var last=null,n=0;[].forEach.call(els,function(el){var par=el.parentNode;n=par===last?n+1:0;last=par;el.dataset.rd=Math.min(n,6)*70;el.classList.add('rv');io.observe(el)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(reveal,30)});else setTimeout(reveal,30);
addEventListener('pageshow',function(e){if(e.persisted){var d=document.getElementById('hopv');if(d)d.remove()}});
})();
