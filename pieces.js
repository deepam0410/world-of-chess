/* ============================================================
   pieces.js — Piece data & card builder
   ============================================================ */
(function () {
  'use strict';

  var PIECES = [
    {
      type:     'king',
      name:     'The King',
      alias:    '"The Eternal Sovereign"',
      symbol:   '♚',
      number:   '01',
      floatDur: '4.2s',
      desc:     'The heart of the kingdom — he moves one square in any direction, yet every other piece exists to protect him. Lose the King and the game is lost.',
      stats:    [{ v: '∞', l: 'Value' }, { v: '1', l: 'Range' }, { v: '8', l: 'Directions' }],
      tags:     ['Any Direction', 'One Square', 'Must Be Protected', 'Castling'],
    },
    {
      type:     'queen',
      name:     'The Queen',
      alias:    '"The Supreme Commander"',
      symbol:   '♛',
      number:   '02',
      floatDur: '3.8s',
      desc:     'The mightiest warrior — she slides any distance along ranks, files, and diagonals. Worth nine pawns, her capture can decide the fate of any game.',
      stats:    [{ v: '9', l: 'Value' }, { v: '∞', l: 'Range' }, { v: '8', l: 'Directions' }],
      tags:     ['Any Direction', 'Unlimited Range', 'Most Powerful', 'Linear & Diagonal'],
    },
    {
      type:     'rook',
      name:     'The Rook',
      alias:    '"The Iron Fortress"',
      symbol:   '♜',
      number:   '03',
      floatDur: '5.1s',
      desc:     'Ancient towers of war that own every open rank and file. Rooks dominate the endgame, and a pair working together forms an unstoppable battery.',
      stats:    [{ v: '5', l: 'Value' }, { v: '∞', l: 'Range' }, { v: '4', l: 'Directions' }],
      tags:     ['Horizontal', 'Vertical', 'Unlimited Range', 'Castling Partner'],
    },
    {
      type:     'bishop',
      name:     'The Bishop',
      alias:    '"The Diagonal Oracle"',
      symbol:   '♝',
      number:   '04',
      floatDur: '4.6s',
      desc:     'Masters of the diagonal — each Bishop is bound to one color forever, yet together a pair of Bishops covers every square, making them a coveted advantage.',
      stats:    [{ v: '3', l: 'Value' }, { v: '∞', l: 'Range' }, { v: '4', l: 'Diagonals' }],
      tags:     ['Diagonal Only', 'One Color', 'Unlimited Range', 'Long-Range'],
    },
    {
      type:     'knight',
      name:     'The Knight',
      alias:    '"The Shadow Leaper"',
      symbol:   '♞',
      number:   '05',
      floatDur: '3.4s',
      desc:     'The trickster — the only piece that leaps over others. It moves in an L-shape that defies linear thinking and forks multiple pieces with deadly surprise.',
      stats:    [{ v: '3', l: 'Value' }, { v: 'L', l: 'Move Shape' }, { v: '8', l: 'Jump Targets' }],
      tags:     ['L-Shape Jump', 'Leaps Over All', 'Both Colors', 'Fork Specialist'],
    },
    {
      type:     'pawn',
      name:     'The Pawn',
      alias:    '"The Soul of Chess"',
      symbol:   '♟',
      number:   '06',
      floatDur: '5.6s',
      desc:     'Humble yet magnificent — a pawn that marches to the far rank becomes any piece it desires. Every pawn is a queen sleeping in disguise.',
      stats:    [{ v: '1', l: 'Value' }, { v: '1–2', l: 'First Move' }, { v: '8th', l: 'Promotion' }],
      tags:     ['Forward March', 'Diagonal Capture', 'En Passant', 'Promotion'],
    },
  ];

  function buildCard(piece, index) {
    var canvasId = 'pieceCanvas_' + piece.type;
    var card = document.createElement('div');
    card.className = 'piece-card';

    var stats = piece.stats.map(function (s) {
      return '<div class="stat-chip"><div class="stat-value">' + s.v + '</div><div class="stat-label">' + s.l + '</div></div>';
    }).join('');

    var tags = piece.tags.map(function (t) {
      return '<span class="move-tag">' + t + '</span>';
    }).join('');

    card.innerHTML =
      '<div class="piece-visual">' +
        '<div class="piece-canvas-wrap">' +
          '<canvas id="' + canvasId + '" width="220" height="220"></canvas>' +
        '</div>' +
        '<button class="watch-move-btn" onclick="MoveDemo.open(\'' + piece.type + '\')">' +
          '<span class="btn-piece-icon">' + piece.symbol + '</span>' +
          'Watch It Move' +
        '</button>' +
      '</div>' +
      '<div class="piece-info">' +
        '<div class="piece-number">Piece ' + piece.number + '</div>' +
        '<h3 class="piece-name">' + piece.name + '</h3>' +
        '<div class="piece-alias">' + piece.alias + '</div>' +
        '<div class="piece-divider"></div>' +
        '<p class="piece-desc">' + piece.desc + '</p>' +
        '<div class="piece-stats">' + stats + '</div>' +
        '<div class="piece-movement">' + tags + '</div>' +
      '</div>';

    return card;
  }

  function injectPieces() {
    var container = document.getElementById('piecesContainer');
    if (!container) return;
    container.innerHTML = '';

    PIECES.forEach(function (piece, i) {
      container.appendChild(buildCard(piece, i));
    });

    initScrollReveal();
  }

  function initScrollReveal() {
    var page = document.getElementById('piecesPage');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          setTimeout(function () { e.target.classList.add('visible'); }, 60);
          // Find which piece type this card is
          var canvas = e.target.querySelector('canvas');
          if (canvas && canvas.id) {
            var type = canvas.id.replace('pieceCanvas_', '');
            setTimeout(function () {
              Chess3D.initPieceScene(type, canvas.id);
            }, 180);
          }
        }
      });
    }, { root: page, threshold: 0.10 });

    document.querySelectorAll('.piece-card').forEach(function (c) {
      observer.observe(c);
    });
  }

  window.PiecesModule = {
    inject: injectPieces,
  };

})();