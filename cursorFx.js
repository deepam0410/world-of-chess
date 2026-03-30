/* ============================================================
   cursorFx.js — 3-D animated chess cursor  (v2)
   ============================================================ */
(function () {
  'use strict';

  /* ── bail on touch-only ─────────────────────────────────── */
  if (!window.matchMedia('(pointer: fine)').matches) return;

  /* ── symbols for particles ──────────────────────────────── */
  var SYMBOLS = ['♔','♕','♖','♗','♘','♙','✦','✧'];

  /* ── tunables ───────────────────────────────────────────── */
  var POOL        = 50;
  var SPAWN_MS    = 38;
  var LIFE        = 1100;
  var DRIFT_UP    = 52;
  var DRIFT_X     = 32;
  var BURST_COUNT = 8;

  /* ── build DOM ──────────────────────────────────────────── */
  var wrapper = document.createElement('div');
  wrapper.className = 'cur3d';
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.innerHTML =
    '<div class="cur3d-glow"></div>' +
    '<div class="cur3d-piece">♛</div>' +
    '<div class="cur3d-orbit cur3d-orbit--1"></div>' +
    '<div class="cur3d-orbit cur3d-orbit--2"></div>' +
    '<div class="cur3d-orbit cur3d-orbit--3"></div>' +
    '<div class="cur3d-ring"></div>';
  document.body.appendChild(wrapper);

  /* particle container */
  var pContainer = document.createElement('div');
  pContainer.className = 'cur3d-particles';
  pContainer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(pContainer);

  /* particle pool */
  var pool = [];
  var pIdx = 0;
  for (var i = 0; i < POOL; i++) {
    var sp = document.createElement('span');
    sp.className = 'cur3d-p';
    pContainer.appendChild(sp);
    pool.push({ el: sp, active: false });
  }

  /* ── state ──────────────────────────────────────────────── */
  var mx = -200, my = -200;
  var tx = -200, ty = -200;        // smoothed target
  var lastSpawn = 0;
  var rafId = null;
  var hovering = false;

  /* ── smooth follow (lerp) ───────────────────────────────── */
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ── mousemove ──────────────────────────────────────────── */
  document.addEventListener('mousemove', function (e) {
    mx = e.clientX;
    my = e.clientY;

    var now = performance.now();
    if (now - lastSpawn > SPAWN_MS) {
      spawn(mx, my, now);
      lastSpawn = now;
    }

    if (!rafId) rafId = requestAnimationFrame(tick);
  });

  /* ── click burst ────────────────────────────────────────── */
  document.addEventListener('mousedown', function (e) {
    wrapper.classList.add('cur3d--click');
    var now = performance.now();
    for (var b = 0; b < BURST_COUNT; b++) spawn(e.clientX, e.clientY, now);
  });
  document.addEventListener('mouseup', function () {
    wrapper.classList.remove('cur3d--click');
  });

  /* ── hover detection for interactive elements ───────────── */
  document.addEventListener('mouseover', function (e) {
    var t = e.target;
    if (t.closest('a, button, [onclick], .watch-move-btn, .theme-btn, .enter-btn, .demo-ctrl-btn, .nav-home-btn, .move-demo-close')) {
      hovering = true;
      wrapper.classList.add('cur3d--hover');
    }
  });
  document.addEventListener('mouseout', function (e) {
    var t = e.target;
    if (t.closest('a, button, [onclick], .watch-move-btn, .theme-btn, .enter-btn, .demo-ctrl-btn, .nav-home-btn, .move-demo-close')) {
      hovering = false;
      wrapper.classList.remove('cur3d--hover');
    }
  });

  /* ── leave / enter window ───────────────────────────────── */
  document.addEventListener('mouseleave', function () {
    wrapper.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function () {
    wrapper.style.opacity = '1';
  });

  /* ── spawn particle ─────────────────────────────────────── */
  function spawn(x, y, now) {
    var p = pool[pIdx];
    pIdx = (pIdx + 1) % POOL;

    p.el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    p.x0 = x;
    p.y0 = y;
    p.dx = (Math.random() - 0.5) * DRIFT_X;
    p.rot = (Math.random() - 0.5) * 160;
    p.scale = 0.5 + Math.random() * 0.7;
    p.born = now;
    p.active = true;

    p.el.style.left = x + 'px';
    p.el.style.top  = y + 'px';
    p.el.style.opacity = '1';
  }

  /* ── main loop ──────────────────────────────────────────── */
  function tick(now) {
    /* smooth cursor follow */
    tx = lerp(tx, mx, 0.22);
    ty = lerp(ty, my, 0.22);

    wrapper.style.transform =
      'translate(' + tx + 'px,' + ty + 'px)';

    /* particles */
    var anyActive = false;
    for (var i = 0; i < POOL; i++) {
      var p = pool[i];
      if (!p.active) continue;

      var age = now - p.born;
      if (age > LIFE) {
        p.active = false;
        p.el.style.opacity = '0';
        continue;
      }
      anyActive = true;

      var t = age / LIFE;
      var ease = 1 - Math.pow(1 - t, 3);  // ease-out cubic

      p.el.style.left    = (p.x0 + p.dx * ease) + 'px';
      p.el.style.top     = (p.y0 - DRIFT_UP * ease) + 'px';
      p.el.style.opacity = (1 - ease).toFixed(3);
      p.el.style.transform =
        'translate(-50%,-50%) scale(' + (p.scale * (1 - 0.5 * ease)).toFixed(3) +
        ') rotate(' + (p.rot * ease).toFixed(1) + 'deg)';
    }

    rafId = requestAnimationFrame(tick);
  }

  /* kick off */
  rafId = requestAnimationFrame(tick);

})();
