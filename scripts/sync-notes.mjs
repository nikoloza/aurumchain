#!/usr/bin/env bun
// Generates the workspace Note copies of repo documents.
//
// `smbls docs push` syncs `docs/*.md` from inside a Symbols project to the
// workspace Notes, and reads its metadata from YAML frontmatter. The repo's own
// documents carry no frontmatter, so this script writes a generated copy into
// the landing package with the note metadata prepended.
//
// docs/<source>.md  ──►  packages/landing/docs/<key>.md  ──►  smbls docs push
//
// The generated folder is gitignored: docs/ stays the single source of truth,
// and the copy is rebuilt on demand. Run `bun run docs:push` to do both steps.

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(rootDir, 'packages', 'landing', 'docs')

// One entry per document that belongs in Notes. `frontmatter` is emitted
// verbatim, so keep it valid YAML.
const NOTES = [
  {
    source: 'docs/SPEC.md',
    key: 'fractyco-technical-specification',
    frontmatter: `title: Fractyco — Technical Specification
type: note
folderPath: /engineering
state: published
category: engineering
tags:
  - fractyco
  - spec
  - architecture
  - solana
summary: >-
  What Fractyco does, in ASD-STE100 Simplified Technical English. Covers the
  three surfaces, the database, the four Anchor programs, the functional
  breakdown, the route contract, the constraints, and the known gaps.
privacy: private`
  }
]

await mkdir(outDir, { recursive: true })

for (const note of NOTES) {
  const body = await readFile(path.join(rootDir, note.source), 'utf8')
  const target = path.join(outDir, `${note.key}.md`)
  await writeFile(target, `---\n${note.frontmatter}\n---\n\n${body}`)
  console.log(`[notes] ${note.source} → packages/landing/docs/${note.key}.md`)
}
