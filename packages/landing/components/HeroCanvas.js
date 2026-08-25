// The hero's WebGL — a living cross-section of the earth, after the
// underground / above-ground idea from the product's first life (aurc.app).
//
// Below the dashed horizon sits the asset: an ore body drawn as a value
// diamond — a triangular particle lattice joined by hairline edges, resting
// among faint strata. Above the horizon is the market: liquid particles
// drifting on the wind. Between them runs the whole business, on loop:
// particles are extracted from the deposit, rise in a swaying column, clear
// the horizon, live above ground as liquid, then settle back down and
// re-crystallize into the lattice. The cursor drills below ground (touching
// the deposit frees fractions) and is wind above it; a click is a
// settlement ring that hurries the airborne home. On load the ore body
// assembles upward out of the deep.
//
// Raw WebGL1, two passes (GL_LINES: lattice edges + strata dashes, under
// diamond point sprites). Attribute slots are global GL state, so each pass
// disables the other's arrays. JS integration, ~450 particles. All browser
// handles go through el.node.ownerDocument; the loop rides the framework's
// onFrame tick; reduced motion renders the deposit frozen with no
// circulation; no WebGL → the Hero's ghost mark shows instead (gated by the
// webglOk state this component sets).
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
      'attribute vec2 p;attribute float r;attribute float m;attribute float f;' +
      'uniform vec2 scale;uniform float dpr;varying float vR;varying float vM;varying float vF;' +
      'void main(){' +
      'vec2 q=vec2(p.x*scale.x*2.0-1.0,1.0-p.y*2.0);' +
      'gl_Position=vec4(q,0.0,1.0);' +
      'gl_PointSize=(2.1+1.9*r)*(1.0+0.5*m)*dpr;' +
      'vR=r;vM=m;vF=f;}',
      'precision mediump float;varying float vR;varying float vM;varying float vF;' +
      'uniform vec3 colA;uniform vec3 colB;uniform float alBase;' +
      'void main(){' +
      'vec2 q=gl_PointCoord*2.0-1.0;' +
      'float d=abs(q.x)+abs(q.y);' +
      'if(d>1.0)discard;' +
      'float soft=0.62-0.22*vM;' +
      'float edge=1.0-smoothstep(soft,1.0,d);' +
      'vec3 col=mix(colA,colB,vM);' +
      'float a=(alBase*(0.55+0.45*vR)+0.2*vM)*edge;' +
      'a*=mix(1.0,0.3,vF);' +
      'gl_FragColor=vec4(col*a,a);}'
    )
    const lineProg = link(
      'attribute vec2 p;attribute float a;' +
      'uniform vec2 scale;varying float vA;' +
      'void main(){' +
      'vec2 q=vec2(p.x*scale.x*2.0-1.0,1.0-p.y*2.0);' +
      'gl_Position=vec4(q,0.0,1.0);vA=a;}',
      'precision mediump float;varying float vA;uniform vec3 colL;' +
      'void main(){gl_FragColor=vec4(colL*vA,vA);}'
    )
    if (!pointProg || !lineProg) return

    // ── world constants (height units; x runs 0..aspect) ──
    const HZ = 0.6           // the horizon
    const R = 0.24           // ore-body half-diagonal
    const STEP = R / 12
    const vsp = STEP * 0.866

    // ── the deposit: triangular lattice clipped to the L1 diamond ──
    const homes = []
    const index = {}
    const topIdx = []
    let n = 0
    for (let row = -30; row <= 30; row++) {
      for (let col = -30; col <= 30; col++) {
        const hx = col * STEP + (((row % 2) + 2) % 2) * STEP * 0.5
        const hy = row * vsp
        if (Math.abs(hx) + Math.abs(hy) > R) continue
        index[row + '_' + col] = n
        homes.push(hx, hy)
        if (hy < -R * 0.3) topIdx.push(n)
        n++
      }
    }
    const edges = []
    for (let row = -30; row <= 30; row++) {
      for (let col = -30; col <= 30; col++) {
        const a = index[row + '_' + col]
        if (a === undefined) continue
        const right = index[row + '_' + (col + 1)]
        const even = ((row % 2) + 2) % 2 === 0
        const dl = index[(row + 1) + '_' + (even ? col - 1 : col)]
        const dr = index[(row + 1) + '_' + (even ? col : col + 1)]
        if (right !== undefined) edges.push(a, right)
        if (dl !== undefined) edges.push(a, dl)
        if (dr !== undefined) edges.push(a, dr)
      }
    }
    const NC = n
    const NF = 90
    const N = NC + NF
    const E = edges.length / 2

    // ── strata: dashed horizontal beds under the horizon ──
    const strata = []
    for (let k = 1; k <= 3; k++) {
      const y = HZ + 0.11 * k + 0.012 * (k % 2)
      for (let x = 0.05; x < 2.6; x += 0.085) {
        strata.push(x, y, x + 0.05, y, k)
      }
    }
    const SN = strata.length / 5

    const home = new Float32Array(N * 2)
    home.set(homes)
    const pos = new Float32Array(N * 2)
    const vel = new Float32Array(N * 2)
    const melt = new Float32Array(N)
    const rand = new Float32Array(N)
    const free = new Float32Array(N)
    const mode = new Uint8Array(N)        // 0 crystal · 1 rising · 2 aloft · 3 returning
    const aloftUntil = new Float32Array(N)
    for (let i = 0; i < N; i++) rand[i] = Math.random()
    for (let i = NC; i < N; i++) {
      free[i] = 1
      melt[i] = 1
      mode[i] = 2
      home[i * 2] = Math.random() * 2.4
      home[i * 2 + 1] = Math.random() * (HZ - 0.06)
      pos[i * 2] = home[i * 2]
      pos[i * 2 + 1] = home[i * 2 + 1]
    }
    // Assembly: the ore body rises out of the deep.
    for (let i = 0; i < NC; i++) {
      pos[i * 2] = home[i * 2] + (Math.random() - 0.5) * 0.16
      pos[i * 2 + 1] = home[i * 2 + 1] + 0.22 + Math.random() * 0.38
    }

    const mkBuf = (data, dyn) => {
      const b = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, b)
      gl.bufferData(gl.ARRAY_BUFFER, data, dyn ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW)
      return b
    }
    const drawPos = new Float32Array(N * 2)
    const posBuf = mkBuf(drawPos, true)
    const meltBuf = mkBuf(melt, true)
    const randBuf = mkBuf(rand, false)
    const freeBuf = mkBuf(free, false)
    const LE = E + SN
    const linePos = new Float32Array(LE * 4)
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
      HZ, R, NC, NF, N, E, SN, LE, edges, strata, topIdx,
      home, pos, vel, melt, rand, mode, aloftUntil,
      drawPos, posBuf, meltBuf, randBuf, freeBuf,
      linePos, lineAl, linePosBuf, lineAlBuf,
      uP: {
        scale: gl.getUniformLocation(pointProg, 'scale'),
        dpr: gl.getUniformLocation(pointProg, 'dpr'),
        colA: gl.getUniformLocation(pointProg, 'colA'),
        colB: gl.getUniformLocation(pointProg, 'colB'),
        alBase: gl.getUniformLocation(pointProg, 'alBase')
      },
      aP: {
        p: gl.getAttribLocation(pointProg, 'p'),
        r: gl.getAttribLocation(pointProg, 'r'),
        m: gl.getAttribLocation(pointProg, 'm'),
        f: gl.getAttribLocation(pointProg, 'f')
      },
      uL: {
        scale: gl.getUniformLocation(lineProg, 'scale'),
        colL: gl.getUniformLocation(lineProg, 'colL')
      },
      aL: {
        p: gl.getAttribLocation(lineProg, 'p'),
        a: gl.getAttribLocation(lineProg, 'a')
      },
      t0: win.performance ? win.performance.now() : 0,
      reduced,
      win,
      extracted: 0,
      extractCap: Math.round(NC * 0.18),
      extractAcc: 0,
      ringAt: -1e9,
      ringX: 0,
      ringY: 0,
      seenClick: 0
    }
    // The cross-section carries the identity now — retire the static ghost.
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
      const intro = H.reduced ? 1 : Math.min(1, t / 1.5)
      const introEase = 1 - Math.pow(1 - intro, 3)

      const HZ = H.HZ
      const cx = aspect * 0.74
      const cy = HZ + H.R + 0.05

      const rect = el.node.getBoundingClientRect()
      const mx = ((el.scope.cxr === undefined ? -1e4 : el.scope.cxr) - rect.left) / Math.max(1, rect.height)
      const my = ((el.scope.cyr === undefined ? -1e4 : el.scope.cyr) - rect.top) / Math.max(1, rect.height)

      if (el.scope.clickStart && el.scope.clickStart !== H.seenClick) {
        H.seenClick = el.scope.clickStart
        H.ringAt = now
        H.ringX = mx
        H.ringY = my
      }
      const ringAge = (now - H.ringAt) / 1000
      const ringOn = ringAge > 0 && ringAge < 1.4
      const ringR = ringAge * 0.9

      const scroll = Math.max(0, Math.min(1.5, (el.node.ownerDocument.documentElement.scrollTop || 0) / Math.max(1, win.innerHeight)))
      const breatheX = Math.sin(t * 0.4) * 0.003
      const breatheY = Math.cos(t * 0.31) * 0.003

      const { NC, N, pos, vel, home, melt, rand, mode, aloftUntil, drawPos, topIdx } = H
      const colSway = Math.sin(t * 0.8) * 0.014

      // ── extraction scheduler: a steady trickle off the top of the deposit ──
      if (!H.reduced && intro >= 1) {
        H.extractAcc += 1
        if (H.extractAcc >= 5 && H.extracted < H.extractCap) {
          H.extractAcc = 0
          const cand = topIdx[(Math.random() * topIdx.length) | 0]
          if (mode[cand] === 0 && melt[cand] < 0.15) {
            mode[cand] = 1
            H.extracted++
          }
        }
        // The cursor is a drill: touching the deposit frees fractions.
        if (my > HZ && H.extracted < H.extractCap + 6) {
          let drilled = 0
          for (let d = 0; d < 3; d++) {
            const i = (Math.random() * NC) | 0
            if (mode[i] !== 0) continue
            const wx = cx + home[i * 2]
            const wy = cy + home[i * 2 + 1]
            const dxm = wx - mx
            const dym = wy - my
            if (dxm * dxm + dym * dym < 0.012 && drilled < 2) {
              mode[i] = 1
              H.extracted++
              drilled++
            }
          }
        }
      }

      for (let i = 0; i < N; i++) {
        const ix = i * 2
        const iy = ix + 1
        const isFree = i >= NC
        let px = pos[ix]
        let py = pos[iy]
        const md = isFree ? 2 : mode[i]
        const hwx = isFree ? home[ix] : cx + home[ix] + breatheX
        const hwy = isFree ? home[iy] : cy + home[iy] + breatheY

        // Melt follows the journey: airborne fractions are liquid.
        const mTarget = md === 0 ? 0 : 1
        const m0 = melt[i]
        melt[i] = isFree ? 1 : m0 + (mTarget - m0) * (mTarget > m0 ? 0.14 : 0.06)
        const m = melt[i]

        if (H.reduced && !isFree) {
          px = hwx
          py = hwy
          vel[ix] = 0
          vel[iy] = 0
        } else {
          let vx = vel[ix]
          let vy = vel[iy]
          if (md === 0) {
            // Seated in the lattice.
            const k = 0.1 + introEase * 0.06
            vx += (hwx - px) * k
            vy += (hwy - py) * k
          } else if (md === 1) {
            // Rising toward the surface in the swaying column.
            const colX = cx + colSway + Math.sin(t * 5 + rand[i] * 12) * 0.008
            vx += (colX - px) * 0.02
            vy -= 0.00062
            if (py < HZ - 0.005) {
              mode[i] = 2
              vy *= 0.35
              vx += (rand[i] - 0.5) * 0.02
              aloftUntil[i] = t + 2.5 + rand[i] * 3.5
            }
          } else if (md === 2) {
            // Aloft: the market wind. Free drifters live here forever.
            const wind = Math.sin(py * 6.2 + t * 0.55) + 0.5 * Math.sin(py * 2.6 - t * 0.35)
            vx += wind * 0.00075
            vy += Math.cos(px * 4.2 + t * 0.5) * 0.00035
            // Buoyancy holds the airborne above the boundary.
            if (py > HZ - 0.03) vy -= 0.0009
            if (py < 0.05) vy += 0.0006
            // Cursor is wind above ground.
            if (my < HZ) {
              const dxm = px - mx
              const dym = py - my
              const d2 = dxm * dxm + dym * dym
              if (d2 < 0.02 && d2 > 1e-6) {
                const dd = Math.sqrt(d2)
                const f = (1 - dd / 0.1414) * 0.0022
                vx += dxm / dd * f
                vy += dym / dd * f
              }
            }
            if (!isFree && t > aloftUntil[i]) mode[i] = 3
            if (isFree) {
              if (px < -0.05) px += aspect + 0.1
              if (px > aspect + 0.05) px -= aspect + 0.1
            }
          } else {
            // Settling home: gravity, then the lattice takes it back.
            vy += 0.00055
            vx += (hwx - px) * 0.012
            if (py > hwy - 0.02 && Math.abs(px - hwx) < 0.03) {
              mode[i] = 0
              H.extracted--
              vx *= 0.3
              vy *= 0.3
            }
          }
          // A settlement ring hurries the airborne home.
          if (ringOn && !isFree && (md === 2 || md === 3)) {
            const dxr = px - H.ringX
            const dyr = py - H.ringY
            const dr = Math.sqrt(dxr * dxr + dyr * dyr)
            if (Math.abs(dr - ringR) < 0.07) {
              mode[i] = 3
              vy += 0.003
            }
          }
          vx *= 0.9
          vy *= 0.9
          px += vx
          py += vy
          vel[ix] = vx
          vel[iy] = vy
        }
        pos[ix] = px
        pos[iy] = py
        // Depth parallax: the world above ground scrolls away faster.
        const par = py < HZ ? scroll * 0.035 : scroll * 0.1
        drawPos[ix] = px
        drawPos[iy] = py - par
      }

      // ── line geometry: lattice edges die with melt; strata sit steady ──
      const { E, SN, edges, strata, linePos, lineAl } = H
      const gate = introEase * introEase * introEase
      for (let e = 0; e < E; e++) {
        const a = edges[e * 2]
        const b = edges[e * 2 + 1]
        linePos[e * 4] = drawPos[a * 2]
        linePos[e * 4 + 1] = drawPos[a * 2 + 1]
        linePos[e * 4 + 2] = drawPos[b * 2]
        linePos[e * 4 + 3] = drawPos[b * 2 + 1]
        const al = (1 - melt[a]) * (1 - melt[b]) * gate * 0.5
        lineAl[e * 2] = al
        lineAl[e * 2 + 1] = al
      }
      for (let sIx = 0; sIx < SN; sIx++) {
        const o = (E + sIx) * 4
        const so = sIx * 5
        const k = strata[so + 4]
        const drift = Math.sin(t * 0.2 + k * 2.1) * 0.006 - scroll * 0.02 * k
        const par = scroll * 0.035
        linePos[o] = strata[so] + drift
        linePos[o + 1] = strata[so + 1] - par
        linePos[o + 2] = strata[so + 2] + drift
        linePos[o + 3] = strata[so + 3] - par
        const al = (0.13 - k * 0.025) * gate
        lineAl[(E + sIx) * 2] = al
        lineAl[(E + sIx) * 2 + 1] = al
      }

      const dark = el.node.ownerDocument.documentElement.getAttribute('data-theme') === 'dark'
      gl.clear(gl.COLOR_BUFFER_BIT)

      // Pass 1 — hairlines. Disable the point pass's extra attribute slots
      // first: enabled arrays are global GL state, and stale out-of-range
      // pointers turn the line pass into garbage geometry.
      gl.useProgram(H.lineProg)
      gl.uniform2f(H.uL.scale, 1 / aspect, 1)
      if (dark) gl.uniform3f(H.uL.colL, 0.659, 0.753, 0.812)
      else gl.uniform3f(H.uL.colL, 0.376, 0.49, 0.58)
      if (H.aP.m >= 0) gl.disableVertexAttribArray(H.aP.m)
      if (H.aP.r >= 0) gl.disableVertexAttribArray(H.aP.r)
      if (H.aP.f >= 0) gl.disableVertexAttribArray(H.aP.f)
      gl.bindBuffer(gl.ARRAY_BUFFER, H.linePosBuf)
      gl.bufferData(gl.ARRAY_BUFFER, linePos, gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(H.aL.p)
      gl.vertexAttribPointer(H.aL.p, 2, gl.FLOAT, false, 0, 0)
      gl.bindBuffer(gl.ARRAY_BUFFER, H.lineAlBuf)
      gl.bufferData(gl.ARRAY_BUFFER, lineAl, gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(H.aL.a)
      gl.vertexAttribPointer(H.aL.a, 1, gl.FLOAT, false, 0, 0)
      gl.lineWidth(1)
      gl.drawArrays(gl.LINES, 0, H.LE * 2)

      // Pass 2 — the particles.
      gl.useProgram(H.pointProg)
      gl.uniform2f(H.uP.scale, 1 / aspect, 1)
      gl.uniform1f(H.uP.dpr, dpr)
      if (dark) {
        gl.uniform3f(H.uP.colA, 0.659, 0.753, 0.812)
        gl.uniform3f(H.uP.colB, 0.45, 0.58, 0.68)
        gl.uniform1f(H.uP.alBase, 0.62)
      } else {
        gl.uniform3f(H.uP.colA, 0.031, 0.141, 0.224)
        gl.uniform3f(H.uP.colB, 0.376, 0.49, 0.58)
        gl.uniform1f(H.uP.alBase, 0.58)
      }
      if (H.aL.a >= 0 && H.aL.a !== H.aP.r && H.aL.a !== H.aP.m && H.aL.a !== H.aP.f) gl.disableVertexAttribArray(H.aL.a)
      gl.bindBuffer(gl.ARRAY_BUFFER, H.posBuf)
      gl.bufferData(gl.ARRAY_BUFFER, drawPos, gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(H.aP.p)
      gl.vertexAttribPointer(H.aP.p, 2, gl.FLOAT, false, 0, 0)
      gl.bindBuffer(gl.ARRAY_BUFFER, H.meltBuf)
      gl.bufferData(gl.ARRAY_BUFFER, melt, gl.DYNAMIC_DRAW)
      gl.enableVertexAttribArray(H.aP.m)
      gl.vertexAttribPointer(H.aP.m, 1, gl.FLOAT, false, 0, 0)
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
