/* ============================================================
   visuals.js  — Visual & Experience Upgrades
   1. Cinematic page transitions (flying pieces)
   2. Cinematic scroll storytelling (ambient bg per piece)
   3. Piece Comparison Mode
   4. Chess Clock widget
   5. Achievements System
   ============================================================ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     1. CINEMATIC PAGE TRANSITIONS
     Flying chess pieces burst across screen on enter/goBack
  ══════════════════════════════════════════════════════════ */
  var Transitions = (function () {
    var SYMBOLS = ['♔','♕','♖','♗','♘','♙','♚','♛','♜','♝','♞','♟'];
    var container;

    function init() {
      container = document.createElement('div');
      container.className = 'cine-burst';
      container.setAttribute('aria-hidden', 'true');
      document.body.appendChild(container);

      // Patch enterWorld & goBack
      patchFn('enterWorld', burstForward);
      patchFn('goBack',     burstBack);
    }

    function patchFn(name, burstFn) {
      var orig = window[name];
      window[name] = function () {
        burstFn();
        if (orig) orig.apply(this, arguments);
      };
    }

    function burstForward() { burst('forward'); }
    function burstBack()    { burst('back');    }

    function burst(dir) {
      for (var i = 0; i < 22; i++) {
        (function (i) {
          setTimeout(function () {
            var el = document.createElement('span');
            el.className = 'cine-p';
            el.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

            var startX = dir === 'forward'
              ? Math.random() * window.innerWidth
              : Math.random() * window.innerWidth;
            var startY = dir === 'forward'
              ? window.innerHeight + 40
              : -40;
            var endX = startX + (Math.random() - 0.5) * 300;
            var endY = dir === 'forward'
              ? -40
              : window.innerHeight + 40;

            el.style.cssText = [
              'left:'    + startX + 'px',
              'top:'     + startY + 'px',
              'font-size:' + (1.4 + Math.random() * 2.2) + 'rem',
              'opacity:1',
              '--tx:' + (endX - startX) + 'px',
              '--ty:' + (endY - startY) + 'px',
              '--rot:' + ((Math.random() - 0.5) * 540) + 'deg',
              '--dur:' + (0.8 + Math.random() * 0.7) + 's',
            ].join(';');

            container.appendChild(el);
            el.classList.add('cine-p--fly');

            setTimeout(function () {
              if (el.parentNode) el.parentNode.removeChild(el);
            }, 1600);
          }, i * 55);
        })(i);
      }
    }

    return { init: init };
  })();




  /* ══════════════════════════════════════════════════════════
     3. PIECE COMPARISON MODE
     Floating panel: pick two pieces, see their stats side-by-side
  ══════════════════════════════════════════════════════════ */
  var Comparison = (function () {

    var PIECE_DATA = {
      king:   { name:'King',   sym:'♚', value:'∞', range:'1',  dirs:'8', speed:'Slow',    role:'Royal' },
      queen:  { name:'Queen',  sym:'♛', value:'9', range:'∞',  dirs:'8', speed:'Fast',    role:'Attack' },
      rook:   { name:'Rook',   sym:'♜', value:'5', range:'∞',  dirs:'4', speed:'Fast',    role:'Support' },
      bishop: { name:'Bishop', sym:'♝', value:'3', range:'∞',  dirs:'4', speed:'Fast',    role:'Attack' },
      knight: { name:'Knight', sym:'♞', value:'3', range:'L',  dirs:'8', speed:'Jumper',  role:'Tactical' },
      pawn:   { name:'Pawn',   sym:'♟', value:'1', range:'1',  dirs:'1', speed:'Slow',    role:'Infantry' },
    };

    var TYPES = ['king','queen','rook','bishop','knight','pawn'];
    var panel, selA, selB, open = false, btnEl;

    function init() {
      // FAB button
      btnEl = document.createElement('button');
      btnEl.className    = 'cmp-fab';
      btnEl.title        = 'Compare Pieces';
      btnEl.innerHTML    = '⚖ Compare';
      btnEl.setAttribute('aria-label', 'Open piece comparison');
      document.body.appendChild(btnEl);
      btnEl.addEventListener('click', toggle);

      // Panel
      panel = document.createElement('div');
      panel.className   = 'cmp-panel';
      panel.setAttribute('role', 'dialog');
      panel.setAttribute('aria-label', 'Piece Comparison');
      panel.innerHTML   = buildPanelHTML();
      document.body.appendChild(panel);

      selA  = panel.querySelector('#cmpSelA');
      selB  = panel.querySelector('#cmpSelB');

      panel.querySelector('.cmp-close').addEventListener('click', toggle);
      selA.addEventListener('change', render);
      selB.addEventListener('change', render);

      render();
    }

    function buildPanelHTML() {
      var opts = TYPES.map(function (t) {
        return '<option value="' + t + '">' + PIECE_DATA[t].sym + ' ' + PIECE_DATA[t].name + '</option>';
      }).join('');

      return [
        '<div class="cmp-header">',
          '<span class="cmp-title">⚖ Piece Comparison</span>',
          '<button class="cmp-close" aria-label="Close">✕</button>',
        '</div>',
        '<div class="cmp-selectors">',
          '<div class="cmp-sel-wrap">',
            '<label class="cmp-sel-label">Piece A</label>',
            '<select id="cmpSelA" class="cmp-select">' + opts + '</select>',
          '</div>',
          '<div class="cmp-vs">VS</div>',
          '<div class="cmp-sel-wrap">',
            '<label class="cmp-sel-label">Piece B</label>',
            '<select id="cmpSelB" class="cmp-select">' + opts.replace('value="king"', 'value="king"') + '</select>',
          '</div>',
        '</div>',
        '<div class="cmp-body" id="cmpBody"></div>',
      ].join('');
    }

    function toggle() {
      open = !open;
      panel.classList.toggle('cmp-panel--open', open);
      btnEl.classList.toggle('cmp-fab--active', open);
      if (open) {
        selB.selectedIndex = 1; // default: queen
        render();
        Achievements.unlock('comparer');
      }
    }

    function render() {
      var typeA = selA ? selA.value : 'king';
      var typeB = selB ? selB.value : 'queen';
      var a = PIECE_DATA[typeA];
      var b = PIECE_DATA[typeB];
      var body = document.getElementById('cmpBody');
      if (!body) return;

      var rows = [
        { key:'Symbol',    va: a.sym,   vb: b.sym   },
        { key:'Value',     va: a.value, vb: b.value  },
        { key:'Range',     va: a.range, vb: b.range  },
        { key:'Directions',va: a.dirs,  vb: b.dirs   },
        { key:'Speed',     va: a.speed, vb: b.speed  },
        { key:'Role',      va: a.role,  vb: b.role   },
      ];

      body.innerHTML = rows.map(function (r) {
        var winA = isWinnerA(r.key, r.va, r.vb);
        var winB = isWinnerA(r.key, r.vb, r.va);
        return [
          '<div class="cmp-row">',
            '<span class="cmp-val cmp-val-a ' + (winA ? 'cmp-val--win':'') + '">' + r.va + '</span>',
            '<span class="cmp-key">' + r.key + '</span>',
            '<span class="cmp-val cmp-val-b ' + (winB ? 'cmp-val--win':'') + '">' + r.vb + '</span>',
          '</div>',
        ].join('');
      }).join('');
    }

    function numericVal(s) {
      if (s === '∞') return 999;
      if (s === 'L')  return 3;
      var n = parseFloat(s);
      return isNaN(n) ? 0 : n;
    }

    function isWinnerA(key, va, vb) {
      if (key === 'Symbol' || key === 'Speed' || key === 'Role') return false;
      return numericVal(va) > numericVal(vb);
    }

    return { init: init };
  })();




  /* ══════════════════════════════════════════════════════════
     5. ACHIEVEMENTS SYSTEM
     Toast badges pop up as user explores the site
  ══════════════════════════════════════════════════════════ */
  var Achievements = (function () {

    var DEFS = {
      welcome:   { icon:'👑', title:'Welcome, Grandmaster',   desc:'You entered the World of Chess.' },
      explorer:  { icon:'🗺', title:'The Explorer',           desc:'You scrolled through all six pieces.' },
      comparer:  { icon:'⚖', title:'The Analyst',            desc:'You opened the Piece Comparison panel.' },
      watcher:   { icon:'🎬', title:'The Spectator',          desc:'You watched a piece move demo.' },
      allPieces: { icon:'🏆', title:'Complete Collection',    desc:'You viewed all 6 piece move demos.' },
      themer:    { icon:'🎨', title:'Theme Master',           desc:'You tried all three themes.' },
    };

    var unlocked = {};
    var watchedPieces = {};
    var themedUsed = {};

    var toastContainer;

    function init() {
      toastContainer = document.createElement('div');
      toastContainer.className = 'ach-container';
      toastContainer.setAttribute('aria-live', 'polite');
      document.body.appendChild(toastContainer);

      // Hook enterWorld
      var origEnter = window.enterWorld;
      window.enterWorld = function () {
        unlock('welcome');
        if (origEnter) origEnter.apply(this, arguments);
      };

      // Hook MoveDemo.open
      var origMDOpen = window.MoveDemo ? window.MoveDemo.open : null;
      var hookMD = function () {
        var md = window.MoveDemo;
        if (!md || md.__hooked) return;
        md.__hooked = true;
        var orig = md.open;
        md.open = function (type) {
          unlock('watcher');
          watchedPieces[type] = true;
          if (Object.keys(watchedPieces).length >= 6) unlock('allPieces');
          orig.apply(this, arguments);
        };
      };
      // MoveDemo may init after us — try now and also after DOM ready
      hookMD();
      setTimeout(hookMD, 600);

      // Hook setTheme
      var origTheme = window.setTheme;
      window.setTheme = function (theme) {
        themedUsed[theme] = true;
        if (Object.keys(themedUsed).length >= 3) unlock('themer');
        if (origTheme) origTheme.apply(this, arguments);
      };

      // Hook scroll: all pieces explored
      var piecesPage = document.getElementById('piecesPage');
      if (piecesPage) {
        piecesPage.addEventListener('scroll', function () {
          var cards = document.querySelectorAll('.piece-card.visible');
          if (cards.length >= 6) unlock('explorer');
        });
      }
    }

    function unlock(key) {
      if (unlocked[key]) return;
      var def = DEFS[key];
      if (!def) return;
      unlocked[key] = true;
      showToast(def);
    }

    function showToast(def) {
      var toast = document.createElement('div');
      toast.className = 'ach-toast';
      toast.innerHTML =
        '<div class="ach-icon">' + def.icon + '</div>' +
        '<div class="ach-text">' +
          '<div class="ach-title">' + def.title + '</div>' +
          '<div class="ach-desc">'  + def.desc  + '</div>' +
        '</div>';
      toastContainer.appendChild(toast);

      // Trigger enter animation
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          toast.classList.add('ach-toast--show');
        });
      });

      // Auto-dismiss
      setTimeout(function () {
        toast.classList.remove('ach-toast--show');
        setTimeout(function () {
          if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 600);
      }, 4000);
    }

    return { init: init, unlock: unlock };
  })();

  window.Achievements = Achievements;


  /* ══════════════════════════════════════════════════════════
     BOOT — initialise all modules after DOM ready
  ══════════════════════════════════════════════════════════ */
  function boot() {
    Transitions.init();
    Comparison.init();
    Achievements.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
