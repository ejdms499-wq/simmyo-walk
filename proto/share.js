/* 심묘한 산책 — 심묘 그림 저장·공유
   쓰는 법: 아무 단추에 data-share-src="그림 경로" data-share-title="제목" data-share-caption="한 줄" 을 달면 누를 때 공유 창이 열림.
   또는 SimmyoShare.open({src, title, caption})
   카카오톡 바로 보내기를 쓰려면 아래 KAKAO_KEY 에 카카오 개발자 JavaScript 키를 넣으시오(없으면 휴대폰 공유창/링크 복사로 대신함). */
(function(){
var KAKAO_KEY=window.KAKAO_KEY||'';
var SITE='심묘한 산책 · 경성야록';
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
'#shr .sh{position:relative}#shr .tst{position:absolute;left:50%;top:38%;transform:translate(-50%,-50%) scale(.9);width:max-content;max-width:86%;background:#211c17;color:#f4eddc;font:15px/1.6 "Gowun Dodum",sans-serif;text-align:center;padding:16px 20px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.4);opacity:0;pointer-events:none;transition:.25s;z-index:3}#shr .tst.on{opacity:1;transform:translate(-50%,-50%) scale(1)}#shr .tst b{color:#f7d27a}'+
'#shr .lk{display:flex;gap:6px;margin-top:10px}#shr .lk[hidden]{display:none}#shr .lk input{flex:1;min-width:0;font:13px/1 sans-serif;padding:10px;border:1px solid #8a7b66;border-radius:8px;background:#fffaf0;color:#211c17}#shr .lk button{border:0;border-radius:8px;background:#211c17;color:#f4eddc;padding:0 14px;font:13px "Gowun Dodum",sans-serif;cursor:pointer}'+
'.shrbtn{display:inline-flex;align-items:center;gap:6px;white-space:nowrap;flex:none;border:1px solid #211c17;background:rgba(244,237,220,.95);color:#211c17;border-radius:999px;padding:7px 12px 6px;font:12.5px/1 "Gowun Dodum",sans-serif;cursor:pointer}'+
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
  '</div><div class="tst" role="status"></div><div class="msg" aria-live="polite"></div><div class="lk" hidden><input readonly aria-label="공유 주소"><button class="cp">복사</button></div><div style="font:12px/1.5 Gowun Dodum,sans-serif;color:#8a7b66;text-align:center;margin-top:4px">휴대폰에서는 위 그림을 길게 눌러 바로 저장할 수도 있소</div></div>';
  document.body.appendChild(root);
  root.addEventListener('click',function(e){if(e.target===root)close()});
  root.querySelector('.x').onclick=close;root.querySelector('.lk .cp').onclick=function(){copyLink('링크를 복사했소.')};
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
  var fx=(W-iw)/2-22,fy=Math.max(80,(H-(ph+44)-250)/2);
  x.save();x.translate(W/2,fy+ph/2+22);x.rotate(-0.012);x.translate(-W/2,-(fy+ph/2+22));
  x.shadowColor='rgba(40,25,10,.35)';x.shadowBlur=30;x.shadowOffsetY=12;x.fillStyle='#fbf6e8';x.fillRect(fx,fy,iw+44,ph+44);x.shadowColor='transparent';
  x.drawImage(im,fx+22,fy+22,iw,ph);x.strokeStyle='rgba(33,28,23,.5)';x.lineWidth=2;x.strokeRect(fx+22,fy+22,iw,ph);
  x.fillStyle='rgba(217,190,130,.7)';x.save();x.translate(W/2,fy-6);x.rotate(.03);x.fillRect(-70,-16,140,34);x.restore();
  x.restore();
  var ty=fy+ph+44+86;
  x.fillStyle='#2a2a46';x.font='64px "Nanum Pen Script", cursive';x.textAlign='center';
  var t=cur.caption||cur.title||'심묘';wrap(x,t,W/2,ty,W-160,64);
  var by=Math.min(H-60,ty+64*Math.min(3,Math.ceil(x.measureText(t).width/(W-160)))+70);x.fillStyle='#a8402c';x.font='700 26px "Nanum Myeongjo", serif';x.fillText(SITE,W/2,by);
  x.fillStyle='#8a7b66';x.font='20px "Gowun Dodum", sans-serif';x.fillText(cur.title?cur.title:'',W/2,by+34);
  // 발도장
  x.fillStyle='rgba(168,64,44,.85)';paw(x,W-120,H-120,38);
  return new Promise(function(ok){c.toBlob(function(b){ok(b)},'image/jpeg',.86)})}
function wrap(x,t,cx,y,maxw,lh){var w=t.split(''),line='',lines=[];w.forEach(function(ch){if(x.measureText(line+ch).width>maxw){lines.push(line);line=ch}else line+=ch});lines.push(line);lines.slice(0,3).forEach(function(l,i){x.fillText(l,cx,y+i*lh)})}
function paw(x,cx,cy,r){x.beginPath();x.ellipse(cx,cy+r*.25,r*.42,r*.34,0,0,7);x.fill();[[-.5,-.15],[-.18,-.5],[.18,-.5],[.5,-.15]].forEach(function(p){x.beginPath();x.ellipse(cx+p[0]*r,cy+p[1]*r,r*.15,r*.2,0,0,7);x.fill()})}
function fname(){return 'simmyo-'+(idOf(cur.src)||'card')+'.jpg'}
var BASE=(function(){var h=location.href.split('#')[0].split('?')[0],i=h.indexOf('/proto/');return i>=0?h.slice(0,i+1):h.replace(/[^\/]*$/,'')})();
var shareURL='';
function idOf(src){try{var p=new URL(src,location.href).pathname.split('/');return p[p.length-2]+'-'+p[p.length-1].replace(/\.\w+$/,'')}catch(e){return ''}}
var INAPP=/KAKAOTALK|Instagram|FBAN|FBAV|Line\/|NAVER|DaumApps/i.test(navigator.userAgent);
function file(){return new File([cardBlob],fname(),{type:'image/jpeg'})}
function canFiles(){try{return !!(navigator.canShare&&navigator.canShare({files:[file()]}))}catch(e){return false}}
function download(){var a=document.createElement('a');a.href=cardURL;a.download=fname();document.body.appendChild(a);a.click();a.remove()}
async function shareFiles(){try{await navigator.share({files:[file()]});return 'ok'}catch(e){return e&&e.name==='AbortError'?'cancel':'fail'}}
async function shareLink(){try{await navigator.share({title:(cur.title||'심묘')+' — '+SITE,text:text(),url:shareURL});return 'ok'}catch(e){return e&&e.name==='AbortError'?'cancel':'fail'}}
async function copy(t){try{await navigator.clipboard.writeText(t);return true}catch(e){var ta=document.createElement('textarea');ta.value=t;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();var ok=false;try{ok=document.execCommand('copy')}catch(_){}ta.remove();return ok}}
function kakaoReady(){return new Promise(function(ok){if(!KAKAO_KEY)return ok(false);if(window.Kakao&&Kakao.isInitialized&&Kakao.isInitialized())return ok(true);var s=document.createElement('script');s.src='https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';s.onload=function(){try{Kakao.init(KAKAO_KEY);ok(true)}catch(e){ok(false)}};s.onerror=function(){ok(false)};document.head.appendChild(s)})}
function go(u){var w=null;try{w=window.open(u,'_blank','noopener')}catch(e){}if(!w)location.href=u}
var MOB=/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)||(navigator.maxTouchPoints>1&&/Macintosh/.test(navigator.userAgent));
var cardFile=null,kakaoOK=false;
/* 크게 보이는 알림(시트 한가운데) */
function toast(t,ms){var e=root.querySelector('.tst');e.innerHTML=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(function(){e.classList.remove('on')},ms||3600);say(t.replace(/<[^>]+>/g,' '))}
function showLink(){var b=root.querySelector('.lk');b.hidden=false;var i=b.querySelector('input');i.value=shareURL;if(!MOB){try{i.focus();i.select()}catch(e){}}}
function doDownload(){if(cardURL){download();return true}var a=document.createElement('a');a.href=cur.src;a.download=fname();document.body.appendChild(a);a.click();a.remove();return true}
function copyLink(after){copy(shareURL).then(function(ok){showLink();toast(ok?after:'자동 복사가 막혔소.<br>아래 주소 칸을 길게 눌러 복사하시오.',5200)})}
/* 휴대폰 공유창은 누른 그 순간에 바로 불러야 열림(기다렸다 부르면 막힘) */
function nativeShare(data,onFail){try{var pr=navigator.share(data);pr.then(function(){toast('보냈소.')}).catch(function(e){if(e&&e.name==='AbortError')return;onFail()})}catch(e){onFail()}}
function act(a){say('');window.snd&&snd('paper');
  if(!cardFile&&(a==='save'||a==='insta')&&!cardURL){toast('그림을 준비하는 중이오. 잠깐 뒤 다시 눌러 주시오.');return}
  if(a==='x'){go('https://twitter.com/intent/tweet?text='+encodeURIComponent(text())+'&url='+encodeURIComponent(shareURL));toast('X(트위터) 창을 열었소.');return}
  if(a==='threads'){go('https://www.threads.net/intent/post?text='+encodeURIComponent(text()+'\n'+shareURL));toast('스레드 창을 열었소.');return}
  if(a==='link'){copyLink('링크를 복사했소.<br>카톡·인스타 DM·문자에 붙여 넣으면<br>그림이 미리보기로 뜨오.');return}
  if(a==='save'){
    if(MOB&&cardFile&&canFiles()){nativeShare({files:[cardFile]},function(){doDownload();toast('그림을 받았소.<br>안 보이면 위 그림을 길게 눌러<br>「이미지 저장」을 고르시오.',5200)});return}
    if(INAPP){toast('카톡 안 브라우저에서는 저장이 막혀 있소.<br>위 그림을 <b>길게 눌러</b> 「이미지 저장」을 고르시오.',6000);return}
    doDownload();toast(MOB?'그림을 받았소.<br>안 보이면 위 그림을 길게 눌러 저장하시오.':'그림을 저장했소.<br>「다운로드」 폴더를 보시오.',5200);return}
  if(a==='kakao'){
    if(kakaoOK){try{Kakao.Share.sendDefault({objectType:'feed',content:{title:cur.title||'심묘',description:cur.caption||SITE,imageUrl:BASE+'proto/share/og/'+idOf(cur.src)+'.jpg',link:{mobileWebUrl:shareURL,webUrl:shareURL}},buttons:[{title:'그림 보러 가기',link:{mobileWebUrl:shareURL,webUrl:shareURL}}]});return}catch(e){}}
    if(MOB&&navigator.share){nativeShare({title:(cur.title||'심묘')+' — '+SITE,text:text(),url:shareURL},function(){copyLink('링크를 복사했소.<br>카카오톡 대화방에 붙여 넣으시오.')});return}
    copyLink(MOB?'링크를 복사했소.<br>카카오톡 대화방에 붙여 넣으면<br>그림이 미리보기로 뜨오.':'링크를 복사했소.<br>카카오톡 PC 대화방에 <b>Ctrl+V</b>로 붙여 넣으면<br>그림이 미리보기로 뜨오.');return}
  if(a==='insta'){
    if(MOB&&cardFile&&canFiles()){nativeShare({files:[cardFile]},function(){doDownload();toast('그림을 받았소.<br>인스타그램 앱에서 이 그림을 골라 올리시오.',5600)});return}
    if(INAPP){toast('위 그림을 <b>길게 눌러</b> 저장한 뒤,<br>인스타그램 앱에서 올리시오.',6000);return}
    doDownload();toast(MOB?'그림을 받았소.<br>인스타그램 앱에서 이 그림을 골라 올리시오.':'그림을 저장했소(다운로드 폴더).<br>인스타그램은 휴대폰 앱에서만 올릴 수 있소.',6000);return}
}
async function openShare(o){ensure();cur=o||{};root.classList.add('on');say('');root.querySelector('.lk').hidden=true;root.querySelector('.tst').classList.remove('on');cardFile=null;root.querySelector('.pv').src=cur.src;if(KAKAO_KEY)kakaoReady().then(function(v){kakaoOK=v});
  var id=idOf(cur.src);shareURL=location.href.split('#')[0];cardBlob=null;
  try{var r=await fetch(BASE+'proto/share/card/'+id+'.jpg');if(r.ok){cardBlob=await r.blob();shareURL=BASE+'proto/share/'+id+'.html'}}catch(e){}
  try{if(!cardBlob)cardBlob=await makeCard();if(cardURL)URL.revokeObjectURL(cardURL);cardURL=URL.createObjectURL(cardBlob);root.querySelector('.pv').src=cardURL;root.querySelector('.pv').alt=(cur.title||'')+' 공유 그림';try{cardFile=file()}catch(e){}}
  catch(e){}}
window.SimmyoShare={open:openShare,card:function(o){cur=o;return makeCard()}};
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('[data-share-src]');if(!b)return;e.preventDefault();e.stopPropagation();openShare({src:b.getAttribute('data-share-src'),title:b.getAttribute('data-share-title')||'',caption:b.getAttribute('data-share-caption')||''})},true);
})();
