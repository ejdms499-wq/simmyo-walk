/* 심묘한 산책 — 효과음 (Web Audio로 직접 합성, 파일 없음)
   snd('mew') 처럼 부름. 첫 터치/클릭 뒤에만 소리가 남(브라우저 규칙).
   나중에 진짜 녹음(CC0)을 쓰려면 FILES에 이름:'경로' 를 적으면 그 파일이 우선 재생됨. */
(function(){
var FILES={};FILES.mew='../audio/sfx/mew.mp3';FILES.mewhi='../audio/sfx/mewhi.mp3';FILES.mewlow='../audio/sfx/mewlow.mp3';FILES.mrrp='../audio/sfx/mrrp.mp3';FILES.yawn='../audio/sfx/yawn.mp3';FILES.hop='../audio/sfx/hop.mp3';FILES.land='../audio/sfx/land.mp3';FILES.paper='../audio/sfx/paper.mp3';FILES.tink='../audio/sfx/tink.mp3';FILES.clink='../audio/sfx/clink.mp3';FILES.chime='../audio/sfx/chime.mp3';FILES.bell='../audio/sfx/bell.mp3';FILES.splash='../audio/sfx/splash.mp3';FILES.drip='../audio/sfx/drip.mp3';FILES.crackle='../audio/sfx/crackle.mp3';FILES.horn='../audio/sfx/horn.mp3';FILES.pop='../audio/sfx/pop.mp3';FILES.sniff='../audio/sfx/sniff.mp3';FILES.whoosh='../audio/sfx/whoosh.mp3';FILES.crunch='../audio/sfx/crunch.mp3';FILES.ice='../audio/sfx/ice.mp3';FILES.sneeze='../audio/sfx/sneeze.mp3';FILES.lick='../audio/sfx/lick.mp3';FILES.page='../audio/sfx/page.mp3';
var ctx=null,master=null,muted=false,buf={};
try{muted=localStorage.getItem('simmyo_mute2')==='1'}catch(e){}
function init(){if(ctx)return;var AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;ctx=new AC();master=ctx.createGain();master.gain.value=muted?0:0.6;
  var comp=ctx.createDynamicsCompressor();master.connect(comp);comp.connect(ctx.destination);
  Object.keys(FILES).forEach(function(k){fetch(FILES[k]).then(function(r){return r.arrayBuffer()}).then(function(a){return ctx.decodeAudioData(a)}).then(function(b){buf[k]=b}).catch(function(){})})}
function unlock(){init();if(ctx&&ctx.state==='suspended')ctx.resume()}
['pointerdown','touchstart','keydown','wheel'].forEach(function(ev){addEventListener(ev,unlock,{passive:true,capture:true})});
function noiseBuf(sec){var n=Math.floor(ctx.sampleRate*sec),b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0);for(var i=0;i<n;i++)d[i]=Math.random()*2-1;return b}
var NB=null;function noise(t,dur){if(!NB)NB=noiseBuf(2);var s=ctx.createBufferSource();s.buffer=NB;s.loop=true;s.start(t,Math.random()*1.5);s.stop(t+dur+.05);return s}
function env(g,t,a,h,r,peak){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.setValueAtTime(peak,t+a+h);g.gain.exponentialRampToValueAtTime(0.0001,t+a+h+r)}
function out(node,vol,pan){var g=ctx.createGain();g.gain.value=vol==null?1:vol;node.connect(g);if(ctx.createStereoPanner&&pan){var p=ctx.createStereoPanner();p.pan.value=pan;g.connect(p);p.connect(master)}else g.connect(master);return g}
/* 야옹: 톱니파 + 입 모양(필터)이 「ㅁ→이→아→오」로 열렸다 닫힘 */
function mew(t,o){o=o||{};var p=o.pitch||1,dur=o.dur||.55,v=o.vol||.5;
  var osc=ctx.createOscillator();osc.type='sawtooth';var f0=560*p;
  osc.frequency.setValueAtTime(f0*.82,t);osc.frequency.linearRampToValueAtTime(f0*1.38,t+dur*.32);osc.frequency.linearRampToValueAtTime(f0*1.12,t+dur*.7);osc.frequency.linearRampToValueAtTime(f0*.78,t+dur);
  var vib=ctx.createOscillator(),vg=ctx.createGain();vib.frequency.value=6.5;vg.gain.value=f0*.018;vib.connect(vg);vg.connect(osc.frequency);
  var lp=ctx.createBiquadFilter();lp.type='lowpass';lp.Q.value=4;lp.frequency.setValueAtTime(380,t);lp.frequency.exponentialRampToValueAtTime(3200*p,t+dur*.3);lp.frequency.exponentialRampToValueAtTime(1500*p,t+dur*.75);lp.frequency.exponentialRampToValueAtTime(520,t+dur);
  var f2=ctx.createBiquadFilter();f2.type='peaking';f2.frequency.setValueAtTime(1300*p,t);f2.frequency.linearRampToValueAtTime(2500*p,t+dur*.35);f2.frequency.linearRampToValueAtTime(1000*p,t+dur);f2.gain.value=10;f2.Q.value=3;
  var g=ctx.createGain();env(g,t,.05,dur-.2,.15,v);
  osc.connect(lp);lp.connect(f2);f2.connect(g);var last=g;
  if(false&&o.horn){var bp=ctx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1400;bp.Q.value=1.4;g.connect(bp);last=bp;var dl=ctx.createDelay();dl.delayTime.value=.09;var fb=ctx.createGain();fb.gain.value=.35;bp.connect(dl);dl.connect(fb);fb.connect(dl);out(dl,.5)}
  out(last,1,o.pan);osc.start(t);vib.start(t);osc.stop(t+dur+.1);vib.stop(t+dur+.1)}
/* 그르릉 */
function purr(){}
function thump(t,f,v,d){var o=ctx.createOscillator();o.type='sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*.45,t+d);var g=ctx.createGain();env(g,t,.004,0,d,v);o.connect(g);out(g);o.start(t);o.stop(t+d+.05)}
function hiss(t,d,f,q,v,type,f2){var s=noise(t,d);var b=ctx.createBiquadFilter();b.type=type||'bandpass';b.frequency.setValueAtTime(f,t);if(f2)b.frequency.exponentialRampToValueAtTime(f2,t+d);b.Q.value=q||1;var g=ctx.createGain();env(g,t,Math.min(.02,d/4),0,d,v);s.connect(b);b.connect(g);out(g);return g}
function ping(t,fs,d,v){fs.forEach(function(f,i){var o=ctx.createOscillator();o.type='sine';o.frequency.value=f;var g=ctx.createGain();env(g,t,.003,0,d*(1-i*.18),v/(1+i*.8));o.connect(g);out(g);o.start(t);o.stop(t+d+.05)})}
var LIB={
  mew:function(t){mew(t)},
  mewhi:function(t){mew(t,{pitch:1.25,dur:.38,vol:.45})},
  mewlow:function(t){mew(t,{pitch:.8,dur:.75,vol:.42})},
  mrrp:function(t){mew(t,{pitch:1.15,dur:.26,vol:.3})},
  horn:function(t){mew(t,{pitch:1.05,dur:.6,vol:.5,horn:1})},
  purr:function(t){purr(t,2.2)},
  hop:function(t){hiss(t,.16,900,.8,.08,'bandpass',2400)},
  land:function(t){thump(t,140,.35,.12);hiss(t,.08,500,.7,.08)},
  step:function(t){thump(t,190,.06,.05)},
  sniff:function(t){for(var i=0;i<3;i++)hiss(t+i*.13,.07,3200,1.2,.18)},
  tink:function(t){ping(t,[2380,3710,5230],.35,.12)},
  clink:function(t){ping(t,[3100,4650],.22,.09);ping(t+.09,[2900],.15,.05)},
  bell:function(t){ping(t,[1180,2860,4120],1.1,.16);ping(t+.32,[1180,2860,4120],1.1,.14)},
  crackle:function(t){var d=2.2;hiss(t,d,5000,.6,.012,'highpass');for(var i=0;i<26;i++){var tt=t+Math.random()*d;hiss(tt,.004+Math.random()*.006,2500+Math.random()*3000,1,.08+Math.random()*.1)}},
  splash:function(t){hiss(t,.45,1800,.6,.25,'bandpass',500);hiss(t+.05,.25,4000,.8,.08,'highpass');for(var i=0;i<5;i++)ping(t+.08+Math.random()*.3,[900+Math.random()*900],.08,.04)},
  drip:function(t){var o=ctx.createOscillator();o.frequency.setValueAtTime(900,t);o.frequency.exponentialRampToValueAtTime(1900,t+.06);var g=ctx.createGain();env(g,t,.002,0,.09,.12);o.connect(g);out(g);o.start(t);o.stop(t+.12)},
  lick:function(t){for(var i=0;i<3;i++)hiss(t+i*.18,.06,1500,2,.12)},
  sneeze:function(t){hiss(t,.05,2500,1,.05);hiss(t+.18,.18,3000,.7,.35,'bandpass',1500)},
  hissc:function(t){hiss(t,.6,4200,.8,.22)},
  whoosh:function(t){hiss(t,.7,300,.7,.22,'bandpass',2600)},
  chime:function(t){ping(t,[1568,2349],1.4,.08);ping(t+.12,[2093,3136],1.4,.06)},
  paper:function(t){for(var i=0;i<6;i++)hiss(t+i*.035+Math.random()*.02,.05,2000+Math.random()*2500,.8,.1)},
  crunch:function(t){for(var i=0;i<4;i++)hiss(t+i*.07,.04,1200+Math.random()*1500,1.5,.18)},
  ice:function(t){ping(t,[620,1340],.5,.07);hiss(t,.25,3500,1,.06)},
  pop:function(t){thump(t,600,.14,.07)},
  steam:function(t){hiss(t,1.4,2600,.4,.06,'highpass')},
  yawn:function(t){mew(t,{pitch:.7,dur:.9,vol:.25})}
};
/* 웅웅거리는 소리(그르릉·떨림·바람·김 등)와 움직일 때마다 나던 소리는 모두 끔. 꼭 필요한 순간의 짧은 소리만 남김 */
/* 웅웅거리는 소리(그르릉·떨림·김)는 아예 없음. 효과음은 모두 같은 가야금·오르골 소리결로 미리 만든 파일만 씀 */
var KEEP={};Object.keys(FILES).forEach(function(k){KEEP[k]=1});
var GAP={hop:280,land:280,paper:350,mew:900,mewhi:900,mewlow:900,mrrp:700};
var VOL={hop:.7,land:.7,sniff:.6,lick:.6};
var lastPlay={};
function snd(name,opt){try{if(muted||!ctx)return;if(!KEEP[name])return;var nowt=performance.now();if(lastPlay[name]&&nowt-lastPlay[name]<(GAP[name]||600))return;lastPlay[name]=nowt;if(ctx.state==='suspended')ctx.resume();var t=ctx.currentTime+.01;
  if(buf[name]){var s=ctx.createBufferSource();s.buffer=buf[name];s.playbackRate.value=1+(Math.random()-.5)*.04;out(s,VOL[name]||.95);s.start(t);duck(.55,.9)}}catch(e){}}
/* ── 배경 음악: 장면마다 한 곡, 바뀔 때 천천히 겹쳐 넘어감 ── */
var TR={street:'../audio/street.mp3',night:'../audio/night.mp3',note:'../audio/note.mp3',paper:'../audio/paper.mp3'};
var BV=.36,bgmBus=null,bgmCur=null,bgmWant=null,bgmBuf={},bgmLoading={};
function bus(){if(!bgmBus){bgmBus=ctx.createGain();bgmBus.gain.value=1;bgmBus.connect(master)}return bgmBus}
function duck(to,sec){if(!bgmBus||!ctx)return;var t=ctx.currentTime;bgmBus.gain.cancelScheduledValues(t);bgmBus.gain.setValueAtTime(bgmBus.gain.value,t);bgmBus.gain.linearRampToValueAtTime(to,t+.08);bgmBus.gain.linearRampToValueAtTime(1,t+.08+(sec||1))}
function loadTrack(n,cb){if(bgmBuf[n])return cb(bgmBuf[n]);if(bgmLoading[n]){bgmLoading[n].push(cb);return}bgmLoading[n]=[cb];
  fetch(TR[n]).then(function(r){return r.arrayBuffer()}).then(function(a){return ctx.decodeAudioData(a)}).then(function(b){bgmBuf[n]=b;var q=bgmLoading[n];bgmLoading[n]=null;q.forEach(function(f){f(b)})}).catch(function(){bgmLoading[n]=null})}
function bgm(n){bgmWant=n;if(!ctx||muted)return;if(bgmCur&&bgmCur.n===n)return;
  loadTrack(n,function(b){if(bgmWant!==n||(bgmCur&&bgmCur.n===n)||muted)return;var t=ctx.currentTime+.05;
    if(bgmCur){var o=bgmCur;o.g.gain.cancelScheduledValues(t);o.g.gain.setValueAtTime(o.g.gain.value,t);o.g.gain.linearRampToValueAtTime(0,t+2.5);try{o.s.stop(t+2.6)}catch(e){}}
    var s=ctx.createBufferSource();s.buffer=b;s.loop=true;var g=ctx.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(BV,t+(bgmCur?2.5:3.5));s.connect(g);g.connect(bus());s.start(t,bgmCur?0:Math.random()*8);bgmCur={n:n,s:s,g:g}})}
function bgmStop(sec){if(!bgmCur||!ctx)return;var o=bgmCur;bgmCur=null;var t=ctx.currentTime;o.g.gain.cancelScheduledValues(t);o.g.gain.setValueAtTime(o.g.gain.value,t);o.g.gain.linearRampToValueAtTime(0,t+(sec||1));try{o.s.stop(t+(sec||1)+.05)}catch(e){}}
window.bgm=function(n){bgmWant=n;bgm(n)};window.bgmStop=bgmStop;
var P0=location.pathname;bgmWant=/\/road\//.test(P0)?'street':/\/album\//.test(P0)?'paper':/\/(lens|side)\//.test(P0)?'note':null;
var _un=unlock;unlock=function(){_un();if(ctx&&bgmWant&&!muted&&!bgmCur)bgm(bgmWant)};
['pointerdown','touchstart','keydown','wheel'].forEach(function(ev){addEventListener(ev,function(){unlock()},{passive:true,capture:true})});
document.addEventListener('visibilitychange',function(){if(!ctx)return;if(document.hidden)ctx.suspend();else if(!muted)ctx.resume()});
function setMute(m){muted=m;if(m&&ctx){stopSong(.1);bgmStop(.4)}else if(ctx&&bgmWant)setTimeout(function(){bgm(bgmWant)},50);try{localStorage.setItem('simmyo_mute2',m?'1':'0')}catch(e){}if(master)master.gain.value=m?0:.6;document.querySelectorAll('.sndbtn').forEach(function(b){b.textContent=m?'소리 끔':'소리 켬';b.setAttribute('aria-pressed',m?'false':'true')})}
/* 소리 버튼: class="sndbtn" 인 버튼을 찾아 연결 */
function wire(){document.querySelectorAll('.sndbtn').forEach(function(b){if(b._w)return;b._w=1;b.addEventListener('click',function(e){e.stopPropagation();unlock();setMute(!muted);if(!muted)snd('mrrp')})});setMute(muted)}
if(document.readyState!=='loading')wire();else document.addEventListener('DOMContentLoaded',wire);

/* 유성기 노래: 진짜 녹음 파일(url)을 나팔 소리처럼(낮은음·높은음 깎고 지직 소리) 틀어 줌. 파일이 없으면 false */
var songBuf={},cur=null;
function stopSong(fade){if(!cur)return;var c=cur;cur=null;try{var t=ctx.currentTime;c.g.gain.cancelScheduledValues(t);c.g.gain.setValueAtTime(c.g.gain.value,t);c.g.gain.linearRampToValueAtTime(0,t+(fade||.6));c.src.stop(t+(fade||.6)+.05);c.cr&&c.cr.stop(t+(fade||.6)+.05)}catch(e){}}
function playSong(url,maxSec,offset){return new Promise(function(res){try{if(muted||!ctx){res(false);return}if(ctx.state==='suspended')ctx.resume();
  var go=function(b){if(!b){res(false);return}stopSong(.2);duck(.15,(maxSec||14));var t=ctx.currentTime+.05,d=Math.min(maxSec||14,b.duration-(offset||0));
    var src=ctx.createBufferSource();src.buffer=b;
    var hp=ctx.createBiquadFilter();hp.type='highpass';hp.frequency.value=320;var lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3400;
    var pk=ctx.createBiquadFilter();pk.type='peaking';pk.frequency.value=1500;pk.gain.value=7;pk.Q.value=.9;
    var g=ctx.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.9,t+.8);g.gain.setValueAtTime(.9,t+Math.max(.9,d-1.2));g.gain.linearRampToValueAtTime(0,t+d);
    src.connect(hp);hp.connect(lp);lp.connect(pk);pk.connect(g);g.connect(master);
    if(!NB)NB=noiseBuf(2);var cr=ctx.createBufferSource();cr.buffer=NB;cr.loop=true;var cb=ctx.createBiquadFilter();cb.type='highpass';cb.frequency.value=3000;var cg=ctx.createGain();cg.gain.value=.025;cr.connect(cb);cb.connect(cg);cg.connect(g);
    src.start(t,offset||0,d+.1);cr.start(t);cr.stop(t+d+.1);cur={src:src,g:g,cr:cr};src.onended=function(){if(cur&&cur.src===src)cur=null};res(true)};
  if(songBuf[url]!==undefined){go(songBuf[url]);return}
  fetch(url).then(function(r){if(!r.ok)throw 0;return r.arrayBuffer()}).then(function(a){return ctx.decodeAudioData(a)}).then(function(b){songBuf[url]=b;go(b)}).catch(function(){songBuf[url]=null;res(false)})}catch(e){res(false)}})}
window.playSong=playSong;window.stopSong=stopSong;
window.snd=snd;window.sndWire=wire;
})();
/* 나팔 노래: 저작권이 끝난 옛 노래 mp3를 저장소 audio 폴더에 horn.mp3로 넣고 아래를 '../../audio/horn.mp3' 로 바꾸면 나옴 */
window.HORN='';
