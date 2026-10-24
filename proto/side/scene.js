/* 곁골목 장면: 미드저니 배경 위에서 심묘가 여러 몸짓을 이어서 함.
   좌표는 배경 그림의 원래 픽셀 기준. sc = 심묘 크기(걷기 컷 기준 배율). f = 1 오른쪽, -1 왼쪽.
   걸음 종류: hop(폴짝) · walk(걷기) · run(뛰기) */
(function(){
var SCENES={
 bingsu:{bg:'bg/s04.webp',W:1232,H:928,sc:1.85,start:[1000,760,-1],steps:[
  {k:'sniff',say:'얼음 냄새요.',snd:'sniff'},
  {k:'lickice',f:1,say:'…차오.',snd:'lick'},
  {k:'brainfreeze',say:'머리가 띵하오.',snd:'ice'},{k:'facewash'},
  {k:'tap'},
  {to:[760,850],by:'hop',k:'loaf',say:'여기 시원하오.'},
  {k:'blink'},
  {to:[1000,760],by:'hop',f:-1,k:'sitlook'}]},
 expo:{bg:'bg/s01.webp',W:1232,H:928,sc:1.25,start:[880,812,-1],steps:[
  {k:'lookup',say:'탑 꼭대기가 양파 같소.'},
  {k:'toytrain',say:'맨 뒤 칸이오.',snd:'whoosh'},{k:'wind',say:'꼬마기차 바람이오.',snd:'whoosh'},
  {to:[640,800],by:'walk',k:'gaze',f:-1},
  {k:'proud',snd:'mrrp',say:'입장권은 없소.'},{k:'hunt'},
  {to:[300,795],by:'run',k:'yawn'},
  {to:[880,812],by:'run',f:-1,k:'blink'}]},
 hwasin:{bg:'bg/s02.webp',W:928,H:1232,sc:1.9,start:[470,1170,1],steps:[
  {k:'ceil',say:'작은 방이 올라가오.'},
  {k:'button',say:'이 단추를 누르면…',snd:'tink'},{k:'startle',say:'!',snd:'land'},{k:'puff'},
  {k:'scratch',say:'흠.'},
  {to:[320,1150],by:'walk',f:-1,k:'groom'},
  {k:'knead'},{k:'stretch'},{k:'dozey'},
  {to:[600,1155],by:'walk',k:'licklip',say:'몇 층이오?'}]},
 jodk:{bg:'bg/s03.webp',W:1232,H:928,sc:1.65,start:[540,865,-1],steps:[
  {k:'stare',f:-1,say:'이 쇠 꽃이 말을 하오?'},
  {k:'micnose',say:'쇠 냄새요.',snd:'sniff'},{k:'sneeze',snd:'sneeze'},
  {k:'sitlook',say:'야옹. 경성 들리오?',snd:'horn'},
  {to:[640,548],by:'hop',k:'tilt'},{k:'newsp',say:'오늘 소식이오.',snd:'paper'},
  {k:'loaf',say:'방송은 잘 들었소.'},
  {to:[540,865],by:'hop',f:-1,k:'blink'}]},
 sakura:{bg:'bg/s05.webp',W:1232,H:928,sc:1.55,start:[880,815,1],steps:[
  {k:'swat',say:'꽃잎이 도망가오.',snd:'pop'},
  {k:'lookup'},
  {k:'petalcatch',say:'잡았소.'},{k:'petal',say:'…하나 더 오오.'},
  {k:'roll'},{k:'belly'},
  {to:[1060,800],by:'walk',k:'blink'},
  {k:'gazeup',say:'밤인데 밝소.'},
  {to:[880,815],by:'walk',f:-1,k:'sitlook'}]},
 stadium:{bg:'bg/s06.webp',W:1232,H:928,sc:1.75,start:[160,860,1],steps:[
  {k:'sitlook',say:'다들 왜 뛰는지 모르겠소.'},
  {to:[950,875],by:'run',k:'yawn',say:'…일등이오.'},
  {k:'proud',snd:'mrrp'},
  {k:'finish',say:'결승선이오.'},{k:'smug'},
  {to:[420,868],by:'run',f:-1,k:'scratch'},
  {k:'loaf'}]},
 bonjeong:{bg:'bg/s07.webp',W:1232,H:928,sc:1.55,start:[620,895,1],steps:[
  {k:'gazeup',say:'방울이 불을 켰소.'},
  {to:[480,880],by:'walk',f:-1,k:'groom'},
  {k:'lampjump',say:'방울을 잡겠소.',snd:'hop'},{k:'sulk',say:'…높소.'},{k:'lookback'},
  {to:[770,882],by:'walk',k:'ceil',say:'밤이 길겠소.'},
  {k:'scratch'},{k:'bigyawn'},
  {to:[620,895],by:'walk',f:-1,k:'blink'}]},
 seoulst:{bg:'bg/s09.webp',W:1232,H:928,sc:1.7,start:[620,868,1],steps:[
  {k:'ceil',say:'천장이 둥글게 열렸소.'},
  {to:[470,800],by:'walk',f:-1,k:'stretch'},
  {k:'pause',say:'기차 소리요.',snd:'bell'},
  {to:[760,840],by:'run',k:'smug',say:'…기차는 안 타오.'},
  {k:'dozey'},
  {to:[620,868],by:'walk',f:-1,k:'blink'}]},
 post:{bg:'bg/s10.webp',W:1232,H:928,sc:1.5,start:[1060,885,-1],steps:[
  {k:'lookup',say:'엽서가 다 여기로 오오.'},
  {to:[640,556],by:'hop',f:-1,k:'tailwrap'},
  {k:'paper',say:'이건 내게 온 엽서요?',snd:'paper'},
  {k:'stamp',say:'도장 찍었소.',snd:'tink'},
  {to:[420,556],by:'walk',f:-1,k:'smug'},
  {k:'loaf'},
  {to:[1060,885],by:'hop',k:'blink'}]},
 photo:{bg:'bg/s11.webp',W:1232,H:928,sc:1.5,start:[860,840,-1],steps:[
  {k:'stare',f:-1,say:'저 상자가 나를 보오.'},
  {to:[622,592],by:'hop',f:-1,k:'smug',say:'…찍으시오.'},
  {k:'pause'},
  {k:'startle',say:'!',snd:'pop'},
  {k:'sulk',say:'눈이 부시오.'},
  {to:[860,840],by:'hop',k:'facewash'}]},
 barber:{bg:'bg/s12.webp',W:1232,H:928,sc:1.5,start:[980,885,-1],steps:[
  {k:'lookup',f:-1,say:'저 의자는 돌아가오?'},
  {to:[745,648],by:'hop',f:-1,k:'chairspin'},
  {k:'facewash',say:'단발은 안 하오.'},
  {k:'smug'},
  {to:[420,885],by:'hop',f:-1,k:'sniff',snd:'sniff',say:'머릿기름 냄새요.'},
  {k:'sneeze',snd:'sneeze'},
  {to:[980,885],by:'walk',k:'blink'}]},
 books:{bg:'bg/s13.webp',W:1232,H:928,sc:1.55,start:[720,890,1],steps:[
  {k:'lookup',say:'책이 하늘까지 쌓였소.'},
  {k:'newsp',say:'팔리지 않는 책 위가 내 자리요.',snd:'paper'},
  {k:'paper',snd:'paper'},
  {to:[520,880],by:'walk',f:-1,k:'chase'},
  {k:'dozey'},
  {to:[720,890],by:'walk',k:'loaf'}]},
 market:{bg:'bg/s14.webp',W:1232,H:928,sc:1.55,start:[860,895,-1],steps:[
  {k:'sniff',f:-1,say:'마른 생선 냄새요.',snd:'sniff'},
  {k:'hunt'},
  {k:'basket',say:'이 바구니는 내 것이오.'},
  {to:[1060,870],by:'walk',k:'tailwrap'},
  {k:'ignore',say:'…아직 문 안 열었소.'},
  {to:[860,895],by:'walk',f:-1,k:'blink'}]},
 mitsu:{bg:'bg/s08.webp',W:1232,H:928,sc:1.45,start:[330,648,-1],steps:[
  {k:'stare',f:-1,say:'경성이 다 보이오.'},
  {to:[200,885],by:'hop',k:'sitlook'},
  {to:[610,795],by:'hop',k:'crouch',say:'물고기는 없소.',snd:'drip'},
  {k:'fountain',snd:'drip',say:'물맛은 괜찮소.'},{k:'lickpaw',snd:'lick'},
  {to:[1080,885],by:'hop',k:'loaf'},
  {to:[330,648],by:'hop',f:-1,k:'blink'}]}
};
/* 몸짓: [컷, 시간ms] */
var SEQ={
 chairspin:[['g2_D9',1300],['g2_C4',1400]],tailwrap:[['g2_A8',2000]],paper:[['g2_D4',1500]],stamp:[['g2_E5',1700]],basket:[['g2_D7',2400]],ignore:[['g2_C6',2000]],
 brainfreeze:[['g2_F1',1700]],button:[['g2_F2',1500]],micnose:[['g2_F3',1800]],petalcatch:[['g2_F4',1900]],finish:[['g2_F5',1100]],lampjump:[['g2_B1',400],['g2_F6',900],['g2_B5',500]],
 fountain:[['g2_F7',2000]],toytrain:[['g2_F8',2200]],stretch:[['g2_A1',1300],['g2_A2',1200]],bigyawn:[['g2_A3',1200]],facewash:[['g2_A4',700],['g2_A5',700],['g2_A4',600]],
 belly:[['g2_A7',2000]],puff:[['g2_C1',1100]],sulk:[['g2_C2',1700]],dozey:[['g2_C3',900],['g2_C4',1300]],smug:[['g2_C7',1500]],pause:[['g2_C9',1200]],
 hunt:[['g2_D1',1200],['g2_D2',500]],chase:[['g2_D9',1400]],newsp:[['g2_D6',2200]],
 sniff:[['s3_01',1600]],lickice:[['g_f5',2400]],freeze:[['s8_07',1500]],tap:[['s7_05',700],['s7_06',900]],
 loaf:[['lie_01',2600]],blink:[['sitg_01',900],['sitg_02',110],['sitg_03',140],['sitg_02',110],['sitg_01',900]],
 sitlook:[['sitg_10',1600]],lookup:[['s4_04',1700]],wind:[['g_s4',1700]],gaze:[['g_s7',1800]],proud:[['react_08',1400]],
 yawn:[['sitg_04',300],['sitg_05',900],['sitg_06',500],['sitg_01',500]],ceil:[['g_s1',1900]],startle:[['react_01',700],['react_02',1100]],
 scratch:[['sitg_09',1400]],groom:[['sitg_07',500],['sitg_08',500],['sitg_07',500],['sitg_01',500]],knead:[['react_06',650],['sitg_01',500],['react_06',650]],
 licklip:[['g_p7',1500]],stare:[['g_s2',2100]],sneeze:[['sitg_01',400],['sitg_03',220],['sitg_12',500],['sitg_01',600]],tilt:[['sitg_10',1500]],
 swat:[['g_s3',1500]],petal:[['g_f9',2200]],roll:[['lie_02',500],['lie_04',1400],['lie_02',500]],gazeup:[['g_s7',1900]],
 dash:[['g_s5',900]],lookback:[['sitg_11',1600]],crouch:[['g_s8',2000]],lickpaw:[['s6_04',1400]]
};
var typ=null,SZ=null,cv,cat,sh,say,stage,cfg,raf=0,cur={x:0,y:0,f:1,k:'sitg_01',lift:0},busy=false,timer=0,si=0,react=false,REDUCE=matchMedia('(prefers-reduced-motion: reduce)').matches;
function src(k){return '../road/m2/'+k+'.webp'}
var YOFF={"wk_01": 3.1, "wk_02": 2.3, "wk_03": 2.4, "wk_04": -0.3, "wk_05": 3.3, "wk_06": 2.7, "wk_07": 2.8, "wk_08": -1.1, "tr_01": -0.9, "tr_02": -0.2, "tr_03": -6.6, "tr_04": 1.3, "tr_05": -1.1, "tr_06": -7.7, "fw_01": 2.2, "fw_02": 2.8, "fw_03": -1.7, "fw_04": 1.9, "fw_05": 1.7, "fw_06": 1.5, "fw_07": 1.3, "fw_08": -3.5, "fw_09": -3.6, "fw_10": -2.2, "fw_11": -0.0, "fw_12": -0.2};
var MOUTH=/^(wk_|tr_|jump_|trot_|fw_|walkg_|react_0[345])/,dropX=null,dropY=null;
function pose(k,x,y,f,lift){var z=SZ[k];if(!z)return;var mo=MOUTH.test(k);if(typ){if(mo){typ.style.opacity=0;dropX=null}else{if(dropX===null){dropX=x+f*52*cfg.sc;dropY=y}typ.style.left=(dropX-13*cfg.sc)+'px';typ.style.top=(dropY-26*cfg.sc)+'px';typ.style.width=(26*cfg.sc)+'px';typ.style.opacity=1}}lift=(lift||0)-(YOFF[k]||0)*cfg.sc*.56;var s=cfg.sc*.56*(k.indexOf('g_')===0?.86:1),w=z[0]*s,h=z[1]*s,ax=(f>0?z[2]:z[0]-z[2])*s;
  if(cat.getAttribute('src')!==src(k))cat.src=src(k);cat.style.width=w+'px';cat.style.left=(x-ax)+'px';cat.style.top=(y-h-(lift||0))+'px';
  cat.style.transformOrigin=ax+'px 100%';cat.style.transform='scaleX('+f+')';
  var sw=Math.min(w*.75,170*cfg.sc)*(1-Math.min(.5,(lift||0)/300));sh.style.width=sw+'px';sh.style.left=(x-sw/2)+'px';sh.style.top=(y-8*cfg.sc)+'px';sh.style.opacity=Math.max(.2,.45-(lift||0)/400);
  cur={x:x,y:y,f:f,k:k,lift:lift||0};var sw2=say.offsetWidth||0,sh2=say.offsetHeight||0;say.style.left=Math.max(sw2/2+14,Math.min(cfg.W-sw2/2-14,x))+'px';say.style.top=Math.max(sh2+14,y-h-(lift||0)-16)+'px'}
function wait(ms){return new Promise(function(r){timer=setTimeout(r,REDUCE?0:ms)})}
function tw(dur,fn){return new Promise(function(r){if(REDUCE){fn(1);r();return}var t0=performance.now();(function f(now){var u=Math.max(0,Math.min(1,(now-t0)/dur));fn(u);if(u<1)raf=requestAnimationFrame(f);else r()})(t0)})}
function talk(t,ms){if(!t)return;say.textContent=t;pose(cur.k,cur.x,cur.y,cur.f,cur.lift);say.classList.add('on');clearTimeout(say._t);say._t=setTimeout(function(){say.classList.remove('on')},ms||2200)}
function snd(n){if(n&&window.snd)window.snd(n)}
async function move(to,by,f){var a={x:cur.x,y:cur.y},b={x:to[0],y:to[1]},d=Math.hypot(b.x-a.x,b.y-a.y);var face=f||(b.x>=a.x?1:-1);
  if(by==='hop'){snd('hop');var h=60+Math.abs(b.y-a.y)*.5;await tw(Math.max(450,d*1.1),function(u){var e=u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;var k=u<.12?'jump_01':u<.3?'jump_03':u<.55?'jump_04':u<.75?'jump_06':u<.92?'jump_07':'jump_08';pose(k,a.x+(b.x-a.x)*e,a.y+(b.y-a.y)*e,face,h*4*u*(1-u))});snd('land');return}
  var run=by==='run',sp=run?.5:.2,n=run?6:8,per=run?75:110;await tw(d/sp,function(u){var t=u*d/sp;var k=run?'tr_0'+(1+Math.floor(t/per)%n):'wk_0'+(1+Math.floor(t/per)%n);pose(k,a.x+(b.x-a.x)*u,a.y+(b.y-a.y)*u,face,0)})}
async function play(name,f){var q=SEQ[name]||[['sitg_01',800]];for(var i=0;i<q.length;i++){if(react)return;pose(q[i][0],cur.x,cur.y,f||cur.f,0);await wait(q[i][1])}}
async function loop(){var st=cfg.steps;while(true){var s=st[si%st.length];si++;
  if(s.to)await move(s.to,s.by||'walk',s.f);
  var f=s.f||cur.f;if(s.say)talk(s.say,2600);snd(s.snd);await play(s.k,f);
  while(react)await wait(200);await wait(250)}}
async function poke(){if(react)return;react=true;var lines=['…','냐.','무슨 일이오.','쓰다듬지 마시오.','흠.'];talk(lines[Math.floor(Math.random()*lines.length)],1400);snd(['mew','mewhi','mrrp'][Math.floor(Math.random()*3)]);
  var r=[['react_01',600],['react_02',900]];if(Math.random()<.5)r=[['react_07',1300]];if(Math.random()<.3)r=[['react_06',500],['sitg_01',350],['react_06',500]];
  for(var i=0;i<r.length;i++){pose(r[i][0],cur.x,cur.y,cur.f,0);await new Promise(function(q){setTimeout(q,r[i][1])})}react=false}
function fit(){var w=stage.parentNode.clientWidth;var s=w/cfg.W;stage.style.transform='scale('+s+')';stage.parentNode.style.height=(cfg.H*s)+'px';var bs=Math.max(1,1/s);say.style.fontSize=(24/s*0.9)+'px'}
window.SCENE_IDS=Object.keys(SCENES);
window.startScene=function(id,host){cfg=SCENES[id];if(!cfg)return false;
  host.innerHTML='<div class="stg"><img class="bgi" alt=""><img class="typ" src="../road/m2/type.webp" alt="" style="position:absolute;opacity:0;transition:opacity .2s"><div class="csh"></div><img class="cat" alt="심묘 — 누르면 반응함"><div class="csay"></div></div>';
  stage=host.querySelector('.stg');typ=host.querySelector('.typ');cat=host.querySelector('.cat');sh=host.querySelector('.csh');say=host.querySelector('.csay');
  stage.style.width=cfg.W+'px';stage.style.height=cfg.H+'px';host.querySelector('.bgi').src=cfg.bg;
  fit();addEventListener('resize',fit);cat.addEventListener('click',function(e){e.stopPropagation();poke()});
  fetch('../road/m2/sizes.json').then(function(r){return r.json()}).then(function(j){SZ=j;
    /* 걷기·뛰기 컷 기준점 통일(떨림 방지) */
    [['wk_',8],['tr_',6]].forEach(function(g){var s=0,ks=[];for(var i=1;i<=g[1];i++){var k=g[0]+'0'+i;if(SZ[k]){ks.push(k);s+=SZ[k][2]/SZ[k][0]}}ks.forEach(function(k){SZ[k][2]=SZ[k][0]*s/ks.length})});
    var all={};Object.keys(SEQ).forEach(function(n){SEQ[n].forEach(function(q){all[q[0]]=1})});['jump_01','jump_03','jump_04','jump_06','jump_07','jump_08','react_01','react_02','react_06','react_07'].forEach(function(k){all[k]=1});for(var i=1;i<=8;i++)all['wk_0'+i]=1;for(i=1;i<=6;i++)all['tr_0'+i]=1;
    Object.keys(all).forEach(function(k){var im=new Image();im.src=src(k)});
    pose('sitg_01',cfg.start[0],cfg.start[1],cfg.start[2]||1,0);loop()});
  return true};
})();
