#!/usr/bin/env node
'use strict'

/**
 * audit-full.cjs
 * Complete audit of both the theory expanded content and the code library.
 * Reports totals and any missing items.
 */

const fs   = require('fs')
const path = require('path')
const LIB  = path.resolve(__dirname, '../src/code-library')
const LANGS = ['python','c','cpp','java','javascript','typescript','csharp','go','rust']

// ─── Read registry from code-library dir ─────────────────────────────────────
function getRegistryFromDisk() {
  if (!fs.existsSync(LIB)) return {}
  const registry = {}
  for (const ds of fs.readdirSync(LIB)) {
    if (!fs.statSync(path.join(LIB, ds)).isDirectory()) continue
    registry[ds] = []
    for (const op of fs.readdirSync(path.join(LIB, ds))) {
      if (!fs.statSync(path.join(LIB, ds, op)).isDirectory()) continue
      registry[ds].push(op)
    }
  }
  return registry
}

// ─── Theory coverage ──────────────────────────────────────────────────────────
function auditTheory() {
  const theory = require('../src/constants/theory.ts.cjs-stub') // handled below
  return {}
}

const registry = getRegistryFromDisk()

let totalDS    = 0
let totalOps   = 0
let totalImpl  = 0
let missing    = []

for (const [ds, ops] of Object.entries(registry)) {
  totalDS++
  for (const op of ops) {
    totalOps++
    for (const lang of LANGS) {
      const file = path.join(LIB, ds, op, lang)
      if (fs.existsSync(file) && fs.statSync(file).size > 0) {
        totalImpl++
      } else {
        missing.push(`${ds} / ${op} / ${lang}`)
      }
    }
  }
}

const expectedImpl = totalOps * LANGS.length

const W = 60
const line = '─'.repeat(W)
const dbl  = '═'.repeat(W)

console.log(`\n╔${dbl}╗`)
console.log(`║${'  FULL EDUCATIONAL PLATFORM AUDIT REPORT'.padEnd(W)}║`)
console.log(`╚${dbl}╝\n`)

// Code library section
console.log(`  ── Code Library ─────────────────────────────────────────`)
console.log(`    Data Structures    : ${totalDS}`)
console.log(`    Total Operations   : ${totalOps}`)
console.log(`    Languages          : ${LANGS.length}`)
console.log(`    Expected Impl.     : ${expectedImpl}`)
console.log(`    Actual Impl.       : ${totalImpl}`)
console.log(`    Missing            : ${missing.length}`)

if (missing.length > 0) {
  console.log(`\n  ── Missing Implementations ───────────────────────────────`)
  for (const m of missing.slice(0, 30)) console.log(`    ✗ ${m}`)
  if (missing.length > 30) console.log(`    ... and ${missing.length - 30} more`)
}

// Theory section (read theoryExpanded.ts)
const theoryExp = path.resolve(__dirname, '../src/constants/theoryExpanded.ts')
const theoryBase = path.resolve(__dirname, '../src/constants/theory.ts')
let expandedCount = 0
let baseCount = 0
if (fs.existsSync(theoryExp)) {
  const content = fs.readFileSync(theoryExp, 'utf8')
  const matches = content.match(/'[a-z-]+'\s*:/g) || []
  expandedCount = matches.filter(m => !m.includes('complexity') && !m.includes('access') && !m.includes('search') && !m.includes('insert') && !m.includes('delete') && !m.includes('space')).length
}
if (fs.existsSync(theoryBase)) {
  const content = fs.readFileSync(theoryBase, 'utf8')
  const matches = content.match(/^\s{2}'[a-z-]+'\s*:\s*\{/gm) || []
  baseCount = matches.length
}

console.log(`\n  ── Theory Library ────────────────────────────────────────`)
console.log(`    Base theory entries   : ${baseCount}`)
console.log(`    Rich expanded entries : ${expandedCount}`)
console.log(`    (rich content merges on top of base automatically)`)

// Final verdict
console.log(`\n  ${'─'.repeat(W - 2)}`)
if (missing.length === 0) {
  console.log(`  Code Library Validation : ✅ PASS — ${totalImpl} implementations, 0 missing`)
} else {
  console.log(`  Code Library Validation : ❌ FAIL — ${missing.length} missing implementations`)
}
console.log(`  Theory Content          : ✅ ${baseCount} base + ${expandedCount} rich entries\n`)
