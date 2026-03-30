/* ============================================================
   app.js — Main orchestrator: navigation, theme, transitions
   ============================================================ */
(function () {
  'use strict';

  var transitioning = false;

  /* ── Boot ────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    buildTransitionBoard();
    spawnFloatingPieces();
    Chess3D.initLanding();
    setPageState('landing');
  });

  /* ── Page state (controls nav-home-btn visibility) ──────── */
  function setPageState(name) {
    document.body.setAttribute('data-page', name);
  }

  /* ── Theme Switcher ──────────────────────────────────────── */
  window.setTheme = function (theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('.theme-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
  };

  /* ── Enter World ─────────────────────────────────────────── */
  window.enterWorld = function () {
    if (transitioning) return;
    transitioning = true;

    var overlay  = document.getElementById('transitionOverlay');
    var enterBtn = document.getElementById('enterBtn');

    // Button micro-feedback
    enterBtn.style.transform = 'scale(0.93)';
    setTimeout(function () { enterBtn.style.transform = ''; }, 140);

    // Wave animate the board cells
    animateBoardCells();

    // Fade in overlay
    setTimeout(function () {
      overlay.classList.add('active');
    }, 280);

    // Switch to pieces page
    setTimeout(function () {
      showPage('piecesPage');
      PiecesModule.inject();
      Chess3D.initPiecesBg();
      setPageState('pieces');
    }, 1700);

    // Fade out overlay
    setTimeout(function () {
      overlay.style.transition = 'opacity 0.75s ease';
      overlay.style.opacity    = '0';
    }, 2150);

    // Cleanup
    setTimeout(function () {
      overlay.classList.remove('active');
      overlay.style.opacity    = '';
      overlay.style.transition = '';
      transitioning = false;
    }, 3000);
  };

  /* ── Go Back (always available) ─────────────────────────── */
  window.goBack = function () {
    if (transitioning) return;
    var piecesPage = document.getElementById('piecesPage');
    if (!piecesPage.classList.contains('active')) return; // already on landing

    transitioning = true;

    // Close any open demo
    if (window.MoveDemo) { window.MoveDemo.close(); }

    piecesPage.style.transition = 'opacity 0.55s ease';
    piecesPage.style.opacity    = '0';

    setTimeout(function () {
      showPage('landing');
      setPageState('landing');
      piecesPage.style.opacity    = '';
      piecesPage.style.transition = '';
      piecesPage.scrollTop = 0;
      transitioning = false;
    }, 580);
  };

  /* ── Show/hide pages ─────────────────────────────────────── */
  function showPage(id) {
    document.querySelectorAll('.page').forEach(function (p) {
      p.classList.remove('active');
    });
    var el = document.getElementById(id);
    if (el) el.classList.add('active');
  }

  /* ── Transition board ────────────────────────────────────── */
  function buildTransitionBoard() {
    var board = document.getElementById('transitionBoard');
    if (!board) return;
    for (var i = 0; i < 64; i++) {
      var cell = document.createElement('div');
      cell.className = 'tb-cell';
      var isLight = (Math.floor(i / 8) + (i % 8)) % 2 === 0;
      cell.style.background = isLight ? 'var(--board-light)' : 'var(--board-dark)';
      cell.dataset.isLight  = isLight;
      board.appendChild(cell);
    }
  }

  function animateBoardCells() {
    var cells = document.querySelectorAll('.tb-cell');
    cells.forEach(function (cell, i) {
      var delay = (i % 8) * 26 + Math.floor(i / 8) * 18;
      setTimeout(function () {
        cell.style.transition = 'background 0.28s';
        cell.style.background = cell.dataset.isLight === 'true'
          ? 'var(--gold-light)' : 'var(--gold-dark)';
        setTimeout(function () {
          cell.style.background = cell.dataset.isLight === 'true'
            ? 'var(--board-light)' : 'var(--board-dark)';
        }, 380);
      }, delay);
    });
  }

  /* ── Floating pieces (landing) ───────────────────────────── */
  var SYMBOLS = ['♔','♕','♖','♗','♘','♙','♚','♛','♜','♝','♞','♟'];

  function spawnFloatingPieces() {
    var container = document.getElementById('floatingPieces');
    if (!container) return;
    for (var i = 0; i < 18; i++) {
      var el   = document.createElement('div');
      el.className   = 'fp';
      el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      var left  = 3 + Math.random() * 94;
      var dur   = 12 + Math.random() * 14;
      var delay = Math.random() * 18;
      var size  = 1.2 + Math.random() * 2.4;
      el.style.cssText = 'left:' + left + '%;font-size:' + size + 'rem;--dur:' + dur + 's;--delay:-' + delay + 's;';
      container.appendChild(el);
    }
  }

  /* ── Keyboard shortcuts ──────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter'  && document.getElementById('landing').classList.contains('active')) enterWorld();
    if (e.key === 'Escape' && document.getElementById('piecesPage').classList.contains('active') &&
        !document.getElementById('moveDemoOverlay').classList.contains('open')) goBack();
    if (e.key === '1') setTheme('dark');
    if (e.key === '2') setTheme('light');
    if (e.key === '3') setTheme('balanced');
  });

})();