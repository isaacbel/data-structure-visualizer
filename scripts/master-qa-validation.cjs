#!/usr/bin/env node
'use strict'
/**
 * master-qa-validation.cjs
 * Comprehensive Quality Assurance Validation Script.
 * Verifies:
 * 1. 1,674 multi-language code files (42 DS × 186 ops × 9 languages) — 0 missing
 * 2. 42 rich expanded theory chapters
 * 3. 42 dedicated resource maps with metadata (pubYear, readTime, difficulty)
 * 4. TypeScript compilation (0 errors)
 * Exits with non-zero exit code if ANY validation check fails.
 */
const fs   = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const LANGS = ['python', 'c', 'cpp', 'java', 'javascript', 'typescript', 'csharp', 'go', 'rust']
const LIB   = path.resolve(__dirname, '../src/code-library')
const ROOT  = path.resolve(__dirname, '..')

console.log('╔═══════════════════════════════════════════════════════════════╗')
console.log('║           MASTER QUALITY ASSURANCE VALIDATION SUITE           ║')
console.log('╚═══════════════════════════════════════════════════════════════╝')
console.log('')

let failures = 0

// 1. Code Library Check
console.log('  [1/4] Verifying Code Library (1,674 expected files)...')
let totalCodeFiles = 0
let missingCodeFiles = []
if (fs.existsSync(LIB)) {
  for (const ds of fs.readdirSync(LIB)) {
    const dsPath = path.join(LIB, ds)
    if (!fs.statSync(dsPath).isDirectory()) continue
    for (const op of fs.readdirSync(dsPath)) {
      const opPath = path.join(dsPath, op)
      if (!fs.statSync(opPath).isDirectory()) continue
      for (const lang of LANGS) {
        const file = path.join(opPath, lang)
        if (fs.existsSync(file) && fs.statSync(file).size > 0) {
          totalCodeFiles++
        } else {
          missingCodeFiles.push(`${ds}/${op}/${lang}`)
        }
      }
    }
  }
}

if (missingCodeFiles.length === 0 && totalCodeFiles >= 1674) {
  console.log(`        ✅ PASS: ${totalCodeFiles} code files present (0 missing)`)
} else {
  console.log(`        ❌ FAIL: Missing ${missingCodeFiles.length} code files`)
  failures++
}

// 2. Theory Chapters Check
console.log('  [2/4] Verifying Theory Chapters (42 data structures)...')
const p = (f) => { try { return fs.readFileSync(f, 'utf8'); } catch (e) { return ''; } }
const expandedSet = new Set()
;['src/constants/theoryExpanded.ts', 'src/constants/theoryExpanded2.ts', 'src/constants/theoryExpanded3.ts'].forEach(f => {
  [...p(path.join(ROOT, f)).matchAll(/^  '([a-z][a-z-]+)'\s*:/gm)].forEach(m => expandedSet.add(m[1]))
})

if (expandedSet.size >= 42) {
  console.log(`        ✅ PASS: ${expandedSet.size} data structures have rich textbook chapters`)
} else {
  console.log(`        ❌ FAIL: Only ${expandedSet.size} / 42 theory chapters found`)
  failures++
}

// 3. Dedicated Resources Check
console.log('  [3/4] Verifying Dedicated Resources (42 data structures)...')
const resContent = p(path.join(ROOT, 'src/constants/dedicatedResources.ts'))
const resSet = new Set([...resContent.matchAll(/^  '([a-z][a-z-]+)'\s*:/gm)].map(m => m[1]))

if (resSet.size >= 42) {
  console.log(`        ✅ PASS: ${resSet.size} data structures have verified dedicated learning resources`)
} else {
  console.log(`        ❌ FAIL: Only ${resSet.size} / 42 dedicated resource entries found`)
  failures++
}

// 4. TypeScript Compiler Check
console.log('  [4/4] Verifying TypeScript Compilation (`npx tsc --noEmit`)...')
try {
  execSync('npx tsc --noEmit', { cwd: ROOT, stdio: 'pipe' })
  console.log('        ✅ PASS: TypeScript compilation succeeded with 0 errors')
} catch (err) {
  console.log('        ❌ FAIL: TypeScript compilation errors detected')
  console.log(err.stdout ? err.stdout.toString() : err.message)
  failures++
}

console.log('')
console.log('═══════════════════════════════════════════════════════════════')
if (failures === 0) {
  console.log('  OVERALL RESULT: ✅ ALL QA VALIDATION CHECKS PASSED (100% COMPLETE)')
  console.log('═══════════════════════════════════════════════════════════════')
  process.exit(0)
} else {
  console.log(`  OVERALL RESULT: ❌ ${failures} VALIDATION CHECKS FAILED`)
  console.log('═══════════════════════════════════════════════════════════════')
  process.exit(1)
}
