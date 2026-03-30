/* ============================================================
   chess3d.js  — Three.js scenes: landing board + piece previews
   ============================================================ */
(function () {
  'use strict';

  /* ── Piece geometry builder ─────────────────────────────── */
  function makeMat(isWhite) {
    return new THREE.MeshStandardMaterial({
      color:     isWhite ? 0xf5efe0 : 0x1a120a,
      roughness: isWhite ? 0.28 : 0.22,
      metalness: isWhite ? 0.10 : 0.38,
    });
  }

  function cyl(g, mat, rTop, rBot, h, y, segs) {
    segs = segs || 20;
    var m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, segs), mat);
    m.position.y = y; m.castShadow = true; m.receiveShadow = true;
    g.add(m);
  }
  function sph(g, mat, r, y, segs) {
    segs = segs || 18;
    var m = new THREE.Mesh(new THREE.SphereGeometry(r, segs, segs), mat);
    m.position.y = y; m.castShadow = true;
    g.add(m);
  }
  function tor(g, mat, r, tube, y) {
    var m = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 12, 44), mat);
    m.position.y = y; m.rotation.x = Math.PI / 2; m.castShadow = true;
    g.add(m);
  }
  function box(g, mat, w, h, d, x, y, z) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x || 0, y, z || 0); m.castShadow = true;
    g.add(m);
  }
  function cone(g, mat, r, h, y, segs) {
    segs = segs || 14;
    var m = new THREE.Mesh(new THREE.ConeGeometry(r, h, segs), mat);
    m.position.y = y; m.castShadow = true;
    g.add(m);
  }

  function buildPiece(type, isWhite) {
    var mat = makeMat(isWhite);
    var g   = new THREE.Group();

    // Shared base platform
    cyl(g, mat, 0.56, 0.70, 0.13, 0.065, 28);
    cyl(g, mat, 0.46, 0.56, 0.09, 0.185, 22);
    tor(g, mat, 0.49, 0.065, 0.235);

    switch (type) {
      case 'king': {
        cyl(g, mat, 0.17, 0.43, 0.46, 0.52, 16);
        tor(g, mat, 0.30, 0.072, 0.77);
        cyl(g, mat, 0.28, 0.22, 0.40, 1.07, 14);
        tor(g, mat, 0.26, 0.062, 1.30);
        cyl(g, mat, 0.22, 0.28, 0.20, 1.47);
        sph(g, mat, 0.24, 1.62, 16);
        // cross
        box(g, mat, 0.09, 0.40, 0.09, 0, 2.00, 0);
        box(g, mat, 0.30, 0.09, 0.09, 0, 2.14, 0);
        break;
      }
      case 'queen': {
        cyl(g, mat, 0.16, 0.41, 0.44, 0.51, 16);
        tor(g, mat, 0.30, 0.072, 0.76);
        cyl(g, mat, 0.27, 0.21, 0.44, 1.05, 14);
        tor(g, mat, 0.25, 0.058, 1.30);
        cyl(g, mat, 0.21, 0.27, 0.17, 1.45);
        sph(g, mat, 0.22, 1.60, 16);
        // crown balls + spikes
        for (var i = 0; i < 5; i++) {
          var a = (i / 5) * Math.PI * 2;
          var cx = Math.cos(a) * 0.23, cz = Math.sin(a) * 0.23;
          var sp = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 10), mat);
          sp.position.set(cx, 1.76, cz); sp.castShadow = true; g.add(sp);
          var spk = new THREE.Mesh(new THREE.ConeGeometry(0.042, 0.16, 8), mat);
          spk.position.set(cx, 1.90, cz); spk.castShadow = true; g.add(spk);
        }
        break;
      }
      case 'rook': {
        cyl(g, mat, 0.19, 0.40, 0.46, 0.52, 16);
        cyl(g, mat, 0.28, 0.21, 0.64, 1.02, 14);
        cyl(g, mat, 0.33, 0.29, 0.15, 1.37);
        // crenellations
        for (var j = 0; j < 4; j++) {
          var ba = (j / 4) * Math.PI * 2;
          var bx = Math.cos(ba) * 0.25, bz = Math.sin(ba) * 0.25;
          var batt = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.24, 0.15), mat);
          batt.position.set(bx, 1.56, bz); batt.castShadow = true; g.add(batt);
        }
        break;
      }
      case 'bishop': {
        cyl(g, mat, 0.14, 0.40, 0.44, 0.51, 16);
        tor(g, mat, 0.28, 0.068, 0.76);
        cyl(g, mat, 0.15, 0.25, 0.62, 1.11, 14);
        tor(g, mat, 0.17, 0.056, 1.45);
        sph(g, mat, 0.19, 1.65, 16);
        cone(g, mat, 0.065, 0.28, 1.97, 8);
        sph(g, mat, 0.058, 2.12, 10);
        break;
      }
      case 'knight': {
        cyl(g, mat, 0.16, 0.40, 0.44, 0.51, 16);
        tor(g, mat, 0.28, 0.068, 0.76);
        cyl(g, mat, 0.22, 0.18, 0.30, 1.02, 12);
        // neck
        var neck = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.23, 0.40, 12), mat);
        neck.position.set(0.06, 1.30, 0); neck.rotation.z = -0.24;
        neck.castShadow = true; g.add(neck);
        // head
        var headGeo = new THREE.SphereGeometry(0.25, 14, 14);
        headGeo.scale(1, 1.28, 0.76);
        var head = new THREE.Mesh(headGeo, mat);
        head.position.set(0.16, 1.65, 0); head.castShadow = true; g.add(head);
        // snout
        var snout = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.24, 10), mat);
        snout.position.set(0.30, 1.50, 0); snout.rotation.z = Math.PI / 2;
        snout.castShadow = true; g.add(snout);
        // ears
        [-1, 1].forEach(function (s) {
          var ear = new THREE.Mesh(new THREE.ConeGeometry(0.054, 0.15, 6), mat);
          ear.position.set(0.10, 1.91, s * 0.13); ear.castShadow = true; g.add(ear);
        });
        break;
      }
      case 'pawn': {
        cyl(g, mat, 0.14, 0.37, 0.40, 0.47, 16);
        tor(g, mat, 0.25, 0.062, 0.70);
        cyl(g, mat, 0.13, 0.21, 0.48, 1.01, 14);
        tor(g, mat, 0.17, 0.052, 1.28);
        sph(g, mat, 0.20, 1.50, 16);
        break;
      }
    }

    return g;
  }

  /* ── Lighting helper ─────────────────────────────────────── */
  function addLights(scene) {
    scene.add(new THREE.AmbientLight(0xfff4e0, 0.65));

    var dir = new THREE.DirectionalLight(0xfff0d8, 2.6);
    dir.position.set(4, 10, 6);
    dir.castShadow = true;
    dir.shadow.mapSize.set(1024, 1024);
    scene.add(dir);

    var fill = new THREE.PointLight(0x7799ff, 0.45, 30);
    fill.position.set(-4, 4, -4);
    scene.add(fill);

    var rim = new THREE.PointLight(0xffa060, 0.55, 20);
    rim.position.set(0, 2, -6);
    scene.add(rim);
  }

  /* ── Board builder (for landing bg) ─────────────────────── */
  function buildBoard(scene) {
    var g = new THREE.Group();
    var lMat = new THREE.MeshStandardMaterial({ color: 0xc8a96e, roughness: 0.42, metalness: 0.10 });
    var dMat = new THREE.MeshStandardMaterial({ color: 0x5c3d1e, roughness: 0.55, metalness: 0.22 });

    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 8; c++) {
        var isL = (r + c) % 2 === 0;
        var mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 0.12, 1), isL ? lMat : dMat);
        mesh.position.set(c - 3.5, 0, r - 3.5);
        mesh.receiveShadow = true;
        g.add(mesh);
      }
    }
    var frame = new THREE.Mesh(
      new THREE.BoxGeometry(9.4, 0.20, 9.4),
      new THREE.MeshStandardMaterial({ color: 0x2a1508, roughness: 0.6, metalness: 0.3 })
    );
    frame.position.y = -0.07; frame.receiveShadow = true; g.add(frame);

    scene.add(g);
    return g;
  }

  /* ── Landing scene ───────────────────────────────────────── */
  var landingRAF;
  var landingClock = new THREE.Clock();

  function initLanding() {
    var canvas = document.getElementById('chessCanvas');
    if (!canvas) return;

    var W = window.innerWidth, H = window.innerHeight;
    var scene    = new THREE.Scene();
    var camera   = new THREE.PerspectiveCamera(52, W / H, 0.1, 200);
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });

    camera.position.set(0, 8, 15);
    camera.lookAt(0, 0, 0);

    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    renderer.toneMapping       = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    addLights(scene);
    var board = buildBoard(scene);
    board.position.set(0, -2, 0);
    board.rotation.y = 0.25;

    // 6 pieces orbiting the board
    var TYPES   = ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'];
    var floaters = TYPES.map(function (t, i) {
      var p   = buildPiece(t, i % 2 === 0);
      var ang = (i / TYPES.length) * Math.PI * 2;
      p.position.set(Math.cos(ang) * 5.8, 0.4, Math.sin(ang) * 5.8);
      p.scale.setScalar(0.52);
      p.userData = { angle: ang, floatOff: Math.random() * Math.PI * 2, floatSpd: 0.4 + Math.random() * 0.3 };
      scene.add(p);
      return p;
    });

    (function loop() {
      landingRAF = requestAnimationFrame(loop);
      var t = landingClock.getElapsedTime();
      board.rotation.y = 0.25 + t * 0.07;

      floaters.forEach(function (p) {
        p.userData.angle += 0.0038;
        p.position.x = Math.cos(p.userData.angle) * 5.8;
        p.position.z = Math.sin(p.userData.angle) * 5.8;
        p.position.y = 0.4 + Math.sin(t * p.userData.floatSpd + p.userData.floatOff) * 0.45;
        p.rotation.y += 0.012;
      });

      renderer.render(scene, camera);
    })();

    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* ── Per-piece preview scenes ────────────────────────────── */
  var pieceSceneMap = {};

  function initPieceScene(type, canvasId) {
    if (pieceSceneMap[type]) return;

    var canvas = document.getElementById(canvasId);
    if (!canvas) return;

    var W = 220, H = 220;
    var scene    = new THREE.Scene();
    var camera   = new THREE.PerspectiveCamera(40, W / H, 0.1, 60);
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });

    camera.position.set(0, 1.9, 4.5);
    camera.lookAt(0, 1.0, 0);

    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type    = THREE.PCFSoftShadowMap;
    renderer.toneMapping       = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    addLights(scene);

    // Pedestal
    var ped = new THREE.Mesh(
      new THREE.CylinderGeometry(0.72, 0.88, 0.22, 32),
      new THREE.MeshStandardMaterial({ color: 0x111008, roughness: 0.5, metalness: 0.45 })
    );
    ped.position.y = -0.11; ped.receiveShadow = true; scene.add(ped);

    // Glowing rim
    var rimMesh = new THREE.Mesh(
      new THREE.TorusGeometry(0.68, 0.032, 8, 64),
      new THREE.MeshStandardMaterial({
        color: 0xc9a84c, emissive: 0xc9a84c, emissiveIntensity: 2.2, roughness: 0.18
      })
    );
    rimMesh.rotation.x = Math.PI / 2; rimMesh.position.y = 0.01; scene.add(rimMesh);

    // White piece (foreground)
    var white = buildPiece(type, true);
    white.scale.setScalar(0.52);
    white.position.y = 0.06;
    scene.add(white);

    // Dark twin (background)
    var dark = buildPiece(type, false);
    dark.scale.setScalar(0.40);
    dark.position.set(0.75, 0.05, -1.3);
    dark.rotation.y = 0.9;
    scene.add(dark);

    var clock = new THREE.Clock();
    (function loop() {
      requestAnimationFrame(loop);
      var t = clock.getElapsedTime();
      white.rotation.y = t * 0.65;
      dark.rotation.y  = -t * 0.42;
      white.position.y = 0.06 + Math.sin(t * 1.1) * 0.09;
      dark.position.y  = 0.05 + Math.sin(t * 0.9 + 1.2) * 0.06;
      renderer.render(scene, camera);
    })();

    pieceSceneMap[type] = true;
  }

  /* ── Pieces page bg ──────────────────────────────────────── */
  function initPiecesBg() {
    var canvas = document.getElementById('piecesCanvas');
    if (!canvas || canvas._bgInit) return;
    canvas._bgInit = true;

    var W = window.innerWidth, H = window.innerHeight;
    var scene    = new THREE.Scene();
    var camera   = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });

    camera.position.set(0, 7, 13); camera.lookAt(0, 0, 0);
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    addLights(scene);

    var board = buildBoard(scene);
    board.position.y = -1.8;
    var clock = new THREE.Clock();
    (function loop() {
      requestAnimationFrame(loop);
      board.rotation.y = clock.getElapsedTime() * 0.045;
      renderer.render(scene, camera);
    })();

    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* ── Public API ──────────────────────────────────────────── */
  window.Chess3D = {
    initLanding:    initLanding,
    initPieceScene: initPieceScene,
    initPiecesBg:   initPiecesBg,
    stopLanding:    function () { cancelAnimationFrame(landingRAF); },
  };

})();