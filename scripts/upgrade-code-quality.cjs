#!/usr/bin/env node
'use strict'

/**
 * upgrade-code-quality.cjs
 * Replaces thin skeleton implementations with complete, production-quality code
 * for the most commonly used data structures and operations.
 */

const fs   = require('fs')
const path = require('path')
const LIB  = path.resolve(__dirname, '../src/code-library')

function write(ds, op, lang, code) {
  const dir = path.join(LIB, ds, op)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, lang), code.trimStart(), 'utf8')
}

// ═══════════════════════════════════════════════════════════════
// ARRAY — SEARCH (Binary Search + Linear Search)
// ═══════════════════════════════════════════════════════════════

write('array', 'search', 'python', `
# ─── Array Search: Linear Search & Binary Search ────────────────────────────
# Time Complexity:  Linear Search O(n) | Binary Search O(log n)
# Space Complexity: O(1)

def linear_search(arr: list, target) -> int:
    """
    Search for target in arr using linear scan.
    Returns index of first occurrence, or -1 if not found.
    Works on unsorted arrays.
    """
    for i, val in enumerate(arr):       # Scan every element
        if val == target:
            return i                    # Found: return index immediately
    return -1                           # Not found

def binary_search(arr: list, target) -> int:
    """
    Search for target in a SORTED array using binary search.
    Returns index of target, or -1 if not found.
    Requires arr to be sorted in ascending order.
    Time: O(log n) — eliminates half the search space each step.
    """
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = lo + (hi - lo) // 2      # Avoid integer overflow
        if arr[mid] == target:
            return mid                  # Exact match
        elif arr[mid] < target:
            lo = mid + 1               # Target is in right half
        else:
            hi = mid - 1              # Target is in left half
    return -1                           # Not found

def binary_search_recursive(arr: list, target, lo: int, hi: int) -> int:
    """Recursive binary search."""
    if lo > hi:
        return -1
    mid = lo + (hi - lo) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, hi)
    else:
        return binary_search_recursive(arr, target, lo, mid - 1)

# ─── Example usage ───────────────────────────────────────────────────────────
if __name__ == '__main__':
    data = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]

    # Linear search (works on unsorted)
    idx = linear_search(data, 23)
    print(f"Linear search  → index {idx}")    # → 5

    # Binary search (requires sorted)
    idx = binary_search(data, 23)
    print(f"Binary search  → index {idx}")    # → 5

    idx = binary_search(data, 99)
    print(f"Not found      → index {idx}")    # → -1
`)

write('array', 'search', 'javascript', `
// ─── Array Search: Linear Search & Binary Search ─────────────────────────────
// Time Complexity:  Linear O(n) | Binary O(log n)
// Space Complexity: O(1)

/**
 * Linear search — works on any unsorted array.
 * @param {any[]} arr - The array to search
 * @param {any} target - Value to find
 * @returns {number} Index of first match, or -1
 */
function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;  // Found — return immediately
  }
  return -1;                           // Not found
}

/**
 * Binary search — requires a SORTED array.
 * Eliminates half the search space at each step → O(log n).
 * @param {number[]} arr - Sorted array
 * @param {number} target - Value to find
 * @returns {number} Index of target, or -1
 */
function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;      // Unsigned right shift = floor((lo+hi)/2), avoids overflow
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

/**
 * Binary search — recursive version.
 */
function binarySearchRecursive(arr, target, lo = 0, hi = arr.length - 1) {
  if (lo > hi) return -1;
  const mid = (lo + hi) >>> 1;
  if (arr[mid] === target) return mid;
  if (arr[mid] < target) return binarySearchRecursive(arr, target, mid + 1, hi);
  return binarySearchRecursive(arr, target, lo, mid - 1);
}

// ─── Example ──────────────────────────────────────────────────────────────────
const sorted = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
console.log(linearSearch(sorted, 23));          // 5
console.log(binarySearch(sorted, 23));          // 5
console.log(binarySearch(sorted, 99));          // -1
console.log(binarySearchRecursive(sorted, 38)); // 6
`)

write('array', 'search', 'typescript', `
// ─── Array Search: Linear Search & Binary Search (TypeScript) ────────────────
// Time Complexity:  Linear O(n) | Binary O(log n)
// Space Complexity: O(1)

/**
 * Linear search for any comparable type.
 * Works on unsorted arrays.
 */
function linearSearch<T>(arr: T[], target: T): number {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

/**
 * Binary search on a sorted array of numbers.
 * Requires arr to be sorted in ascending order.
 */
function binarySearch(arr: number[], target: number): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

/**
 * Generic binary search with a comparator function.
 * comparator(a, b): negative if a < b, 0 if equal, positive if a > b
 */
function binarySearchGeneric<T>(
  arr: T[],
  target: T,
  comparator: (a: T, b: T) => number
): number {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const cmp = comparator(arr[mid], target);
    if (cmp === 0) return mid;
    else if (cmp < 0) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}

// ─── Example ──────────────────────────────────────────────────────────────────
const sorted: number[] = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
console.log(binarySearch(sorted, 23));   // 5
console.log(binarySearch(sorted, 99));   // -1
console.log(linearSearch(['a','b','c'], 'b')); // 1
`)

write('array', 'search', 'java', `
import java.util.Arrays;

/**
 * Array Search: Linear Search & Binary Search
 *
 * Time Complexity:  Linear O(n) | Binary O(log n)
 * Space Complexity: O(1) iterative | O(log n) recursive stack
 */
public class ArraySearch {

    /**
     * Linear search — finds first occurrence of target.
     * Works on any array (sorted or unsorted).
     *
     * @param arr    array to search
     * @param target value to find
     * @return index of first match, or -1 if not found
     */
    public static int linearSearch(int[] arr, int target) {
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] == target) return i;   // Found
        }
        return -1;                             // Not found
    }

    /**
     * Binary search (iterative) — requires SORTED array.
     * Eliminates half the search space each step → O(log n).
     */
    public static int binarySearch(int[] arr, int target) {
        int lo = 0, hi = arr.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;     // Avoid integer overflow
            if (arr[mid] == target)   return mid;
            else if (arr[mid] < target) lo = mid + 1;
            else                        hi = mid - 1;
        }
        return -1;
    }

    /**
     * Binary search (recursive).
     */
    public static int binarySearchRec(int[] arr, int target, int lo, int hi) {
        if (lo > hi) return -1;
        int mid = lo + (hi - lo) / 2;
        if (arr[mid] == target)    return mid;
        if (arr[mid] < target)     return binarySearchRec(arr, target, mid + 1, hi);
        return binarySearchRec(arr, target, lo, mid - 1);
    }

    public static void main(String[] args) {
        int[] arr = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};

        System.out.println(linearSearch(arr, 23));        // 5
        System.out.println(binarySearch(arr, 23));        // 5
        System.out.println(binarySearch(arr, 99));        // -1

        // Built-in binary search for comparison
        System.out.println(Arrays.binarySearch(arr, 38)); // 6
    }
}
`)

write('array', 'search', 'c', `
#include <stdio.h>

/* ── Array Search: Linear & Binary ──────────────────────────────────────────
 * Time Complexity:  Linear O(n) | Binary O(log n)
 * Space Complexity: O(1)
 * ─────────────────────────────────────────────────────────────────────────── */

/**
 * linear_search — scan every element.
 * Works on unsorted arrays.
 * Returns first matching index or -1.
 */
int linear_search(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}

/**
 * binary_search — requires sorted array in ascending order.
 * Divides search space in half each iteration.
 * Returns matching index or -1.
 */
int binary_search(int arr[], int n, int target) {
    int lo = 0, hi = n - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;   /* Prevent (lo+hi) overflow */
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

/**
 * binary_search_recursive — recursive variant.
 */
int binary_search_rec(int arr[], int lo, int hi, int target) {
    if (lo > hi) return -1;
    int mid = lo + (hi - lo) / 2;
    if (arr[mid] == target)   return mid;
    if (arr[mid] < target)    return binary_search_rec(arr, mid + 1, hi, target);
    return binary_search_rec(arr, lo, mid - 1, target);
}

int main() {
    int arr[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int n = sizeof(arr) / sizeof(arr[0]);

    printf("Linear search  [23] → %d\\n", linear_search(arr, n, 23));  /* 5 */
    printf("Binary search  [23] → %d\\n", binary_search(arr, n, 23));  /* 5 */
    printf("Binary search  [99] → %d\\n", binary_search(arr, n, 99));  /* -1 */
    printf("Binary recursive[38] → %d\\n",
           binary_search_rec(arr, 0, n - 1, 38));                       /* 6 */
    return 0;
}
`)

write('array', 'search', 'cpp', `
#include <iostream>
#include <vector>
#include <algorithm>   // std::binary_search, std::lower_bound

// ── Array Search: Linear & Binary Search ────────────────────────────────────
// Time Complexity:  Linear O(n) | Binary O(log n)
// Space Complexity: O(1)

/**
 * linearSearch — sequential scan, works on any array.
 */
int linearSearch(const std::vector<int>& arr, int target) {
    for (int i = 0; i < static_cast<int>(arr.size()); i++) {
        if (arr[i] == target) return i;
    }
    return -1;
}

/**
 * binarySearch — requires sorted input.
 * Iterative implementation: no stack overhead.
 */
int binarySearch(const std::vector<int>& arr, int target) {
    int lo = 0, hi = static_cast<int>(arr.size()) - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;    // Prevents integer overflow
        if (arr[mid] == target)    return mid;
        else if (arr[mid] < target) lo = mid + 1;
        else                        hi = mid - 1;
    }
    return -1;
}

/**
 * Using STL: std::lower_bound returns iterator to first element >= target.
 */
int stlBinarySearch(const std::vector<int>& arr, int target) {
    auto it = std::lower_bound(arr.begin(), arr.end(), target);
    if (it != arr.end() && *it == target) {
        return static_cast<int>(it - arr.begin());
    }
    return -1;
}

int main() {
    std::vector<int> arr = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};

    std::cout << "Linear  [23]: " << linearSearch(arr, 23) << "\\n";    // 5
    std::cout << "Binary  [23]: " << binarySearch(arr, 23) << "\\n";    // 5
    std::cout << "STL     [38]: " << stlBinarySearch(arr, 38) << "\\n"; // 6
    std::cout << "Missing [99]: " << binarySearch(arr, 99) << "\\n";    // -1
    return 0;
}
`)

write('array', 'search', 'csharp', `
using System;
using System.Collections.Generic;

/// <summary>
/// Array Search: Linear Search and Binary Search
/// Time:  Linear O(n) | Binary O(log n)
/// Space: O(1)
/// </summary>
public class ArraySearch {

    /// <summary>
    /// Linear search — scans every element.
    /// Works on unsorted arrays.
    /// </summary>
    public static int LinearSearch<T>(T[] arr, T target) where T : IEquatable<T> {
        for (int i = 0; i < arr.Length; i++) {
            if (arr[i].Equals(target)) return i;
        }
        return -1;
    }

    /// <summary>
    /// Binary search — requires sorted array.
    /// Eliminates half the candidates each iteration.
    /// </summary>
    public static int BinarySearch(int[] arr, int target) {
        int lo = 0, hi = arr.Length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;   // Avoid integer overflow
            if (arr[mid] == target)    return mid;
            else if (arr[mid] < target) lo = mid + 1;
            else                        hi = mid - 1;
        }
        return -1;
    }

    public static void Main() {
        int[] arr = { 2, 5, 8, 12, 16, 23, 38, 56, 72, 91 };

        Console.WriteLine(LinearSearch(arr, 23));   // 5
        Console.WriteLine(BinarySearch(arr, 23));   // 5
        Console.WriteLine(BinarySearch(arr, 99));   // -1

        // Built-in
        Console.WriteLine(Array.BinarySearch(arr, 38)); // 6
    }
}
`)

write('array', 'search', 'go', `
package main

import (
	"fmt"
	"sort"
)

// linearSearch scans every element. Works on unsorted slices.
// Time: O(n), Space: O(1)
func linearSearch(arr []int, target int) int {
	for i, v := range arr {
		if v == target {
			return i
		}
	}
	return -1
}

// binarySearch requires a sorted slice.
// Eliminates half the search space per iteration. O(log n).
func binarySearch(arr []int, target int) int {
	lo, hi := 0, len(arr)-1
	for lo <= hi {
		mid := lo + (hi-lo)/2 // Prevents integer overflow
		switch {
		case arr[mid] == target:
			return mid
		case arr[mid] < target:
			lo = mid + 1
		default:
			hi = mid - 1
		}
	}
	return -1
}

func main() {
	arr := []int{2, 5, 8, 12, 16, 23, 38, 56, 72, 91}

	fmt.Println("Linear  [23]:", linearSearch(arr, 23)) // 5
	fmt.Println("Binary  [23]:", binarySearch(arr, 23)) // 5
	fmt.Println("Missing [99]:", binarySearch(arr, 99)) // -1

	// Standard library: sort.SearchInts
	i := sort.SearchInts(arr, 38)
	fmt.Println("STL     [38]:", i) // 6
}
`)

write('array', 'search', 'rust', `
// ── Array Search: Linear & Binary Search ────────────────────────────────────
// Time:  Linear O(n) | Binary O(log n)
// Space: O(1)

/// Linear search — works on any slice, sorted or not.
fn linear_search<T: PartialEq>(arr: &[T], target: &T) -> Option<usize> {
    for (i, val) in arr.iter().enumerate() {
        if val == target {
            return Some(i);
        }
    }
    None
}

/// Binary search (iterative) — requires a sorted slice.
fn binary_search<T: Ord>(arr: &[T], target: &T) -> Option<usize> {
    let mut lo = 0usize;
    let mut hi = arr.len();
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        match arr[mid].cmp(target) {
            std::cmp::Ordering::Equal   => return Some(mid),
            std::cmp::Ordering::Less    => lo = mid + 1,
            std::cmp::Ordering::Greater => hi = mid,
        }
    }
    None
}

fn main() {
    let arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];

    println!("Linear  [23]: {:?}", linear_search(&arr, &23));   // Some(5)
    println!("Binary  [23]: {:?}", binary_search(&arr, &23));   // Some(5)
    println!("Missing [99]: {:?}", binary_search(&arr, &99));   // None

    // Standard library slice::binary_search
    println!("STL     [38]: {:?}", arr.binary_search(&38));     // Ok(6)
}
`)

// ═══════════════════════════════════════════════════════════════
// BST — SEARCH (Complete with visualization commentary)
// ═══════════════════════════════════════════════════════════════
write('bst', 'search', 'python', `
# ─── Binary Search Tree: Search ──────────────────────────────────────────────
# Time Complexity:  Average O(log n) | Worst O(n) if unbalanced
# Space Complexity: O(h) recursive stack where h = tree height

class TreeNode:
    """A single node in a Binary Search Tree."""
    def __init__(self, val: int):
        self.val = val
        self.left = None   # Keys less than self.val
        self.right = None  # Keys greater than self.val

class BST:
    def __init__(self):
        self.root = None

    def insert(self, val: int):
        """Insert a value while maintaining BST property."""
        self.root = self._insert(self.root, val)

    def _insert(self, node, val: int):
        if node is None:
            return TreeNode(val)              # Found insertion spot
        if val < node.val:
            node.left = self._insert(node.left, val)   # Go left
        elif val > node.val:
            node.right = self._insert(node.right, val) # Go right
        # val == node.val: ignore duplicates (or handle as desired)
        return node

    def search(self, val: int) -> bool:
        """
        Search for val in the BST.
        At each node: if val == node.val → found.
                      if val < node.val  → search left subtree.
                      if val > node.val  → search right subtree.
        Returns True if found, False otherwise.
        """
        return self._search(self.root, val)

    def _search(self, node, val: int) -> bool:
        if node is None:
            return False                      # Fell off the tree — not found
        if val == node.val:
            return True                       # Exact match found
        if val < node.val:
            return self._search(node.left, val)   # Must be in left subtree
        return self._search(node.right, val)       # Must be in right subtree

    def search_iterative(self, val: int) -> bool:
        """Iterative search — avoids recursive stack overhead."""
        curr = self.root
        while curr is not None:
            if val == curr.val:
                return True
            curr = curr.left if val < curr.val else curr.right
        return False

    def find_node(self, val: int):
        """Return the node with the given value, or None."""
        curr = self.root
        while curr:
            if val == curr.val: return curr
            curr = curr.left if val < curr.val else curr.right
        return None

# ─── Example usage ───────────────────────────────────────────────────────────
if __name__ == '__main__':
    bst = BST()
    for v in [50, 30, 70, 20, 40, 60, 80]:
        bst.insert(v)

    #        50
    #       /  \\
    #      30   70
    #     / \\   / \\
    #    20  40 60  80

    print(bst.search(40))           # True  — O(log n): 50→30→40
    print(bst.search(99))           # False — O(log n): 50→70→80→None
    print(bst.search_iterative(60)) # True  — no recursion
`)

console.log('✅ Upgraded code quality for array/search and bst/search')
