/* 심묘한 산책 — 심묘 그림 저장·공유
   쓰는 법: 아무 단추에 data-share-src="그림 경로" data-share-title="제목" data-share-caption="한 줄" 을 달면 누를 때 공유 창이 열림.
   또는 SimmyoShare.open({src, title, caption})
   카카오톡 바로 보내기를 쓰려면 아래 KAKAO_KEY 에 카카오 개발자 JavaScript 키를 넣으시오(없으면 휴대폰 공유창/링크 복사로 대신함). */
(function(){
var KAKAO_KEY=window.KAKAO_KEY||'';
var SITE='심묘한 산책 · 京城野錄';
var css=''+
'#shr{position:fixed;inset:0;z-index:9000;display:none;align-items:flex-end;justify-content:center;background:rgba(29,25,21,.6)}'+
'#shr.on{display:flex}'+
'#shr .sh{width:min(520px,100%);max-height:94vh;overflow:auto;background:#ebe2cc;border-radius:18px 18px 0 0;padding:18px 18px calc(18px + env(safe-area-inset-bottom));box-shadow:0 -10px 40px rgba(0,0,0,.35);transform:translateY(30px);transition:transform .35s cubic-bezier(.2,.9,.3,1)}'+
'#shr.on .sh{transform:none}'+
'@media (min-width:700px){#shr{align-items:center}#shr .sh{border-radius:18px}}'+
'#shr .hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;font:700 15px/1.2 "Nanum Myeongjo",serif;color:#211c17}'+
'#shr .hd button{border:0;background:none;font:22px/1 sans-serif;cursor:pointer;color:#5b4f42;padding:4px 8px}'+
'#shr .pv{display:block;width:100%;max-height:46vh;object-fit:contain;background:#e3d8bf;border-radius:6px;box-shadow:0 6px 14px rgba(40,25,10,.25)}'+
'#shr .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}'+
'#shr .grid button{display:flex;flex-direction:column;align-items:center;gap:6px;border:1px solid rgba(33,28,23,.35);background:#f4eddc;border-radius:12px;padding:12px 4px 10px;cursor:pointer;font:13px/1.2 "Gowun Dodum",sans-serif;color:#211c17}'+
'#shr .grid button:hover{background:#fff8e8}'+
'#shr .grid i{display:grid;place-items:center;width:38px;height:38px;border-radius:50%;font:700 15px/1 sans-serif;font-style:normal;color:#fff}'+
'#shr .msg{min-height:20px;margin-top:10px;font:13px/1.5 "Gowun Dodum",sans-serif;color:#a8402c;text-align:center}'+
'.shrbtn{display:inline-flex;align-items:center;gap:6px;border:1px solid #211c17;background:rgba(244,237,220,.95);color:#211c17;border-radius:999px;padding:7px 12px 6px;font:12.5px/1 "Gowun Dodum",sans-serif;cursor:pointer}'+
'.shrbtn::before{content:"";width:13px;height:13px;background:currentColor;clip-path:polygon(50% 0,85% 35%,62% 35%,62% 70%,38% 70%,38% 35%,15% 35%);}'+
'.shrbtn.mini{position:absolute;right:8px;top:8px;z-index:2;padding:6px 9px 5px;font-size:11.5px;box-shadow:0 2px 6px rgba(0,0,0,.2)}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
var root=null,cur=null,cardBlob=null,cardURL='';
function ensure(){if(root)return;root=document.createElement('div');root.id='shr';root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-label','그림 저장·공유');
  root.innerHTML='<div class="sh"><div class="hd"><span>심묘 그림 저장·공유</span><button class="x" aria-label="닫기">×</button></div><img class="pv" alt=""><div class="grid">'+
  '<button data-a="save"><i style="background:#211c17">↓</i>이미지 저장</button>'+
  '<button data-a="kakao"><i style="background:#f7d600;color:#3a1d1d">K</i>카카오톡</button>'+
  '<button data-a="insta"><i style="background:linear-gradient(45deg,#f2a03d,#d6336c,#7b3fbf)">◎</i>인스타그램</button>'+
  '<button data-a="x"><i style="background:#111">X</i>X(트위터)</button>'+
  '<button data-a="threads"><i style="background:#111">@</i>스레드</button>'+
  '<button data-a="link"><i style="background:#a8402c">⧉</i>링크 복사</button>'+
  '</div><div class="msg" aria-live="polite"></div></div>';
  document.body.appendChild(root);
  root.addEventListener('click',function(e){if(e.target===root)close()});
  root.querySelector('.x').onclick=close;
  [].forEach.call(root.querySelectorAll('.grid button'),function(b){b.onclick=function(){act(b.dataset.a)}});
  addEventListener('keydown',function(e){if(e.key==='Escape'&&root.classList.contains('on'))close()});}
function close(){root.classList.remove('on')}
function say(t){root.querySelector('.msg').textContent=t||''}
function pageURL(){var u=location.href.split('#')[0];return u}
function text(){return (cur.title?'「'+cur.title+'」 ':'')+(cur.caption?cur.caption+' ':'')+'— '+SITE}
function load(src){return new Promise(function(ok,no){var im=new Image();im.onload=function(){ok(im)};im.onerror=no;im.src=src})}
/* 공유용 카드(4:5): 바랜 종이 위 사진, 손글씨 한 줄, 아래 이름 */
async function makeCard(){
  var im=await load(cur.src);
  try{await Promise.all([document.fonts.load('48px "Nanum Pen Script"'),document.fonts.load('700 30px "Nanum Myeongjo"')])}catch(e){}
  var W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;var x=c.getContext('2d');
  x.fillStyle='#ebe2cc';x.fillRect(0,0,W,H);
  for(var i=0;i<2600;i++){x.fillStyle='rgba(90,70,40,'+(Math.random()*.06)+')';x.fillRect(Math.random()*W,Math.random()*H,1.6,1.6)}
  var pw=W-150,ph=Math.min(pw*im.height/im.width,880),iw=ph*im.width/im.height;if(iw>pw){iw=pw;ph=pw*im.height/im.width}
  var fx=(W-iw)/2-22,fy=Math.max(90,(H-(ph+44)-300)/2);
  x.save();x.translate(W/2,fy+ph/2+22);x.rotate(-0.012);x.translate(-W/2,-(fy+ph/2+22));
  x.shadowColor='rgba(40,25,10,.35)';x.shadowBlur=30;x.shadowOffsetY=12;x.fillStyle='#fbf6e8';x.fillRect(fx,fy,iw+44,ph+44);x.shadowColor='transparent';
  x.drawImage(im,fx+22,fy+22,iw,ph);x.strokeStyle='rgba(33,28,23,.5)';x.lineWidth=2;x.strokeRect(fx+22,fy+22,iw,ph);
  x.fillStyle='rgba(217,190,130,.7)';x.save();x.translate(W/2,fy-6);x.rotate(.03);x.fillRect(-70,-16,140,34);x.restore();
  x.restore();
  var ty=fy+ph+44+86;
  x.fillStyle='#2a2a46';x.font='64px "Nanum Pen Script", cursive';x.textAlign='center';
  var t=cur.caption||cur.title||'심묘';wrap(x,t,W/2,ty,W-160,64);
  x.fillStyle='#a8402c';x.font='700 26px "Nanum Myeongjo", serif';x.fillText(SITE,W/2,H-74);
  x.fillStyle='#8a7b66';x.font='20px "Gowun Dodum", sans-serif';x.fillText(cur.title?cur.title:'',W/2,H-40);
  // 발도장
  x.fillStyle='rgba(168,64,44,.85)';paw(x,W-120,H-120,38);
  return new Promise(function(ok){c.toBlob(function(b){ok(b)},'image/jpeg',.9)})}
function wrap(x,t,cx,y,maxw,lh){var w=t.split(''),line='',lines=[];w.forEach(function(ch){if(x.measureText(line+ch).width>maxw){lines.push(line);line=ch}else line+=ch});lines.push(line);lines.slice(0,3).forEach(function(l,i){x.fillText(l,cx,y+i*lh)})}
function paw(x,cx,cy,r){x.beginPath();x.ellipse(cx,cy+r*.25,r*.42,r*.34,0,0,7);x.fill();[[-.5,-.15],[-.18,-.5],[.18,-.5],[.5,-.15]].forEach(function(p){x.beginPath();x.ellipse(cx+p[0]*r,cy+p[1]*r,r*.15,r*.2,0,0,7);x.fill()})}
function fname(){return 'simmyo_'+(cur.title||'그림').replace(/[\\/:*?"<>|\s]+/g,'_')+'.jpg'}
function file(){return new File([cardBlob],fname(),{type:'image/jpeg'})}
function canFiles(){try{return !!(navigator.canShare&&navigator.canShare({files:[file()]}))}catch(e){return false}}
function download(){var a=document.createElement('a');a.href=cardURL;a.download=fname();document.body.appendChild(a);a.click();a.remove()}
async function sysShare(){try{await navigator.share({files:[file()],title:SITE,text:text()+' '+pageURL()});return true}catch(e){return e&&e.name==='AbortError'}}
async function copy(t){try{await navigator.clipboard.writeText(t);return true}catch(e){var ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();var ok=false;try{ok=document.execCommand('copy')}catch(_){}ta.remove();return ok}}
function kakaoReady(){return new Promise(function(ok){if(!KAKAO_KEY)return ok(false);if(window.Kakao&&Kakao.isInitialized&&Kakao.isInitialized())return ok(true);var s=document.createElement('script');s.src='https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';s.onload=function(){try{Kakao.init(KAKAO_KEY);ok(true)}catch(e){ok(false)}};s.onerror=function(){ok(false)};document.head.appendChild(s)})}
async function act(a){say('');window.snd&&snd('paper');
  if(a==='save'){download();say('그림을 저장했소. (휴대폰이면 사진 보관함이나 다운로드 폴더를 보시오)');return}
  if(a==='x'){open('https://twitter.com/intent/tweet?text='+encodeURIComponent(text())+'&url='+encodeURIComponent(pageURL()),'_blank','noopener');return}
  if(a==='threads'){open('https://www.threads.net/intent/post?text='+encodeURIComponent(text()+' '+pageURL()),'_blank','noopener');return}
  if(a==='link'){say(await copy(pageURL())?'링크를 복사했소. 원하는 곳에 붙여 넣으시오.':'복사가 안 되었소. 주소창의 주소를 직접 복사하시오.');return}
  if(a==='kakao'){
    if(await kakaoReady()){try{Kakao.Share.sendDefault({objectType:'feed',content:{title:cur.title||'심묘',description:cur.caption||SITE,imageUrl:new URL(cur.src,location.href).href,link:{mobileWebUrl:pageURL(),webUrl:pageURL()}},buttons:[{title:'심묘 따라 걷기',link:{mobileWebUrl:pageURL(),webUrl:pageURL()}}]});return}catch(e){}}
    if(canFiles()){await sysShare();return}
    await copy(text()+' '+pageURL());say('링크를 복사했소. 카카오톡 대화창에 붙여 넣으시오. (휴대폰에서는 공유창으로 바로 보낼 수 있소)');return}
  if(a==='insta'){
    if(canFiles()){var ok=await sysShare();if(!ok)say('공유창이 열리지 않았소. 「이미지 저장」 후 인스타그램 앱에서 올리시오.');return}
    download();say('그림을 저장했소. 인스타그램은 앱에서만 올릴 수 있으니, 휴대폰 인스타그램에서 이 그림을 골라 올리시오.');return}
}
async function openShare(o){ensure();cur=o||{};root.classList.add('on');say('그림을 준비하는 중…');root.querySelector('.pv').removeAttribute('src');
  try{cardBlob=await makeCard();if(cardURL)URL.revokeObjectURL(cardURL);cardURL=URL.createObjectURL(cardBlob);root.querySelector('.pv').src=cardURL;root.querySelector('.pv').alt=(cur.title||'')+' 공유 그림';say('')}
  catch(e){say('그림을 불러오지 못했소.')}}
window.SimmyoShare={open:openShare};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-share-src]');if(!b)return;e.preventDefault();e.stopPropagation();openShare({src:b.getAttribute('data-share-src'),title:b.getAttribute('data-share-title')||'',caption:b.getAttribute('data-share-caption')||''})},true);
})();
