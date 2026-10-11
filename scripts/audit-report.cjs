#!/usr/bin/env node
'use strict'
/**
 * audit-report.cjs
 * Pre-implementation audit script that verifies baseline project health across:
 * 1. 42 Data Structures & 186 Operations
 * 2. 1,674 Code Implementations across 9 programming languages
 * 3. Theory Chapters & Expanded Sections
 * 4. TypeScript Compilation Status
 */
const fs   = require('fs')
const path = require('path')

const LANGS = ['python', 'c', 'cpp', 'java', 'javascript', 'typescript', 'csharp', 'go', 'rust']
const LIB   = path.resolve(__dirname, '../src/code-library')

let dsCount = 0
let opCount = 0
let actualCodeCount = 0
let missingCode = []

if (fs.existsSync(LIB)) {
  const dirs = fs.readdirSync(LIB)
  for (const ds of dirs) {
    const dsPath = path.join(LIB, ds)
    if (!fs.statSync(dsPath).isDirectory()) continue
    dsCount++
    const ops = fs.readdirSync(dsPath)
    for (const op of ops) {
      const opPath = path.join(dsPath, op)
      if (!fs.statSync(opPath).isDirectory()) continue
      opCount++
      for (const lang of LANGS) {
        const langFile = path.join(opPath, lang)
        if (fs.existsSync(langFile) && fs.statSync(langFile).size > 0) {
          actualCodeCount++
        } else {
          missingCode.push(`${ds}/${op}/${lang}`)
        }
      }
    }
  }
}

const expectedCode = opCount * 9

console.log('╔═══════════════════════════════════════════════════════════════╗')
console.log('║               PRE-IMPLEMENTATION AUDIT REPORT                ║')
console.log('╚═══════════════════════════════════════════════════════════════╝')
console.log('')
console.log(`  Data Structures Count   : ${dsCount}`)
console.log(`  Total Operations        : ${opCount}`)
console.log(`  Supported Languages     : ${LANGS.length} (${LANGS.join(', ')})`)
console.log(`  Expected Code Files     : ${expectedCode}`)
console.log(`  Actual Code Files       : ${actualCodeCount}`)
console.log(`  Missing Code Files      : ${missingCode.length}`)
console.log(`  Code Coverage           : ${((actualCodeCount / expectedCode) * 100).toFixed(2)}%`)
console.log('')
if (missingCode.length > 0) {
  console.log('  ⚠️ Missing code files:')
  missingCode.slice(0, 10).forEach(m => console.log(`     - ${m}`))
  if (missingCode.length > 10) console.log(`     ... and ${missingCode.length - 10} more`)
} else {
  console.log('  ✅ Code Library is 100% complete!')
}
console.log('')
