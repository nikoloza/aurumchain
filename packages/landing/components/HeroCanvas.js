// The fractionalization field — the brand thesis as an instrument. A staggered
// lattice of diamonds (the fractions) covers the hero; a magnetic lens swells
// the ones under the cursor, a click sends a ripple through the field, and
// the whole plane breathes on a slow two-axis wave. Flat brand color only —
// navy on the ivory ground, mist on the navy one.
//
// Constraints honored: raw WebGL1 (no dependency), every browser handle goes
// through el.node.ownerDocument, the loop rides the framework's onFrame tick,
// reduced motion freezes the ambient wave (pointer response stays, since it
// only ever follows the visitor's own movement), and a machine without WebGL
// keeps the static ghost mark behind this layer.
export const HeroCanvas = {
  tag: 'canvas',
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
  attr: { 'aria-hidden': 'true' },

  onRender: (el) => {
    if (!el.node || el.scope.glInit) return
    el.scope.glInit = true
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
    const vs = compile(gl.VERTEX_SHADER,
      'attribute vec2 g;' +
      'uniform float t;uniform float dpr;uniform float clickT;uniform float scr;' +
      'uniform vec2 m;uniform vec2 res;uniform vec2 cp;' +
      'varying float vA;' +
      'void main(){' +
      'vec2 uv=g;' +
      'vec2 asp=vec2(res.x/max(1.0,res.y),1.0);' +
      'float wave=sin(uv.x*9.0+t*0.6)*cos(uv.y*7.0-t*0.45)*0.5+0.5;' +
      'vec2 d=(uv-m)*asp;' +
      'float dist=length(d);' +
      'float lens=exp(-dist*dist*26.0);' +
      'vec2 push=(dist>0.0001?d/dist:vec2(0.0))*lens*0.014;' +
      'float ring=0.0;' +
      'vec2 cd=(uv-cp)*asp;' +
      'float cdist=length(cd);' +
      'if(clickT<3.0){ring=exp(-pow((cdist-clickT*0.5)*9.0,2.0))*exp(-clickT*1.7);' +
      'push+=(cdist>0.0001?cd/cdist:vec2(0.0))*ring*0.028;}' +
      'float boost=lens*2.4+ring*2.2;' +
      'uv+=push;' +
      'uv.y-=scr*0.07;' +
      'vec2 p=uv*2.0-1.0;p.y=-p.y;' +
      'gl_Position=vec4(p,0.0,1.0);' +
      'float size=(3.4+3.2*wave)*(1.0+boost)*dpr;' +
      'gl_PointSize=min(size,26.0*dpr);' +
      'float ex=smoothstep(0.0,0.05,uv.x)*smoothstep(1.0,0.95,uv.x);' +
      'float ey=smoothstep(0.0,0.09,uv.y)*smoothstep(1.0,0.91,uv.y);' +
      'float leftMask=0.22+0.78*smoothstep(0.22,0.7,uv.x);' +
      'vA=(0.05+0.3*wave+0.55*min(1.0,boost))*ex*ey*leftMask;}')
    const fs = compile(gl.FRAGMENT_SHADER,
      'precision mediump float;varying float vA;uniform vec3 col;uniform float al;' +
      'void main(){' +
      'vec2 q=gl_PointCoord*2.0-1.0;' +
      'float dist=abs(q.x)+abs(q.y);' +
      'if(dist>1.0)discard;' +
      'float edge=1.0-smoothstep(0.72,1.0,dist);' +
      'float a=al*vA*edge;' +
      'gl_FragColor=vec4(col*a,a);}')
    if (!vs || !fs) return
    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    // Staggered lattice — every other row offsets half a cell, the brandbook's
    // diamond-field setting.
    const COLS = 44
    const ROWS = 26
    const N = COLS * ROWS
    const seeds = new Float32Array(N * 2)
    let k = 0
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const off = (r % 2) * 0.5
        seeds[k++] = (c + 0.5 + off) / COLS
        seeds[k++] = (r + 0.5) / ROWS
      }
    }
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'g')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0, 0, 0, 0)

    let reduced = false
    try { reduced = win.matchMedia('(prefers-reduced-motion: reduce)').matches } catch (e) {}

    el.scope.gl = gl
    el.scope.glCount = N
    el.scope.glU = {
      t: gl.getUniformLocation(prog, 't'),
      m: gl.getUniformLocation(prog, 'm'),
      cp: gl.getUniformLocation(prog, 'cp'),
      dpr: gl.getUniformLocation(prog, 'dpr'),
      res: gl.getUniformLocation(prog, 'res'),
      col: gl.getUniformLocation(prog, 'col'),
      al: gl.getUniformLocation(prog, 'al'),
      clickT: gl.getUniformLocation(prog, 'clickT'),
      scr: gl.getUniformLocation(prog, 'scr')
    }
    el.scope.glT0 = win.performance ? win.performance.now() : 0
    el.scope.glReduced = reduced
    el.scope.glWin = win
    // The lens rests over the field until the visitor moves.
    if (el.scope.mx === undefined) { el.scope.mx = 0.72; el.scope.my = 0.42 }
    el.scope.smx = el.scope.mx
    el.scope.smy = el.scope.my
  },

  onFrame: (el) => {
    const gl = el.scope.gl
    if (!gl || !el.node) return
    const win = el.scope.glWin
    const u = el.scope.glU
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
      const t = el.scope.glReduced ? 42 : (now - el.scope.glT0) / 1000
      // Ease the lens toward the pointer for weight.
      el.scope.smx += ((el.scope.mx || 0) - el.scope.smx) * 0.09
      el.scope.smy += ((el.scope.my || 0) - el.scope.smy) * 0.09
      const clickT = el.scope.clickStart ? (now - el.scope.clickStart) / 1000 : 99
      const doc = el.node.ownerDocument
      const scr = Math.max(0, Math.min(1, (doc.documentElement.scrollTop || 0) / Math.max(1, win.innerHeight)))
      const dark = doc.documentElement.getAttribute('data-theme') === 'dark'
      gl.uniform1f(u.t, t)
      gl.uniform1f(u.dpr, dpr)
      gl.uniform2f(u.res, w, h)
      gl.uniform2f(u.m, el.scope.smx, el.scope.smy)
      gl.uniform2f(u.cp, el.scope.cx === undefined ? 0.6 : el.scope.cx, el.scope.cy === undefined ? 0.5 : el.scope.cy)
      gl.uniform1f(u.clickT, clickT)
      gl.uniform1f(u.scr, scr)
      if (dark) {
        gl.uniform3f(u.col, 0.659, 0.753, 0.812)
        gl.uniform1f(u.al, 0.5)
      } else {
        gl.uniform3f(u.col, 0.157, 0.298, 0.42)
        gl.uniform1f(u.al, 0.58)
      }
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.POINTS, 0, el.scope.glCount)
    } catch (e) {}
  },

  onRemove: (el) => {
    el.scope.gl = null
  }
}
