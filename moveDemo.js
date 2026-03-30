/* ============================================================
   moveDemo.js — Interactive movement demo overlay
   Step-through board for each piece type
   ============================================================ */
(function () {
  'use strict';

  /* ── Piece definitions: col/row from center (4,4) ────────── */
  // Each "step" shows: where the piece IS, and what squares are highlighted
  // col/row are 0-based indices (0=a, 7=h, row 0=rank 8, row 7=rank 1)

  var PIECE_START = { col: 3, row: 4 }; // d4 — center-ish

  var DEMOS = {

    king: {
      icon: '♚',
      title: 'The King',
      rule: 'Moves exactly ONE square in any of 8 directions.',
      desc: 'The King steps carefully — never into danger. He can move to any adjacent square: horizontally, vertically, or diagonally.',
      steps: [
        {
          label: 'Starting square',
          piece: { col: 3, row: 4 },
          can: [
            {col:2,row:3},{col:3,row:3},{col:4,row:3},
            {col:2,row:4},{col:4,row:4},
            {col:2,row:5},{col:3,row:5},{col:4,row:5},
          ],
          path: [],
          note: 'All 8 surrounding squares are reachable from the center.',
        },
        {
          label: 'Move right',
          piece: { col: 4, row: 4 },
          can: [
            {col:3,row:3},{col:4,row:3},{col:5,row:3},
            {col:3,row:4},{col:5,row:4},
            {col:3,row:5},{col:4,row:5},{col:5,row:5},
          ],
          path: [],
          note: 'After moving right one square, new destinations appear.',
        },
        {
          label: 'Move diagonally',
          piece: { col: 5, row: 3 },
          can: [
            {col:4,row:2},{col:5,row:2},{col:6,row:2},
            {col:4,row:3},{col:6,row:3},
            {col:4,row:4},{col:5,row:4},{col:6,row:4},
          ],
          path: [],
          note: 'Diagonal movement — one step at a time in any direction.',
        },
        {
          label: 'Near the edge',
          piece: { col: 0, row: 0 },
          can: [{col:1,row:0},{col:0,row:1},{col:1,row:1}],
          path: [],
          note: 'In a corner the King has only 3 possible moves — fewer options!',
        },
      ],
    },

    queen: {
      icon: '♛',
      title: 'The Queen',
      rule: 'Moves any number of squares in any of 8 directions.',
      desc: 'The Queen combines the power of Rook and Bishop. She glides along ranks, files, and all four diagonals — limited only by the board edge and other pieces.',
      steps: [
        {
          label: 'Horizontal reach',
          piece: { col: 3, row: 4 },
          can: [{col:0,row:4},{col:1,row:4},{col:2,row:4},{col:4,row:4},{col:5,row:4},{col:6,row:4},{col:7,row:4}],
          path: [{col:0,row:4},{col:1,row:4},{col:2,row:4},{col:4,row:4},{col:5,row:4},{col:6,row:4},{col:7,row:4}],
          note: 'Along the rank — the Queen sweeps left and right the entire board.',
        },
        {
          label: 'Vertical reach',
          piece: { col: 3, row: 4 },
          can: [{col:3,row:0},{col:3,row:1},{col:3,row:2},{col:3,row:3},{col:3,row:5},{col:3,row:6},{col:3,row:7}],
          path: [{col:3,row:0},{col:3,row:1},{col:3,row:2},{col:3,row:3},{col:3,row:5},{col:3,row:6},{col:3,row:7}],
          note: 'Along the file — she controls the entire column.',
        },
        {
          label: 'Diagonal reach',
          piece: { col: 3, row: 4 },
          can: [
            {col:0,row:1},{col:1,row:2},{col:2,row:3},{col:4,row:5},{col:5,row:6},{col:6,row:7},
            {col:0,row:7},{col:1,row:6},{col:2,row:5},{col:4,row:3},{col:5,row:2},{col:6,row:1},{col:7,row:0},
          ],
          path: [
            {col:0,row:1},{col:1,row:2},{col:2,row:3},{col:4,row:5},{col:5,row:6},{col:6,row:7},
            {col:0,row:7},{col:1,row:6},{col:2,row:5},{col:4,row:3},{col:5,row:2},{col:6,row:1},{col:7,row:0},
          ],
          note: 'Both diagonal directions — her most dangerous lines of attack.',
        },
        {
          label: 'Full power',
          piece: { col: 3, row: 4 },
          can: (function(){
            var cells=[];
            for(var c=0;c<8;c++) if(c!==3) cells.push({col:c,row:4});
            for(var r=0;r<8;r++) if(r!==4) cells.push({col:3,row:r});
            for(var d=1;d<8;d++){
              if(3+d<8&&4+d<8) cells.push({col:3+d,row:4+d});
              if(3-d>=0&&4-d>=0) cells.push({col:3-d,row:4-d});
              if(3+d<8&&4-d>=0) cells.push({col:3+d,row:4-d});
              if(3-d>=0&&4+d<8) cells.push({col:3-d,row:4+d});
            }
            return cells;
          })(),
          path: [],
          note: 'Combined: the Queen commands 27 squares from d4 — nearly half the board!',
        },
      ],
    },

    rook: {
      icon: '♜',
      title: 'The Rook',
      rule: 'Moves any number of squares horizontally or vertically.',
      desc: 'The Rook is a powerhouse on open lines. It sweeps the full length and width of the board — but cannot move diagonally.',
      steps: [
        {
          label: 'Horizontal sweep',
          piece: { col: 3, row: 4 },
          can:  [{col:0,row:4},{col:1,row:4},{col:2,row:4},{col:4,row:4},{col:5,row:4},{col:6,row:4},{col:7,row:4}],
          path: [{col:0,row:4},{col:1,row:4},{col:2,row:4},{col:4,row:4},{col:5,row:4},{col:6,row:4},{col:7,row:4}],
          note: 'The Rook controls the entire rank from left to right.',
        },
        {
          label: 'Vertical sweep',
          piece: { col: 3, row: 4 },
          can:  [{col:3,row:0},{col:3,row:1},{col:3,row:2},{col:3,row:3},{col:3,row:5},{col:3,row:6},{col:3,row:7}],
          path: [{col:3,row:0},{col:3,row:1},{col:3,row:2},{col:3,row:3},{col:3,row:5},{col:3,row:6},{col:3,row:7}],
          note: 'And the entire file from top to bottom.',
        },
        {
          label: 'Both axes combined',
          piece: { col: 3, row: 4 },
          can:  (function(){
            var c=[];
            for(var col=0;col<8;col++) if(col!==3) c.push({col:col,row:4});
            for(var row=0;row<8;row++) if(row!==4) c.push({col:3,row:row});
            return c;
          })(),
          path: [],
          note: 'From d4 the Rook reaches 14 squares — a +/+ cross pattern.',
        },
        {
          label: 'After moving',
          piece: { col: 7, row: 4 },
          can:  (function(){
            var c=[];
            for(var col=0;col<7;col++) c.push({col:col,row:4});
            for(var row=0;row<8;row++) if(row!==4) c.push({col:7,row:row});
            return c;
          })(),
          path: [],
          note: 'Even from the edge, the Rook retains full control of its rank and file.',
        },
      ],
    },

    bishop: {
      icon: '♝',
      title: 'The Bishop',
      rule: 'Moves any number of squares diagonally — always stays on one color.',
      desc: 'The Bishop travels only on diagonals, so it is forever bound to a single color. But its reach across those diagonals is unlimited.',
      steps: [
        {
          label: 'Light-square bishop',
          piece: { col: 2, row: 5 },
          can: [
            {col:0,row:7},{col:1,row:6},{col:3,row:4},{col:4,row:3},{col:5,row:2},{col:6,row:1},{col:7,row:0},
            {col:0,row:3},{col:1,row:4},{col:3,row:6},{col:4,row:7},
          ],
          path: [
            {col:0,row:7},{col:1,row:6},{col:3,row:4},{col:4,row:3},{col:5,row:2},{col:6,row:1},{col:7,row:0},
            {col:0,row:3},{col:1,row:4},{col:3,row:6},{col:4,row:7},
          ],
          note: 'This Bishop lives on light squares — it will NEVER visit a dark square.',
        },
        {
          label: 'Dark-square bishop',
          piece: { col: 3, row: 4 },
          can: [
            {col:0,row:1},{col:1,row:2},{col:2,row:3},{col:4,row:5},{col:5,row:6},{col:6,row:7},
            {col:0,row:7},{col:1,row:6},{col:2,row:5},{col:4,row:3},{col:5,row:2},{col:6,row:1},{col:7,row:0},
          ],
          path: [
            {col:0,row:1},{col:1,row:2},{col:2,row:3},{col:4,row:5},{col:5,row:6},{col:6,row:7},
            {col:0,row:7},{col:1,row:6},{col:2,row:5},{col:4,row:3},{col:5,row:2},{col:6,row:1},{col:7,row:0},
          ],
          note: 'The dark-square Bishop mirrors the pattern on dark squares only.',
        },
        {
          label: 'Near the edge',
          piece: { col: 0, row: 0 },
          can: [{col:1,row:1},{col:2,row:2},{col:3,row:3},{col:4,row:4},{col:5,row:5},{col:6,row:6},{col:7,row:7}],
          path: [{col:1,row:1},{col:2,row:2},{col:3,row:3},{col:4,row:4},{col:5,row:5},{col:6,row:6},{col:7,row:7}],
          note: 'Even from the corner the Bishop commands a full diagonal.',
        },
        {
          label: 'Bishop pair power',
          piece: { col: 1, row: 0 },
          can: [
            {col:0,row:1},{col:2,row:1},{col:3,row:2},{col:4,row:3},{col:5,row:4},{col:6,row:5},{col:7,row:6},
          ],
          path: [],
          note: 'Two Bishops of opposite colors together cover the ENTIRE board — the coveted "Bishop pair".',
        },
      ],
    },

    knight: {
      icon: '♞',
      title: 'The Knight',
      rule: 'Moves in an L-shape: 2 squares in one direction, then 1 square perpendicular.',
      desc: 'The Knight is chess\'s trickster — the only piece that can leap over others. Its unusual L-shaped path lets it attack squares no other piece threatens from the same position.',
      steps: [
        {
          label: 'The L-shape',
          piece: { col: 3, row: 4 },
          can: [
            {col:2,row:2},{col:4,row:2},
            {col:1,row:3},{col:5,row:3},
            {col:1,row:5},{col:5,row:5},
            {col:2,row:6},{col:4,row:6},
          ],
          path: [],
          note: 'Up to 8 landing squares — all in an L-pattern (2+1 in any rotation).',
        },
        {
          label: 'Leap over pieces',
          piece: { col: 1, row: 0 },
          can: [{col:0,row:2},{col:2,row:2},{col:3,row:1}],
          path: [],
          note: 'From the starting rank the Knight leaps over all the pawns in front.',
        },
        {
          label: 'Fork threat',
          piece: { col: 4, row: 2 },
          can: [
            {col:3,row:0},{col:5,row:0},
            {col:2,row:1},{col:6,row:1},
            {col:2,row:3},{col:6,row:3},
            {col:3,row:4},{col:5,row:4},
          ],
          path: [],
          note: 'A centralized Knight attacks 8 squares simultaneously — deadly fork potential!',
        },
        {
          label: 'Edge vs center',
          piece: { col: 0, row: 0 },
          can: [{col:1,row:2},{col:2,row:1}],
          path: [],
          note: 'In a corner the Knight has only 2 moves — always keep it near the center!',
        },
      ],
    },

    pawn: {
      icon: '♟',
      title: 'The Pawn',
      rule: 'Advances forward — captures diagonally. Reaches the far rank and promotes!',
      desc: 'The Pawn has special rules unlike any other piece: it moves forward but captures on diagonals, it can advance two squares on its first move, and a pawn that reaches the 8th rank transforms into any piece.',
      steps: [
        {
          label: 'First move (two squares)',
          piece: { col: 3, row: 6 },
          can:  [{col:3,row:5},{col:3,row:4}],
          path: [{col:3,row:5}],
          note: 'On its very first move a pawn may advance ONE or TWO squares forward.',
        },
        {
          label: 'Normal advance',
          piece: { col: 3, row: 4 },
          can:  [{col:3,row:3}],
          path: [],
          note: 'After the first move, a pawn can only advance one square at a time.',
        },
        {
          label: 'Diagonal capture',
          piece: { col: 3, row: 4 },
          can:  [{col:2,row:3},{col:4,row:3},{col:3,row:3}],
          path: [],
          note: 'Pawns capture diagonally forward — the two squares marked green are capture squares.',
        },
        {
          label: 'Promotion march',
          piece: { col: 3, row: 1 },
          can:  [{col:3,row:0}],
          path: [{col:3,row:0}],
          note: 'One more step and this pawn becomes a Queen, Rook, Bishop, or Knight — a queen is born!',
        },
      ],
    },

  };

  /* ── State ──────────────────────────────────────────────── */
  var currentType  = null;
  var currentStepI = 0;
  var autoTimer    = null;

  /* ── Board builder ───────────────────────────────────────── */
  function buildDemoBoard() {
    var board = document.getElementById('moveDemoBoard');
    if (!board) return;
    board.innerHTML = '';

    for (var row = 0; row < 8; row++) {
      for (var col = 0; col < 8; col++) {
        var cell = document.createElement('div');
        cell.className = 'demo-cell ' + ((row + col) % 2 === 0 ? 'light' : 'dark');
        cell.dataset.col = col;
        cell.dataset.row = row;

        // Coordinates on border cells
        if (col === 0) {
          var rank = document.createElement('span');
          rank.className = 'coord-rank';
          rank.textContent = 8 - row;
          cell.appendChild(rank);
        }
        if (row === 7) {
          var file = document.createElement('span');
          file.className = 'coord-file';
          file.textContent = 'abcdefgh'[col];
          cell.appendChild(file);
        }

        board.appendChild(cell);
      }
    }
  }

  /* ── Render a step ───────────────────────────────────────── */
  function renderStep(type, stepIndex) {
    var demo = DEMOS[type];
    if (!demo) return;
    var step = demo.steps[stepIndex];
    if (!step) return;

    var board = document.getElementById('moveDemoBoard');
    if (!board) return;

    var cells = board.querySelectorAll('.demo-cell');

    // Clear all states
    cells.forEach(function (c) {
      c.classList.remove('can-move', 'path-cell', 'piece-here', 'piece-moving');
      // Remove piece glyph
      var existing = c.querySelector('.demo-piece');
      if (existing) c.removeChild(existing);
    });

    // Mark path squares first (yellow)
    if (step.path) {
      step.path.forEach(function (sq) {
        var cell = board.querySelector('[data-col="' + sq.col + '"][data-row="' + sq.row + '"]');
        if (cell) cell.classList.add('path-cell');
      });
    }

    // Mark can-move squares (green) — overrides path if same square
    step.can.forEach(function (sq) {
      var cell = board.querySelector('[data-col="' + sq.col + '"][data-row="' + sq.row + '"]');
      if (cell) {
        cell.classList.remove('path-cell');
        cell.classList.add('can-move');
      }
    });

    // Place piece
    var pieceCell = board.querySelector('[data-col="' + step.piece.col + '"][data-row="' + step.piece.row + '"]');
    if (pieceCell) {
      pieceCell.classList.remove('can-move', 'path-cell');
      pieceCell.classList.add('piece-here');
      var glyph = document.createElement('span');
      glyph.className = 'demo-piece';
      glyph.textContent = demo.icon;
      pieceCell.appendChild(glyph);

      // Trigger move animation if not the first step
      if (stepIndex > 0) {
        pieceCell.classList.add('piece-moving');
        setTimeout(function () {
          pieceCell.classList.remove('piece-moving');
        }, 550);
      }
    }

    // Update UI text
    document.getElementById('moveDemoTitle').textContent = demo.title;
    document.getElementById('moveDemoIcon').textContent  = demo.icon;
    document.getElementById('moveDemoRule').textContent  = demo.rule;
    document.getElementById('moveDemoDesc').textContent  = step.note || demo.desc;
    document.getElementById('demoStepLabel').textContent =
      'Step ' + (stepIndex + 1) + ' / ' + demo.steps.length + ' — ' + step.label;

    document.getElementById('demoPrevBtn').disabled = stepIndex === 0;
    document.getElementById('demoNextBtn').disabled = stepIndex === demo.steps.length - 1;
  }

  /* ── Open demo ───────────────────────────────────────────── */
  function open(type) {
    if (!DEMOS[type]) return;

    currentType  = type;
    currentStepI = 0;

    var overlay = document.getElementById('moveDemoOverlay');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    buildDemoBoard();
    renderStep(type, 0);
    startAutoPlay();
  }

  /* ── Close demo ──────────────────────────────────────────── */
  function close() {
    var overlay = document.getElementById('moveDemoOverlay');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    stopAutoPlay();
    currentType = null;
  }

  /* ── Step navigation ─────────────────────────────────────── */
  function step(dir) {
    if (!currentType) return;
    stopAutoPlay();
    var demo   = DEMOS[currentType];
    currentStepI = Math.max(0, Math.min(demo.steps.length - 1, currentStepI + dir));
    renderStep(currentType, currentStepI);
  }

  /* ── Auto-play through steps ──────────────────────────────── */
  function startAutoPlay() {
    stopAutoPlay();
    autoTimer = setInterval(function () {
      if (!currentType) return;
      var demo = DEMOS[currentType];
      currentStepI = (currentStepI + 1) % demo.steps.length;
      renderStep(currentType, currentStepI);
    }, 2800);
  }

  function stopAutoPlay() {
    if (autoTimer) {
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  /* ── Keyboard ────────────────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft')  step(-1);
  });

  /* ── Click outside to close ──────────────────────────────── */
  document.getElementById('moveDemoOverlay').addEventListener('click', function (e) {
    if (e.target === this) close();
  });

  /* ── Public API ──────────────────────────────────────────── */
  window.MoveDemo     = { open: open, close: close };
  window.closeMoveDemo = close;
  window.demoStep     = step;

})();