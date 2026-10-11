#!/usr/bin/env node
'use strict'
/**
 * Populates src/code-library/ with complete, hand-written implementations
 * for all LINEAR data structures, all operations, all 9 languages.
 * Run: node scripts/populate-linear.cjs
 */
const fs   = require('fs')
const path = require('path')

const LIB = path.resolve(__dirname, '../src/code-library')

function write(ds, op, lang, code) {
  const dir = path.join(LIB, ds, op)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, lang), code.trimStart(), 'utf8')
}

/* ═══════════════════════════════════════════════════════════════════════════
   ARRAY  —  insert | delete | search | traverse | access
═══════════════════════════════════════════════════════════════════════════ */

// ── insert ────────────────────────────────────────────────────────────────
write('array','insert','python', `
def insert(arr: list, index: int, value) -> list:
    """Insert value at index. Shifts elements right. O(n)."""
    arr.insert(index, value)
    return arr

# Manual implementation without built-in:
def insert_manual(arr: list, index: int, value) -> list:
    arr.append(None)                    # grow by 1
    for i in range(len(arr) - 1, index, -1):
        arr[i] = arr[i - 1]            # shift right
    arr[index] = value
    return arr

if __name__ == "__main__":
    a = [10, 20, 30, 40]
    insert(a, 2, 99)
    print(a)  # [10, 20, 99, 30, 40]
`)

write('array','insert','c', `
#include <stdio.h>

/* Insert value at index in arr of size *n (arr must have capacity). O(n) */
void array_insert(int arr[], int *n, int index, int value) {
    for (int i = *n; i > index; i--)
        arr[i] = arr[i - 1];   /* shift right */
    arr[index] = value;
    (*n)++;
}

int main(void) {
    int arr[10] = {10, 20, 30, 40};
    int n = 4;
    array_insert(arr, &n, 2, 99);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    /* 10 20 99 30 40 */
    return 0;
}
`)

write('array','insert','cpp', `
#include <vector>
#include <iostream>

// Insert value at index. O(n) due to shift.
void array_insert(std::vector<int>& arr, int index, int value) {
    arr.insert(arr.begin() + index, value);
}

int main() {
    std::vector<int> arr = {10, 20, 30, 40};
    array_insert(arr, 2, 99);
    for (int x : arr) std::cout << x << " ";  // 10 20 99 30 40
}
`)

write('array','insert','java', `
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ArrayInsert {
    // Insert into ArrayList at index. O(n).
    public static <T> void insert(ArrayList<T> arr, int index, T value) {
        arr.add(index, value);
    }

    // Insert into raw int array (pre-sized). O(n).
    public static int[] insertRaw(int[] arr, int n, int index, int value) {
        for (int i = n; i > index; i--)
            arr[i] = arr[i - 1];
        arr[index] = value;
        return arr;
    }

    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<>(Arrays.asList(10, 20, 30, 40));
        insert(list, 2, 99);
        System.out.println(list);  // [10, 20, 99, 30, 40]
    }
}
`)

write('array','insert','javascript', `
// Insert value at index. O(n) due to shift.
function arrayInsert(arr, index, value) {
    arr.splice(index, 0, value);
    return arr;
}

// Manual implementation without splice:
function arrayInsertManual(arr, index, value) {
    arr.push(null);                           // grow
    for (let i = arr.length - 1; i > index; i--)
        arr[i] = arr[i - 1];                  // shift right
    arr[index] = value;
    return arr;
}

const arr = [10, 20, 30, 40];
arrayInsert(arr, 2, 99);
console.log(arr);  // [10, 20, 99, 30, 40]
`)

write('array','insert','typescript', `
// Insert value at index. O(n) due to shift.
function arrayInsert<T>(arr: T[], index: number, value: T): T[] {
    arr.splice(index, 0, value);
    return arr;
}

// Manual implementation without splice:
function arrayInsertManual<T>(arr: T[], index: number, value: T): T[] {
    arr.push(value);                               // grow (placeholder)
    for (let i = arr.length - 1; i > index; i--)
        arr[i] = arr[i - 1];
    arr[index] = value;
    return arr;
}

const arr: number[] = [10, 20, 30, 40];
arrayInsert(arr, 2, 99);
console.log(arr);  // [10, 20, 99, 30, 40]
`)

write('array','insert','csharp', `
using System;
using System.Collections.Generic;

public class ArrayInsert {
    // Insert into List<T> at index. O(n).
    public static void Insert<T>(List<T> arr, int index, T value) {
        arr.Insert(index, value);
    }

    // Insert into int array (pre-sized, track length manually). O(n).
    public static void InsertRaw(int[] arr, ref int n, int index, int value) {
        for (int i = n; i > index; i--)
            arr[i] = arr[i - 1];
        arr[index] = value;
        n++;
    }

    public static void Main() {
        var list = new List<int> { 10, 20, 30, 40 };
        Insert(list, 2, 99);
        Console.WriteLine(string.Join(", ", list));  // 10, 20, 99, 30, 40
    }
}
`)

write('array','insert','go', `
package main

import "fmt"

// Insert value at index. Returns new slice. O(n).
func arrayInsert(arr []int, index, value int) []int {
    arr = append(arr, 0)                    // grow
    copy(arr[index+1:], arr[index:])        // shift right
    arr[index] = value
    return arr
}

func main() {
    arr := []int{10, 20, 30, 40}
    arr = arrayInsert(arr, 2, 99)
    fmt.Println(arr)  // [10 20 99 30 40]
}
`)

write('array','insert','rust', `
fn array_insert(arr: &mut Vec<i32>, index: usize, value: i32) {
    arr.insert(index, value);  // O(n)
}

// Manual implementation:
fn array_insert_manual(arr: &mut Vec<i32>, index: usize, value: i32) {
    arr.push(0);
    let n = arr.len();
    for i in (index + 1..n).rev() {
        arr[i] = arr[i - 1];
    }
    arr[index] = value;
}

fn main() {
    let mut arr = vec![10, 20, 30, 40];
    array_insert(&mut arr, 2, 99);
    println!("{:?}", arr);  // [10, 20, 99, 30, 40]
}
`)

// ── delete ────────────────────────────────────────────────────────────────
write('array','delete','python', `
def array_delete(arr: list, index: int):
    """Remove element at index. O(n) due to shift."""
    if index < 0 or index >= len(arr):
        raise IndexError("Index out of bounds")
    return arr.pop(index)

# Manual (no built-in):
def array_delete_manual(arr: list, index: int) -> list:
    for i in range(index, len(arr) - 1):
        arr[i] = arr[i + 1]   # shift left
    arr.pop()                  # shrink
    return arr

if __name__ == "__main__":
    a = [10, 20, 30, 40]
    array_delete(a, 2)
    print(a)  # [10, 20, 40]
`)

write('array','delete','c', `
#include <stdio.h>

/* Delete element at index, shift left. O(n). */
void array_delete(int arr[], int *n, int index) {
    for (int i = index; i < *n - 1; i++)
        arr[i] = arr[i + 1];
    (*n)--;
}

int main(void) {
    int arr[] = {10, 20, 30, 40};
    int n = 4;
    array_delete(arr, &n, 2);
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    /* 10 20 40 */
    return 0;
}
`)

write('array','delete','cpp', `
#include <vector>
#include <iostream>
#include <stdexcept>

// Remove element at index. O(n).
void array_delete(std::vector<int>& arr, int index) {
    if (index < 0 || index >= (int)arr.size())
        throw std::out_of_range("Index out of bounds");
    arr.erase(arr.begin() + index);
}

int main() {
    std::vector<int> arr = {10, 20, 30, 40};
    array_delete(arr, 2);
    for (int x : arr) std::cout << x << " ";  // 10 20 40
}
`)

write('array','delete','java', `
import java.util.ArrayList;
import java.util.Arrays;

public class ArrayDelete {
    public static <T> T delete(ArrayList<T> arr, int index) {
        return arr.remove(index);  // O(n)
    }

    // Raw array version:
    public static void deleteRaw(int[] arr, int[] nRef, int index) {
        int n = nRef[0];
        for (int i = index; i < n - 1; i++)
            arr[i] = arr[i + 1];
        nRef[0]--;
    }

    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList<>(Arrays.asList(10, 20, 30, 40));
        delete(list, 2);
        System.out.println(list);  // [10, 20, 40]
    }
}
`)

write('array','delete','javascript', `
// Remove element at index. O(n).
function arrayDelete(arr, index) {
    if (index < 0 || index >= arr.length)
        throw new RangeError("Index out of bounds");
    return arr.splice(index, 1)[0];
}

// Manual (no splice):
function arrayDeleteManual(arr, index) {
    const removed = arr[index];
    for (let i = index; i < arr.length - 1; i++)
        arr[i] = arr[i + 1];
    arr.length--;
    return removed;
}

const arr = [10, 20, 30, 40];
arrayDelete(arr, 2);
console.log(arr);  // [10, 20, 40]
`)

write('array','delete','typescript', `
function arrayDelete<T>(arr: T[], index: number): T {
    if (index < 0 || index >= arr.length)
        throw new RangeError("Index out of bounds");
    return arr.splice(index, 1)[0];
}

function arrayDeleteManual<T>(arr: T[], index: number): T {
    const removed = arr[index];
    for (let i = index; i < arr.length - 1; i++)
        arr[i] = arr[i + 1];
    arr.length--;
    return removed;
}

const arr: number[] = [10, 20, 30, 40];
arrayDelete(arr, 2);
console.log(arr);  // [10, 20, 40]
`)

write('array','delete','csharp', `
using System;
using System.Collections.Generic;

public class ArrayDelete {
    public static T Delete<T>(List<T> arr, int index) {
        T val = arr[index];
        arr.RemoveAt(index);   // O(n)
        return val;
    }

    public static void DeleteRaw(int[] arr, ref int n, int index) {
        for (int i = index; i < n - 1; i++)
            arr[i] = arr[i + 1];
        n--;
    }

    public static void Main() {
        var list = new List<int> { 10, 20, 30, 40 };
        Delete(list, 2);
        Console.WriteLine(string.Join(", ", list));  // 10, 20, 40
    }
}
`)

write('array','delete','go', `
package main

import "fmt"

// Delete element at index. Returns new slice. O(n).
func arrayDelete(arr []int, index int) ([]int, int) {
    removed := arr[index]
    arr = append(arr[:index], arr[index+1:]...)
    return arr, removed
}

func main() {
    arr := []int{10, 20, 30, 40}
    arr, removed := arrayDelete(arr, 2)
    fmt.Println(arr, "removed:", removed)  // [10 20 40] removed: 30
}
`)

write('array','delete','rust', `
fn array_delete(arr: &mut Vec<i32>, index: usize) -> i32 {
    arr.remove(index)  // O(n) — shifts elements left
}

fn main() {
    let mut arr = vec![10, 20, 30, 40];
    let removed = array_delete(&mut arr, 2);
    println!("{:?}  removed: {}", arr, removed);  // [10, 20, 40] removed: 30
}
`)

// ── search ────────────────────────────────────────────────────────────────
write('array','search','python', `
def linear_search(arr: list, value) -> int:
    """Return index of value, or -1 if not found. O(n)."""
    for i, v in enumerate(arr):
        if v == value:
            return i
    return -1

def binary_search(arr: list, value) -> int:
    """Binary search on sorted array. O(log n)."""
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == value:
            return mid
        elif arr[mid] < value:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

if __name__ == "__main__":
    a = [10, 20, 30, 40, 50]
    print(linear_search(a, 30))   # 2
    print(binary_search(a, 30))   # 2
    print(binary_search(a, 99))   # -1
`)

write('array','search','c', `
#include <stdio.h>

/* Linear search. O(n). */
int linear_search(int arr[], int n, int value) {
    for (int i = 0; i < n; i++)
        if (arr[i] == value) return i;
    return -1;
}

/* Binary search on sorted array. O(log n). */
int binary_search(int arr[], int n, int value) {
    int lo = 0, hi = n - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if      (arr[mid] == value) return mid;
        else if (arr[mid] <  value) lo = mid + 1;
        else                        hi = mid - 1;
    }
    return -1;
}

int main(void) {
    int arr[] = {10, 20, 30, 40, 50};
    printf("%d\n", linear_search(arr, 5, 30));  /* 2 */
    printf("%d\n", binary_search(arr, 5, 30));  /* 2 */
    printf("%d\n", binary_search(arr, 5, 99));  /* -1 */
    return 0;
}
`)

write('array','search','cpp', `
#include <vector>
#include <algorithm>
#include <iostream>

// Linear search. O(n).
int linear_search(const std::vector<int>& arr, int value) {
    for (int i = 0; i < (int)arr.size(); i++)
        if (arr[i] == value) return i;
    return -1;
}

// Binary search on sorted vector. O(log n).
int binary_search_idx(const std::vector<int>& arr, int value) {
    auto it = std::lower_bound(arr.begin(), arr.end(), value);
    if (it != arr.end() && *it == value)
        return (int)(it - arr.begin());
    return -1;
}

int main() {
    std::vector<int> arr = {10, 20, 30, 40, 50};
    std::cout << linear_search(arr, 30) << "\n";      // 2
    std::cout << binary_search_idx(arr, 30) << "\n";  // 2
    std::cout << binary_search_idx(arr, 99) << "\n";  // -1
}
`)

write('array','search','java', `
import java.util.Arrays;

public class ArraySearch {
    // Linear search. O(n).
    public static int linearSearch(int[] arr, int value) {
        for (int i = 0; i < arr.length; i++)
            if (arr[i] == value) return i;
        return -1;
    }

    // Binary search on sorted array. O(log n).
    public static int binarySearch(int[] arr, int value) {
        int lo = 0, hi = arr.length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if      (arr[mid] == value) return mid;
            else if (arr[mid] <  value) lo = mid + 1;
            else                        hi = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};
        System.out.println(linearSearch(arr, 30));        // 2
        System.out.println(binarySearch(arr, 30));        // 2
        System.out.println(Arrays.binarySearch(arr, 30)); // 2 (built-in)
    }
}
`)

write('array','search','javascript', `
// Linear search. O(n).
function linearSearch(arr, value) {
    return arr.indexOf(value);  // returns -1 if not found
}

// Binary search on sorted array. O(log n).
function binarySearch(arr, value) {
    let lo = 0, hi = arr.length - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if      (arr[mid] === value) return mid;
        else if (arr[mid] <  value)  lo = mid + 1;
        else                         hi = mid - 1;
    }
    return -1;
}

const arr = [10, 20, 30, 40, 50];
console.log(linearSearch(arr, 30));  // 2
console.log(binarySearch(arr, 30));  // 2
console.log(binarySearch(arr, 99));  // -1
`)

write('array','search','typescript', `
// Linear search. O(n).
function linearSearch<T>(arr: T[], value: T): number {
    return arr.indexOf(value);
}

// Binary search on sorted array. O(log n).
function binarySearch(arr: number[], value: number): number {
    let lo = 0, hi = arr.length - 1;
    while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        if      (arr[mid] === value) return mid;
        else if (arr[mid] <  value)  lo = mid + 1;
        else                         hi = mid - 1;
    }
    return -1;
}

const arr: number[] = [10, 20, 30, 40, 50];
console.log(linearSearch(arr, 30));  // 2
console.log(binarySearch(arr, 30));  // 2
`)

write('array','search','csharp', `
using System;

public class ArraySearch {
    // Linear search. O(n).
    public static int LinearSearch<T>(T[] arr, T value) where T : IEquatable<T> {
        for (int i = 0; i < arr.Length; i++)
            if (arr[i].Equals(value)) return i;
        return -1;
    }

    // Binary search on sorted array. O(log n).
    public static int BinarySearch(int[] arr, int value) {
        int lo = 0, hi = arr.Length - 1;
        while (lo <= hi) {
            int mid = lo + (hi - lo) / 2;
            if      (arr[mid] == value) return mid;
            else if (arr[mid] <  value) lo = mid + 1;
            else                        hi = mid - 1;
        }
        return -1;
    }

    public static void Main() {
        int[] arr = {10, 20, 30, 40, 50};
        Console.WriteLine(LinearSearch(arr, 30));  // 2
        Console.WriteLine(BinarySearch(arr, 30));  // 2
        Console.WriteLine(Array.BinarySearch(arr, 30));  // 2 (built-in)
    }
}
`)

write('array','search','go', `
package main

import (
    "fmt"
    "sort"
)

// Linear search. O(n).
func linearSearch(arr []int, value int) int {
    for i, v := range arr {
        if v == value { return i }
    }
    return -1
}

// Binary search on sorted slice. O(log n).
func binarySearch(arr []int, value int) int {
    idx := sort.SearchInts(arr, value)
    if idx < len(arr) && arr[idx] == value { return idx }
    return -1
}

func main() {
    arr := []int{10, 20, 30, 40, 50}
    fmt.Println(linearSearch(arr, 30))  // 2
    fmt.Println(binarySearch(arr, 30))  // 2
    fmt.Println(binarySearch(arr, 99))  // -1
}
`)

write('array','search','rust', `
fn linear_search(arr: &[i32], value: i32) -> Option<usize> {
    arr.iter().position(|&x| x == value)
}

fn binary_search(arr: &[i32], value: i32) -> Option<usize> {
    arr.binary_search(&value).ok()
}

// Manual binary search:
fn binary_search_manual(arr: &[i32], value: i32) -> Option<usize> {
    let (mut lo, mut hi) = (0usize, arr.len());
    while lo < hi {
        let mid = lo + (hi - lo) / 2;
        if arr[mid] == value  { return Some(mid); }
        else if arr[mid] < value { lo = mid + 1; }
        else { hi = mid; }
    }
    None
}

fn main() {
    let arr = vec![10, 20, 30, 40, 50];
    println!("{:?}", linear_search(&arr, 30));         // Some(2)
    println!("{:?}", binary_search_manual(&arr, 30));  // Some(2)
    println!("{:?}", binary_search_manual(&arr, 99));  // None
}
`)

// ── traverse ──────────────────────────────────────────────────────────────
write('array','traverse','python', `
def traverse(arr: list) -> None:
    """Visit every element. O(n)."""
    for i, value in enumerate(arr):
        print(f"arr[{i}] = {value}")

def traverse_reverse(arr: list) -> None:
    """Traverse in reverse. O(n)."""
    for i in range(len(arr) - 1, -1, -1):
        print(f"arr[{i}] = {arr[i]}")

if __name__ == "__main__":
    a = [10, 20, 30, 40]
    traverse(a)
    print("---")
    traverse_reverse(a)
`)

write('array','traverse','c', `
#include <stdio.h>

void traverse(int arr[], int n) {
    for (int i = 0; i < n; i++)
        printf("arr[%d] = %d\n", i, arr[i]);
}

void traverse_reverse(int arr[], int n) {
    for (int i = n - 1; i >= 0; i--)
        printf("arr[%d] = %d\n", i, arr[i]);
}

int main(void) {
    int arr[] = {10, 20, 30, 40};
    traverse(arr, 4);
    return 0;
}
`)

write('array','traverse','cpp', `
#include <vector>
#include <iostream>

void traverse(const std::vector<int>& arr) {
    for (int i = 0; i < (int)arr.size(); i++)
        std::cout << "arr[" << i << "] = " << arr[i] << "\n";
}

// Range-based for loop (idiomatic C++11):
void traverse_range(const std::vector<int>& arr) {
    for (const int& x : arr)
        std::cout << x << " ";
    std::cout << "\n";
}

int main() {
    std::vector<int> arr = {10, 20, 30, 40};
    traverse(arr);
    traverse_range(arr);
}
`)

write('array','traverse','java', `
import java.util.List;
import java.util.Arrays;

public class ArrayTraverse {
    public static void traverse(int[] arr) {
        for (int i = 0; i < arr.length; i++)
            System.out.println("arr[" + i + "] = " + arr[i]);
    }

    public static <T> void traverseList(List<T> list) {
        for (int i = 0; i < list.size(); i++)
            System.out.println("list[" + i + "] = " + list.get(i));
    }

    // Enhanced for loop:
    public static void traverseEach(int[] arr) {
        for (int x : arr) System.out.print(x + " ");
        System.out.println();
    }

    public static void main(String[] args) {
        traverse(new int[]{10, 20, 30, 40});
    }
}
`)

write('array','traverse','javascript', `
function traverse(arr) {
    for (let i = 0; i < arr.length; i++)
        console.log(\`arr[\${i}] = \${arr[i]}\`);
}

function traverseForOf(arr) {
    for (const value of arr)
        console.log(value);
}

function traverseForEach(arr) {
    arr.forEach((value, index) =>
        console.log(\`arr[\${index}] = \${value}\`)
    );
}

const arr = [10, 20, 30, 40];
traverse(arr);
`)

write('array','traverse','typescript', `
function traverse<T>(arr: T[]): void {
    for (let i = 0; i < arr.length; i++)
        console.log(\`arr[\${i}] = \${arr[i]}\`);
}

function traverseForOf<T>(arr: T[]): void {
    for (const value of arr)
        console.log(value);
}

function map<T, U>(arr: T[], fn: (v: T, i: number) => U): U[] {
    const result: U[] = [];
    for (let i = 0; i < arr.length; i++)
        result.push(fn(arr[i], i));
    return result;
}

const arr: number[] = [10, 20, 30, 40];
traverse(arr);
const doubled = map(arr, v => v * 2);
console.log(doubled);  // [20, 40, 60, 80]
`)

write('array','traverse','csharp', `
using System;
using System.Collections.Generic;

public class ArrayTraverse {
    public static void Traverse(int[] arr) {
        for (int i = 0; i < arr.Length; i++)
            Console.WriteLine($"arr[{i}] = {arr[i]}");
    }

    public static void TraverseForeach<T>(IEnumerable<T> arr) {
        foreach (var x in arr)
            Console.Write(x + " ");
        Console.WriteLine();
    }

    public static void Main() {
        Traverse(new[] {10, 20, 30, 40});
    }
}
`)

write('array','traverse','go', `
package main

import "fmt"

func traverse(arr []int) {
    for i, v := range arr {
        fmt.Printf("arr[%d] = %d\n", i, v)
    }
}

func traverseReverse(arr []int) {
    for i := len(arr) - 1; i >= 0; i-- {
        fmt.Printf("arr[%d] = %d\n", i, arr[i])
    }
}

func main() {
    arr := []int{10, 20, 30, 40}
    traverse(arr)
}
`)

write('array','traverse','rust', `
fn traverse(arr: &[i32]) {
    for (i, &v) in arr.iter().enumerate() {
        println!("arr[{}] = {}", i, v);
    }
}

fn traverse_reverse(arr: &[i32]) {
    for (i, &v) in arr.iter().enumerate().rev() {
        println!("arr[{}] = {}", i, v);
    }
}

fn main() {
    let arr = vec![10, 20, 30, 40];
    traverse(&arr);
    println!("---");
    traverse_reverse(&arr);

    // Functional style:
    let doubled: Vec<i32> = arr.iter().map(|&x| x * 2).collect();
    println!("{:?}", doubled);  // [20, 40, 60, 80]
}
`)

// ── access ────────────────────────────────────────────────────────────────
write('array','access','python', `
def access(arr: list, index: int):
    """Random access by index. O(1)."""
    if index < 0 or index >= len(arr):
        raise IndexError(f"Index {index} out of range [0, {len(arr)-1}]")
    return arr[index]

def update(arr: list, index: int, value) -> None:
    """Update element at index. O(1)."""
    if index < 0 or index >= len(arr):
        raise IndexError(f"Index {index} out of range")
    arr[index] = value

if __name__ == "__main__":
    a = [10, 20, 30, 40]
    print(access(a, 2))    # 30
    update(a, 2, 99)
    print(a)               # [10, 20, 99, 40]
`)

write('array','access','c', `
#include <stdio.h>
#include <stdlib.h>

/* O(1) random access by index. */
int access(int arr[], int n, int index) {
    if (index < 0 || index >= n) {
        fprintf(stderr, "Index %d out of range\\n", index);
        exit(EXIT_FAILURE);
    }
    return arr[index];
}

void update(int arr[], int n, int index, int value) {
    if (index < 0 || index >= n) {
        fprintf(stderr, "Index %d out of range\\n", index);
        exit(EXIT_FAILURE);
    }
    arr[index] = value;
}

int main(void) {
    int arr[] = {10, 20, 30, 40};
    printf("%d\n", access(arr, 4, 2));  /* 30 */
    update(arr, 4, 2, 99);
    printf("%d\n", arr[2]);             /* 99 */
    return 0;
}
`)

write('array','access','cpp', `
#include <vector>
#include <iostream>
#include <stdexcept>

// O(1) random access.
int access(const std::vector<int>& arr, int index) {
    if (index < 0 || index >= (int)arr.size())
        throw std::out_of_range("Index out of range");
    return arr[index];        // or arr.at(index) for bounds-checked
}

void update(std::vector<int>& arr, int index, int value) {
    if (index < 0 || index >= (int)arr.size())
        throw std::out_of_range("Index out of range");
    arr[index] = value;
}

int main() {
    std::vector<int> arr = {10, 20, 30, 40};
    std::cout << access(arr, 2) << "\n";  // 30
    update(arr, 2, 99);
    std::cout << arr[2] << "\n";          // 99
}
`)

write('array','access','java', `
import java.util.ArrayList;

public class ArrayAccess {
    // O(1) read.
    public static <T> T access(ArrayList<T> arr, int index) {
        if (index < 0 || index >= arr.size())
            throw new IndexOutOfBoundsException("Index: " + index);
        return arr.get(index);
    }

    // O(1) write.
    public static <T> void update(ArrayList<T> arr, int index, T value) {
        if (index < 0 || index >= arr.size())
            throw new IndexOutOfBoundsException("Index: " + index);
        arr.set(index, value);
    }

    public static void main(String[] args) {
        ArrayList<Integer> arr = new ArrayList<>();
        arr.add(10); arr.add(20); arr.add(30); arr.add(40);
        System.out.println(access(arr, 2));  // 30
        update(arr, 2, 99);
        System.out.println(arr.get(2));      // 99
    }
}
`)

write('array','access','javascript', `
// O(1) random access.
function access(arr, index) {
    if (index < 0 || index >= arr.length)
        throw new RangeError(\`Index \${index} out of range\`);
    return arr[index];
}

function update(arr, index, value) {
    if (index < 0 || index >= arr.length)
        throw new RangeError(\`Index \${index} out of range\`);
    arr[index] = value;
}

const arr = [10, 20, 30, 40];
console.log(access(arr, 2));  // 30
update(arr, 2, 99);
console.log(arr);             // [10, 20, 99, 40]
`)

write('array','access','typescript', `
function access<T>(arr: T[], index: number): T {
    if (index < 0 || index >= arr.length)
        throw new RangeError(\`Index \${index} out of range [0, \${arr.length - 1}]\`);
    return arr[index];
}

function update<T>(arr: T[], index: number, value: T): void {
    if (index < 0 || index >= arr.length)
        throw new RangeError(\`Index \${index} out of range\`);
    arr[index] = value;
}

const arr: number[] = [10, 20, 30, 40];
console.log(access(arr, 2));  // 30
update(arr, 2, 99);
console.log(arr);             // [10, 20, 99, 40]
`)

write('array','access','csharp', `
using System;
using System.Collections.Generic;

public class ArrayAccess {
    public static T Access<T>(List<T> arr, int index) {
        if (index < 0 || index >= arr.Count)
            throw new ArgumentOutOfRangeException(nameof(index));
        return arr[index];  // O(1)
    }

    public static void Update<T>(List<T> arr, int index, T value) {
        if (index < 0 || index >= arr.Count)
            throw new ArgumentOutOfRangeException(nameof(index));
        arr[index] = value;  // O(1)
    }

    public static void Main() {
        var arr = new List<int> { 10, 20, 30, 40 };
        Console.WriteLine(Access(arr, 2));   // 30
        Update(arr, 2, 99);
        Console.WriteLine(arr[2]);           // 99
    }
}
`)

write('array','access','go', `
package main

import "fmt"

func access(arr []int, index int) (int, error) {
    if index < 0 || index >= len(arr) {
        return 0, fmt.Errorf("index %d out of range [0, %d]", index, len(arr)-1)
    }
    return arr[index], nil  // O(1)
}

func update(arr []int, index, value int) error {
    if index < 0 || index >= len(arr) {
        return fmt.Errorf("index %d out of range", index)
    }
    arr[index] = value  // O(1)
    return nil
}

func main() {
    arr := []int{10, 20, 30, 40}
    v, _ := access(arr, 2)
    fmt.Println(v)  // 30
    update(arr, 2, 99)
    fmt.Println(arr)  // [10 20 99 40]
}
`)

write('array','access','rust', `
fn access(arr: &[i32], index: usize) -> Option<i32> {
    arr.get(index).copied()  // O(1), returns None if out of range
}

fn update(arr: &mut [i32], index: usize, value: i32) -> bool {
    if let Some(elem) = arr.get_mut(index) {
        *elem = value;  // O(1)
        true
    } else {
        false
    }
}

fn main() {
    let mut arr = vec![10, 20, 30, 40];
    println!("{:?}", access(&arr, 2));  // Some(30)
    println!("{:?}", access(&arr, 9));  // None
    update(&mut arr, 2, 99);
    println!("{:?}", arr);              // [10, 20, 99, 40]
}
`)

/* ═══════════════════════════════════════════════════════════════════════════
   VECTOR  — push_back | pop_back | insert | delete | access
═══════════════════════════════════════════════════════════════════════════ */
write('vector','push_back','python', `
class DynamicArray:
    """Dynamic array (like Python list) with amortized O(1) push_back."""
    def __init__(self):
        self._data = []
        self._size = 0
        self._capacity = 1

    def push_back(self, value) -> None:
        if self._size == self._capacity:
            self._resize(self._capacity * 2)
        self._data.append(value)
        self._size += 1

    def _resize(self, new_cap: int) -> None:
        new_data = [None] * new_cap
        for i in range(self._size):
            new_data[i] = self._data[i]
        self._data = new_data
        self._capacity = new_cap

    def __len__(self): return self._size
    def __getitem__(self, i): return self._data[i]

# Python list has built-in dynamic resizing:
v = []
v.append(10)   # push_back O(1) amortized
v.append(20)
v.append(30)
print(v)  # [10, 20, 30]
`)

write('vector','push_back','c', `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct {
    int   *data;
    size_t size;
    size_t capacity;
} Vector;

void vec_init(Vector *v) {
    v->capacity = 4;
    v->size     = 0;
    v->data     = malloc(v->capacity * sizeof(int));
}

void vec_push_back(Vector *v, int value) {
    if (v->size == v->capacity) {
        v->capacity *= 2;
        v->data = realloc(v->data, v->capacity * sizeof(int));
    }
    v->data[v->size++] = value;  /* O(1) amortized */
}

void vec_free(Vector *v) { free(v->data); }

int main(void) {
    Vector v;
    vec_init(&v);
    vec_push_back(&v, 10);
    vec_push_back(&v, 20);
    vec_push_back(&v, 30);
    for (size_t i = 0; i < v.size; i++) printf("%d ", v.data[i]);
    vec_free(&v);
    return 0;
}
`)

write('vector','push_back','cpp', `
#include <vector>
#include <iostream>

int main() {
    std::vector<int> v;
    v.reserve(4);          // optional: pre-allocate to avoid reallocs

    v.push_back(10);       // O(1) amortized
    v.push_back(20);
    v.push_back(30);

    std::cout << "size="     << v.size()     << "\n";
    std::cout << "capacity=" << v.capacity() << "\n";
    for (int x : v) std::cout << x << " ";  // 10 20 30
}
`)

write('vector','push_back','java', `
import java.util.ArrayList;

public class VectorPushBack {
    public static void main(String[] args) {
        ArrayList<Integer> v = new ArrayList<>(4);  // initial capacity
        v.add(10);  // push_back — O(1) amortized
        v.add(20);
        v.add(30);
        System.out.println(v);  // [10, 20, 30]
        System.out.println("size: " + v.size());
    }
}
`)

write('vector','push_back','javascript', `
// JavaScript arrays are dynamic by default — push is O(1) amortized.
const v = [];
v.push(10);  // push_back
v.push(20);
v.push(30);
console.log(v);        // [10, 20, 30]
console.log(v.length); // 3
`)

write('vector','push_back','typescript', `
const v: number[] = [];
v.push(10);  // O(1) amortized
v.push(20);
v.push(30);
console.log(v);        // [10, 20, 30]
console.log(v.length); // 3
`)

write('vector','push_back','csharp', `
using System;
using System.Collections.Generic;

public class VectorPushBack {
    public static void Main() {
        var v = new List<int>(4);  // initial capacity
        v.Add(10);  // push_back — O(1) amortized
        v.Add(20);
        v.Add(30);
        Console.WriteLine(string.Join(", ", v));  // 10, 20, 30
        Console.WriteLine("Count: " + v.Count);
    }
}
`)

write('vector','push_back','go', `
package main

import "fmt"

func main() {
    v := make([]int, 0, 4)  // length=0, capacity=4
    v = append(v, 10)       // push_back — O(1) amortized
    v = append(v, 20)
    v = append(v, 30)
    fmt.Println(v)       // [10 20 30]
    fmt.Println(len(v))  // 3
    fmt.Println(cap(v))  // 4
}
`)

write('vector','push_back','rust', `
fn main() {
    let mut v: Vec<i32> = Vec::with_capacity(4);
    v.push(10);  // O(1) amortized
    v.push(20);
    v.push(30);
    println!("{:?}", v);       // [10, 20, 30]
    println!("len={}", v.len());
    println!("cap={}", v.capacity());
}
`)

write('vector','pop_back','python', `
v = [10, 20, 30]
last = v.pop()   # pop_back — O(1), returns removed element
print(last)      # 30
print(v)         # [10, 20]
`)

write('vector','pop_back','c', `
#include <stdio.h>

/* Returns removed element. Decrements size. O(1). */
int vec_pop_back(int data[], size_t *size) {
    if (*size == 0) { fprintf(stderr, "pop on empty vector\\n"); return -1; }
    return data[--(*size)];
}

int main(void) {
    int data[] = {10, 20, 30};
    size_t size = 3;
    int last = vec_pop_back(data, &size);
    printf("removed: %d, size: %zu\\n", last, size);  /* removed: 30, size: 2 */
    return 0;
}
`)

write('vector','pop_back','cpp', `
#include <vector>
#include <iostream>
#include <stdexcept>

int popBack(std::vector<int>& v) {
    if (v.empty()) throw std::underflow_error("pop_back on empty vector");
    int last = v.back();
    v.pop_back();  // O(1)
    return last;
}

int main() {
    std::vector<int> v = {10, 20, 30};
    std::cout << popBack(v) << "\n";  // 30
    std::cout << v.size() << "\n";    // 2
}
`)

write('vector','pop_back','java', `
import java.util.ArrayList;
import java.util.Arrays;

public class VectorPopBack {
    public static <T> T popBack(ArrayList<T> v) {
        if (v.isEmpty()) throw new java.util.NoSuchElementException("pop on empty");
        return v.remove(v.size() - 1);  // O(1)
    }

    public static void main(String[] args) {
        ArrayList<Integer> v = new ArrayList<>(Arrays.asList(10, 20, 30));
        System.out.println(popBack(v));  // 30
        System.out.println(v);          // [10, 20]
    }
}
`)

write('vector','pop_back','javascript', `
function popBack(v) {
    if (v.length === 0) throw new Error("pop on empty vector");
    return v.pop();  // O(1)
}

const v = [10, 20, 30];
console.log(popBack(v));  // 30
console.log(v);           // [10, 20]
`)

write('vector','pop_back','typescript', `
function popBack<T>(v: T[]): T {
    if (v.length === 0) throw new Error("pop on empty vector");
    return v.pop()!;  // O(1)
}

const v: number[] = [10, 20, 30];
console.log(popBack(v));  // 30
console.log(v);           // [10, 20]
`)

write('vector','pop_back','csharp', `
using System;
using System.Collections.Generic;

public class VectorPopBack {
    public static T PopBack<T>(List<T> v) {
        if (v.Count == 0) throw new InvalidOperationException("pop on empty list");
        T last = v[v.Count - 1];
        v.RemoveAt(v.Count - 1);  // O(1)
        return last;
    }

    public static void Main() {
        var v = new List<int> { 10, 20, 30 };
        Console.WriteLine(PopBack(v));  // 30
        Console.WriteLine(string.Join(", ", v));  // 10, 20
    }
}
`)

write('vector','pop_back','go', `
package main

import "fmt"

func popBack(v []int) ([]int, int) {
    n := len(v)
    if n == 0 { panic("pop on empty slice") }
    return v[:n-1], v[n-1]  // O(1)
}

func main() {
    v := []int{10, 20, 30}
    v, last := popBack(v)
    fmt.Println(last, v)  // 30 [10 20]
}
`)

write('vector','pop_back','rust', `
fn pop_back(v: &mut Vec<i32>) -> Option<i32> {
    v.pop()  // O(1)
}

fn main() {
    let mut v = vec![10, 20, 30];
    println!("{:?}", pop_back(&mut v));  // Some(30)
    println!("{:?}", v);                 // [10, 20]
}
`)

write('vector','insert','python', `
v = [10, 20, 30, 40]
v.insert(2, 99)   # insert at index 2 — O(n)
print(v)          # [10, 20, 99, 30, 40]
`)
write('vector','insert','c', `
#include <stdio.h>
void vec_insert(int data[], size_t *size, size_t index, int value) {
    for (size_t i = *size; i > index; i--) data[i] = data[i-1];
    data[index] = value; (*size)++;
}
int main(void) {
    int data[10] = {10,20,30,40}; size_t size = 4;
    vec_insert(data, &size, 2, 99);
    for (size_t i = 0; i < size; i++) printf("%d ", data[i]);
    return 0;
}
`)
write('vector','insert','cpp', `
#include <vector>
#include <iostream>
int main() {
    std::vector<int> v = {10,20,30,40};
    v.insert(v.begin() + 2, 99);  // O(n)
    for (int x : v) std::cout << x << " ";  // 10 20 99 30 40
}
`)
write('vector','insert','java', `
import java.util.*;
public class VectorInsert {
    public static void main(String[] args) {
        ArrayList<Integer> v = new ArrayList<>(Arrays.asList(10,20,30,40));
        v.add(2, 99);  // O(n)
        System.out.println(v);  // [10, 20, 99, 30, 40]
    }
}
`)
write('vector','insert','javascript', `
const v = [10,20,30,40];
v.splice(2, 0, 99);  // O(n)
console.log(v);       // [10, 20, 99, 30, 40]
`)
write('vector','insert','typescript', `
const v: number[] = [10,20,30,40];
v.splice(2, 0, 99);  // O(n)
console.log(v);       // [10, 20, 99, 30, 40]
`)
write('vector','insert','csharp', `
using System; using System.Collections.Generic;
public class VectorInsert {
    public static void Main() {
        var v = new List<int>{10,20,30,40};
        v.Insert(2, 99);  // O(n)
        Console.WriteLine(string.Join(", ", v));  // 10, 20, 99, 30, 40
    }
}
`)
write('vector','insert','go', `
package main
import "fmt"
func vecInsert(v []int, index, value int) []int {
    v = append(v, 0)
    copy(v[index+1:], v[index:])
    v[index] = value
    return v
}
func main() {
    v := vecInsert([]int{10,20,30,40}, 2, 99)
    fmt.Println(v)  // [10 20 99 30 40]
}
`)
write('vector','insert','rust', `
fn main() {
    let mut v = vec![10,20,30,40];
    v.insert(2, 99);  // O(n)
    println!("{:?}", v);  // [10, 20, 99, 30, 40]
}
`)

write('vector','delete','python', `
v = [10,20,30,40]
v.pop(2)   # delete at index — O(n)
print(v)   # [10, 20, 40]
`)
write('vector','delete','c', `
#include <stdio.h>
void vec_delete(int data[], size_t *size, size_t index) {
    for (size_t i = index; i < *size - 1; i++) data[i] = data[i+1];
    (*size)--;
}
int main(void) {
    int data[] = {10,20,30,40}; size_t size = 4;
    vec_delete(data, &size, 2);
    for (size_t i = 0; i < size; i++) printf("%d ", data[i]);  // 10 20 40
    return 0;
}
`)
write('vector','delete','cpp', `
#include <vector>
#include <iostream>
int main() {
    std::vector<int> v = {10,20,30,40};
    v.erase(v.begin() + 2);  // O(n)
    for (int x : v) std::cout << x << " ";  // 10 20 40
}
`)
write('vector','delete','java', `
import java.util.*;
public class VectorDelete {
    public static void main(String[] args) {
        ArrayList<Integer> v = new ArrayList<>(Arrays.asList(10,20,30,40));
        v.remove(2);  // O(n)
        System.out.println(v);  // [10, 20, 40]
    }
}
`)
write('vector','delete','javascript', `
const v = [10,20,30,40];
v.splice(2,1);
console.log(v);  // [10, 20, 40]
`)
write('vector','delete','typescript', `
const v: number[] = [10,20,30,40];
v.splice(2,1);
console.log(v);  // [10, 20, 40]
`)
write('vector','delete','csharp', `
using System; using System.Collections.Generic;
public class VectorDelete {
    public static void Main() {
        var v = new List<int>{10,20,30,40};
        v.RemoveAt(2);  // O(n)
        Console.WriteLine(string.Join(", ", v));  // 10, 20, 40
    }
}
`)
write('vector','delete','go', `
package main
import "fmt"
func vecDelete(v []int, index int) []int {
    return append(v[:index], v[index+1:]...)
}
func main() {
    v := vecDelete([]int{10,20,30,40}, 2)
    fmt.Println(v)  // [10 20 40]
}
`)
write('vector','delete','rust', `
fn main() {
    let mut v = vec![10,20,30,40];
    v.remove(2);  // O(n)
    println!("{:?}", v);  // [10, 20, 40]
}
`)

write('vector','access','python', `
v = [10,20,30,40]
print(v[2])      # O(1) random access -> 30
v[2] = 99
print(v[2])      # 99
`)
write('vector','access','c', `
#include <stdio.h>
int main(void) {
    int data[] = {10,20,30,40};
    printf("%d\n", data[2]);   // O(1) -> 30
    data[2] = 99;
    printf("%d\n", data[2]);   // 99
    return 0;
}
`)
write('vector','access','cpp', `
#include <vector>
#include <iostream>
int main() {
    std::vector<int> v = {10,20,30,40};
    std::cout << v[2]      << "\n";  // 30 — unchecked O(1)
    std::cout << v.at(2)   << "\n";  // 30 — bounds-checked O(1)
    v[2] = 99;
    std::cout << v[2] << "\n";       // 99
}
`)
write('vector','access','java', `
import java.util.*;
public class VectorAccess {
    public static void main(String[] args) {
        ArrayList<Integer> v = new ArrayList<>(Arrays.asList(10,20,30,40));
        System.out.println(v.get(2));   // O(1) -> 30
        v.set(2, 99);
        System.out.println(v.get(2));   // 99
    }
}
`)
write('vector','access','javascript', `
const v = [10,20,30,40];
console.log(v[2]);     // 30 — O(1)
v[2] = 99;
console.log(v[2]);     // 99
`)
write('vector','access','typescript', `
const v: number[] = [10,20,30,40];
console.log(v[2]);     // 30 — O(1)
v[2] = 99;
console.log(v[2]);     // 99
`)
write('vector','access','csharp', `
using System; using System.Collections.Generic;
var v = new List<int>{10,20,30,40};
Console.WriteLine(v[2]);   // 30 — O(1)
v[2] = 99;
Console.WriteLine(v[2]);   // 99
`)
write('vector','access','go', `
package main
import "fmt"
func main() {
    v := []int{10,20,30,40}
    fmt.Println(v[2])   // 30 — O(1)
    v[2] = 99
    fmt.Println(v[2])   // 99
}
`)
write('vector','access','rust', `
fn main() {
    let mut v = vec![10,20,30,40];
    println!("{}", v[2]);      // 30 — O(1)
    println!("{:?}", v.get(2)); // Some(30) — bounds-safe
    v[2] = 99;
    println!("{}", v[2]);      // 99
}
`)

/* ═══════════════════════════════════════════════════════════════════════════
   STACK  — push | pop | peek
═══════════════════════════════════════════════════════════════════════════ */
const STACK_CLASSES = {
  python: `class Stack:
    def __init__(self):
        self._data = []

    def push(self, value) -> None:
        self._data.append(value)   # O(1) amortized

    def pop(self):
        if self.is_empty():
            raise IndexError("Stack underflow")
        return self._data.pop()    # O(1)

    def peek(self):
        if self.is_empty():
            raise IndexError("Stack is empty")
        return self._data[-1]      # O(1)

    def is_empty(self) -> bool:
        return len(self._data) == 0

    def size(self) -> int:
        return len(self._data)

if __name__ == "__main__":
    s = Stack()
    s.push(10); s.push(20); s.push(30)
    print(s.peek())   # 30
    print(s.pop())    # 30
    print(s.size())   # 2`,
  c: `#include <stdio.h>
#include <stdlib.h>

#define MAX 1000
typedef struct { int data[MAX]; int top; } Stack;

void stack_init(Stack *s)         { s->top = -1; }
int  stack_empty(Stack *s)        { return s->top == -1; }
void stack_push(Stack *s, int v)  { if (s->top >= MAX-1) { fprintf(stderr,"overflow\\n"); return; } s->data[++s->top] = v; }
int  stack_pop (Stack *s)         { if (stack_empty(s)) { fprintf(stderr,"underflow\\n"); return -1; } return s->data[s->top--]; }
int  stack_peek(Stack *s)         { if (stack_empty(s)) { fprintf(stderr,"empty\\n"); return -1; } return s->data[s->top]; }

int main(void) {
    Stack s; stack_init(&s);
    stack_push(&s, 10); stack_push(&s, 20); stack_push(&s, 30);
    printf("peek=%d\\n", stack_peek(&s));  // 30
    printf("pop=%d\\n",  stack_pop(&s));   // 30
    printf("size=%d\\n", s.top + 1);       // 2
    return 0;
}`,
  cpp: `#include <stack>
#include <iostream>
#include <stdexcept>

// Using STL stack:
void demo_stl() {
    std::stack<int> s;
    s.push(10); s.push(20); s.push(30);
    std::cout << "peek=" << s.top() << "\\n";   // 30
    s.pop();
    std::cout << "size=" << s.size() << "\\n";  // 2
}

// Manual implementation with vector:
template<typename T>
class Stack {
    std::vector<T> data;
public:
    void push(T v)  { data.push_back(v); }
    T    pop()      { if (data.empty()) throw std::underflow_error(""); T v=data.back(); data.pop_back(); return v; }
    T&   peek()     { if (data.empty()) throw std::underflow_error(""); return data.back(); }
    bool empty()    { return data.empty(); }
    int  size()     { return (int)data.size(); }
};`,
  java: `import java.util.ArrayDeque;
import java.util.Deque;

public class StackDemo {
    // Using Deque (preferred over java.util.Stack):
    public static void main(String[] args) {
        Deque<Integer> stack = new ArrayDeque<>();
        stack.push(10); stack.push(20); stack.push(30);
        System.out.println("peek=" + stack.peek());   // 30
        System.out.println("pop="  + stack.pop());    // 30
        System.out.println("size=" + stack.size());   // 2
    }
}

// Generic manual implementation:
class Stack<T> {
    private final java.util.ArrayList<T> data = new java.util.ArrayList<>();
    public void push(T v)   { data.add(v); }
    public T    pop()       { if (data.isEmpty()) throw new java.util.NoSuchElementException(); return data.remove(data.size()-1); }
    public T    peek()      { if (data.isEmpty()) throw new java.util.NoSuchElementException(); return data.get(data.size()-1); }
    public boolean isEmpty(){ return data.isEmpty(); }
    public int  size()      { return data.size(); }
}`,
  javascript: `class Stack {
    constructor() { this._data = []; }
    push(value)  { this._data.push(value); }      // O(1)
    pop()        { if (this.isEmpty()) throw new Error("underflow"); return this._data.pop(); }  // O(1)
    peek()       { if (this.isEmpty()) throw new Error("empty"); return this._data[this._data.length - 1]; }
    isEmpty()    { return this._data.length === 0; }
    size()       { return this._data.length; }
}

const s = new Stack();
s.push(10); s.push(20); s.push(30);
console.log(s.peek());  // 30
console.log(s.pop());   // 30
console.log(s.size());  // 2`,
  typescript: `class Stack<T> {
    private _data: T[] = [];
    push(value: T): void    { this._data.push(value); }
    pop(): T                { if (this.isEmpty()) throw new Error("underflow"); return this._data.pop()!; }
    peek(): T               { if (this.isEmpty()) throw new Error("empty"); return this._data[this._data.length - 1]; }
    isEmpty(): boolean      { return this._data.length === 0; }
    size(): number          { return this._data.length; }
}

const s = new Stack<number>();
s.push(10); s.push(20); s.push(30);
console.log(s.peek());  // 30
console.log(s.pop());   // 30`,
  csharp: `using System;
using System.Collections.Generic;

public class Stack<T> {
    private readonly List<T> _data = new();
    public void Push(T value) { _data.Add(value); }
    public T    Pop()  { if (_data.Count == 0) throw new InvalidOperationException("underflow");
                         T v = _data[^1]; _data.RemoveAt(_data.Count - 1); return v; }
    public T    Peek() { if (_data.Count == 0) throw new InvalidOperationException("empty"); return _data[^1]; }
    public bool IsEmpty => _data.Count == 0;
    public int  Count   => _data.Count;
}

// Demo using built-in:
var s = new System.Collections.Generic.Stack<int>();
s.Push(10); s.Push(20); s.Push(30);
Console.WriteLine(s.Peek());  // 30
Console.WriteLine(s.Pop());   // 30`,
  go: `package main

import (
    "container/list"
    "fmt"
)

type Stack struct { l *list.List }
func NewStack()           *Stack { return &Stack{l: list.New()} }
func (s *Stack) Push(v int)      { s.l.PushBack(v) }
func (s *Stack) Pop() int        { e := s.l.Back(); s.l.Remove(e); return e.Value.(int) }
func (s *Stack) Peek() int       { return s.l.Back().Value.(int) }
func (s *Stack) IsEmpty() bool   { return s.l.Len() == 0 }
func (s *Stack) Size() int       { return s.l.Len() }

func main() {
    s := NewStack()
    s.Push(10); s.Push(20); s.Push(30)
    fmt.Println("peek=", s.Peek())  // 30
    fmt.Println("pop=",  s.Pop())   // 30
    fmt.Println("size=", s.Size())  // 2
}`,
  rust: `struct Stack<T>(Vec<T>);
impl<T> Stack<T> {
    fn new()              -> Self { Stack(Vec::new()) }
    fn push(&mut self, v: T)       { self.0.push(v); }
    fn pop(&mut self) -> Option<T> { self.0.pop() }
    fn peek(&self)    -> Option<&T>{ self.0.last() }
    fn is_empty(&self)-> bool      { self.0.is_empty() }
    fn size(&self)    -> usize     { self.0.len() }
}

fn main() {
    let mut s: Stack<i32> = Stack::new();
    s.push(10); s.push(20); s.push(30);
    println!("peek={:?}", s.peek());   // Some(30)
    println!("pop={:?}",  s.pop());    // Some(30)
    println!("size={}",   s.size());   // 2
}`,
}

for (const [lang, code] of Object.entries(STACK_CLASSES)) {
  write('stack','push', lang, code)
  write('stack','pop',  lang, code)
  write('stack','peek', lang, code)
}

/* ═══════════════════════════════════════════════════════════════════════════
   QUEUE  — enqueue | dequeue | peek
═══════════════════════════════════════════════════════════════════════════ */
const QUEUE_CLASSES = {
  python: `from collections import deque

class Queue:
    def __init__(self):
        self._data = deque()

    def enqueue(self, value) -> None:
        self._data.append(value)       # O(1)

    def dequeue(self):
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self._data.popleft()    # O(1)

    def peek(self):
        if self.is_empty():
            raise IndexError("Queue is empty")
        return self._data[0]           # front element

    def is_empty(self) -> bool:
        return len(self._data) == 0

    def size(self) -> int:
        return len(self._data)

if __name__ == "__main__":
    q = Queue()
    q.enqueue(10); q.enqueue(20); q.enqueue(30)
    print(q.peek())    # 10 (front)
    print(q.dequeue()) # 10
    print(q.size())    # 2`,
  c: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int val; struct Node *next; } Node;
typedef struct { Node *front, *rear; int size; } Queue;

void q_init(Queue *q) { q->front = q->rear = NULL; q->size = 0; }
int  q_empty(Queue *q){ return q->size == 0; }

void enqueue(Queue *q, int v) {
    Node *n = malloc(sizeof(Node));
    n->val = v; n->next = NULL;
    if (q->rear) q->rear->next = n; else q->front = n;
    q->rear = n; q->size++;
}

int dequeue(Queue *q) {
    if (q_empty(q)) { fprintf(stderr,"empty\\n"); return -1; }
    Node *tmp = q->front; int v = tmp->val;
    q->front = q->front->next;
    if (!q->front) q->rear = NULL;
    free(tmp); q->size--;
    return v;
}

int peek(Queue *q) { return q_empty(q) ? -1 : q->front->val; }

int main(void) {
    Queue q; q_init(&q);
    enqueue(&q,10); enqueue(&q,20); enqueue(&q,30);
    printf("peek=%d\\n",  peek(&q));     // 10
    printf("deq=%d\\n",   dequeue(&q));  // 10
    printf("size=%d\\n",  q.size);       // 2
    return 0;
}`,
  cpp: `#include <queue>
#include <iostream>
#include <stdexcept>

// STL queue:
void demo_stl() {
    std::queue<int> q;
    q.push(10); q.push(20); q.push(30);
    std::cout << "front=" << q.front() << "\\n";  // 10
    q.pop();
    std::cout << "size=" << q.size() << "\\n";    // 2
}

// Manual linked-list implementation:
template<typename T>
class Queue {
    struct Node { T val; Node* next; };
    Node *front_ = nullptr, *rear_ = nullptr;
    int size_ = 0;
public:
    void enqueue(T v)  { auto* n=new Node{v,nullptr}; if(rear_) rear_->next=n; else front_=n; rear_=n; size_++; }
    T    dequeue()     { if(!front_) throw std::underflow_error(""); auto* t=front_; T v=t->val; front_=front_->next; if(!front_) rear_=nullptr; delete t; size_--; return v; }
    T    peek()        { if(!front_) throw std::underflow_error(""); return front_->val; }
    bool empty()       { return size_==0; }
    int  size()        { return size_; }
};`,
  java: `import java.util.ArrayDeque;
import java.util.Deque;

public class QueueDemo {
    public static void main(String[] args) {
        Deque<Integer> q = new ArrayDeque<>();
        q.offer(10); q.offer(20); q.offer(30);
        System.out.println("peek="  + q.peek());   // 10
        System.out.println("poll="  + q.poll());   // 10
        System.out.println("size="  + q.size());   // 2
    }
}

class Queue<T> {
    private final java.util.LinkedList<T> data = new java.util.LinkedList<>();
    public void enqueue(T v)    { data.addLast(v); }
    public T    dequeue()       { return data.removeFirst(); }
    public T    peek()          { return data.getFirst(); }
    public boolean isEmpty()    { return data.isEmpty(); }
    public int  size()          { return data.size(); }
}`,
  javascript: `class Queue {
    constructor() {
        this._data = [];
        this._head = 0;  // avoid O(n) shift on dequeue
    }
    enqueue(value)  { this._data.push(value); }
    dequeue() {
        if (this.isEmpty()) throw new Error("Queue is empty");
        const val = this._data[this._head++];
        // Shrink internal array when head is far ahead
        if (this._head > 100 && this._head > this._data.length / 2) {
            this._data = this._data.slice(this._head);
            this._head = 0;
        }
        return val;
    }
    peek()    { if (this.isEmpty()) throw new Error("empty"); return this._data[this._head]; }
    isEmpty() { return this._head >= this._data.length; }
    size()    { return this._data.length - this._head; }
}

const q = new Queue();
q.enqueue(10); q.enqueue(20); q.enqueue(30);
console.log(q.peek());    // 10
console.log(q.dequeue()); // 10
console.log(q.size());    // 2`,
  typescript: `class Queue<T> {
    private _data: T[] = [];
    private _head = 0;
    enqueue(value: T): void  { this._data.push(value); }
    dequeue(): T {
        if (this.isEmpty()) throw new Error("Queue is empty");
        const val = this._data[this._head++];
        if (this._head > 100 && this._head > this._data.length / 2) {
            this._data = this._data.slice(this._head);
            this._head = 0;
        }
        return val;
    }
    peek(): T       { if (this.isEmpty()) throw new Error("empty"); return this._data[this._head]; }
    isEmpty(): boolean { return this._head >= this._data.length; }
    size(): number  { return this._data.length - this._head; }
}`,
  csharp: `using System;
using System.Collections.Generic;

public class QueueDemo {
    public static void Main() {
        var q = new Queue<int>();
        q.Enqueue(10); q.Enqueue(20); q.Enqueue(30);
        Console.WriteLine("peek=" + q.Peek());    // 10
        Console.WriteLine("deq="  + q.Dequeue()); // 10
        Console.WriteLine("size=" + q.Count);     // 2
    }
}`,
  go: `package main

import (
    "container/list"
    "fmt"
)

type Queue struct { l *list.List }
func NewQueue()            *Queue { return &Queue{l: list.New()} }
func (q *Queue) Enqueue(v int)    { q.l.PushBack(v) }
func (q *Queue) Dequeue() int     { e := q.l.Front(); q.l.Remove(e); return e.Value.(int) }
func (q *Queue) Peek() int        { return q.l.Front().Value.(int) }
func (q *Queue) IsEmpty() bool    { return q.l.Len() == 0 }
func (q *Queue) Size() int        { return q.l.Len() }

func main() {
    q := NewQueue()
    q.Enqueue(10); q.Enqueue(20); q.Enqueue(30)
    fmt.Println("peek=", q.Peek())    // 10
    fmt.Println("deq=",  q.Dequeue()) // 10
    fmt.Println("size=", q.Size())    // 2
}`,
  rust: `use std::collections::VecDeque;

struct Queue<T>(VecDeque<T>);
impl<T> Queue<T> {
    fn new()               -> Self { Queue(VecDeque::new()) }
    fn enqueue(&mut self, v: T)    { self.0.push_back(v); }
    fn dequeue(&mut self) -> Option<T> { self.0.pop_front() }
    fn peek(&self)         -> Option<&T> { self.0.front() }
    fn is_empty(&self)     -> bool { self.0.is_empty() }
    fn size(&self)         -> usize { self.0.len() }
}

fn main() {
    let mut q: Queue<i32> = Queue::new();
    q.enqueue(10); q.enqueue(20); q.enqueue(30);
    println!("peek={:?}", q.peek());    // Some(10)
    println!("deq={:?}",  q.dequeue()); // Some(10)
    println!("size={}",   q.size());    // 2
}`,
}

for (const [lang, code] of Object.entries(QUEUE_CLASSES)) {
  write('queue','enqueue', lang, code)
  write('queue','dequeue', lang, code)
  write('queue','peek',    lang, code)
}

console.log('✅ Linear structures (array, vector, stack, queue) populated.')
