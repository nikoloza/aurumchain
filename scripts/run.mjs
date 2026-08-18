#!/usr/bin/env node
// Runs a smbls command across the three surfaces.
//
//   bun scripts/run.mjs start     dev servers: landing 5040, dashboard 5041, governance 5042
//   node scripts/run.mjs build     production build per surface
//   node scripts/run.mjs publish   push + publish every surface, then the brand library
//
// `start` keeps all three processes attached and prefixes each output line
// with its surface, so one terminal covers the whole product.
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const mode = process.argv[2] || 'start'
const SURFACES = ['landing', 'dashboard', 'governance']
const TARGETS = mode === 'publish' ? [...SURFACES, 'brand'] : SURFACES

const ARGS = {
  start: ['start', '--no-cache'],
  build: ['build'],
  publish: ['publish', '--yes', '--non-interactive']
}[mode]
if (!ARGS) {
  console.error(`Unknown mode "${mode}" — use start, build, or publish.`)
  process.exit(1)
}

const prefix = (name, data) => {
  for (const line of String(data).split('\n')) {
    if (line.trim()) console.log(`[${name}] ${line}`)
  }
}

const run = (name) =>
  new Promise((resolve) => {
    const child = spawn('bunx', ['smbls', ...ARGS], {
      cwd: path.join(rootDir, 'packages', name),
      env: process.env
    })
    child.stdout.on('data', (d) => prefix(name, d))
    child.stderr.on('data', (d) => prefix(name, d))
    child.on('exit', (code) => resolve({ name, code: code ?? 0 }))
  })

if (mode === 'start') {
  // Long-running: launch all three and stay attached.
  TARGETS.forEach(run)
} else {
  // Sequential: publishes and builds report a summary and exit non-zero on
  // the first failure.
  let failed = 0
  for (const name of TARGETS) {
    const { code } = await run(name)
    console.log(`[${name}] exited ${code}`)
    if (code !== 0) failed = code
  }
  process.exit(failed)
}
