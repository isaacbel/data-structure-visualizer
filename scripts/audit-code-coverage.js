const fs = require('fs')

// Parse registry to get all DS + ops
const reg = fs.readFileSync('src/constants/registry.ts', 'utf8')
const dsMatches = [...reg.matchAll(/ds\('([^']+)',\s*'[^']+',\s*'[^']+',\s*\[([^\]]+)\]/g)]
const registry = {}
for (const m of dsMatches) {
  const id = m[1]
  const ops = m[2].split(',').map(s => s.trim().replace(/'/g, ''))
  registry[id] = ops
}

const allDS = Object.keys(registry)
console.log('=== REGISTRY AUDIT ===')
console.log('Total DS:', allDS.length)
console.log('Total operations:', Object.values(registry).flat().length)

const examples = fs.readFileSync('src/constants/codeExamples.ts', 'utf8')
const examplesExt = fs.readFileSync('src/constants/codeExamplesExtended.ts', 'utf8')
const combined = examples + examplesExt

const LANGS = ['python','c','cpp','java','javascript','typescript','csharp','go','rust']

let totalNeeded = 0, totalFound = 0
const missing = []
const report = []

for (const [ds, ops] of Object.entries(registry)) {
  for (const op of ops) {
    // Check per lang by looking for ds key + op key + lang key proximity
    const dsBlock = extractDsBlock(combined, ds)
    const opBlock = dsBlock ? extractOpBlock(dsBlock, op) : ''
    const coveredLangs = []
    const missingLangs = []
    for (const lang of LANGS) {
      totalNeeded++
      if (opBlock && opBlock.includes(lang + ':')) {
        totalFound++
        coveredLangs.push(lang)
      } else {
        missingLangs.push(lang)
      }
    }
    if (missingLangs.length > 0) {
      missing.push({ ds, op, missingLangs, coveredLangs })
      report.push(`MISSING [${ds}][${op}]: needs ${missingLangs.join(', ')}`)
    }
  }
}

function extractDsBlock(src, ds) {
  const patterns = [
    new RegExp(`'${ds}'\\s*:\\s*\\{`),
    new RegExp(`${ds}\\s*:\\s*\\{`)
  ]
  for (const pat of patterns) {
    const idx = src.search(pat)
    if (idx !== -1) {
      // Scan forward to find the matching closing brace
      let depth = 0, i = src.indexOf('{', idx)
      const start = i
      while (i < src.length) {
        if (src[i] === '{') depth++
        else if (src[i] === '}') { depth--; if (depth === 0) return src.slice(start, i+1) }
        i++
      }
    }
  }
  return ''
}

function extractOpBlock(dsBlock, op) {
  const patterns = [
    new RegExp(`'${op}'\\s*:\\s*\\{`),
    new RegExp(`${op}\\s*:\\s*\\{`)
  ]
  for (const pat of patterns) {
    const idx = dsBlock.search(pat)
    if (idx !== -1) {
      let depth = 0, i = dsBlock.indexOf('{', idx)
      const start = i
      while (i < dsBlock.length) {
        if (dsBlock[i] === '{') depth++
        else if (dsBlock[i] === '}') { depth--; if (depth === 0) return dsBlock.slice(start, i+1) }
        i++
      }
    }
  }
  return ''
}

console.log('\n=== MISSING IMPLEMENTATIONS ===')
console.log(`Total needed: ${totalNeeded}`)
console.log(`Found: ${totalFound}`)
console.log(`Missing: ${totalNeeded - totalFound}`)
console.log('\nDetails:')
report.forEach(r => console.log(r))

// Summary per DS
console.log('\n=== PER-DS SUMMARY ===')
const dsGroups = {}
for (const m of missing) {
  if (!dsGroups[m.ds]) dsGroups[m.ds] = { ops: 0, langGaps: 0 }
  dsGroups[m.ds].ops++
  dsGroups[m.ds].langGaps += m.missingLangs.length
}
for (const [ds, stats] of Object.entries(dsGroups)) {
  console.log(`  ${ds}: ${stats.ops} ops have gaps, ${stats.langGaps} total missing lang implementations`)
}
