/* 심묘한 산책 — 경성야록 스핀오프
   흐름: 표지(점괘) → 산책 지도(도장첩 · 주머니) → 장소(심묘 눈 · 킁킁 · 귀 · 사람 눈 → 도장 + 빠진 글자 + 수첩 쪽지, 10초 놀이 → 멸치)
        → 자정 편집국(글자 놓기 → 수배 사유 → 읽을 수 없는 지면 → 78% → 문자보급 · 브나로드) → 산책 선물(엽서 · 결과 카드 · 배경화면 · 스티커)
   데이터는 simmyo-data.js. 진행은 localStorage 'simmyo-v1'. 시연: ?demo=1 */
(function (W, D) {
  'use strict';
  var $ = function (s, r) { return (r || D).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); };
  var D2 = /[?&]d2=1/.test(location.search);
  if (!D2) W.SIMMYO_DATA.P = W.SIMMYO_DATA.P.filter(function (p) { return p.day !== 2; });
  var DATA = W.SIMMYO_DATA, P = DATA.P, ORDER = DATA.ORDER;
  /* 이틀 산책 — 첫째 날(문장 「심묘는 오늘도 잇소」) · 둘째 날(「내일도 산책하겟소」) */
  P.forEach(function (p) { p.day = p.day || 1; });
  var DAYP = { 1: P.filter(function (p) { return p.day === 1; }), 2: P.filter(function (p) { return p.day === 2; }) };
  var DORD = { 1: ORDER, 2: DATA.ORDER2 };
  var IMG = 'assets/simmyo/s/', EXT = '.webp', GR = 'assets/simmyo/g/';
  var KEY = 'simmyo-v1';
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(G)); } catch (e) {} }
  var G = load();
  function fix() { G.s = G.s || {}; G.got = G.got || []; G.got2 = G.got2 || []; G.day = D2 ? (G.day || 1) : 1; G.t = G.t || {}; G.win = G.win || {}; G.fish = G.fish || 0; if (G.snd === undefined) G.snd = 1; if (!G.no) G.no = 100 + Math.floor(Math.random() * 900); }
  fix(); save();
  var byId = {}; P.forEach(function (p, i) { p.i = i; byId[p.id] = p; });
  var buzz = function (p) { if (navigator.vibrate) try { navigator.vibrate(p); } catch (e) {} };
  var RM = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hr = new Date().getHours(), NIGHT = hr >= 19 || hr < 6;
  var STP = function (id) { return '<img src="' + GR + 'stp_' + id + '.png" alt="">'; };
  $$('.ic').forEach(function (e) { var k = e.className.match(/ic-(\w+)/); if (k) e.innerHTML = '<img src="' + GR + 'ic_' + k[1] + '.png" alt="">'; });

  /* 진행 */
  function st(id) { return G.s[id] || (G.s[id] = {}); }
  var SENSES = ['eye', 'nose', 'ear', 'human'];
  function nUsed(id) { var s = G.s[id] || {}; return SENSES.filter(function (k) { return s[k]; }).length; }
  function done(id) { return nUsed(id) >= 2; }
  function nDone(d) { return DAYP[d || 1].filter(function (p) { return done(p.id); }).length; }
  function midOpen(d) { return nDone(d) >= 8 || new Date().getHours() === 0; }
  function gotOf(d) { return d === 2 ? G.got2 : G.got; }
  function solvedOf(d) { return d === 2 ? G.solved2 : G.solved; }
  function addFish(n) { G.fish += n; save(); paintHud(); var f = $('#fishN'); f.classList.remove('pop'); void f.offsetWidth; f.classList.add('pop'); }

  /* 심묘 얼굴 — 스티커로 기분 */
  var MOODS = ['sleep', 'yawn', 'wow', 'fish', 'peek'];
  function mood(el, m) { if (el) MOODS.forEach(function (k) { el.classList.toggle(k, k === m); }); }

  /* ── 소리 ── 첫 손길 뒤에만, 끄기 가능 */
  var AC = null, amb = null;
  function ac() { if (!G.snd) return null; if (!AC) { var C = W.AudioContext || W.webkitAudioContext; if (!C) return null; AC = new C(); } if (AC.state === 'suspended') AC.resume(); return AC; }
  function noise(a, dur) { var b = a.createBuffer(1, Math.max(1, a.sampleRate * dur), a.sampleRate), d = b.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; var s = a.createBufferSource(); s.buffer = b; return s; }
  function env(g, t, at, hold, rel, peak) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + at); g.gain.setValueAtTime(peak, t + at + hold); g.gain.exponentialRampToValueAtTime(0.0001, t + at + hold + rel); }
  function bell(a, t, f, v) { [1, 2.76, 5.4].forEach(function (m, k) { var o = a.createOscillator(), g = a.createGain(); o.frequency.value = f * m; o.connect(g); g.connect(a.destination); env(g, t, .005, 0, 1.4 / (k + 1), (v || .18) / (k + 1)); o.start(t); o.stop(t + 1.6); }); }
  function hiss(a, t, dur, type, freq, q, v, at) { var s = noise(a, dur), f = a.createBiquadFilter(), g = a.createGain(); f.type = type; f.frequency.value = freq; f.Q.value = q || 1; s.connect(f); f.connect(g); g.connect(a.destination); env(g, t, at || .3, Math.max(.05, dur - (at || .3) - .5), .5, v); s.start(t); s.stop(t + dur); }
  function crackle(a, t, dur, v) { for (var i = 0; i < dur * 14; i++) { var tt = t + Math.random() * dur, s = noise(a, .02), g = a.createGain(); g.gain.value = v * Math.random(); s.connect(g); g.connect(a.destination); s.start(tt); } }
  function notes(a, t, seq, v, gap) { seq.forEach(function (n, k) { var o = a.createOscillator(), g = a.createGain(), tt = t + k * (gap || .42); o.type = 'triangle'; o.frequency.value = 440 * Math.pow(2, (n - 69) / 12); o.connect(g); g.connect(a.destination); env(g, tt, .02, .1, .5, v); o.start(tt); o.stop(tt + .8); }); }
  function clap(a, t, n, v) { for (var i = 0; i < n; i++) { var tt = t + Math.random() * 1.6, s = noise(a, .05), f = a.createBiquadFilter(), g = a.createGain(); f.type = 'bandpass'; f.frequency.value = 1200 + Math.random() * 900; s.connect(f); f.connect(g); g.connect(a.destination); env(g, tt, .002, 0, .06, v * (.5 + Math.random() * .5)); s.start(tt); s.stop(tt + .08); } }
  function file(src, v, dur) { if (!G.snd) return; try { var au = new Audio(src); au.volume = v; au.play(); if (dur) setTimeout(function () { var k = setInterval(function () { au.volume = Math.max(0, au.volume - .05); if (au.volume <= .01) { au.pause(); clearInterval(k); } }, 60); }, dur * 1000); } catch (e) {} }
  function purr(a, t) { var s = noise(a, 1.4), f = a.createBiquadFilter(), g = a.createGain(), lfo = a.createOscillator(), lg = a.createGain(); f.type = 'lowpass'; f.frequency.value = 180; lfo.frequency.value = 24; lg.gain.value = .09; lfo.connect(lg); lg.connect(g.gain); s.connect(f); f.connect(g); g.connect(a.destination); g.gain.setValueAtTime(.1, t); g.gain.linearRampToValueAtTime(0, t + 1.4); s.start(t); lfo.start(t); s.stop(t + 1.4); lfo.stop(t + 1.4); }
  var SND = {
    tram: function (a, t) { hiss(a, t, 3.4, 'lowpass', 160, 1, .25); bell(a, t + .3, 880, .16); bell(a, t + .62, 880, .16); hiss(a, t, 3.4, 'bandpass', 600, .6, .05, 1); },
    cinema: function (a, t) { hiss(a, t, 3.6, 'bandpass', 420, .7, .06, .8); clap(a, t + 1.8, 60, .3); },
    radio: function (a, t) { file('audio/radio-static.mp3', .35, 3); [0, 1, 2].forEach(function (k) { var o = a.createOscillator(), g = a.createGain(); o.frequency.value = 880; o.connect(g); g.connect(a.destination); env(g, t + 1 + k, .01, .08, .05, .08); o.start(t + 1 + k); o.stop(t + 1.3 + k); }); },
    stadium: function (a, t) { var s = noise(a, .25), g = a.createGain(); s.connect(g); g.connect(a.destination); env(g, t + .2, .002, 0, .2, .5); s.start(t + .2); hiss(a, t + .3, 3.6, 'bandpass', 700, .5, .14, 1.2); },
    gramophone: function (a, t) { crackle(a, t, 4, .12); hiss(a, t, 4, 'highpass', 3000, .5, .015, .2); notes(a, t + .4, [67, 71, 74, 72, 71, 67, 69], .07); },
    roof: function (a, t) { crackle(a, t, 2.2, .06); hiss(a, t, 3.2, 'lowpass', 400, .5, .05, 1); bell(a, t + 2, 1320, .05); },
    lift: function (a, t) { bell(a, t + .1, 1046, .14); hiss(a, t + .4, 3, 'lowpass', 120, 1, .2, .6); },
    record: function (a, t) { crackle(a, t, 4.2, .14); notes(a, t + .8, [64, 67, 69, 67, 64, 62, 64], .07); },
    clock: function (a, t) { for (var i = 0; i < 12; i++) bell(a, t + i * .55, 392, .12); },
    stamp: function (a, t) { var s = noise(a, .12), f = a.createBiquadFilter(), g = a.createGain(); f.type = 'lowpass'; f.frequency.value = 500; s.connect(f); f.connect(g); g.connect(a.destination); env(g, t, .002, 0, .12, .6); s.start(t); },
    ok: function (a, t) { notes(a, t, [72, 76, 79], .07, .12); },
    no: function (a, t) { notes(a, t, [60, 56], .06, .14); },
    tick: function (a, t) { notes(a, t, [84], .03); },
    yasi: function (a, t) { hiss(a, t, 3.6, 'bandpass', 900, .6, .08, .8); notes(a, t + .5, [67, 67, 64], .05, .22); bell(a, t + 2.6, 880, .06); },
    sakura: function (a, t) { hiss(a, t, 3.8, 'highpass', 1800, .4, .05, 1.2); hiss(a, t + .5, 3, 'bandpass', 700, .5, .03, 1); notes(a, t + 1.2, [88, 86], .025, .3); },
    expo: function (a, t) { [0, .5].forEach(function (k) { var o = a.createOscillator(), g = a.createGain(); o.type = 'square'; o.frequency.value = 520; o.connect(g); g.connect(a.destination); env(g, t + k, .02, .25, .2, .04); o.start(t + k); o.stop(t + k + .6); }); hiss(a, t + .4, 3, 'lowpass', 200, 1, .12, .6); },
    bingsu: function (a, t) { for (var i = 0; i < 6; i++) hiss(a, t + i * .45, .4, 'highpass', 3500, .6, .12, .05); bell(a, t + 3, 2600, .03); },
    seol: function (a, t) { for (var i = 0; i < 18; i++) { var o = a.createOscillator(), g = a.createGain(), tt = t + Math.random() * 3; o.frequency.setValueAtTime(260 + Math.random() * 200, tt); o.frequency.exponentialRampToValueAtTime(600, tt + .06); o.connect(g); g.connect(a.destination); env(g, tt, .005, 0, .06, .04); o.start(tt); o.stop(tt + .1); } bell(a, t + 2.8, 1900, .07); bell(a, t + 3, 1900, .07); },
    dabang: function (a, t) { crackle(a, t, 4, .1); notes(a, t + .6, [62, 66, 69, 71, 69, 66], .06, .5); },
    bonjeong: function (a, t) { hiss(a, t, 3.6, 'bandpass', 1100, .5, .05, 1); bell(a, t + .4, 2400, .05); bell(a, t + .55, 2900, .04); for (var i = 0; i < 6; i++) { var s = noise(a, .03), g = a.createGain(), tt = t + 1 + i * .32; s.connect(g); g.connect(a.destination); env(g, tt, .002, 0, .05, .2); s.start(tt); } },
    hangang: function (a, t) { hiss(a, t, 3.8, 'lowpass', 300, .5, .12, 1.2); var o = a.createOscillator(), g = a.createGain(); o.frequency.setValueAtTime(1800, t + .8); o.frequency.exponentialRampToValueAtTime(90, t + 1.3); o.connect(g); g.connect(a.destination); env(g, t + .8, .002, 0, .5, .12); o.start(t + .8); o.stop(t + 1.4); for (var i = 0; i < 5; i++) hiss(a, t + 2 + i * .3, .2, 'bandpass', 1500, 1, .06, .03); },
    purr: purr
  };
  function play(k) { var a = ac(); if (!a || !SND[k]) return; SND[k](a, a.currentTime + .03); }
  /* 장소 배경 소리 — 아주 작게 */
  var AMB = { tram: [300, .012], dansung: [500, .01], jodk: [2500, .006], stadium: [700, .014], nakrang: [3000, .004], mitsu: [350, .01], record: [3000, .005], hwasin: [200, .012], yasi: [900, .012], sakura: [1600, .006], expo: [400, .01], bingsu: [3000, .004], seol: [250, .01], dabang: [3000, .004], bonjeong: [1000, .01], hangang: [300, .014] };
  function ambStart(id) {
    ambStop(); var a = ac(), c = AMB[id]; if (!a || !c) return;
    var s = noise(a, 4), f = a.createBiquadFilter(), g = a.createGain(); s.loop = true; f.type = 'bandpass'; f.frequency.value = c[0]; f.Q.value = .5; s.connect(f); f.connect(g); g.connect(a.destination);
    g.gain.setValueAtTime(0, a.currentTime); g.gain.linearRampToValueAtTime(c[1], a.currentTime + 1.5); s.start(); amb = { s: s, g: g, a: a };
  }
  function ambStop() { if (!amb) return; var x = amb; amb = null; try { x.g.gain.linearRampToValueAtTime(0, x.a.currentTime + .4); setTimeout(function () { try { x.s.stop(); } catch (e) {} }, 500); } catch (e) {} }
  function paintHud() { $('#fishN b').textContent = G.fish; var b = $('#snd'); b.textContent = G.snd ? '소리 켬' : '소리 끔'; b.setAttribute('aria-pressed', G.snd ? 'true' : 'false'); }
  $('#snd').onclick = function () { G.snd = G.snd ? 0 : 1; save(); paintHud(); if (!G.snd) { ambStop(); if (AC) AC.suspend(); } else { ac(); if (cp && !$('#place').hidden) ambStart(cp.id); } };
  paintHud();

  /* ── 화면 전환 ── */
  var lastV = 'cover';
  function show(v) {
    if (v !== 'place') { ambStop(); leavePlace(); }
    $$('.v').forEach(function (s) { s.hidden = s.dataset.v !== v; });
    D.body.classList.toggle('dark', v === 'mid');
    D.querySelector('meta[name=theme-color]').setAttribute('content', v === 'mid' ? '#0c1f1e' : '#2f5d57');
    W.scrollTo(0, 0); if (v !== 'about') lastV = v;
  }
  function go(h) { if (location.hash !== '#' + h) location.hash = h; else route(); }
  function route() {
    var h = location.hash.slice(1) || 'cover';
    if (h.indexOf('p-') === 0 && byId[h.slice(2)]) { openPlace(byId[h.slice(2)]); return; }
    if (h === 'map') { paintMap(); show('map'); return; }
    if (h === 'mid') { openMid(1); return; }
    if (h === 'peek') { openMid(1, true); return; }
    if (h === 'mid2') { openMid(2); return; }
    if (h === 'card') { openCard(); show('card'); return; }
    if (h === 'about') { paintAbout(); show('about'); return; }
    show('cover');
  }
  W.addEventListener('hashchange', route);
  D.addEventListener('click', function (e) { var g = e.target.closest('[data-go]'); if (g) { e.preventDefault(); ac(); go(g.dataset.go); } });
  $('#abBack').onclick = function () { if (history.length > 1) history.back(); else go('map'); };

  /* 발자국 — 장소 사이 이동 */
  function trail() {
    if (RM) return; var t = $('#trail'); t.innerHTML = '';
    for (var i = 0; i < 6; i++) { var im = D.createElement('img'); im.src = GR + 'paw.png'; im.alt = ''; im.style.left = (8 + i * 15) + '%'; im.style.top = (i % 2 ? 54 : 46) + '%'; im.style.animationDelay = (i * .07) + 's'; t.appendChild(im); }
    t.classList.remove('on'); void t.offsetWidth; t.classList.add('on');
  }

  /* ── ① 표지 ── */
  var fromSeek = /from=seek/.test(location.search), cv = $('#cvImg');
  if (fromSeek) { var cs = $('#cvSrc'); if (cs) cs.remove(); cv.src = IMG + 'escape' + EXT; cv.alt = '구겨진 신문 광고면을 밟고 빠져나오는 심묘 (재현 그림)'; $('#cvSay').textContent = '「수배지에서 빠져나왓소. …따라오든지 말든지.」'; }
  else if (false && NIGHT) { cv.src = IMG + 'cover_night' + EXT; cv.alt = '보름달 아래 기와지붕에 안즌 심묘 (재현 그림)'; $('#cvSay').textContent = '「밤이구려. 밤 경성은 내가 더 잘 아오.」'; }
  if (G.s && nDone(1) > 0) $('#cvGo').textContent = !D2 || nDone(1) < 8 ? '산책 이어 걷기 (' + nDone(1) + '/8)' : '산책 이어 걷기 (둘째 날 ' + nDone(2) + '/8)';
  /* 오프닝 — 수배지가 찢어짐 */
  if (fromSeek && !RM && !location.hash) { var op = $('#open'); op.hidden = false; setTimeout(function () { op.classList.add('tear'); }, 500); setTimeout(function () { op.hidden = true; }, 1700); }
  /* 오늘의 점괘 — 날짜로 하나, 장소 하나 */
  (function () { var d = new Date(), k = d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate(); var f = DATA.fortune[k % DATA.fortune.length], p = P[(k * 7) % P.length]; $('#foT').textContent = '「' + f + '」'; $('#foP').innerHTML = '오늘의 산책지 · <button type="button" class="lnk" data-go="p-' + p.id + '">' + p.name + ' (' + p.yr + ') →</button>'; })();

  /* ── ② 지도 ── */
  var mpArt = $('#mpArt'), mpList = $('#mpList'), WEATHER = '';
  function paintMap() {
    var d = G.day === 2 ? 2 : 1, DP = DAYP[d], OR = DORD[d], got = gotOf(d);
    $$('#mpDays button').forEach(function (b) { var on = +b.dataset.day === d; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); b.querySelector('small').textContent = nDone(+b.dataset.day) + '/8'; });
    $('#mpDayNote').textContent = d === 1 ? '첫째 날 · 1899~1937 경성 여덟 곳. 도장을 다 모으면 「자정」의 문이 열립니다.' : '둘째 날 · 1929년 잡지 『별건곤』이 권한 「이틀 서울 구경」처럼 하루 더. 지금은 옛 사진으로 걷고, 그림은 그리는 중입니다.';
    $$('.pin', mpArt).forEach(function (n) { n.remove(); });
    DP.forEach(function (p) {
      var b = D.createElement('button'); b.type = 'button'; b.className = 'pin' + (done(p.id) ? ' done' : '') + (d === 2 ? ' d2' : ''); b.style.left = p.x + '%'; b.style.top = p.y + '%';
      b.innerHTML = '<b>' + p.name + '</b>' + (done(p.id) ? STP(p.id) : '<i></i>'); b.setAttribute('aria-label', p.name + ' · ' + p.yr + (done(p.id) ? ' · 도장 찍음' : ''));
      b.dataset.p = p.id; b.onclick = function () { go('p-' + p.id); }; mpArt.appendChild(b);
    });
    var open = midOpen(d), s = D.createElement('button'); s.type = 'button'; s.className = 'pin star' + (open ? '' : ' lock'); s.style.left = d === 1 ? '84%' : '62%'; s.style.top = d === 1 ? '45%' : '20%';
    s.innerHTML = '<b>' + (d === 1 ? '★ 자정' : '☾ 둘째 날 밤') + '</b><i></i>'; s.setAttribute('aria-label', (d === 1 ? '자정의 숨은 곳' : '둘째 날 밤') + (open ? '' : ' · 잠김')); s.onclick = function () { go(d === 1 ? 'mid' : 'mid2'); }; mpArt.appendChild(s);
    mpList.innerHTML = DP.map(function (p) {
      return '<li class="' + (done(p.id) ? 'done' : '') + '"><button type="button" data-p="' + p.id + '"><span class="paw">' + STP(p.id) + '</span><span>' + p.name + '<small>' + p.where + ' · ' + p.yr + (G.win[p.id] ? ' · 놀이 ✓' : '') + '</small></span></button></li>';
    }).join('') + '<li class="star"><button type="button" data-go="' + (d === 1 ? 'mid' : 'mid2') + '"><span class="paw">' + STP('mid') + '</span><span>' + (d === 1 ? '★ 자정의 숨은 곳' : '☾ 둘째 날 밤') + '<small>' + (open ? '문이 열렸습니다' : '도장 여덟 개 · 또는 밤 12시') + '</small></span></button></li>';
    $$('[data-p]', mpList).forEach(function (b) { b.onclick = function () { go('p-' + b.dataset.p); }; });
    $('#mpN').textContent = nDone(d);
    $('#mpBook').innerHTML = DP.map(function (p) { return '<button type="button" class="' + (done(p.id) ? 'on' : '') + '" data-p="' + p.id + '" aria-label="' + p.name + (done(p.id) ? ' 도장' : ' · 아직') + '">' + STP(p.id) + '</button>'; }).join('');
    $$('[data-p]', $('#mpBook')).forEach(function (b) { b.onclick = function () { go('p-' + b.dataset.p); }; });
    $('#mpPouch').innerHTML = OR.map(function (c) { return got.indexOf(c) >= 0 ? '<span class="ch">' + c + '</span>' : '<span class="ch no">?</span>'; }).join('');
    var n = nDone(d);
    var line = n === 0 ? (d === 1 ? '오늘은 어디 냄새가 나는지 보오.' : '하루 더 걷겟소? 따라오든지 말든지.') : n < 8 ? '발바닥 ' + n + '개 찍엇소. 아즉 ' + (8 - n) + '곳 남앗소.' : (d === 1 ? '다 걸엇구려. ★ 자리로 가 보시오. 거긔 내가 잇소.' : '이틀을 다 걸엇구려. ☾ 자리로 오시오.');
    if (WEATHER && n < 8) line = WEATHER + ' ' + line;
    $('#mpSay').textContent = '「' + line + '」';
    mood($('#map .face'), n >= 8 ? 'fish' : 'peek');
  }
  $$('#mpDays button').forEach(function (b) { b.onclick = function () { G.day = +b.dataset.day; save(); ac(); paintMap(); }; });
  /* 서울 날씨 한마디 — 실패하면 조용히 넘어감 */
  try {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=37.57&longitude=126.98&current=weather_code').then(function (r) { return r.json(); }).then(function (j) {
      var c = j && j.current && j.current.weather_code; if (c === undefined) return;
      WEATHER = c >= 71 && c <= 77 ? '눈이 오는구려. 발바닥이 시리오.' : (c >= 51 && c <= 67) || (c >= 80 && c <= 82) || c >= 95 ? '비 오는 날은 처마 밑이 제일이오.' : c >= 45 && c <= 48 ? '안개가 끼엇소. 냄새로 걸으시오.' : c <= 1 ? (NIGHT ? '하늘이 맑소. 달이 잘 보이겟소.' : '볏이 조소. 지붕이 따끈하겟소.') : '';
      if (!$('#map').hidden) paintMap();
    }).catch(function () {});
  } catch (e) {}

  /* ── ③ 장소 ── */
  var cp = null, art = $('#plArt'), card = $('#plCard'), sayN = 0, enterT = 0;
  function sayP(t, face) { var s = $('#plSay'); s.textContent = '「' + t + '」'; var w = s.parentNode; w.classList.remove('pop'); void w.offsetWidth; w.classList.add('pop'); if (face !== undefined) mood($('#plFace'), face); }
  function leavePlace() { if (cp && enterT) { G.t[cp.id] = (G.t[cp.id] || 0) + Math.min(600, (Date.now() - enterT) / 1000); save(); } enterT = 0; }
  function setColor(on, x, y) {
    var c = $('#plCol');
    if (on) { art.style.setProperty('--bx', (x || 50) + '%'); art.style.setProperty('--by', (y || 72) + '%'); art.classList.add('color'); $('#plMode').textContent = '심묘 눈 · 벽보는 다 흰 종이'; }
    else { art.classList.remove('color'); }
  }
  function preload(p) { [p.img, p.wide].forEach(function (k) { var i = new Image(); i.src = IMG + k + EXT; }); }
  function openPlace(p) {
    var from = cp; leavePlace(); cp = p; sayN = 0; enterT = Date.now();
    if (from && from !== p && !$('#place').hidden) trail();
    G.day = p.day; save(); var PH = !!p.ph, LBL = PH ? '옛 사진 · 그림은 그리는 중' : '그림 · 재현', ALT = PH ? ' (옛 사진)' : ' (재현 그림)';
    $('#plT').textContent = p.name; $('#plH').textContent = p.name; $('#plSide').dataset.k = p.where + ' · ' + p.yr; $('#plY').textContent = (p.day === 2 ? '둘째 날 · ' : '') + p.where + ' · ' + p.yr;
    $('.rt', art).textContent = LBL; $('#plWide .rt').textContent = LBL;
    var src = IMG + p.img + EXT; $('#plImg').src = src; $('#plImg').alt = p.alt + ALT; $('#plCol').src = src;
    $('#plWideImg').src = IMG + p.wide + EXT; $('#plWideImg').alt = p.walt + ALT;
    setColor(false); $('#plMode').textContent = '사람들의 기록 속 경성 · 흑백';
    $('#plStamp').src = GR + 'stp_' + p.id + '.png'; $('#plStamp').classList.toggle('on', done(p.id));
    card.classList.remove('intro'); intro(p);
    $('#plPlayT').textContent = p.game.title; $('#plPlayS').textContent = G.win[p.id] ? '성공 · 멸치 받음' : '성공하면 멸치 한 마리';
    $('#plGo').innerHTML = p.go ? '<a href="' + p.go[0] + '">' + p.go[1] + ' →</a>' : '';
    var fk = $('#plFolk'); if (p.people && p.people.length) { fk.hidden = false; fk.innerHTML = '<p class="folk-k">그곳 사람들 · 옷과 밥</p>' + p.people.map(function (o) { return '<details class="folk-i"><summary><i>' + o.k + '</i><b>' + o.t + '</b></summary><ul>' + o.li.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul><span class="src">출처 · ' + o.src + '</span></details>'; }).join(''); } else { fk.hidden = true; fk.innerHTML = ''; }
    paintSense();
    sayP(done(p.id) ? (NIGHT ? p.night : '여긴 벌써 다녀갓소. 그래도 또 보시오.') : '사람들 긔록 속 경성은 흑백이오. 심묘 눈을 눌러 보시오.', '');
    var DP = DAYP[p.day], k = DP.indexOf(p), L = DP.length; $('#plPrev').onclick = function () { go('p-' + DP[(k + L - 1) % L].id); }; $('#plNext').onclick = function () { go('p-' + DP[(k + 1) % L].id); };
    preload(DP[(k + 1) % L]); preload(DP[(k + L - 1) % L]);
    show('place'); enterT = Date.now(); ambStart(p.id);
  }
  function paintSense() {
    var s = st(cp.id);
    $$('#sense button').forEach(function (b) { b.classList.toggle('used', !!s[b.dataset.s]); });
    var u = nUsed(cp.id);
    $('#senseN').textContent = done(cp.id) ? '발바닥 도장 찍음 · 빠진 글자 「' + cp.ch + '」 주머니에 있음' + (u < 4 ? ' · 남은 감각 ' + (4 - u) + '가지도 열어 보세요' : ' · 다 둘러봤습니다') : u === 0 ? '그림 속 반짝이는 자리를 눌러 보세요. 두 가지만 열어도 도장이 찍힙니다.' : '한 가지만 더 열면 도장이 찍힙니다.';
    paintHs();
  }
  var HSL = { eye: '심묘 눈', nose: '킁킁', ear: '귀', human: '사람 눈' };
  function paintHs() {
    var h = $('#plHs'), s = st(cp.id); if (!cp.hs) { h.innerHTML = ''; return; }
    h.innerHTML = SENSES.map(function (k) { var c = cp.hs[k]; return c ? '<button type="button" class="spot' + (s[k] ? ' used' : '') + '" data-s="' + k + '" style="left:' + c[0] + '%;top:' + c[1] + '%" aria-label="' + HSL[k] + '"><img src="' + GR + 'ic_' + k + '.png" alt=""><span>' + HSL[k] + '</span></button>' : ''; }).join('');
  }
  $('#plHs').addEventListener('click', function (e) { var b = e.target.closest('.spot'); if (!b) return; e.stopPropagation(); $('#sense button[data-s="' + b.dataset.s + '"]').click(); });
  function intro(p) {
    card.innerHTML = '<p class="k">' + p.where + ' · ' + p.yr + '</p><h3 class="in-h">' + p.name + '</h3><p class="in-p">' + p.f[0] + '</p><p class="in-hint">그림 속 반짝이는 자리를 눌러 보세요 — 고양이 눈, 코, 귀, 그리고 사람의 눈.</p>';
    card.hidden = false; card.classList.add('intro');
  }
  function use(k) {
    var s = st(cp.id), was = done(cp.id); s[k] = 1; save();
    $$('#sense button').forEach(function (b) { b.classList.toggle('cur', b.dataset.s === k); });
    if (!was && done(cp.id)) setTimeout(stamp, 900);
    paintSense();
  }
  function stamp() {
    var sp = $('#plStamp'); sp.classList.remove('on'); void sp.offsetWidth; sp.classList.add('on'); buzz(30); play('stamp');
    var gg = gotOf(cp.day); if (gg.indexOf(cp.ch) < 0) gg.push(cp.ch); save(); addFish(1);
    var dr = $('#plDrop'); dr.textContent = cp.ch; dr.classList.remove('on'); void dr.offsetWidth; dr.classList.add('on');
    sayP('발바닥 찍엇소. 지면에서 글자 하나가 톡 떨어졋소 — 「' + cp.ch + '」. 멸치도 한 마리 받앗소.', 'wow');
    paintSense();
  }
  $('#sense').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b || !cp) return; var k = b.dataset.s; ac(); card.classList.remove('intro');
    if (k === 'eye') {
      var ec = cp.hs && cp.hs.cat; setColor(true, ec ? ec[0] : 50, ec ? ec[1] : 70); card.hidden = true;
      sayP(NIGHT && st(cp.id).eye ? cp.night : cp.say[sayN++ % 3], cp.id === 'nakrang' ? 'sleep' : '');
    } else if (k === 'nose') {
      var n = cp.nose;
      card.innerHTML = n ? '<p class="k">킁킁 · 냄새</p>' + (n.img ? '<figure data-lb><img src="' + IMG + n.img + EXT + '" alt="' + n.alt + (n.ph ? ' (옛 자료)' : ' (재현 그림)') + '"><figcaption>' + (n.ph ? '옛 자료 · 그림은 그리는 중' : '그림 · 재현') + '</figcaption></figure>' : '') + '<p>' + n.t + '</p><span class="src">출처 · ' + n.src + '</span>'
        : '<p class="k">킁킁 · 냄새</p><h3>…킁킁. 이 냄새는 아직 모릅니다.</h3><p>이곳의 냄새는 믿을 만한 자료를 찾는 중입니다. 지어내지 않겠습니다.</p>';
      card.hidden = false; sayP(n ? '코가 먼저 아오.' : '모르는 냄새는 모른다 하오.', n ? 'fish' : 'yawn');
    } else if (k === 'ear') {
      card.innerHTML = '<p class="k">귀 · 그곳의 소리</p><div class="wave on">' + new Array(24).join('<i></i>') + '</div><p>' + cp.ear.t + '</p><small>' + (G.snd ? '만든 소리(합성음)입니다. 노래 가사는 싣지 않습니다.' : '지금 소리가 꺼져 있습니다. 오른쪽 위 「소리」를 눌러 켜세요.') + '</small>';
      card.hidden = false; play(cp.ear.k); setTimeout(function () { var w = $('.wave', card); if (w) w.classList.remove('on'); }, 4200);
      sayP('귀가 쫑긋하오.', 'peek');
    } else if (k === 'human') {
      setColor(false); $('#plMode').textContent = '사람 눈 · 당시 지면';
      card.innerHTML = '<p class="k">사람 눈 · ' + cp.where + ' · ' + cp.yr + '</p><h3>' + cp.name + '</h3><ol>' + cp.f.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ol><span class="src">출처 · ' + cp.src + '</span>' +
        '<p class="k" style="margin-top:12px">당시 지면 · 실제 자료 · 누르면 크게</p><div class="arc">' + cp.arc.map(function (a) { return '<figure data-lb><img src="' + a.img + '" alt="' + a.cap + '" loading="lazy"><figcaption><b>' + a.cap + '</b>' + a.src + '</figcaption></figure>'; }).join('') + '</div>';
      card.hidden = false; sayP('…사람들은 저걸 읽는구려. 고양이는 냄새로 충분하오.', 'yawn');
    }
    use(k);
    if (k !== 'eye' && W.innerWidth < 900) setTimeout(function () { card.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'nearest' }); }, 60);
  });
  /* 심묘 얼굴 누르기 — 그르릉 + 한마디 */
  D.addEventListener('click', function (e) {
    var f = e.target.closest('.face'); if (!f) return; play('purr'); buzz(12);
    if (cp && !$('#place').hidden) sayP(cp.say[sayN++ % 3]);
  });
  $('#plImg').parentNode.addEventListener('click', function (e) { if (cp && !e.target.closest('.rt')) sayP(art.classList.contains('color') ? cp.say[sayN++ % 3] : '흰 종이가 붙어 잇소. 무슨 뜻인지는 모르겟소.'); });

  /* ── 10초 놀이 ── */
  var gm = $('#game'), gTimer = null, gRaf = 0;
  function gEnd(ok) {
    cancelAnimationFrame(gRaf); clearInterval(gTimer);
    var g = cp.game; $('#gmMsg').textContent = ok ? g.win : g.lose; play(ok ? 'ok' : 'no');
    if (ok && !G.win[cp.id]) { G.win[cp.id] = 1; save(); addFish(1); $('#gmMsg').textContent += ' · 멸치 한 마리!'; $('#plPlayS').textContent = '성공 · 멸치 받음'; }
    $('#gmBtns').innerHTML = '<button type="button" class="btn ghost" id="gmAgain">한 판 더</button><button type="button" class="btn" id="gmDone">닫기</button>';
    $('#gmAgain').onclick = startGame; $('#gmDone').onclick = closeGame;
    sayP(ok ? '그르릉. 내가 잘하는 거요.' : '…하품. 다시 해 보겟소.', ok ? 'fish' : 'yawn');
  }
  function closeGame() { cancelAnimationFrame(gRaf); clearInterval(gTimer); gm.hidden = true; }
  $('#gmX').onclick = closeGame;
  $('#plPlay').onclick = function () { ac(); startGame(); };
  function startGame() {
    var g = cp.game, stg = $('#gmStage'), btns = $('#gmBtns'); cancelAnimationFrame(gRaf); clearInterval(gTimer);
    $('#gmT').textContent = g.title; $('#gmHow').textContent = g.how; $('#gmMsg').textContent = ''; gm.hidden = false;
    stg.className = 'gm-stage t-' + g.type; stg.style.backgroundImage = 'url(' + IMG + cp.img + EXT + ')';
    if (g.type === 'timing' || g.type === 'needle') {
      /* 움직이는 표시가 과녁에 들어올 때 누르기 */
      var round = 0, pos = 0, dir = 1, sp = g.type === 'needle' ? .9 : 1.15;
      stg.innerHTML = g.type === 'needle' ? '<div class="disc"><i class="dot"></i></div><div class="arm"></div>' : '<div class="bar"><span class="zone"></span><span class="mark"><img src="' + GR + 'sk_peek.png" alt=""></span></div><p class="rnd"></p>';
      var zone = { a: 38 + Math.random() * 30 }; zone.b = zone.a + 16;
      var z = $('.zone', stg); if (z) { z.style.left = zone.a + '%'; z.style.width = '16%'; }
      var t0 = performance.now();
      var step = function (t) {
        if (g.type === 'needle') { pos = ((t - t0) / 1000 * 140 * sp) % 360; $('.disc', stg).style.transform = 'rotate(' + pos + 'deg)'; }
        else { pos += dir * sp * (1 + round * .25); if (pos > 100) { pos = 100; dir = -1; } if (pos < 0) { pos = 0; dir = 1; } $('.mark', stg).style.left = pos + '%'; var r = $('.rnd', stg); if (r) r.textContent = g.rounds > 1 ? (round + 1) + ' / ' + g.rounds : ''; }
        gRaf = requestAnimationFrame(step);
      };
      gRaf = requestAnimationFrame(step);
      btns.innerHTML = '<button type="button" class="btn big" id="gmHit">' + g.btn + '</button>';
      var tries = 0;
      $('#gmHit').onclick = function () {
        tries++;
        var hit = g.type === 'needle' ? (pos > 330 || pos < 30) : (pos >= zone.a && pos <= zone.b);
        if (hit) { round++; play('tick'); buzz(15); if (round >= g.rounds) gEnd(true); else { zone.a = 15 + Math.random() * 55; zone.b = zone.a + 16; z.style.left = zone.a + '%'; } }
        else if (tries >= g.rounds + 2) gEnd(false); else { $('#gmMsg').textContent = '조금 일럿거나 늦엇소. 다시!'; play('no'); }
      };
    } else if (g.type === 'tap') {
      var n = 0, left = g.secs, started = false;
      stg.innerHTML = '<div class="race"><div class="lane"><b>심묘</b><span class="run me"><img src="' + GR + 'sk_wow.png" alt=""></span></div><div class="lane"><b>' + (g.them || '선수들') + '</b><span class="run them"></span></div></div><p class="rnd">' + left + '초</p>';
      btns.innerHTML = '<button type="button" class="btn big" id="gmHit">' + g.btn + '</button>';
      var them = 0;
      $('#gmHit').onclick = function () {
        if (!started) { started = true; gTimer = setInterval(function () { left--; them += g.goal / g.secs; $('.them', stg).style.width = Math.min(100, them / g.goal * 100) + '%'; $('.rnd', stg).textContent = Math.max(0, left) + '초'; if (left <= 0) gEnd(n >= g.goal); }, 1000); }
        n++; $('.me', stg).style.left = Math.min(92, n / g.goal * 92) + '%'; if (n % 4 === 0) play('tick');
        if (n >= g.goal) gEnd(true);
      };
    } else if (g.type === 'dial') {
      var f = g.min + Math.round((g.max - g.min) * (.55 + Math.random() * .35) / 10) * 10;
      stg.innerHTML = '<div class="radio"><div class="scale"><i class="needle"></i></div><p class="freq"><b>' + f + '</b> 킬로헤르츠</p><div class="static"></div></div>';
      btns.innerHTML = '<button type="button" class="btn ghost" data-d="-50">◀◀</button><button type="button" class="btn ghost" data-d="-10">◀</button><button type="button" class="btn ghost" data-d="10">▶</button><button type="button" class="btn ghost" data-d="50">▶▶</button>';
      var paint = function () { $('.freq b', stg).textContent = f; $('.needle', stg).style.left = ((f - g.min) / (g.max - g.min) * 100) + '%'; var d = Math.abs(f - g.target); $('.static', stg).style.opacity = Math.min(1, d / 300); if (d === 0) gEnd(true); };
      paint(); $$('[data-d]', btns).forEach(function (b) { b.onclick = function () { f = Math.max(g.min, Math.min(g.max, f + (+b.dataset.d))); play('tick'); paint(); }; });
    } else if (g.type === 'choose') {
      stg.innerHTML = ''; btns.innerHTML = g.opts.map(function (o, i) { return '<button type="button" class="btn ghost opt" data-i="' + i + '">' + o + '</button>'; }).join('');
      $$('.opt', btns).forEach(function (b) { b.onclick = function () { if (+b.dataset.i === g.ans) gEnd(true); else { b.disabled = true; b.classList.add('nope'); $('#gmMsg').textContent = g.lose; play('no'); } }; });
    }
  }

  /* 크게 보기 */
  var lb = $('#lb');
  D.addEventListener('click', function (e) {
    var f = e.target.closest('[data-lb], .pl-wide'); if (!f) return;
    var im = $('img', f), cap = $('figcaption', f);
    $('#lbImg').src = im.src; $('#lbImg').alt = im.alt; $('#lbCap').innerHTML = f.classList.contains('pl-wide') ? (cp && cp.ph ? '옛 사진 · 그림은 그리는 중' : '그림 · 재현') : (cap ? cap.innerHTML : '');
    lb.hidden = false;
  });
  lb.onclick = function () { lb.hidden = true; };
  D.addEventListener('keydown', function (e) { if (e.key === 'Escape') { lb.hidden = true; closeGame(); } });

  /* ── ④ 자정 ── */
  var placed = 0, MD = 1;
  var PEEK = false;
  function openMid(d, peek) {
    PEEK = !!peek; MD = d; var open = PEEK || midOpen(d), now = new Date(), OR = DORD[d];
    $('#mdTitle').textContent = d === 1 ? '★ 자정 · 편집국' : '☾ 둘째 날 밤 · 편집국';
    $('#mdClock').textContent = ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
    $('#mdLock').hidden = open; $('#mdOpen').hidden = !open; $('#mdN').textContent = nDone(d);
    $('#mdLockP').textContent = (d === 1 ? '첫째 날' : '둘째 날') + ' 여덟 곳 발바닥 도장을 다 모으거나, 진짜 밤 12시(00:00 ~ 00:59)에 다시 오세요.';
    $('#mdImg').src = IMG + (solvedOf(d) ? 'midnight_done' : 'midnight') + EXT;
    $('#mdPeek').hidden = !PEEK;
    if (open) buildTiles();
    show('mid');
    if (PEEK) peekRun();
  }
  function buildTiles() {
    var OR = DORD[MD], got = gotOf(MD), DP = DAYP[MD];
    placed = 0; var have = OR.filter(function (c) { return got.indexOf(c) >= 0; });
    $('#mdSlots').innerHTML = OR.map(function (c) { var p = DP.filter(function (q) { return q.ch === c; })[0]; return '<span class="slot"><span class="ch no">·</span>' + STP(p.id) + '</span>'; }).join('');
    var sh = have.slice().sort(function () { return Math.random() - .5; });
    $('#mdTiles').innerHTML = sh.map(function (c) { return '<button type="button" data-c="' + c + '">' + c + '</button>'; }).join('');
    $('#mdEnd').hidden = true; $('#md2End').hidden = true;
    $('#mdSay').textContent = have.length < 8 ? '「글자가 ' + (8 - have.length) + '개 모자라오. 더 걸어야 문장이 되오.」' : (MD === 1 ? '「늦엇구려. 나는 늘 여기 잇섯소.」' : '「또 왓구려. 이번엔 내가 기다렷소.」');
    if (solvedOf(MD)) { OR.forEach(function (c, i) { var s = $$('#mdSlots .ch')[i]; s.textContent = c; s.className = 'ch ok'; }); $('#mdTiles').innerHTML = ''; (MD === 1 ? ending : ending2)(true); }
  }
  $('#mdTiles').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return; ac(); var OR = DORD[MD];
    if (b.dataset.c === OR[placed] && gotOf(MD).length >= 8) {
      var s = $$('#mdSlots .ch')[placed]; s.textContent = b.dataset.c; s.className = 'ch ok'; b.classList.add('used'); placed++; play('tick');
      if (placed === 8) {
        if (MD === 1) G.solved = 1; else G.solved2 = 1; save();
        $('#mdImg').src = IMG + 'midnight_done' + EXT; $('#mdSay').textContent = MD === 1 ? '「심묘는 오늘도 잇소.」' : '「내일도 산책하겟소.」'; mood($('#mid .face'), 'fish'); buzz([20, 60, 20]); play('ok'); (MD === 1 ? ending : ending2)(false);
      }
    } else { b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope'); play('no'); }
  });
  if (!D2) { $('#mpDays').hidden = true; $('#mpDayNote').hidden = true; $('#mdDay2').hidden = true; }
  $('#mdDay2').onclick = function () { G.day = 2; save(); go('map'); };
  $('#mdBell').onclick = function () { play('clock'); $('#mdSay').textContent = '「…열둘. 이제 글자를 노으시오.」'; };
  function peekRun() {
    var OR = DORD[1]; $('#mdTiles').innerHTML = ''; $('#mdSay').textContent = '「늦엇구려. 나는 늘 여기 잇섯소.」';
    OR.forEach(function (c, i) { setTimeout(function () { if (!PEEK) return; var s = $$('#mdSlots .ch')[i]; if (!s) return; s.textContent = c; s.className = 'ch ok'; play('tick'); if (i === OR.length - 1) { $('#mdImg').src = IMG + 'midnight_done' + EXT; $('#mdSay').textContent = '「심묘는 오늘도 잇소.」'; ending(false); } }, RM ? 0 : 320 + i * 260); });
  }
  function ending2(again) {
    var c = DATA.course;
    $('#md2NoteK').textContent = '수첩 · ' + DATA.mid2Note.k; $('#md2NoteT').textContent = DATA.mid2Note.t;
    $('#crsT').textContent = c.title; $('#crs1').textContent = c.d1; $('#crs2').textContent = c.d2;
    $('#crsP1').textContent = c.t1; $('#crsP2').textContent = c.t2; $('#crsP3').textContent = c.t3; $('#crsSrc').textContent = '출처 · ' + c.src;
    $('#md2End').hidden = false;
    if (!again) setTimeout(function () { $('#md2End').scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' }); }, 400);
  }
  function ending(again) {
    var w = DATA.wanted, e = DATA.ending;
    $('#mdNoteK').textContent = '수첩 마지막 쪽 · ' + DATA.midNote.k; $('#mdNoteT').textContent = DATA.midNote.t;
    $('#wCrime').textContent = w.crime; $('#wReward').textContent = w.reward; $('#wWhy').textContent = w.why;
    $('#blImg').src = e.paper.img; $('#blImg').alt = e.paper.cap; $('#blCap').textContent = e.paper.cap;
    $('#fact1').textContent = e.fact1; $('#fact2').textContent = e.fact2; $('#factSrc').textContent = '출처 · ' + e.src;
    $('#mdEnd').hidden = false;
    var bp = $('#blPaper'); if (!again) { bp.classList.remove('read'); $('#mdFact').hidden = true; $('#mdGifts').hidden = true; } else { bp.classList.add('read'); $('#mdFact').hidden = false; $('#mdGifts').hidden = false; }
    if (!again) setTimeout(function () { $('#mdEnd').scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' }); }, 400);
  }
  $('#blBtn').onclick = function () { $('#blPaper').classList.add('read'); $('#blQ').textContent = '사람 눈으로 보니 글자가 보입니다. 그런데 그 시절에는…'; setTimeout(function () { $('#mdFact').hidden = false; $('#mdGifts').hidden = false; $('#mdFact').scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' }); }, 900); };

  /* ── ⑤ 산책 선물 — 엽서 · 결과 카드 · 배경화면 ── */
  var tab = 'post', wallNight = NIGHT;
  function loadAll(srcs, cb) { var im = {}, left = Object.keys(srcs).length; Object.keys(srcs).forEach(function (k) { var i = new Image(); i.onload = i.onerror = function () { if (--left === 0) (D.fonts && D.fonts.ready ? D.fonts.ready : Promise.resolve()).then(function () { cb(im); }); }; i.src = srcs[k]; im[k] = i; }); }
  function cover(x, img, X, Y, Wd, Ht, fy) { var r = Math.max(Wd / img.width, Ht / img.height), w = img.width * r, h = img.height * r; x.save(); x.beginPath(); x.rect(X, Y, Wd, Ht); x.clip(); x.drawImage(img, X + (Wd - w) / 2, Y + (Ht - h) * (fy === undefined ? .5 : fy), w, h); x.restore(); }
  function stampsRow(x, im, X, Y, s, gap, d) { DAYP[d || 1].forEach(function (p, k) { var i = im[p.id]; if (!i || !i.width) return; x.save(); x.globalAlpha = done(p.id) ? 1 : .16; x.translate(X + k * gap + s / 2, Y + s / 2); x.rotate(done(p.id) ? (k % 2 ? .08 : -.08) : 0); x.drawImage(i, -s / 2, -s / 2, s, s); x.restore(); }); }
  function fin(cvs, name) { try { $('#cdSave').href = cvs.toDataURL('image/png'); $('#cdSave').setAttribute('download', name); } catch (e) {} }
  function drawPost() {
    var cvs = $('#cdCv'); cvs.width = 900; cvs.height = 1300; var x = cvs.getContext('2d'), d = new Date(), n = nDone(1);
    var srcs = { pic: IMG + (NIGHT || G.solved ? 'card_night' : 'card_day') + EXT, post: GR + 'postage.png', logo: GR + 'logo_h.png' }, n2 = nDone(2); P.forEach(function (p) { srcs[p.id] = GR + 'stp_' + p.id + '.png'; });
    loadAll(srcs, function (im) {
      x.fillStyle = '#f2e6cb'; x.fillRect(0, 0, 900, 1300); cover(x, im.pic, 40, 40, 820, 900);
      x.strokeStyle = '#231c16'; x.lineWidth = 4; x.strokeRect(40, 40, 820, 900);
      if (im.post.width) { x.save(); x.translate(760, 150); x.rotate(.08); var pw = 150, ph = pw * im.post.height / im.post.width; x.drawImage(im.post, -pw / 2, -ph / 2, pw, ph); x.restore(); }
      x.fillStyle = '#231c16'; x.font = '900 50px "Noto Serif KR", serif'; x.fillText('오늘의 심묘', 44, 1012);
      x.font = '500 24px "Noto Sans KR", sans-serif'; x.fillStyle = '#5b4e42';
      x.fillText(d.getFullYear() + '. ' + (d.getMonth() + 1) + '. ' + d.getDate() + ' · 발바닥 도장 ' + (D2 ? (n + n2) + '/16' : n + '/8') + (G.solved2 ? ' · 내일도 산책하겟소' : G.solved ? ' · 심묘는 오늘도 잇소' : ''), 46, 1052);
      if (D2) { stampsRow(x, im, 46, 1072, 54, 60, 1); stampsRow(x, im, 46, 1132, 54, 60, 2); } else stampsRow(x, im, 46, 1080, 64, 72, 1);
      if (im.logo.width) { var lw = 330, lh = lw * im.logo.height / im.logo.width; x.drawImage(im.logo, 900 - 44 - lw, 1300 - 40 - lh, lw, lh); }
      x.font = '500 18px "Noto Sans KR", sans-serif'; x.fillStyle = '#5b4e42'; x.fillText('심묘한 산책 · 그림은 재현', 46, 1250);
      fin(cvs, '오늘의_심묘_엽서.png');
    });
  }
  function fav() { var best = null, bt = 0; P.forEach(function (p) { if (!p.ph && (G.t[p.id] || 0) > bt) { bt = G.t[p.id]; best = p; } }); return best; }
  function drawRes() {
    var cvs = $('#cdCv'); cvs.width = 1080; cvs.height = 1920; var x = cvs.getContext('2d'), n = nDone(1) + nDone(2), b = fav();
    var face = G.solved ? 'fish' : n >= 4 ? 'sit' : 'peek';
    var srcs = { logo: GR + 'logo_v.png', face: GR + 'sk_' + face + '.png', pic: IMG + (b ? b.img : 'cover_day') + EXT, em: GR + 'emblem.png' }; P.forEach(function (p) { srcs[p.id] = GR + 'stp_' + p.id + '.png'; });
    loadAll(srcs, function (im) {
      x.fillStyle = '#f2e6cb'; x.fillRect(0, 0, 1080, 1920);
      x.fillStyle = '#2f5d57'; x.fillRect(0, 0, 1080, 120); x.fillStyle = '#f2e6cb'; x.font = '700 34px "Noto Sans KR", sans-serif'; x.textAlign = 'center'; x.fillText('나의 심묘한 산책 · 결과', 540, 76);
      if (im.logo.width) { var lw = 380, lh = lw * im.logo.height / im.logo.width; x.drawImage(im.logo, 540 - lw / 2, 160, lw, lh); var ly = 160 + lh; } else ly = 400;
      x.fillStyle = '#d2603b'; x.font = '900 64px "Noto Serif KR", serif'; x.fillText('제 ' + G.no + '호 산책자', 540, ly + 100);
      cover(x, im.pic, 140, ly + 150, 800, 620, .6); x.strokeStyle = '#231c16'; x.lineWidth = 5; x.strokeRect(140, ly + 150, 800, 620);
      if (im.face.width) x.drawImage(im.face, 760, ly + 600, 240, 240);
      x.fillStyle = '#231c16'; x.font = '700 40px "Noto Sans KR", sans-serif';
      x.fillText(b ? '가장 오래 머문 곳 · ' + b.name + ' (' + b.yr + ')' : (n ? '이틀째 산책 중이오' : '아직 걷기 전이오'), 540, ly + 850);
      x.font = '500 32px "Noto Sans KR", sans-serif'; x.fillStyle = '#5b4e42';
      x.fillText('발바닥 도장 ' + n + (D2 ? '/16' : '/8') + ' · 멸치 ' + G.fish + '마리' + (G.solved2 ? ' · 이틀 문장 완성' : G.solved ? ' · 자정 문장 완성' : ''), 540, ly + 905);
      stampsRow(x, im, 540 - (8 * 116 - 16) / 2, ly + (D2 ? 940 : 950), 100, 116, 1); if (D2) stampsRow(x, im, 540 - (8 * 116 - 16) / 2, ly + 1052, 100, 116, 2);
      x.textAlign = 'center'; x.font = '500 26px "Noto Sans KR", sans-serif'; x.fillStyle = '#5b4e42'; x.fillText('심묘한 산책 · 그림은 재현 · 심묘는 지어낸 고양이', 540, 1870);
      x.textAlign = 'left'; fin(cvs, '심묘한_산책_결과.png');
    });
  }
  function drawWall() {
    var cvs = $('#cdCv'); cvs.width = 1080; cvs.height = 1920; var x = cvs.getContext('2d');
    loadAll({ pic: IMG + (wallNight ? 'cover_night' : 'cover_day') + EXT, logo: GR + (wallNight ? 'logo_h_cream.png' : 'logo_h.png') }, function (im) {
      cover(x, im.pic, 0, 0, 1080, 1920, .5);
      var g = x.createLinearGradient(0, 0, 0, 520); g.addColorStop(0, wallNight ? 'rgba(10,25,25,.75)' : 'rgba(242,230,203,.85)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 1080, 520);
      if (im.logo.width) { var lw = 640, lh = lw * im.logo.height / im.logo.width; x.drawImage(im.logo, 540 - lw / 2, 230, lw, lh); }
      fin(cvs, '심묘_배경화면_' + (wallNight ? '밤' : '낮') + '.png');
    });
    $('#cdWall2').textContent = wallNight ? '낮 배경으로' : '밤 배경으로';
  }
  function paintTab() {
    $$('.tabs button').forEach(function (b) { b.classList.toggle('on', b.dataset.t === tab); b.setAttribute('aria-selected', b.dataset.t === tab); });
    $('#cdWall2').hidden = tab !== 'wall'; $('#cdCv').className = 'cv-' + tab;
    if (tab === 'post') drawPost(); else if (tab === 'res') drawRes(); else drawWall();
  }
  $$('.tabs button').forEach(function (b) { b.onclick = function () { tab = b.dataset.t; paintTab(); }; });
  $('#cdWall2').onclick = function () { wallNight = !wallNight; drawWall(); };
  var STK = [['sit', '앉기', 0], ['yawn', '하품', 2], ['wow', '놀람', 4], ['fish', '멸치', 6], ['peek', '빼꼼', 8], ['sleep', '낮잠', 10]];
  function openCard() {
    paintTab();
    $('#stkRow').innerHTML = STK.map(function (k) {
      var open = G.fish >= k[2];
      return open ? '<a href="assets/simmyo/stickers/simmyo_' + k[0] + '.png" download="심묘_' + k[1] + '.png" aria-label="스티커 ' + k[1] + ' 내려받기"><img src="' + GR + 'sk_' + k[0] + '.png" alt="심묘 스티커 · ' + k[1] + '" loading="lazy"><span>' + k[1] + '</span></a>'
        : '<span class="lock" aria-label="스티커 ' + k[1] + ' · 멸치 ' + k[2] + '마리면 열림"><img src="' + GR + 'sk_' + k[0] + '.png" alt=""><span>멸치 ' + k[2] + '</span></span>';
    }).join('');
    var sh = $('#cdShare'), cvs = $('#cdCv');
    if (navigator.share && navigator.canShare) {
      sh.hidden = false;
      sh.onclick = function () { cvs.toBlob(function (b) { var f = new File([b], '심묘한_산책.png', { type: 'image/png' }); if (navigator.canShare({ files: [f] })) navigator.share({ files: [f], title: '심묘한 산책' }).catch(function () {}); else navigator.share({ title: '심묘한 산책', url: location.href.split('#')[0] }).catch(function () {}); }); };
    }
  }
  $('#reset').onclick = function () { var snd = G.snd; G = { snd: snd }; fix(); save(); paintHud(); go('cover'); };

  /* ── ⑥ 심묘 소개 · 수첩 ── */
  function paintAbout() {
    $('#abTalk').innerHTML = DATA.talk.map(function (t, i) { return '<div class="tk' + (i % 3 === 1 ? ' r' : '') + '"><b>「' + t[0] + '」</b><span>' + t[1] + '</span></div>'; }).join('');
    var got = 0;
    $('#abNotes').innerHTML = P.map(function (p) { var on = done(p.id); if (on) got++; return '<li class="' + (on ? 'on' : '') + '">' + STP(p.id) + '<div>' + (on ? '<b>' + p.note.k + '</b><p>' + p.note.t + '</p>' : '<b>' + p.name + '</b><p>도장을 찍으면 열립니다.</p>') + '</div></li>'; }).join('') +
      '<li class="' + (G.solved ? 'on' : '') + '">' + STP('mid') + '<div>' + (G.solved ? '<b>' + DATA.midNote.k + '</b><p>' + DATA.midNote.t + '</p>' : '<b>?</b><p>자정의 문장을 완성하면 열립니다.</p>') + '</div></li>' +
      (!D2 ? '' : '<li class="' + (G.solved2 ? 'on' : '') + '">' + STP('mid') + '<div>' + (G.solved2 ? '<b>' + DATA.mid2Note.k + '</b><p>' + DATA.mid2Note.t + '</p>' : '<b>?</b><p>둘째 날 밤 문장을 완성하면 열립니다.</p>') + '</div></li>');
    $('#abNoteN').textContent = (got + (G.solved ? 1 : 0) + (G.solved2 ? 1 : 0)) + ' / ' + (P.length + (D2 ? 2 : 1));
  }

  /* ── 시연용 ?demo=1 ── */
  if (/demo=1/.test(location.search)) {
    var dm = $('#demo'); dm.hidden = false;
    dm.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return; var k = b.dataset.d;
      if (k === 'all') { P.forEach(function (p) { G.s[p.id] = { eye: 1, nose: 1, ear: 1, human: 1 }; var gg = gotOf(p.day); if (gg.indexOf(p.ch) < 0) gg.push(p.ch); }); G.fish = Math.max(G.fish, 8); save(); paintHud(); go('map'); route(); }
      if (k === 'mid') go('mid');
      if (k === 'mid2') go('mid2');
      if (k === 'reset') { var snd = G.snd; G = { snd: snd }; fix(); save(); paintHud(); go('cover'); route(); }
    });
  }
  W.addEventListener('pagehide', function () { leavePlace(); });
  route();
})(window, document);

/* ════════ 2026-10-21 : 장난감 경성 골목 · 총총 걷는 심묘 ════════ */
(function () {
  var D = document, W = window, $ = function (s) { return D.querySelector(s); };
  var RM = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var C = 'assets/simmyo/city/';
  var ROW0 = [['hanokA', 150], ['dansung', 200], ['x_s011', 150], ['hwasin', 215], ['hanokB', 140], ['ymca', 190], ['x_s015', 150], ['jodk', 165], ['x_h002', 135], ['nakrang', 165], ['mitsu', 190], ['x_s013', 145], ['stadium', 165], ['x_h003', 140]];
  var ROW = ROW0; var track = $('#townTrack');
  function fill(el, h) { var html = ROW.map(function (r) { return '<img src="' + C + r[0] + '.webp" alt="" style="--h:' + Math.round(r[1] * (h || 1)) + 'px">'; }).join(''); el.innerHTML = html + html; }
  if (track) fill(track, 1);
  var x = -260, v = 38, target = 38, last = performance.now();
  function tick(t) { var dt = Math.min(.05, (t - last) / 1000); last = t; v += (target - v) * Math.min(1, dt * 3); x -= v * dt; var half = track.scrollWidth / 2; if (half > 0 && -x > half) x += half; track.style.transform = 'translateX(' + x + 'px)'; requestAnimationFrame(tick); }
  if (!RM && track) requestAnimationFrame(tick);
  /* 산책 따라가기 → 빨라졌다가 지도로 */
  var cv = $('#cover');
  D.addEventListener('click', function (e) {
    var g = e.target.closest('#cvGo'); if (!g || RM || !track) return;
    e.preventDefault(); e.stopImmediatePropagation();
    cv.classList.add('fast'); target = 520;
    setTimeout(function () { cv.classList.remove('fast'); target = 38; location.hash = 'map'; }, 1300);
  }, true);
  /* 지도 → 장소 : 그 건물 앞까지 총총 */
  var TILE = { dansung: 'dansung', record: 'ymca', jodk: 'jodk', mitsu: 'mitsu', nakrang: 'nakrang', hwasin: 'hwasin', stadium: 'stadium' };
  var TRAM = '<svg viewBox="0 0 160 110"><rect x="10" y="30" width="140" height="62" rx="6" fill="#e9c66a" stroke="#231c16" stroke-width="3"/><rect x="10" y="70" width="140" height="22" fill="#5f9a8f" stroke="#231c16" stroke-width="3"/><g fill="#f6eedb" stroke="#231c16" stroke-width="2.5"><rect x="22" y="40" width="20" height="20"/><rect x="50" y="40" width="20" height="20"/><rect x="78" y="40" width="20" height="20"/><rect x="106" y="40" width="20" height="20"/></g><path d="M80 30 L96 4" stroke="#231c16" stroke-width="3"/><circle cx="36" cy="98" r="9" fill="#231c16"/><circle cx="124" cy="98" r="9" fill="#231c16"/></svg>';
  var ov = $('#walkov'), busy = 0; if (ov) fill($('#woTrack'), .62);
  D.addEventListener('click', function (e) {
    var g = e.target.closest('#map [data-p]'); if (!g || RM || busy || !ov) return;
    var id = g.dataset.p, name = (window.SIMMYO_DATA.P.filter(function (p) { return p.id === id; })[0] || {}).name || '';
    e.preventDefault(); e.stopImmediatePropagation(); busy = 1;
    $('#woDest').innerHTML = TILE[id] ? '<img src="' + C + TILE[id] + '.webp" alt="">' : TRAM;
    $('#woT').innerHTML = '<small>총총총</small>' + name;
    var wt = $('#woTrack'), wx = 0, wl = performance.now(), run = 1;
    (function mv(t) { if (!run) return; var dt = (t - wl) / 1000; wl = t; wx -= 160 * dt; wt.style.transform = 'translateX(' + wx + 'px)'; requestAnimationFrame(mv); })(wl);
    ov.hidden = false; ov.className = 'walkov'; void ov.offsetWidth; ov.classList.add('on');
    setTimeout(function () { ov.classList.add('arrive'); }, 120);
    setTimeout(function () { ov.classList.add('stop'); run = 0; }, 1350);
    setTimeout(function () { location.hash = 'p-' + id; }, 1550);
    setTimeout(function () { ov.classList.remove('on'); }, 1700);
    setTimeout(function () { ov.hidden = true; ov.className = 'walkov'; busy = 0; }, 2050);
  }, true);
})();
