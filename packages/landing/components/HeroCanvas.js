// The hero's WebGL — a spatial ring-world that fills the whole band and
// surrounds the centered editorial column. A dashed surface ellipse floats
// around the text like a horizon seen from just above; a compact torus web
// of nodes and hairlines hugs the copy; and one constellation city stands
// on the ring's far arc — Tbilisi in line-art: the Mtatsminda TV tower,
// Sameba's stepped dome, old-town gable rows with balcony ticks, Narikala's
// crenellated wall, the Bridge of Peace canopy. Beneath the same plane hang
// the underground holdings: buried qvevri up to their necks, the Abanotubani
// bath domes crowning from below, two dashed strata rings, roots — and the
// ore body, a 3D diamond lattice that feeds the circulation. Fractions
// extracted off the ore rise through the surface, live aloft over the city,
// then settle home and re-crystallize; the flip to underground drops the
// camera below the plane and remixes the palette on the way down. The whole
// world turns slowly; the cursor tilts the camera, is wind above ground and
// a drill below it; a click lands a settlement ring; a slipstream rides the
// pointer in both worlds.
//
// Raw WebGL1, two programs (GL_LINES under diamond sprites) with per-pass
// attribute hygiene (slots are global GL state). All rotation happens in a
// CPU-built perspective matrix, so rigid constellations cost nothing per
// frame beyond a breathing offset; a screen-ortho matrix draws the click
// ring and the slipstream as an overlay. Re-inits per node so livesync
// hot-swaps never draw to a detached canvas. All browser handles go through
// el.node.ownerDocument; the loop rides onFrame; reduced motion renders the
// world frozen (the camera still settles); no WebGL → the Hero's ghost mark
// shows instead (gated by webglOk).
export const HeroCanvas = {
  tag: 'canvas',
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  '@tabletS': { display: 'none' },
  attr: { 'aria-hidden': 'true' },

  onRender: (el, s) => {
    if (!el.node || el.scope.hcNode === el.node) return
    el.scope.hcNode = el.node
    const doc = el.node.ownerDocument
    const win = doc && doc.defaultView
    if (!win) return
    let gl = null
    try {
      gl = el.node.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true })
    } catch (e) {}
    if (!gl) return

    const compile = (type, src) => {
      const sh = gl.createShader(type)
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null
    }
    const link = (vsSrc, fsSrc) => {
      const vs = compile(gl.VERTEX_SHADER, vsSrc)
      const fs = compile(gl.FRAGMENT_SHADER, fsSrc)
      if (!vs || !fs) return null
      const pr = gl.createProgram()
      gl.attachShader(pr, vs)
      gl.attachShader(pr, fs)
      gl.linkProgram(pr)
      return gl.getProgramParameter(pr, gl.LINK_STATUS) ? pr : null
    }

    const pointProg = link(
      'attribute vec3 p;attribute float r;attribute float m;attribute float f;attribute float g;' +
      'uniform mat4 mvp;uniform float dpr;' +
      'varying float vR;varying float vM;varying float vF;varying float vG;' +
      'void main(){' +
      'vec4 cp=mvp*vec4(p,1.0);' +
      'gl_Position=cp;' +
      'float w=max(0.4,cp.w);' +
      'gl_PointSize=(2.2+2.1*r)*(1.0+0.5*m)*dpr*(1.5/w);' +
      'vR=r;vM=m;vF=f;' +
      'vG=g*clamp(1.65-0.4*w,0.22,1.0);}',
      'precision mediump float;varying float vR;varying float vM;varying float vF;varying float vG;' +
      'uniform vec3 colA;uniform vec3 colB;uniform float alBase;' +
      'void main(){' +
      'vec2 q=gl_PointCoord*2.0-1.0;' +
      'float d=abs(q.x)+abs(q.y);' +
      'if(d>1.0)discard;' +
      'float soft=0.62-0.22*vM;' +
      'float edge=1.0-smoothstep(soft,1.0,d);' +
      'vec3 col=mix(colA,colB,vM);' +
      'float a=(alBase*(0.55+0.45*vR)+0.2*vM)*edge*vG;' +
      'a*=mix(1.0,0.34,vF);' +
      'gl_FragColor=vec4(col*a,a);}'
    )
    const lineProg = link(
      'attribute vec3 p;attribute float a;' +
      'uniform mat4 mvp;varying float vA;' +
      'void main(){' +
      'vec4 cp=mvp*vec4(p,1.0);' +
      'gl_Position=cp;' +
      'vA=a*clamp(1.65-0.4*max(0.4,cp.w),0.22,1.0);}',
      'precision mediump float;varying float vA;uniform vec3 colL;' +
      'void main(){gl_FragColor=vec4(colL*vA,vA);}'
    )
    if (!pointProg || !lineProg) return

    // ── world constants (units of viewport height; y up, z toward viewer) ──
    const RX = 0.86            // surface ellipse, x radius
    const RZ = 0.55            // surface ellipse, z radius
    const CAM_DIST = 1.9

    // Node groups drive fades: 0 ring web, 1 city (above), 2 under rigid,
    // 3 ore (extractable), 4 dust. Edge groups: 0 web, 1 city, 2 under,
    // 3 ore, 5 ground dashes, 6 strata dashes, 7 roots.
    const nodes = []
    const nodeGroup = []
    const edges = []
    const edgeGroup = []
    const dash = []            // raw segments: x1,y1,z1,x2,y2,z2,group
    const addN = (x, y, z, g) => { nodes.push(x, y, z); nodeGroup.push(g); return nodeGroup.length - 1 }
    const addE = (a, b, g) => { edges.push(a, b); edgeGroup.push(g) }
    const addDash = (x1, y1, z1, x2, y2, z2, g) => dash.push(x1, y1, z1, x2, y2, z2, g)

    // Place a structure on the surface ring at azimuth th, standing inward.
    // Returns a plotter: P(u, v, w) → node id, in the tangent frame (u along
    // the ring, v up, w toward the ring center).
    const stand = (th, inset, g) => {
      const bx = RX * Math.cos(th) * inset
      const bz = RZ * Math.sin(th) * inset
      let txv = -RX * Math.sin(th)
      let tzv = RZ * Math.cos(th)
      const tl = Math.hypot(txv, tzv) || 1
      txv /= tl; tzv /= tl
      let nxv = -bx
      let nzv = -bz
      const nl = Math.hypot(nxv, nzv) || 1
      nxv /= nl; nzv /= nl
      return (u, v, w) => addN(bx + txv * u + nxv * (w || 0), v, bz + tzv * u + nzv * (w || 0), g)
    }
    const chain = (P, pts, g, close) => {
      const ids = pts.map((pt) => P(pt[0], pt[1], pt[2]))
      for (let i = 1; i < ids.length; i++) addE(ids[i - 1], ids[i], g)
      if (close) addE(ids[ids.length - 1], ids[0], g)
      return ids
    }

    // ── the surrounding web — a compact torus of nodes hugging the copy ──
    const ringIds = []
    const RN = 210
    for (let i = 0; i < RN; i++) {
      const th = i * 2.399963
      const ph = i * 1.71 + Math.sin(i * 12.9) * 1.3
      const rr = 1 + Math.cos(ph) * 0.055
      const id = addN(
        RX * rr * Math.cos(th),
        Math.sin(ph) * 0.075 + Math.sin(i * 5.7) * 0.02,
        RZ * rr * Math.sin(th),
        0
      )
      ringIds.push({ id, th: ((th % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) })
    }
    ringIds.sort((a, b) => a.th - b.th)
    for (let i = 0; i < RN; i++) {
      for (let k = 1; k <= 3; k++) {
        const j = (i + k) % RN
        const a = ringIds[i].id
        const b = ringIds[j].id
        const dx = nodes[a * 3] - nodes[b * 3]
        const dy = nodes[a * 3 + 1] - nodes[b * 3 + 1]
        const dz = nodes[a * 3 + 2] - nodes[b * 3 + 2]
        if (dx * dx + dy * dy + dz * dz < 0.024) addE(a, b, 0)
      }
    }

    // ── the surface itself — a dashed ellipse the camera dives through ──
    for (let i = 0; i < 64; i++) {
      const a0 = (i / 64) * Math.PI * 2
      const a1 = a0 + (Math.PI * 2 / 64) * 0.55
      addDash(RX * Math.cos(a0), 0, RZ * Math.sin(a0), RX * Math.cos(a1), 0, RZ * Math.sin(a1), 5)
    }

    // ── Tbilisi, above ground — constellations standing on the far arc ──
    // Narikala wall: crenellated run between two squat towers.
    const Pw = stand(3.5, 0.98, 1)
    chain(Pw, [[-0.15, 0], [-0.15, 0.1], [-0.12, 0.13], [-0.09, 0.1], [-0.09, 0.04]], 1)
    for (let i = 0; i < 6; i++) {
      const u0 = -0.09 + i * 0.03
      chain(Pw, [[u0, 0.04], [u0 + 0.012, 0.04], [u0 + 0.012, 0.06], [u0 + 0.024, 0.06], [u0 + 0.024, 0.04]], 1)
    }
    chain(Pw, [[0.09, 0.04], [0.09, 0.11], [0.12, 0.145], [0.15, 0.11], [0.15, 0]], 1)

    // Old-town gable rows with balcony ticks — one per flank.
    const gables = (th, flip) => {
      const Pg = stand(th, 0.97, 1)
      let u = -0.16
      const hs = [0.1, 0.135, 0.09, 0.12, 0.1]
      const ws = [0.055, 0.06, 0.05, 0.06, 0.055]
      for (let i = 0; i < hs.length; i++) {
        const w = ws[i]
        const h = hs[i] * (flip ? 1.06 : 1)
        chain(Pg, [[u, 0], [u, h * 0.72], [u + w / 2, h], [u + w, h * 0.72], [u + w, 0]], 1)
        const bId0 = Pg(u + w * 0.16, h * 0.42, 0.012)
        const bId1 = Pg(u + w * 0.84, h * 0.42, 0.012)
        addE(bId0, bId1, 1)
        u += w + 0.012
      }
    }
    gables(3.9, false)
    gables(5.15, true)

    // Sameba cathedral: stepped tiers, drum, dome, cross.
    const Ps = stand(4.28, 0.96, 1)
    chain(Ps, [[-0.085, 0], [-0.085, 0.055], [-0.05, 0.055], [-0.05, 0.15], [-0.026, 0.15], [-0.026, 0.205], [0.026, 0.205], [0.026, 0.15], [0.05, 0.15], [0.05, 0.055], [0.085, 0.055], [0.085, 0]], 1)
    const dome = []
    for (let i = 0; i <= 6; i++) {
      const aa = Math.PI * (i / 6)
      dome.push([Math.cos(aa) * -0.026, 0.205 + Math.sin(aa) * 0.05])
    }
    chain(Ps, dome, 1)
    chain(Ps, [[0, 0.255], [0, 0.295]], 1)
    const crossL = Ps(-0.012, 0.278, 0)
    const crossR = Ps(0.012, 0.278, 0)
    addE(crossL, crossR, 1)

    // Mtatsminda TV tower: three legs, ties, the ring, the mast.
    const Pt = stand(4.7, 0.94, 1)
    const legU = [-0.075, 0.075, 0]
    const legW = [0, 0, 0.062]
    const legLevels = [0, 0.15, 0.3, 0.44, 0.53]
    const legNodes = []
    for (let l = 0; l < 3; l++) {
      const ids = []
      for (let k = 0; k < legLevels.length; k++) {
        const f = k / (legLevels.length - 1)
        ids.push(Pt(legU[l] * (1 - f * 0.92), legLevels[k], legW[l] * (1 - f * 0.92)))
      }
      for (let k = 1; k < ids.length; k++) addE(ids[k - 1], ids[k], 1)
      legNodes.push(ids)
    }
    for (let k = 1; k <= 3; k++) {
      addE(legNodes[0][k], legNodes[1][k], 1)
      addE(legNodes[1][k], legNodes[2][k], 1)
      addE(legNodes[2][k], legNodes[0][k], 1)
    }
    const ringY = 0.475
    const towerRing = []
    for (let i = 0; i < 6; i++) {
      const aa = (i / 6) * Math.PI * 2
      towerRing.push(Pt(Math.cos(aa) * 0.036, ringY + Math.sin(aa) * 0.012, Math.sin(aa) * 0.03))
    }
    for (let i = 0; i < 6; i++) addE(towerRing[i], towerRing[(i + 1) % 6], 1)
    const mastA = Pt(0, 0.53, 0)
    const mastB = Pt(0, 0.615, 0)
    const mastC = Pt(0, 0.66, 0)
    addE(mastA, mastB, 1)
    addE(mastB, mastC, 1)

    // Bridge of Peace: the waving canopy over its deck.
    const Pb = stand(5.55, 0.95, 1)
    const canopy = []
    const deck = []
    for (let i = 0; i <= 11; i++) {
      const f = i / 11
      const u = -0.24 + f * 0.48
      canopy.push([u, 0.065 + Math.sin(Math.PI * f) * 0.05 + Math.sin(f * Math.PI * 4) * 0.011])
      deck.push([u, 0.022])
    }
    const cIds = chain(Pb, canopy, 1)
    const dIds = chain(Pb, deck, 1)
    for (let i = 0; i <= 11; i += 3) addE(cIds[i], dIds[i], 1)

    // Funicular: a dashed climb toward the tower.
    const Pf = stand(4.52, 0.96, 1)
    for (let i = 0; i < 5; i++) {
      const f0 = i / 5
      const f1 = f0 + 0.12
      const a = Pf(0.1 - f0 * 0.2, f0 * 0.3, 0)
      const b = Pf(0.1 - f1 * 0.2, f1 * 0.3, 0)
      addE(a, b, 1)
    }

    // ── underground — what the city stands on ──
    // Qvevri, buried to the neck: amphora outlines hanging from the plane.
    const qvevri = (th, sc) => {
      const Pq = stand(th, 0.82, 2)
      chain(Pq, [
        [-0.032 * sc, -0.006], [-0.05 * sc, -0.05 * sc], [-0.056 * sc, -0.115 * sc],
        [-0.04 * sc, -0.185 * sc], [0, -0.235 * sc],
        [0.04 * sc, -0.185 * sc], [0.056 * sc, -0.115 * sc],
        [0.05 * sc, -0.05 * sc], [0.032 * sc, -0.006]
      ], 2)
      const mA = Pq(-0.032 * sc, -0.006, 0)
      const mB = Pq(0.032 * sc, -0.006, 0)
      addE(mA, mB, 2)
      const wA = Pq(-0.046 * sc, -0.09 * sc, 0)
      const wB = Pq(0.046 * sc, -0.09 * sc, 0)
      addE(wA, wB, 2)
    }
    qvevri(3.7, 1)
    qvevri(4.15, 1.25)
    qvevri(4.6, 0.9)

    // Abanotubani bath domes, crowning from below, oculus chimneys peeking.
    const bathDome = (th, sc) => {
      const Pd = stand(th, 0.86, 2)
      const arc = []
      for (let i = 0; i <= 6; i++) {
        const aa = Math.PI * (i / 6)
        arc.push([Math.cos(aa) * -0.075 * sc, -0.082 * sc + Math.sin(aa) * 0.072 * sc])
      }
      chain(Pd, arc, 2)
      chain(Pd, [[-0.01 * sc, -0.012 * sc], [-0.01 * sc, 0.016 * sc], [0.01 * sc, 0.016 * sc], [0.01 * sc, -0.012 * sc]], 2)
    }
    bathDome(5.35, 1)
    bathDome(5.75, 0.82)

    // Roots reaching down beneath the gable rows.
    const roots = (th) => {
      const Pr = stand(th, 0.95, 2)
      chain(Pr, [[0, 0], [-0.02, -0.07], [-0.055, -0.13]], 7)
      chain(Pr, [[0, 0], [0.018, -0.09], [0.008, -0.17]], 7)
      chain(Pr, [[-0.02, -0.07], [-0.005, -0.12]], 7)
    }
    roots(3.95)
    roots(5.1)

    // Two dashed strata rings converging with depth.
    for (let i = 0; i < 44; i++) {
      const a0 = (i / 44) * Math.PI * 2
      const a1 = a0 + (Math.PI * 2 / 44) * 0.5
      addDash(RX * 0.8 * Math.cos(a0), -0.36, RZ * 0.8 * Math.sin(a0), RX * 0.8 * Math.cos(a1), -0.36, RZ * 0.8 * Math.sin(a1), 6)
    }
    for (let i = 0; i < 36; i++) {
      const a0 = (i / 36) * Math.PI * 2
      const a1 = a0 + (Math.PI * 2 / 36) * 0.5
      addDash(RX * 0.58 * Math.cos(a0), -0.7, RZ * 0.58 * Math.sin(a0), RX * 0.58 * Math.cos(a1), -0.7, RZ * 0.58 * Math.sin(a1), 6)
    }

    // ── the ore body — a 3D diamond lattice, source of the circulation ──
    const OSTEP = 0.054
    const OR = 0.168
    const oth = -0.35
    const ocx = RX * Math.cos(oth) * 0.6
    const ocz = RZ * Math.sin(oth) * 0.6
    const ocy = -0.42
    const oreStart = nodeGroup.length
    const oreIndex = {}
    for (let i = -3; i <= 3; i++) {
      for (let j = -3; j <= 3; j++) {
        for (let k = -3; k <= 3; k++) {
          const lx = i * OSTEP
          const ly = j * OSTEP
          const lz = k * OSTEP
          if (Math.abs(lx) + Math.abs(ly) + Math.abs(lz) > OR) continue
          oreIndex[i + '_' + j + '_' + k] = addN(ocx + lx, ocy + ly, ocz + lz, 3)
        }
      }
    }
    const oreEnd = nodeGroup.length
    for (let i = -3; i <= 3; i++) {
      for (let j = -3; j <= 3; j++) {
        for (let k = -3; k <= 3; k++) {
          const a = oreIndex[i + '_' + j + '_' + k]
          if (a === undefined) continue
          const r1 = oreIndex[(i + 1) + '_' + j + '_' + k]
          const r2 = oreIndex[i + '_' + (j + 1) + '_' + k]
          const r3 = oreIndex[i + '_' + j + '_' + (k + 1)]
          if (r1 !== undefined) addE(a, r1, 3)
          if (r2 !== undefined) addE(a, r2, 3)
          if (r3 !== undefined) addE(a, r3, 3)
        }
      }
    }
    const topIdx = []
    for (let i = oreStart; i < oreEnd; i++) {
      if (nodes[i * 3 + 1] > ocy + 0.02) topIdx.push(i)
    }

    // ── dust — the market on the wind above, slow currents below ──
    const NFA = 78
    const NFD = 46
    const dustStart = nodeGroup.length
    for (let i = 0; i < NFA + NFD; i++) {
      const above = i < NFA
      const aa = Math.random() * Math.PI * 2
      const rr = Math.sqrt(Math.random()) * (above ? 0.92 : 0.78)
      addN(
        RX * rr * Math.cos(aa),
        above ? 0.05 + Math.random() * 0.55 : -0.72 + Math.random() * 0.6,
        RZ * rr * Math.sin(aa),
        4
      )
    }

    const N = nodeGroup.length
    const E = edges.length / 2
    const DN = dash.length / 7
    const RING_SEGS = 36
    const TRAIL_MAX = 14
    const TRAIL_SEGS = TRAIL_MAX - 1

    const home = new Float32Array(nodes)
    const pos = new Float32Array(nodes)
    const vel = new Float32Array(N * 3)
    const melt = new Float32Array(N)
    const rand = new Float32Array(N)
    const free = new Float32Array(N)
    const fade = new Float32Array(N)
    const mode = new Uint8Array(N)
    const aloftUntil = new Float32Array(N)
    const group = new Uint8Array(nodeGroup)
    for (let i = 0; i < N; i++) rand[i] = Math.random()
    for (let i = dustStart; i < N; i++) {
      free[i] = 1
      melt[i] = 1
      mode[i] = 2
    }
    // Everything assembles out of a scattered start.
    for (let i = 0; i < dustStart; i++) {
      pos[i * 3] = home[i * 3] + (Math.random() - 0.5) * 0.3
      pos[i * 3 + 1] = home[i * 3 + 1] - 0.25 - Math.random() * 0.35
      pos[i * 3 + 2] = home[i * 3 + 2] + (Math.random() - 0.5) * 0.3
    }

    const mkBuf = (data, dyn) => {
      const b = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, b)
      gl.bufferData(gl.ARRAY_BUFFER, data, dyn ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW)
      return b
    }
    const drawPos = new Float32Array(N * 3)
    const posBuf = mkBuf(drawPos, true)
    const meltBuf = mkBuf(melt, true)
    const fadeBuf = mkBuf(fade, true)
    const randBuf = mkBuf(rand, false)
    const freeBuf = mkBuf(free, false)
    const LE = E + DN + RING_SEGS + TRAIL_SEGS
    const linePos = new Float32Array(LE * 6)
    const lineAl = new Float32Array(LE * 2)
    const linePosBuf = mkBuf(linePos, true)
    const lineAlBuf = mkBuf(lineAl, true)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0, 0, 0, 0)

    let reduced = false
    try { reduced = win.matchMedia('(prefers-reduced-motion: reduce)').matches } catch (e) {}

    el.scope.hc = {
      gl, pointProg, lineProg,
      RX, RZ, CAM_DIST, N, E, DN, LE, RING_SEGS, TRAIL_SEGS,
      edges, edgeGroup, dash, topIdx, oreStart, oreEnd, dustStart,
      ocx, ocy, ocz, NFA,
      home, pos, vel, melt, rand, free, fade, mode, aloftUntil, group,
      drawPos, posBuf, meltBuf, fadeBuf, randBuf, freeBuf,
      linePos, lineAl, linePosBuf, lineAlBuf,
      m0: new Float32Array(16),
      m1: new Float32Array(16),
      m2: new Float32Array(16),
      uP: {
        mvp: gl.getUniformLocation(pointProg, 'mvp'),
        dpr: gl.getUniformLocation(pointProg, 'dpr'),
        colA: gl.getUniformLocation(pointProg, 'colA'),
        colB: gl.getUniformLocation(pointProg, 'colB'),
        alBase: gl.getUniformLocation(pointProg, 'alBase')
      },
      aP: {
        p: gl.getAttribLocation(pointProg, 'p'),
        r: gl.getAttribLocation(pointProg, 'r'),
        m: gl.getAttribLocation(pointProg, 'm'),
        f: gl.getAttribLocation(pointProg, 'f'),
        g: gl.getAttribLocation(pointProg, 'g')
      },
      uL: {
        mvp: gl.getUniformLocation(lineProg, 'mvp'),
        colL: gl.getUniformLocation(lineProg, 'colL')
      },
      aL: {
        p: gl.getAttribLocation(lineProg, 'p'),
        a: gl.getAttribLocation(lineProg, 'a')
      },
      t0: win.performance ? win.performance.now() : 0,
      reduced,
      win,
      wf: 0,
      extracted: 0,
      extractCap: Math.round(topIdx.length * 0.34),
      extractAcc: 0,
      ringAt: -1e9,
      ringX: 0,
      ringY: 0,
      seenClick: 0,
      trail: []
    }
    s.update({ webglOk: true }, { preventFetch: true })
  },

  onFrame: (el) => {
    const H = el.scope.hc
    if (!H || !el.node) return
    const gl = H.gl
    const win = H.win
    try {
      const dpr = Math.min(2, (win && win.devicePixelRatio) || 1)
      const w = Math.round(el.node.clientWidth * dpr)
      const h = Math.round(el.node.clientHeight * dpr)
      if (w < 2 || h < 2) return
      if (el.node.width !== w || el.node.height !== h) {
        el.node.width = w
        el.node.height = h
        gl.viewport(0, 0, w, h)
      }
      const aspect = w / h
      const now = win.performance ? win.performance.now() : 0
      const t = (now - H.t0) / 1000
      const intro = H.reduced ? 1 : Math.min(1, t / 1.6)
      const introEase = 1 - Math.pow(1 - intro, 3)
      const gate = introEase * introEase

      // ── camera: the switcher dives it below the plane; cursor tilts it ──
      const under = el.state && el.state.world === 'under'
      H.wf += ((under ? 1 : 0) - H.wf) * 0.05
      const wf = H.wf
      const rect = el.node.getBoundingClientRect()
      const sxp = ((el.scope.cxr === undefined ? -1e4 : el.scope.cxr) - rect.left) / Math.max(1, rect.height)
      const syp = ((el.scope.cyr === undefined ? -1e4 : el.scope.cyr) - rect.top) / Math.max(1, rect.height)
      const pOn = sxp > -0.2 && sxp < aspect + 0.2 && syp > -0.2 && syp < 1.2
      const mTiltX = pOn ? (syp - 0.5) * 0.1 : 0
      const mTiltY = pOn ? (sxp / aspect - 0.5) * 0.16 : 0
      const scroll = Math.max(0, Math.min(1.5, (el.node.ownerDocument.documentElement.scrollTop || 0) / Math.max(1, win.innerHeight)))

      // The world sways rather than spins — the city keeps to the far arc,
      // the cursor steers a few degrees more.
      const yaw = Math.sin(t * 0.045) * 0.2 + mTiltY
      const eyeY = 0.3 - wf * 1.0 + mTiltX * 0.5 - scroll * 0.18
      const tgtY = 0.04 - wf * 0.36
      const eyeD = H.CAM_DIST - wf * 0.18
      const ex = Math.sin(yaw) * eyeD
      const ez = Math.cos(yaw) * eyeD
      const ey = eyeY

      // Column-major perspective · lookAt, multiplied on the CPU.
      const mpersp = (o, fovy, asp, n, f) => {
        const ft = 1 / Math.tan(fovy / 2)
        o[0] = ft / asp; o[1] = 0; o[2] = 0; o[3] = 0
        o[4] = 0; o[5] = ft; o[6] = 0; o[7] = 0
        o[8] = 0; o[9] = 0; o[10] = (f + n) / (n - f); o[11] = -1
        o[12] = 0; o[13] = 0; o[14] = (2 * f * n) / (n - f); o[15] = 0
      }
      const mlook = (o, exv, eyv, ezv, txv, tyv, tzv) => {
        let zx = exv - txv; let zy = eyv - tyv; let zz = ezv - tzv
        const zl = Math.hypot(zx, zy, zz) || 1
        zx /= zl; zy /= zl; zz /= zl
        let xx = zz; let xy = 0; let xz = -zx
        const xl = Math.hypot(xx, xy, xz) || 1
        xx /= xl; xy /= xl; xz /= xl
        const yx = zy * xz - zz * xy
        const yy = zz * xx - zx * xz
        const yz = zx * xy - zy * xx
        o[0] = xx; o[1] = yx; o[2] = zx; o[3] = 0
        o[4] = xy; o[5] = yy; o[6] = zy; o[7] = 0
        o[8] = xz; o[9] = yz; o[10] = zz; o[11] = 0
        o[12] = -(xx * exv + xy * eyv + xz * ezv)
        o[13] = -(yx * exv + yy * eyv + yz * ezv)
        o[14] = -(zx * exv + zy * eyv + zz * ezv)
        o[15] = 1
      }
      const mmul = (o, a, b) => {
        for (let c = 0; c < 4; c++) {
          for (let r = 0; r < 4; r++) {
            o[c * 4 + r] =
              a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] +
              a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3]
          }
        }
      }
      const P = H.m0
      const V = H.m1
      const M = H.m2
      mpersp(P, 0.62, aspect, 0.2, 7)
      mlook(V, ex, ey, ez, 0, tgtY, 0)
      mmul(M, P, V)

      // Project a world point to screen (height units) for interactions.
      const project = (x, y, z) => {
        const wv = M[3] * x + M[7] * y + M[11] * z + M[15]
        if (wv < 0.05) return null
        const px = (M[0] * x + M[4] * y + M[8] * z + M[12]) / wv
        const py = (M[1] * x + M[5] * y + M[9] * z + M[13]) / wv
        return [(px + 1) / 2 * aspect, (1 - py) / 2]
      }

      if (el.scope.clickStart && el.scope.clickStart !== H.seenClick) {
        H.seenClick = el.scope.clickStart
        H.ringAt = now
        H.ringX = sxp
        H.ringY = syp
      }
      const ringAge = (now - H.ringAt) / 1000
      const ringOn = ringAge > 0 && ringAge < 1.4
      const ringR = ringAge * 0.62

      const { N, E, DN, RING_SEGS, TRAIL_SEGS, home, pos, vel, melt, rand, mode, aloftUntil, drawPos, group, fade, topIdx, dustStart, oreStart, oreEnd } = H
      const aboveFade = 1 - 0.9 * wf
      const underFade = 0.3 + 0.7 * wf
      const scrollFade = 1 - 0.5 * Math.min(1, scroll * 1.1)
      const colSway = Math.sin(t * 0.8) * 0.014

      // Slipstream breadcrumbs (screen space, both worlds).
      if (!H.reduced) {
        const inside = sxp > -0.05 && sxp < aspect + 0.05 && syp > 0.02 && syp < 0.98
        if (inside) {
          const last = H.trail[H.trail.length - 1]
          const dxT = last ? sxp - last.x : 1
          const dyT = last ? syp - last.y : 1
          if (!last || dxT * dxT + dyT * dyT > 0.00003) {
            H.trail.push({ x: sxp, y: syp, t })
            if (H.trail.length > 14) H.trail.shift()
          }
        } else if (H.trail.length) {
          H.trail.shift()
        }
      }

      // Extraction feed: ambient pulls off the ore crown; the cursor drills
      // when the world is under and it hovers the body.
      if (!H.reduced && intro >= 1) {
        H.extractAcc += 1
        if (H.extractAcc >= 6 && H.extracted < H.extractCap) {
          H.extractAcc = 0
          const cand = topIdx[(Math.random() * topIdx.length) | 0]
          if (mode[cand] === 0 && melt[cand] < 0.15) {
            mode[cand] = 1
            H.extracted++
          }
        }
        if (under && pOn && H.extracted < H.extractCap + 5) {
          let drilled = 0
          for (let d = 0; d < 4; d++) {
            const i = oreStart + ((Math.random() * (oreEnd - oreStart)) | 0)
            if (mode[i] !== 0) continue
            const sp = project(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2])
            if (!sp) continue
            const dxm = sp[0] - sxp
            const dym = sp[1] - syp
            if (dxm * dxm + dym * dym < 0.008 && drilled < 2) {
              mode[i] = 1
              H.extracted++
              drilled++
            }
          }
        }
      }

      for (let i = 0; i < N; i++) {
        const ix = i * 3
        const iy = ix + 1
        const iz = ix + 2
        const g = group[i]
        const isOre = g === 3
        const isDust = g === 4
        let px = pos[ix]
        let py = pos[iy]
        let pz = pos[iz]

        if (isDust) {
          const above = home[iy] > 0
          if (!H.reduced) {
            let vx = vel[ix]; let vy = vel[iy]; let vz = vel[iz]
            vx += Math.sin(py * 5.1 + t * (above ? 0.5 : 0.2) + rand[i] * 6) * 0.00055
            vy += Math.cos(px * 3.7 + t * 0.4) * (above ? 0.00028 : 0.00014)
            vz += Math.sin(px * 2.9 - t * (above ? 0.34 : 0.16)) * 0.0004
            if (above) {
              if (py < 0.05) vy += 0.0007
              if (py > 0.62) vy -= 0.0007
            } else {
              if (py > -0.1) vy -= 0.0006
              if (py < -0.74) vy += 0.0006
            }
            const rr = Math.hypot(px / H.RX, pz / H.RZ)
            if (rr > 0.95) { vx -= (px / H.RX) * 0.0009; vz -= (pz / H.RZ) * 0.0009 }
            // The cursor is wind: repel dust near it in screen space.
            if (pOn && (above ? wf < 0.6 : wf > 0.4)) {
              const sp = project(px, py, pz)
              if (sp) {
                const dxm = sp[0] - sxp
                const dym = sp[1] - syp
                const d2 = dxm * dxm + dym * dym
                if (d2 < 0.016 && d2 > 1e-6) {
                  const dd = Math.sqrt(d2)
                  const f = (1 - dd / 0.1265) * 0.0022
                  vx += dxm / dd * f
                  vy -= dym / dd * f
                }
              }
            }
            vx *= 0.92; vy *= 0.92; vz *= 0.92
            px += vx; py += vy; pz += vz
            vel[ix] = vx; vel[iy] = vy; vel[iz] = vz
          }
          fade[i] = (above ? aboveFade : underFade) * scrollFade
        } else if (isOre) {
          const md = mode[i]
          const hx = home[ix] + Math.sin(t * 0.4 + rand[i] * 9) * 0.003
          const hy = home[iy] + Math.cos(t * 0.31 + rand[i] * 7) * 0.003
          const hz = home[iz]
          const mTarget = md === 0 ? 0 : 1
          const m0v = melt[i]
          melt[i] = m0v + (mTarget - m0v) * (mTarget > m0v ? 0.14 : 0.06)
          if (H.reduced) {
            px = hx; py = hy; pz = hz
            vel[ix] = 0; vel[iy] = 0; vel[iz] = 0
          } else {
            let vx = vel[ix]; let vy = vel[iy]; let vz = vel[iz]
            if (md === 0) {
              const k = 0.09 + introEase * 0.07
              vx += (hx - px) * k
              vy += (hy - py) * k
              vz += (hz - pz) * k
            } else if (md === 1) {
              vx += (H.ocx + colSway + Math.sin(t * 5 + rand[i] * 12) * 0.008 - px) * 0.02
              vz += (H.ocz - pz) * 0.02
              vy += 0.0007
              if (py > 0.14) {
                mode[i] = 2
                vy *= 0.35
                vx += (rand[i] - 0.5) * 0.02
                aloftUntil[i] = t + 2.5 + rand[i] * 3.5
              }
            } else if (md === 2) {
              vx += Math.sin(py * 6.2 + t * 0.55) * 0.0007
              vy += Math.cos(px * 4.2 + t * 0.5) * 0.0003
              vz += Math.sin(px * 3.1 - t * 0.3) * 0.0004
              if (py > 0.55) vy -= 0.0009
              if (py < 0.1) vy += 0.0007
              const rr = Math.hypot(px / H.RX, pz / H.RZ)
              if (rr > 0.9) { vx -= (px / H.RX) * 0.001; vz -= (pz / H.RZ) * 0.001 }
              if (t > aloftUntil[i]) mode[i] = 3
            } else {
              vy -= 0.0006
              vx += (hx - px) * 0.014
              vz += (hz - pz) * 0.014
              if (py < hy + 0.02 && Math.abs(px - hx) < 0.03) {
                mode[i] = 0
                H.extracted--
                vx *= 0.3; vy *= 0.3; vz *= 0.3
              }
            }
            if (ringOn && (md === 2 || md === 3)) {
              const sp = project(px, py, pz)
              if (sp) {
                const dr = Math.hypot(sp[0] - H.ringX, sp[1] - H.ringY)
                if (Math.abs(dr - ringR) < 0.06) {
                  mode[i] = 3
                  vy -= 0.002
                }
              }
            }
            vx *= 0.9; vy *= 0.9; vz *= 0.9
            px += vx; py += vy; pz += vz
            vel[ix] = vx; vel[iy] = vy; vel[iz] = vz
          }
          fade[i] = (melt[i] > 0.5 ? 1 : underFade + (1 - underFade) * 0.35) * scrollFade
        } else {
          // Rigid constellations: settle home on intro, then breathe.
          const bx = Math.sin(t * 0.5 + rand[i] * 11) * 0.0035
          const by = Math.cos(t * 0.42 + rand[i] * 8) * 0.0035
          if (H.reduced || intro >= 1) {
            px = home[ix] + bx
            py = home[iy] + by
            pz = home[iz]
          } else {
            px += (home[ix] + bx - px) * (0.05 + introEase * 0.1)
            py += (home[iy] + by - py) * (0.05 + introEase * 0.1)
            pz += (home[iz] - pz) * (0.05 + introEase * 0.1)
          }
          fade[i] = (g === 1 ? aboveFade : g === 2 ? underFade : 1) * scrollFade
        }
        pos[ix] = px; pos[iy] = py; pos[iz] = pz
        drawPos[ix] = px; drawPos[iy] = py; drawPos[iz] = pz
      }

      // ── line buffers: web + constellations, dashes, overlay ──
      const { edges, edgeGroup, dash, linePos, lineAl } = H
      for (let e = 0; e < E; e++) {
        const a = edges[e * 2]
        const b = edges[e * 2 + 1]
        const o = e * 6
        linePos[o] = drawPos[a * 3]
        linePos[o + 1] = drawPos[a * 3 + 1]
        linePos[o + 2] = drawPos[a * 3 + 2]
        linePos[o + 3] = drawPos[b * 3]
        linePos[o + 4] = drawPos[b * 3 + 1]
        linePos[o + 5] = drawPos[b * 3 + 2]
        const eg = edgeGroup[e]
        let al
        if (eg === 3) {
          al = (1 - melt[a]) * (1 - melt[b]) * 0.62 *
            (0.82 + 0.18 * Math.sin(t * 0.6 + (home[a * 3] + home[a * 3 + 1]) * 9)) *
            (underFade + (1 - underFade) * 0.3)
        } else if (eg === 0) {
          al = 0.34 * (0.8 + 0.2 * Math.sin(t * 0.5 + a * 0.7))
        } else if (eg === 1) {
          al = 0.5 * aboveFade
        } else if (eg === 7) {
          al = 0.26 * underFade
        } else {
          al = 0.56 * underFade
        }
        al *= gate * scrollFade
        lineAl[e * 2] = al
        lineAl[e * 2 + 1] = al
      }
      for (let dIx = 0; dIx < DN; dIx++) {
        const so = dIx * 7
        const o = (E + dIx) * 6
        linePos[o] = dash[so]
        linePos[o + 1] = dash[so + 1]
        linePos[o + 2] = dash[so + 2]
        linePos[o + 3] = dash[so + 3]
        linePos[o + 4] = dash[so + 4]
        linePos[o + 5] = dash[so + 5]
        const g = dash[so + 6]
        const al = (g === 5 ? 0.34 : 0.24 * underFade) * gate * scrollFade
        lineAl[(E + dIx) * 2] = al
        lineAl[(E + dIx) * 2 + 1] = al
      }

      // Settlement ring — expanding diamond outline, screen space.
      const ringBase = (E + DN) * 6
      const ringAlBase = (E + DN) * 2
      const ringFade = ringOn ? (1 - ringAge / 1.4) * 0.5 * gate : 0
      const rr2 = ringR + 0.02
      for (let k = 0; k < RING_SEGS; k++) {
        const o = ringBase + k * 6
        if (!ringFade) {
          linePos[o] = linePos[o + 1] = linePos[o + 2] = 0
          linePos[o + 3] = linePos[o + 4] = linePos[o + 5] = 0
          lineAl[ringAlBase + k * 2] = 0
          lineAl[ringAlBase + k * 2 + 1] = 0
          continue
        }
        const a0 = (k / RING_SEGS) * Math.PI * 2
        const a1 = ((k + 1) / RING_SEGS) * Math.PI * 2
        const c0 = Math.cos(a0); const s0 = Math.sin(a0)
        const c1 = Math.cos(a1); const s1 = Math.sin(a1)
        const n0 = Math.abs(c0) + Math.abs(s0)
        const n1 = Math.abs(c1) + Math.abs(s1)
        linePos[o] = H.ringX + (c0 / n0) * rr2
        linePos[o + 1] = H.ringY + (s0 / n0) * rr2
        linePos[o + 2] = 0
        linePos[o + 3] = H.ringX + (c1 / n1) * rr2
        linePos[o + 4] = H.ringY + (s1 / n1) * rr2
        linePos[o + 5] = 0
        lineAl[ringAlBase + k * 2] = ringFade
        lineAl[ringAlBase + k * 2 + 1] = ringFade
      }

      // Slipstream — newest brightest, screen space.
      const trailBase = (E + DN + RING_SEGS) * 6
      const trailAlBase = (E + DN + RING_SEGS) * 2
      for (let k = 0; k < TRAIL_SEGS; k++) {
        const o = trailBase + k * 6
        const p0t = H.trail[k]
        const p1t = H.trail[k + 1]
        let al = 0
        if (p0t && p1t) {
          const seg = (p1t.x - p0t.x) * (p1t.x - p0t.x) + (p1t.y - p0t.y) * (p1t.y - p0t.y)
          const age = t - p1t.t
          if (seg < 0.02 && age < 0.9) {
            al = (1 - age / 0.9) * ((k + 1) / TRAIL_SEGS) * 0.3 * gate
          }
          linePos[o] = p0t.x
          linePos[o + 1] = p0t.y
          linePos[o + 2] = 0
          linePos[o + 3] = p1t.x
          linePos[o + 4] = p1t.y
          linePos[o + 5] = 0
        } else {
          linePos[o] = linePos[o + 1] = linePos[o + 2] = 0
          linePos[o + 3] = linePos[o + 4] = linePos[o + 5] = 0
        }
        lineAl[trailAlBase + k * 2] = al
        lineAl[trailAlBase + k * 2 + 1] = al
      }

      // Palette: page theme above ground, inverted at depth, blended by wf.
      const dark = el.node.ownerDocument.documentElement.getAttribute('data-theme') === 'dark'
      const mixc = (a, b) => a + (b - a) * wf
      let A, B, L, alB
      if (dark) {
        A = [0.659, 0.753, 0.812]
        B = [0.45, 0.58, 0.68]
        L = [0.659, 0.753, 0.812]
        alB = 0.62 + 0.08 * wf
      } else {
        A = [mixc(0.031, 0.94), mixc(0.141, 0.95), mixc(0.224, 0.93)]
        B = [mixc(0.376, 0.659), mixc(0.49, 0.753), mixc(0.58, 0.812)]
        L = [mixc(0.376, 0.659), mixc(0.49, 0.753), mixc(0.58, 0.812)]
        alB = 0.63 + 0.06 * wf
      }
      gl.clear(gl.COLOR_BUFFER_BIT)

      // Screen-ortho for the overlay slice: x∈[0,aspect]→[-1,1], y∈[0,1]→[1,-1].
      const S = H.m0
      S.fill(0)
      S[0] = 2 / aspect
      S[5] = -2
      S[10] = 0.0001
      S[12] = -1
      S[13] = 1
      S[15] = 1

      gl.useProgram(H.lineProg)
      gl.uniform3f(H.uL.colL, L[0], L[1], L[2])
      if (H.aP.m >= 0) gl.disableVertexAttribArray(H.aP.m)
      if (H.aP.r >= 0) gl.disableVertexAttribArray(H.aP.r)
      if (H.aP.f >= 0) gl.disableVertexAttribArray(H.aP.f)
      if (H.aP.g >= 0) gl.disableVertexAttribArray(H.aP.g)
      gl.bindBuffer(gl.ARRAY_BUFFER, H.linePosBuf)
      gl.bufferData(gl.ARRAY_BUFFER, linePos, gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(H.aL.p)
      gl.vertexAttribPointer(H.aL.p, 3, gl.FLOAT, false, 0, 0)
      gl.bindBuffer(gl.ARRAY_BUFFER, H.lineAlBuf)
      gl.bufferData(gl.ARRAY_BUFFER, lineAl, gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(H.aL.a)
      gl.vertexAttribPointer(H.aL.a, 1, gl.FLOAT, false, 0, 0)
      gl.lineWidth(1)
      gl.uniformMatrix4fv(H.uL.mvp, false, M)
      gl.drawArrays(gl.LINES, 0, (E + DN) * 2)
      gl.uniformMatrix4fv(H.uL.mvp, false, S)
      gl.drawArrays(gl.LINES, (E + DN) * 2, (RING_SEGS + TRAIL_SEGS) * 2)

      gl.useProgram(H.pointProg)
      gl.uniformMatrix4fv(H.uP.mvp, false, M)
      gl.uniform1f(H.uP.dpr, dpr)
      gl.uniform3f(H.uP.colA, A[0], A[1], A[2])
      gl.uniform3f(H.uP.colB, B[0], B[1], B[2])
      gl.uniform1f(H.uP.alBase, alB * gate)
      if (H.aL.a >= 0 && H.aL.a !== H.aP.r && H.aL.a !== H.aP.m && H.aL.a !== H.aP.f && H.aL.a !== H.aP.g) gl.disableVertexAttribArray(H.aL.a)
      gl.bindBuffer(gl.ARRAY_BUFFER, H.posBuf)
      gl.bufferData(gl.ARRAY_BUFFER, drawPos, gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(H.aP.p)
      gl.vertexAttribPointer(H.aP.p, 3, gl.FLOAT, false, 0, 0)
      gl.bindBuffer(gl.ARRAY_BUFFER, H.meltBuf)
      gl.bufferData(gl.ARRAY_BUFFER, melt, gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(H.aP.m)
      gl.vertexAttribPointer(H.aP.m, 1, gl.FLOAT, false, 0, 0)
      gl.bindBuffer(gl.ARRAY_BUFFER, H.fadeBuf)
      gl.bufferData(gl.ARRAY_BUFFER, fade, gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(H.aP.g)
      gl.vertexAttribPointer(H.aP.g, 1, gl.FLOAT, false, 0, 0)
      gl.bindBuffer(gl.ARRAY_BUFFER, H.randBuf)
      gl.enableVertexAttribArray(H.aP.r)
      gl.vertexAttribPointer(H.aP.r, 1, gl.FLOAT, false, 0, 0)
      gl.bindBuffer(gl.ARRAY_BUFFER, H.freeBuf)
      gl.enableVertexAttribArray(H.aP.f)
      gl.vertexAttribPointer(H.aP.f, 1, gl.FLOAT, false, 0, 0)
      gl.drawArrays(gl.POINTS, 0, N)
    } catch (e) {}
  },

  onRemove: (el) => {
    el.scope.hc = null
  }
}
