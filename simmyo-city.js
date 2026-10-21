/* 심묘한 산책 — ⓪ 오프닝(실제 수배 사진 → 지금의 심묘) · ② 산책 지도를 심시티처럼 누르는 랜드마크로 */
(function () {
  var D = document, W = window, $ = function (s, r) { return (r || D).querySelector(s); };
  var RM = W.matchMedia && W.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── ⓪ 오프닝 : 한 세션에 한 번, 표지로 들어올 때만 ── */
  (function () {
    var it = $('#intro'); if (!it) return;
    var h = location.hash.slice(1), seen = 0;
    try { seen = sessionStorage.getItem('simmyo-intro'); } catch (e) {}
    if ((h && h !== 'cover') || seen || RM) return;
    try { sessionStorage.setItem('simmyo-intro', '1'); } catch (e) {}
    it.hidden = false; D.body.classList.add('opn-on');
    var T = [], done = 0;
    function at(ms, f) { T.push(setTimeout(f, ms)); }
    function end() { if (done) return; done = 1; T.forEach(clearTimeout); it.classList.add('out'); D.body.classList.remove('opn-on'); setTimeout(function () { it.hidden = true; }, 900); }
    at(200, function () { it.classList.add('s1'); });       // 신문 수배지 · 실제 사진
    at(1900, function () { it.classList.add('s2'); });      // 플래시 → 망점
    at(3000, function () { it.classList.add('s3'); });      // 망점이 흩어지며 지금의 심묘
    at(4700, function () { it.classList.add('s4'); });      // 한 줄
    at(6600, end);
    $('#inSkip').onclick = end; it.addEventListener('click', function (e) { if (e.target === it) end(); });
  })();

  /* ── ② 산책 지도 : 미니어처 경성, 랜드마크를 누르면 그곳으로 ── */
  var C = 'assets/simmyo/city/';
  var S = 17, OX = 1700, OY = 260;
  function iso(x, y) { return [OX + (x - y) * S * 1.732 / 2 * 1.15, OY + (x + y) * S * .5 * 1.15]; }
  var ROADS = [
    { n: '종로', p: [[2, 30], [110, 30]], w: 46, tram: 1 },
    { n: '남대문로', p: [[45, 30], [45, 58], [43, 70], [40, 86]], w: 36 },
    { n: '태평로', p: [[34, 12], [36, 58], [40, 86]], w: 34 },
    { n: '정동길', p: [[36, 52], [22, 52]], w: 20 },
    { n: '본정', p: [[44, 71], [66, 73]], w: 20 },
    { n: '을지로', p: [[36, 47], [100, 47]], w: 26 },
    { n: '', p: [[68, 30], [68, 12]], w: 18 }, { n: '', p: [[56, 30], [56, 14]], w: 16 }, { n: '', p: [[86, 30], [86, 47]], w: 16 }
  ];
  var MARK = [
    { id: 'hwasin', name: '화신백화점', x: 46.5, y: 26.5, w: 232, img: 'hwasin' },
    { id: 'record', name: '음반가게', x: 57, y: 26.5, w: 232, img: 'ymca' },
    { id: 'dansung', name: '단성사', x: 68, y: 26, w: 220, img: 'dansung' },
    { id: 'stadium', name: '경성운동장', x: 100, y: 44, w: 400, img: 'stadium' },
    { id: 'jodk', name: '경성방송국', x: 25, y: 55, w: 190, img: 'jodk' },
    { id: 'nakrang', name: '낙랑파라', x: 39.5, y: 61, w: 160, img: 'nakrang' },
    { id: 'mitsu', name: '미쓰코시 옥상', x: 47, y: 72, w: 244, img: 'mitsu' },
    { id: 'tram', name: '전차', x: 80, y: 30, tram: 1 }
  ];
  var VIEW = { x0: 16, x1: 106, y0: 14, y1: 80 };
  var PATH = [[24, 52], [36, 52], [36, 58], [42, 61], [43, 70], [45, 58], [45, 30], [57, 30], [68, 30], [86, 30], [86, 47], [100, 47], [86, 47], [86, 30], [68, 30], [57, 30], [45, 30], [45, 47], [36, 47], [36, 52]];

  var art = $('#mpArt'); if (!art) return;
  art.classList.add('city');
  var box = D.createElement('div'); box.className = 'cm'; box.id = 'cityMap';
  var world = D.createElement('div'); world.className = 'cm-w'; box.appendChild(world); art.appendChild(box);

  /* 보이는 범위 (픽셀) */
  var cs = [iso(VIEW.x0, VIEW.y1), iso(VIEW.x1, VIEW.y0), iso(VIEW.x0, VIEW.y0), iso(VIEW.x1, VIEW.y1)];
  var minX = Math.min.apply(0, cs.map(function (c) { return c[0]; })) - 60, maxX = Math.max.apply(0, cs.map(function (c) { return c[0]; })) + 60;
  var minY = Math.min.apply(0, cs.map(function (c) { return c[1]; })) - 330, maxY = Math.max.apply(0, cs.map(function (c) { return c[1]; })) + 40;
  var VW = maxX - minX, VH = maxY - minY;
  world.style.width = VW + 'px'; world.style.height = VH + 'px';
  function P(x, y) { var p = iso(x, y); return [p[0] - minX, p[1] - minY]; }
  function pt(a) { return a.map(function (q) { var p = P(q[0], q[1]); return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' '); }

  /* 땅 · 성곽 · 산 · 길 */
  var svg = '<svg class="cm-g" width="' + VW + '" height="' + VH + '"><defs><pattern id="cmh" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><line x1="0" y1="0" x2="0" y2="7" stroke="rgba(90,70,40,.12)" stroke-width="1.2"/></pattern><radialGradient id="cmhill" cx="50%" cy="60%" r="60%"><stop offset="0" stop-color="#9fae7e"/><stop offset="1" stop-color="#7f9466"/></radialGradient></defs>';
  svg += '<polygon points="' + pt([[-6, -4], [118, -4], [118, 96], [-6, 96]]) + '" fill="#e3d6b3"/><polygon points="' + pt([[-6, -4], [118, -4], [118, 96], [-6, 96]]) + '" fill="url(#cmh)"/>';
  function hill(x, y, rx, ry, h) { var c = P(x, y); return '<ellipse cx="' + c[0] + '" cy="' + c[1] + '" rx="' + rx + '" ry="' + ry + '" fill="url(#cmhill)" stroke="rgba(29,24,19,.45)" stroke-width="1.5"/><path d="M' + (c[0] - rx * .7) + ' ' + (c[1] - ry * .1) + ' Q' + c[0] + ' ' + (c[1] - h) + ' ' + (c[0] + rx * .7) + ' ' + (c[1] - ry * .1) + '" fill="#8ea173" stroke="rgba(29,24,19,.45)" stroke-width="1.5"/>'; }
  svg += hill(30, 4, 260, 70, 170) + hill(66, 90, 300, 80, 190);
  svg += '<polyline points="' + pt([[30, 4], [10, 20], [6, 46], [16, 70], [38, 90], [62, 92], [90, 80], [108, 52], [104, 24], [80, 6], [52, 0], [30, 4]]) + '" fill="none" stroke="#8a7a5c" stroke-width="5" stroke-dasharray="2 7" stroke-linecap="round"/>';
  ROADS.forEach(function (r) {
    svg += '<polyline points="' + pt(r.p) + '" fill="none" stroke="#7d6c4c" stroke-width="' + (r.w * .7 + 4) + '" stroke-linejoin="round" stroke-linecap="round" opacity=".35"/><polyline points="' + pt(r.p) + '" fill="none" stroke="#d4c299" stroke-width="' + (r.w * .7) + '" stroke-linejoin="round" stroke-linecap="round"/>';
    if (r.tram) svg += '<polyline points="' + pt(r.p.map(function (q) { return [q[0], q[1] - .5]; })) + '" fill="none" stroke="#5a4a35" stroke-width="1.5"/><polyline points="' + pt(r.p.map(function (q) { return [q[0], q[1] - .1]; })) + '" fill="none" stroke="#5a4a35" stroke-width="1.5"/>';
    if (r.n) { var a = P(r.p[0][0], r.p[0][1]), b = P(r.p[1][0], r.p[1][1]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI, m = P(r.p[0][0] * .55 + r.p[1][0] * .45, r.p[0][1] * .55 + r.p[1][1] * .45); svg += '<text x="' + m[0] + '" y="' + m[1] + '" transform="rotate(' + ang + ' ' + m[0] + ' ' + m[1] + ')" text-anchor="middle" dy="5" font-family="Noto Sans KR" font-weight="700" font-size="16" letter-spacing="8" fill="#6b5a3e">' + r.n + '</text>'; }
  });
  var jt = P(25, 55);
  function tower(x, y, h) { var o = '<g stroke="#7a3d26" stroke-width="2.4" fill="none"><path d="M' + (x - 16) + ' ' + y + ' L' + x + ' ' + (y - h) + ' L' + (x + 16) + ' ' + y + '"/>'; for (var i = 0; i < 10; i++) { var t = i / 10, yy = y - h * t, w = 16 * (1 - t); o += '<path d="M' + (x - w) + ' ' + yy + ' L' + (x + w * .86) + ' ' + (yy - h / 10) + ' M' + (x + w) + ' ' + yy + ' L' + (x - w * .86) + ' ' + (yy - h / 10) + '"/>'; } return o + '</g>'; }
  svg += tower(jt[0] - 100, jt[1] - 18, 290) + tower(jt[0] + 92, jt[1] + 30, 290) + '<path d="M' + (jt[0] - 100) + ' ' + (jt[1] - 308) + ' Q' + jt[0] + ' ' + (jt[1] - 250) + ' ' + (jt[0] + 92) + ' ' + (jt[1] - 260) + '" stroke="#3a2e22" stroke-width="1.6" fill="none"/>';
  world.innerHTML = svg + '</svg>';

  function place(o, el) { var p = P(o.x, o.y); el.style.left = p[0] + 'px'; el.style.top = p[1] + 'px'; el.style.width = o.w + 'px'; el.style.zIndex = Math.round(p[1]); }

  /* 동네 채우기 */
  var seed = 11; function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  var X = { h: ['x_h000', 'x_h002', 'x_h003', 'hanokA', 'hanokB'], s: ['x_s011', 'x_s012', 'x_s013', 'x_s015', 'x_s019', 'x_s020', 'x_s021', 'x_s029'], m: ['x_m030', 'x_m031', 'x_m032', 'x_m033', 'x_m034', 'x_m009', 'x_m004'], b: ['x_b042', 'x_b044', 'x_b046'] };
  function dSeg(x, y, a, b) { var dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy))); return Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy); }
  function nearRoad(x, y) { var m = 1e9; ROADS.forEach(function (r) { for (var i = 0; i < r.p.length - 1; i++) { var d = dSeg(x, y, r.p[i], r.p[i + 1]) - r.w / 22; if (d < m) m = d; } }); return m; }
  function nearMark(x, y) { var m = 1e9; MARK.forEach(function (o) { if (o.tram) return; var d = Math.hypot(o.x - x, o.y - y) - (o.id === 'stadium' ? 11 : o.id === 'jodk' ? 7 : 5); if (d < m) m = d; }); return m; }
  function zone(x, y, nr) {
    if (Math.abs(y - 30) < 7 && nr < 3.2) return rnd() < .62 ? 's' : (rnd() < .45 ? 'b' : (rnd() < .5 ? 'm' : 'h'));
    if (x > 36 && x < 58 && y > 50 && y < 80) return rnd() < .3 ? 'm' : (rnd() < .6 ? 's' : 'h');
    if (Math.abs(x - 45) < 6 && y > 30 && y < 70) return rnd() < .3 ? 'm' : (rnd() < .6 ? 's' : 'h');
    return y < 30 ? (rnd() < .93 ? 'h' : 's') : (rnd() < .84 ? 'h' : 's');
  }
  var SZ = { h: 135, s: 105, m: 125, b: 135 }, frag = D.createDocumentFragment();
  for (var gy = VIEW.y0 - 2; gy < VIEW.y1 + 4; gy += 5.2) for (var gx = VIEW.x0 - 4; gx < VIEW.x1 + 4; gx += 5.6) {
    var x = gx + (rnd() - .5) * 2.2 + ((Math.round(gy / 5.2) % 2) * 2.8), y = gy + (rnd() - .5) * 1.6, nr = nearRoad(x, y);
    if (nr < 1.6 || nearMark(x, y) < 1.5 || rnd() < .12) continue;
    var z = zone(x, y, nr), L = X[z], el = D.createElement('div'); el.className = 'cm-b';
    el.innerHTML = '<img src="' + C + L[Math.floor(rnd() * L.length)] + '.webp" alt="" loading="lazy">'; place({ x: x, y: y, w: SZ[z] * (.9 + rnd() * .2) }, el); frag.appendChild(el);
  }
  for (var n = 0; n < 40; n++) { var tx = VIEW.x0 + rnd() * (VIEW.x1 - VIEW.x0), ty = VIEW.y0 + rnd() * (VIEW.y1 - VIEW.y0); if (nearRoad(tx, ty) < 1.2 || nearMark(tx, ty) < 1) continue; var hh = 26 + rnd() * 22, col = ['#4f6b45', '#3e5b3c', '#6b7f4a', '#5b6e3e'][Math.floor(rnd() * 4)], t = D.createElement('div'); t.className = 'cm-b'; t.innerHTML = '<svg width="40" height="' + (hh + 14) + '"><rect x="18" y="' + (hh - 4) + '" width="4" height="16" fill="#5a4330"/><ellipse cx="20" cy="' + (hh * .55) + '" rx="16" ry="' + (hh * .55) + '" fill="' + col + '" stroke="#1d1813" stroke-width="1.6"/></svg>'; place({ x: tx, y: ty, w: 40 }, t); frag.appendChild(t); }
  world.appendChild(frag);

  /* 랜드마크 : 누르는 건물 */
  var TRAM = '<svg viewBox="0 0 160 110"><g transform="skewY(-24) translate(0 40)"><rect x="10" y="30" width="140" height="56" rx="6" fill="#e9c66a" stroke="#231c16" stroke-width="3"/><rect x="10" y="66" width="140" height="20" fill="#5f9a8f" stroke="#231c16" stroke-width="3"/><g fill="#f6eedb" stroke="#231c16" stroke-width="2.5"><rect x="22" y="38" width="20" height="20"/><rect x="50" y="38" width="20" height="20"/><rect x="78" y="38" width="20" height="20"/><rect x="106" y="38" width="20" height="20"/></g><path d="M80 30 L96 6" stroke="#231c16" stroke-width="3"/></g></svg>';
  var EL = {};
  MARK.forEach(function (o) {
    var b = D.createElement('button'); b.type = 'button'; b.className = 'cm-m' + (o.tram ? ' tram' : ''); b.dataset.p = o.id; b.setAttribute('aria-label', o.name + '(으)로 산책');
    b.innerHTML = (o.tram ? TRAM : '<img src="' + C + o.img + '.webp" alt="">') + '<span class="cm-l"><i></i>' + o.name + '</span>';
    o.w = Math.round((o.w||0) * 1.55); if (o.tram) { var p = P(o.x, o.y); b.style.left = p[0] + 'px'; b.style.top = (p[1] + 10) + 'px'; b.style.width = '190px'; b.style.zIndex = Math.round(p[1]) + 5; } else place(o, b);
    b.addEventListener('click', function () { location.hash = 'p-' + o.id; });
    world.appendChild(b); EL[o.id] = b;
  });

  /* 걷는 심묘 */
  var cat = D.createElement('div'); cat.className = 'cm-cat'; cat.innerHTML = '<i></i><img src="' + C + 'cat_dot_r.webp" alt="">'; world.appendChild(cat);
  var seg = 0, tt = 0, pause = 0, face = 1, last = performance.now(), catImg = $('img', cat);
  function loop(now) {
    var dt = Math.min(.05, (now - last) / 1000); last = now;
    if (!$('#map').hidden) {
      if (pause > 0) { pause -= dt; cat.classList.remove('walk'); }
      else {
        var a = PATH[seg], b = PATH[(seg + 1) % PATH.length], pa = P(a[0], a[1]), pb = P(b[0], b[1]), len = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]);
        tt += 52 * dt / len; if (tt >= 1) { tt = 0; seg = (seg + 1) % PATH.length; if (Math.random() < .35) pause = 1.2; }
        var f = pb[0] >= pa[0] ? 1 : -1; if (f !== face) { face = f; catImg.src = C + (f > 0 ? 'cat_dot_r.webp' : 'cat_dot.webp'); }
        cat.style.left = (pa[0] + (pb[0] - pa[0]) * tt) + 'px'; cat.style.top = (pa[1] + (pb[1] - pa[1]) * tt) + 'px'; cat.classList.add('walk');
      }
    }
    requestAnimationFrame(loop);
  }
  if (!RM) requestAnimationFrame(loop); else { var s0 = P(45, 30); cat.style.left = s0[0] + 'px'; cat.style.top = s0[1] + 'px'; }

  /* 크기 맞추기 : 컴퓨터는 한눈에, 폰은 옆으로 밀어 보기 */
  function fit() {
    var mob = W.innerWidth < 900, cw = art.clientWidth || W.innerWidth;
    var k = mob ? Math.max(.36, cw / VW) : Math.min(cw / VW, (W.innerHeight - 120) / VH);
    world.style.transform = 'scale(' + k + ')'; box.style.height = (VH * k) + 'px';
    world.parentNode.style.width = mob ? '100%' : (VW * k) + 'px';
    var inner = box.querySelector('.cm-sz') || (function () { var z = D.createElement('div'); z.className = 'cm-sz'; box.appendChild(z); return z; })();
    inner.style.width = (VW * k) + 'px';
    if (mob && !box._c && !$('#map').hidden && box.clientWidth) { box._c = 1; var h = P(50, 34); box.scrollLeft = h[0] * k - cw / 2; }
  }
  W.addEventListener('resize', fit);
  /* 도장 찍은 곳 표시 */
  function marks() {
    fit();
    MARK.forEach(function (o) { var li = $('#mpList [data-p="' + o.id + '"]'); var on = li && li.closest('li') && li.closest('li').classList.contains('done'); EL[o.id].classList.toggle('done', !!on); });
  }
  W.addEventListener('hashchange', function () { if (location.hash === '#map') setTimeout(marks, 30); });
  setTimeout(marks, 60);
})();
