#!/usr/bin/env node
'use strict'
// Appends hash-map and hash-set rich theory to theoryExpanded2.ts
const fs   = require('fs')
const path = require('path')
const FILE = path.resolve(__dirname, '../src/constants/theoryExpanded2.ts')

const e = s => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${')

const entries = {
  'hash-map': {
    definition: `A Hash Map (also called HashMap, Dictionary, or Map) is a key-value store that uses a hash function to map keys to array indices, enabling O(1) average-case lookup, insertion, and deletion by key. It is the most widely used data structure in programming: Python dicts, JavaScript objects, Java HashMap, C++ unordered_map, Go maps, and Rust HashMaps are all hash maps. Unlike a hash set (which stores keys only), a hash map stores associated values for each key.`,
    history: `Hash map origins trace to H.P. Luhn (IBM, 1953) and Gene Amdahl's formalization of hashing the same year. Modern standard library implementations include: Java HashMap (Java 1.2, 1998), Python dict (CPython 3.6+ preserves insertion order), C++ unordered_map (C++11). Java 8's HashMap upgraded to tree bins (Red-Black tree) for large bucket chains, giving O(log n) worst-case instead of O(n).`,
    intuition: `A hash map is like a filing cabinet with labeled drawers. The hash function computes which drawer a key belongs in. Storing a value: open the correct drawer, place it inside. Retrieving: compute the key's drawer, look inside. Collisions (two keys in same drawer) are handled by chaining or open addressing.`,
    mathematicalFoundation: `Load factor alpha = n / m  (n = elements, m = buckets)\nExpected chain length: alpha\nExpected search time: O(1 + alpha) = O(1) when alpha is O(1)\nResize threshold: alpha > 0.75 -> double capacity, rehash all in O(n)\nAmortized O(1) per insert via potential analysis`,
    applications: `Database hash indexes for O(1) exact-match lookup. Caching (memcached, Redis). Symbol tables in compilers. DNS caches. Memoization in DP. Word frequency counting. Anagram grouping. LRU Cache (HashMap + doubly linked list).`,
    advantages: `O(1) average insert, search, delete. Flexible key types (any hashable type). Faster than BST-based maps for most workloads. Foundation for countless algorithms and system designs.`,
    disadvantages: `O(n) worst case with poor hash function or adversarial inputs. No ordered iteration. Hash function must handle all key types. Not thread-safe by default.`,
    comparisons: `HashMap vs TreeMap: HashMap O(1) avg but unordered; TreeMap O(log n) but sorted. HashMap vs Array: Array O(1) integer-indexed; HashMap O(1) avg with any hashable key. HashMap vs HashSet: HashSet stores keys only; HashMap stores key+value pairs.`,
    commonMistakes: [
      `Using mutable objects (lists) as keys — they are not hashable in Python.`,
      `Concurrent modification during iteration — ConcurrentModificationException in Java.`,
      `Assuming insertion order is preserved in older Java/C++ — use LinkedHashMap for order.`,
      `Null key handling varies: Java allows one null key; C++ unordered_map does not.`,
    ],
    interviewQuestions: [
      `Two Sum: find two numbers summing to target — O(n) with hash map.`,
      `Group anagrams using a hash map of sorted-string keys.`,
      `Find the first non-repeating character in a string.`,
      `Count word frequencies in a document.`,
      `Design LRU Cache: hash map + doubly linked list.`,
      `Subarray sum equals k: prefix-sum hash map.`,
    ],
    pseudocode: `INSERT(map, key, value):\n  idx = hash(key) % capacity\n  for entry in buckets[idx]:\n    if entry.key == key: entry.value = value; return\n  buckets[idx].append(Entry(key, value))\n  size++; if load_factor > 0.75: resize()\n\nGET(map, key):\n  for entry in buckets[hash(key) % capacity]:\n    if entry.key == key: return entry.value\n  return NOT_FOUND`,
    stepByStep: [
      `Compute hash(key) % capacity to find the bucket index`,
      `Search bucket's chain for existing entry with the same key`,
      `If found: update value in place (no duplicate keys)`,
      `If not found: append new (key, value) entry to bucket chain`,
      `If load_factor (size/capacity) > 0.75: double capacity, rehash all entries`,
      `Delete: find entry in bucket chain, remove it, decrement size`,
    ],
    relatedTopics: ['hash-table', 'hash-set', 'bloom-filter', 'lru-cache'],
    complexity: { access: 'O(1)', search: 'O(1)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
  },

  'hash-set': {
    definition: `A Hash Set is a collection that stores only unique elements with no defined ordering. It is backed by a hash table using elements themselves as keys (with no associated value). The core operation is O(1) average membership testing: "is X in the set?". Hash Sets model mathematical sets and support union, intersection, and difference operations efficiently.`,
    history: `Hash sets emerged from hash tables with a set-specific API in standard libraries in the 1990s. Java HashSet (Java 1.2, 1998) is implemented as a HashMap with a dummy value. Python's built-in set type (Python 2.4, 2004) is one of the most widely-used built-in types in Python. C++ unordered_set (C++11) and Rust HashSet complete the landscape of standard library hash sets.`,
    intuition: `A hash set is like an instant-answer guest list: you can check in O(1) if anyone is on it, add new names, or remove them. No duplicates exist — adding the same name twice changes nothing. The hash function determines exactly which spot on the list to look at for each name.`,
    mathematicalFoundation: `Set operations:\n  Union A union B: O(|A|+|B|)\n  Intersection A intersection B: O(min(|A|,|B|))\n  Difference A minus B: O(|A|)\n  Subset check A subset of B: O(|A|)\nAll basic ops (add/contains/remove): O(1) average`,
    applications: `Duplicate detection in streams. Visited set in BFS/DFS graph traversal. Spell checker dictionaries. Finding unique elements. Two-pointer and sliding-window uniqueness checks. Mathematical set operations. Longest consecutive sequence (O(n) with hash set lookup).`,
    advantages: `O(1) average membership test, insert, remove. Automatically enforces uniqueness. Clean API for set algebra operations. More memory-efficient than hash map when values are not needed.`,
    disadvantages: `No ordering — cannot iterate in sorted order. O(n) worst case with bad hash function. Requires hashable (immutable) elements. Not thread-safe without explicit synchronization.`,
    comparisons: `HashSet vs TreeSet: HashSet O(1) unordered; TreeSet O(log n) sorted. HashSet vs List: List allows duplicates O(n) membership; HashSet enforces uniqueness O(1) membership. HashSet vs HashMap: HashSet stores keys only; HashMap stores key+value pairs.`,
    commonMistakes: [
      `Using a list instead of a set for membership testing — O(n) vs O(1) difference.`,
      `Mutating elements after insertion — their hash changes, corrupting the set state.`,
      `Expecting iteration order in Java HashSet — use LinkedHashSet for insertion order.`,
      `Using mutable objects (list, dict) as set elements — they are not hashable.`,
    ],
    interviewQuestions: [
      `Find all unique elements in an unsorted array.`,
      `Detect a cycle in a linked list using a set of visited node addresses.`,
      `Longest consecutive sequence — O(n) using hash set membership checks.`,
      `Find the intersection of two arrays using hash sets.`,
      `Happy Number: detect loop using a set of previously seen values.`,
      `Find duplicate elements in an array.`,
    ],
    pseudocode: `ADD(set, element):\n  if CONTAINS(set, element): return false  // Duplicate\n  idx = hash(element) % capacity\n  set.buckets[idx].append(element)\n  set.size++; if load_factor > 0.75: resize()\n  return true\n\nCONTAINS(set, element):\n  for e in set.buckets[hash(element) % capacity]:\n    if e == element: return true\n  return false`,
    stepByStep: [
      `Hash the element to find its bucket: idx = hash(elem) % capacity`,
      `Add: check bucket for duplicate first; if not found, append and increment size`,
      `Contains: scan bucket chain for matching element — O(1) expected`,
      `Remove: scan bucket chain, remove matching element, decrement size`,
      `Resize when load_factor > 0.75: double capacity, rehash all elements`,
      `Union: iterate all elements of set B, add each to set A using O(1) add`,
    ],
    relatedTopics: ['hash-map', 'hash-table', 'bloom-filter'],
    complexity: { access: 'N/A', search: 'O(1)', insert: 'O(1)', delete: 'O(1)', space: 'O(n)' },
  },
}

// Read the current file
let content = fs.readFileSync(FILE, 'utf8')

// Remove the closing `}` on the last line and append new entries
content = content.trimEnd()
if (content.endsWith('}')) {
  content = content.slice(0, -1).trimEnd()
}

// Build the new TS entries
let addition = ''
for (const [ds, data] of Object.entries(entries)) {
  addition += `\n\n  '${ds}': {\n`
  for (const [key, val] of Object.entries(data)) {
    if (key === 'complexity') {
      const c = val
      addition += `    complexity: { access: '${c.access}', search: '${c.search}', insert: '${c.insert}', delete: '${c.delete}', space: '${c.space}' },\n`
    } else if (Array.isArray(val)) {
      addition += `    ${key}: [\n`
      for (const item of val) addition += `      \`${e(String(item))}\`,\n`
      addition += `    ],\n`
    } else {
      addition += `    ${key}: \`${e(String(val))}\`,\n`
    }
  }
  addition += `  },`
}

content += addition + '\n}\n'
fs.writeFileSync(FILE, content, 'utf8')
console.log('✅ Appended hash-map and hash-set to theoryExpanded2.ts')
