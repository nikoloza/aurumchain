// The mark, assembled from fractions — the hero's centerpiece. The brand
// logo's exact vector path is rasterized to an offscreen sampling canvas
// (never attached to the DOM — a compute buffer, like a chart library's
// backing store) and every filled cell becomes one diamond particle. The
// particles hold the mark's shape on springs: the cursor scatters them
// locally, a click bursts them outward, and they reassemble on their own —
// fractionalization and settlement, played as physics.
//
// Raw WebGL1 + JS spring integration (~1k particles), no dependencies. All
// browser handles go through el.node.ownerDocument; the loop rides onFrame;
// reduced motion pins the particles to the mark; without WebGL the low-alpha
// ghost mark behind this layer carries the composition alone.
export const HeroMark = {
  tag: 'canvas',
  position: 'absolute',
  top: '4vh',
  right: '-5vw',
  width: '46vw',
  height: '46vw',
  pointerEvents: 'none',
  '@tabletS': { display: 'none' },
  attr: { 'aria-hidden': 'true' },

  onRender: (el) => {
    if (!el.node || el.scope.mkInit) return
    el.scope.mkInit = true
    const doc = el.node.ownerDocument
    const win = doc && doc.defaultView
    if (!win) return
    let gl = null
    try {
      gl = el.node.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true })
    } catch (e) {}
    if (!gl) return

    // ── sample the mark's vector into particle targets ──
    const D = 'M 16.59 4.03 L 14.85 5.77 C 13.93 5.35 12.95 5.14 11.96 5.14 C 10.2 5.14 8.44 5.81 7.1 7.15 C 5.76 8.49 5.09 10.24 5.09 12 L 5.09 12.01 C 5.09 12.99 5.3 13.98 5.72 14.9 C 4.25 16.37 2.71 17.92 1.18 19.46 C 0.72 18.8 0.33 18.1 0 17.36 C 1.01 16.35 2.02 15.35 3.03 14.33 C 2.83 13.57 2.74 12.79 2.74 12.01 L 2.74 12 C 2.74 9.64 3.64 7.28 5.44 5.48 C 7.24 3.68 9.6 2.78 11.96 2.78 C 13.56 2.78 15.16 3.2 16.59 4.03 M 20.93 9.67 C 21.13 10.43 21.23 11.21 21.23 12 C 21.23 14.36 20.33 16.72 18.53 18.52 C 16.73 20.32 14.37 21.22 12.01 21.22 C 10.4 21.22 8.8 20.8 7.37 19.97 L 9.12 18.23 C 10.03 18.66 11.02 18.87 12.01 18.87 C 13.76 18.87 15.52 18.2 16.86 16.85 C 18.21 15.51 18.88 13.75 18.88 12 C 18.88 11.01 18.66 10.02 18.24 9.11 C 19.73 7.62 21.28 6.06 22.82 4.51 C 23.27 5.17 23.67 5.87 24 6.6 Z M 12.01 15.32 L 8.68 12 L 12.01 8.67 L 15.33 12 Z'
    let targets = []
    try {
      const S = 240
      const oc = doc.createElement('canvas')
      oc.width = S
      oc.height = S
      const c2 = oc.getContext('2d')
      const path = new win.Path2D(D)
      c2.scale(S / 24, S / 24)
      c2.fillStyle = '#000'
      c2.fill(path)
      const px = c2.getImageData(0, 0, S, S).data
      const step = 5
      for (let y = 2; y < S; y += step) {
        for (let x = 2; x < S; x += step) {
          if (px[(y * S + x) * 4 + 3] > 120) {
            targets.push(x / S, y / S)
          }
        }
      }
    } catch (e) { return }
    const N = targets.length / 2
    if (N < 50) return

    const compile = (type, src) => {
      const sh = gl.createShader(type)
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null
    }
    const vs = compile(gl.VERTEX_SHADER,
      'attribute vec2 p;attribute float r;' +
      'uniform float dpr;varying float vR;' +
      'void main(){' +
      'vec2 q=p*2.0-1.0;q.y=-q.y;' +
      'gl_Position=vec4(q,0.0,1.0);' +
      'gl_PointSize=(2.6+4.4*r)*dpr;' +
      'vR=r;}')
    const fs = compile(gl.FRAGMENT_SHADER,
      'precision mediump float;varying float vR;uniform vec3 col;uniform float al;' +
      'void main(){' +
      'vec2 q=gl_PointCoord*2.0-1.0;' +
      'float dist=abs(q.x)+abs(q.y);' +
      'if(dist>1.0)discard;' +
      'float edge=1.0-smoothstep(0.7,1.0,dist);' +
      'float a=al*(0.45+0.55*vR)*edge;' +
      'gl_FragColor=vec4(col*a,a);}')
    if (!vs || !fs) return
    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const tArr = new Float32Array(targets)
    const pos = new Float32Array(tArr)
    const vel = new Float32Array(N * 2)
    const rand = new Float32Array(N)
    for (let i = 0; i < N; i++) rand[i] = Math.random()

    const posBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf)
    gl.bufferData(gl.ARRAY_BUFFER, pos, gl.DYNAMIC_DRAW)
    const pLoc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(pLoc)
    gl.vertexAttribPointer(pLoc, 2, gl.FLOAT, false, 0, 0)

    const rBuf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, rBuf)
    gl.bufferData(gl.ARRAY_BUFFER, rand, gl.STATIC_DRAW)
    const rLoc = gl.getAttribLocation(prog, 'r')
    gl.enableVertexAttribArray(rLoc)
    gl.vertexAttribPointer(rLoc, 1, gl.FLOAT, false, 0, 0)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0, 0, 0, 0)

    let reduced = false
    try { reduced = win.matchMedia('(prefers-reduced-motion: reduce)').matches } catch (e) {}

    el.scope.mk = {
      gl, prog, N, tArr, pos, vel, posBuf,
      u: {
        dpr: gl.getUniformLocation(prog, 'dpr'),
        col: gl.getUniformLocation(prog, 'col'),
        al: gl.getUniformLocation(prog, 'al')
      },
      t0: win.performance ? win.performance.now() : 0,
      reduced,
      win,
      burstAt: 0
    }
  },

  onFrame: (el) => {
    const M = el.scope.mk
    if (!M || !el.node) return
    const gl = M.gl
    const win = M.win
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
      const now = win.performance ? win.performance.now() : 0
      const t = (now - M.t0) / 1000

      // Pointer + click in THIS canvas's uv space, derived from the raw
      // client coords the hero stores on the shared scope.
      const rect = el.node.getBoundingClientRect()
      const mx = ((el.scope.cxr === undefined ? -9999 : el.scope.cxr) - rect.left) / Math.max(1, rect.width)
      const my = ((el.scope.cyr === undefined ? -9999 : el.scope.cyr) - rect.top) / Math.max(1, rect.height)
      let burst = 0
      if (el.scope.clickStart && el.scope.clickStart !== M.burstAt) {
        M.burstAt = el.scope.clickStart
        burst = 1
      }

      const N = M.N
      const pos = M.pos
      const vel = M.vel
      const tArr = M.tArr
      const dt = 0.016
      const scroll = Math.max(0, Math.min(1, (el.node.ownerDocument.documentElement.scrollTop || 0) / Math.max(1, win.innerHeight)))
      const swayX = Math.sin(t * 0.5) * 0.004
      const swayY = Math.cos(t * 0.38) * 0.004 + scroll * 0.05
      if (M.reduced) {
        pos.set(tArr)
      } else {
        for (let i = 0; i < N; i++) {
          const ix = i * 2
          const iy = ix + 1
          const txi = tArr[ix] + swayX + Math.sin(t * 0.9 + i * 1.7) * 0.0016
          const tyi = tArr[iy] + swayY + Math.cos(t * 0.8 + i * 2.3) * 0.0016
          let vx = vel[ix]
          let vy = vel[iy]
          // spring home
          vx += (txi - pos[ix]) * 10 * dt
          vy += (tyi - pos[iy]) * 10 * dt
          // cursor scatter
          const dx = pos[ix] - mx
          const dy = pos[iy] - my
          const d2 = dx * dx + dy * dy
          if (d2 < 0.02 && d2 > 0.000001) {
            const d = Math.sqrt(d2)
            const f = (1 - d / 0.1414) * 1.35 * dt
            vx += (dx / d) * f
            vy += (dy / d) * f
          }
          // click burst
          if (burst && d2 < 0.3 && d2 > 0.000001) {
            const d = Math.sqrt(d2)
            const f = (1 - d / 0.5477) * 0.09
            vx += (dx / d) * f
            vy += (dy / d) * f
          }
          vx *= 0.88
          vy *= 0.88
          pos[ix] += vx
          pos[iy] += vy
          vel[ix] = vx
          vel[iy] = vy
        }
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, M.posBuf)
      gl.bufferData(gl.ARRAY_BUFFER, pos, gl.DYNAMIC_DRAW)

      const dark = el.node.ownerDocument.documentElement.getAttribute('data-theme') === 'dark'
      gl.uniform1f(M.u.dpr, dpr)
      if (dark) {
        gl.uniform3f(M.u.col, 0.659, 0.753, 0.812)
        gl.uniform1f(M.u.al, 0.8)
      } else {
        gl.uniform3f(M.u.col, 0.09, 0.22, 0.33)
        gl.uniform1f(M.u.al, 0.82)
      }
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.POINTS, 0, N)
    } catch (e) {}
  },

  onRemove: (el) => {
    el.scope.mk = null
  }
}
