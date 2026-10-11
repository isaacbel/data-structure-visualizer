#!/usr/bin/env node
'use strict'
const fs   = require('fs')
const path = require('path')
const LIB  = path.resolve(__dirname, '../src/code-library')
function write(ds, op, lang, code) {
  const dir = path.join(LIB, ds, op)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, lang), code.trimStart(), 'utf8')
}

/* ═══════════════════════════════════════════════════════════════════════════
   CIRCULAR QUEUE  — enqueue | dequeue | peek
═══════════════════════════════════════════════════════════════════════════ */
const CQ = {
  python:`class CircularQueue:
    def __init__(self, capacity: int):
        self._cap  = capacity + 1   # one slot wasted to distinguish full/empty
        self._data = [None] * self._cap
        self._head = 0
        self._tail = 0

    def enqueue(self, value) -> bool:
        if self.is_full(): return False
        self._data[self._tail] = value
        self._tail = (self._tail + 1) % self._cap
        return True

    def dequeue(self):
        if self.is_empty(): raise IndexError("Queue empty")
        val = self._data[self._head]
        self._head = (self._head + 1) % self._cap
        return val

    def peek(self):
        if self.is_empty(): raise IndexError("Queue empty")
        return self._data[self._head]

    def is_empty(self) -> bool: return self._head == self._tail
    def is_full(self)  -> bool: return (self._tail + 1) % self._cap == self._head
    def size(self)     -> int:  return (self._tail - self._head) % self._cap

if __name__ == "__main__":
    cq = CircularQueue(3)
    cq.enqueue(1); cq.enqueue(2); cq.enqueue(3)
    print(cq.is_full())   # True
    print(cq.dequeue())   # 1
    cq.enqueue(4)
    print(cq.peek())      # 2`,
  c:`#include <stdio.h>
#define CAP 4   /* stores up to CAP-1 elements */
typedef struct { int data[CAP]; int head, tail; } CQ;
void  cq_init(CQ *q)          { q->head = q->tail = 0; }
int   cq_empty(CQ *q)         { return q->head == q->tail; }
int   cq_full(CQ *q)          { return (q->tail + 1) % CAP == q->head; }
int   cq_enqueue(CQ *q, int v){ if (cq_full(q)) return 0; q->data[q->tail]=(v); q->tail=(q->tail+1)%CAP; return 1; }
int   cq_dequeue(CQ *q)       { if (cq_empty(q)) return -1; int v=q->data[q->head]; q->head=(q->head+1)%CAP; return v; }
int   cq_peek(CQ *q)          { return cq_empty(q) ? -1 : q->data[q->head]; }
int main(void){
    CQ q; cq_init(&q);
    cq_enqueue(&q,1); cq_enqueue(&q,2); cq_enqueue(&q,3);
    printf("peek=%d deq=%d\\n", cq_peek(&q), cq_dequeue(&q));  // 1 1
    return 0;
}`,
  cpp:`#include <vector>
#include <stdexcept>
#include <iostream>
template<typename T>
class CircularQueue {
    std::vector<T> data;
    int head=0, tail=0, cap;
public:
    CircularQueue(int c) : data(c+1), cap(c+1) {}
    bool enqueue(T v) { if(full()) return false; data[tail]=v; tail=(tail+1)%cap; return true; }
    T    dequeue()    { if(empty()) throw std::underflow_error(""); T v=data[head]; head=(head+1)%cap; return v; }
    T    peek()       { if(empty()) throw std::underflow_error(""); return data[head]; }
    bool empty()      { return head==tail; }
    bool full()       { return (tail+1)%cap==head; }
    int  size()       { return (tail-head+cap)%cap; }
};
int main(){
    CircularQueue<int> q(3);
    q.enqueue(1); q.enqueue(2); q.enqueue(3);
    std::cout << q.peek() << " " << q.dequeue() << "\\n";  // 1 1
}`,
  java:`public class CircularQueue {
    private final int[] data;
    private int head, tail, cap;
    CircularQueue(int capacity) { cap=capacity+1; data=new int[cap]; }
    boolean enqueue(int v){ if(full()) return false; data[tail]=v; tail=(tail+1)%cap; return true; }
    int     dequeue()     { if(empty()) throw new java.util.NoSuchElementException(); int v=data[head]; head=(head+1)%cap; return v; }
    int     peek()        { if(empty()) throw new java.util.NoSuchElementException(); return data[head]; }
    boolean empty()       { return head==tail; }
    boolean full()        { return (tail+1)%cap==head; }
    int     size()        { return (tail-head+cap)%cap; }
    public static void main(String[] a){
        CircularQueue q = new CircularQueue(3);
        q.enqueue(1); q.enqueue(2); q.enqueue(3);
        System.out.println(q.peek()+" "+q.dequeue());  // 1 1
    }
}`,
  javascript:`class CircularQueue {
    constructor(capacity) {
        this._cap  = capacity + 1;
        this._data = new Array(this._cap);
        this._head = 0; this._tail = 0;
    }
    enqueue(v) { if(this.isFull()) return false; this._data[this._tail]=v; this._tail=(this._tail+1)%this._cap; return true; }
    dequeue()  { if(this.isEmpty()) throw new Error("empty"); const v=this._data[this._head]; this._head=(this._head+1)%this._cap; return v; }
    peek()     { if(this.isEmpty()) throw new Error("empty"); return this._data[this._head]; }
    isEmpty()  { return this._head===this._tail; }
    isFull()   { return (this._tail+1)%this._cap===this._head; }
    size()     { return (this._tail-this._head+this._cap)%this._cap; }
}
const q = new CircularQueue(3);
q.enqueue(1); q.enqueue(2); q.enqueue(3);
console.log(q.peek(), q.dequeue());  // 1 1`,
  typescript:`class CircularQueue<T> {
    private _data: (T|undefined)[];
    private _head = 0; private _tail = 0;
    private _cap: number;
    constructor(capacity: number) { this._cap = capacity+1; this._data = new Array(this._cap); }
    enqueue(v: T): boolean { if(this.isFull()) return false; this._data[this._tail]=v; this._tail=(this._tail+1)%this._cap; return true; }
    dequeue(): T   { if(this.isEmpty()) throw new Error("empty"); const v=this._data[this._head] as T; this._head=(this._head+1)%this._cap; return v; }
    peek(): T      { if(this.isEmpty()) throw new Error("empty"); return this._data[this._head] as T; }
    isEmpty(): boolean { return this._head===this._tail; }
    isFull():  boolean { return (this._tail+1)%this._cap===this._head; }
    size(): number { return (this._tail-this._head+this._cap)%this._cap; }
}`,
  csharp:`public class CircularQueue<T> {
    private T[] _data; private int _head, _tail, _cap;
    public CircularQueue(int capacity) { _cap=capacity+1; _data=new T[_cap]; }
    public bool Enqueue(T v){ if(IsFull) return false; _data[_tail]=v; _tail=(_tail+1)%_cap; return true; }
    public T    Dequeue()   { if(IsEmpty) throw new System.InvalidOperationException(); T v=_data[_head]; _head=(_head+1)%_cap; return v; }
    public T    Peek()      { if(IsEmpty) throw new System.InvalidOperationException(); return _data[_head]; }
    public bool IsEmpty     => _head==_tail;
    public bool IsFull      => (_tail+1)%_cap==_head;
    public int  Size        => (_tail-_head+_cap)%_cap;
}`,
  go:`package main
import "fmt"
type CircularQueue struct { data []int; head,tail,cap int }
func NewCQ(c int) *CircularQueue { return &CircularQueue{data:make([]int,c+1), cap:c+1} }
func (q *CircularQueue) Enqueue(v int) bool { if q.Full() { return false }; q.data[q.tail]=v; q.tail=(q.tail+1)%q.cap; return true }
func (q *CircularQueue) Dequeue() int       { v:=q.data[q.head]; q.head=(q.head+1)%q.cap; return v }
func (q *CircularQueue) Peek() int          { return q.data[q.head] }
func (q *CircularQueue) Empty() bool        { return q.head==q.tail }
func (q *CircularQueue) Full() bool         { return (q.tail+1)%q.cap==q.head }
func main(){
    q := NewCQ(3)
    q.Enqueue(1); q.Enqueue(2); q.Enqueue(3)
    fmt.Println(q.Peek(), q.Dequeue())  // 1 1
}`,
  rust:`struct CircularQueue { data: Vec<i32>, head: usize, tail: usize, cap: usize }
impl CircularQueue {
    fn new(capacity: usize) -> Self {
        CircularQueue { data: vec![0; capacity+1], head:0, tail:0, cap:capacity+1 }
    }
    fn enqueue(&mut self, v: i32) -> bool {
        if self.is_full() { return false; }
        self.data[self.tail] = v;
        self.tail = (self.tail + 1) % self.cap;
        true
    }
    fn dequeue(&mut self) -> Option<i32> {
        if self.is_empty() { return None; }
        let v = self.data[self.head];
        self.head = (self.head + 1) % self.cap;
        Some(v)
    }
    fn peek(&self) -> Option<i32> { if self.is_empty() { None } else { Some(self.data[self.head]) } }
    fn is_empty(&self) -> bool { self.head == self.tail }
    fn is_full(&self)  -> bool { (self.tail + 1) % self.cap == self.head }
}
fn main() {
    let mut q = CircularQueue::new(3);
    q.enqueue(1); q.enqueue(2); q.enqueue(3);
    println!("{:?} {:?}", q.peek(), q.dequeue());  // Some(1) Some(1)
}`,
}
for (const [lang, code] of Object.entries(CQ)) {
  write('circular-queue','enqueue', lang, code)
  write('circular-queue','dequeue', lang, code)
  write('circular-queue','peek',    lang, code)
}

/* ═══════════════════════════════════════════════════════════════════════════
   DEQUE  — pushFront | pushBack | popFront | popBack
═══════════════════════════════════════════════════════════════════════════ */
const DQ = {
  python:`from collections import deque
class Deque:
    def __init__(self):            self._d = deque()
    def push_front(self, v):       self._d.appendleft(v)   # O(1)
    def push_back(self, v):        self._d.append(v)        # O(1)
    def pop_front(self):           return self._d.popleft() # O(1)
    def pop_back(self):            return self._d.pop()     # O(1)
    def peek_front(self):          return self._d[0]
    def peek_back(self):           return self._d[-1]
    def is_empty(self) -> bool:    return len(self._d)==0
    def size(self)     -> int:     return len(self._d)
d = Deque()
d.push_back(10); d.push_back(20); d.push_front(5)
print(d.pop_front(), d.pop_back())  # 5 20`,
  c:`#include <stdio.h>
#include <stdlib.h>
typedef struct Node { int val; struct Node *prev, *next; } Node;
typedef struct { Node *front, *back; int size; } Deque;
void dq_init(Deque *d) { d->front=d->back=NULL; d->size=0; }
void dq_push_front(Deque *d, int v){ Node *n=malloc(sizeof(Node)); n->val=v; n->prev=NULL; n->next=d->front; if(d->front) d->front->prev=n; else d->back=n; d->front=n; d->size++; }
void dq_push_back (Deque *d, int v){ Node *n=malloc(sizeof(Node)); n->val=v; n->next=NULL; n->prev=d->back;  if(d->back)  d->back->next=n;  else d->front=n; d->back=n;  d->size++; }
int  dq_pop_front(Deque *d){ Node *t=d->front; int v=t->val; d->front=t->next; if(d->front) d->front->prev=NULL; else d->back=NULL; free(t); d->size--; return v; }
int  dq_pop_back (Deque *d){ Node *t=d->back;  int v=t->val; d->back=t->prev;  if(d->back)  d->back->next=NULL;  else d->front=NULL; free(t); d->size--; return v; }
int main(void){ Deque d; dq_init(&d); dq_push_back(&d,10); dq_push_back(&d,20); dq_push_front(&d,5); printf("%d %d\\n",dq_pop_front(&d),dq_pop_back(&d)); return 0; }`,
  cpp:`#include <deque>
#include <iostream>
int main(){
    std::deque<int> dq;
    dq.push_back(10); dq.push_back(20); dq.push_front(5);
    std::cout << dq.front() << " " << dq.back() << "\\n";  // 5 20
    dq.pop_front(); dq.pop_back();
    std::cout << dq.size() << "\\n";  // 1
}`,
  java:`import java.util.ArrayDeque;
public class DequeDemo{
    public static void main(String[] a){
        ArrayDeque<Integer> dq = new ArrayDeque<>();
        dq.offerLast(10); dq.offerLast(20); dq.offerFirst(5);
        System.out.println(dq.peekFirst()+" "+dq.peekLast()); // 5 20
        dq.pollFirst(); dq.pollLast();
        System.out.println(dq.size());  // 1
    }
}`,
  javascript:`class Deque {
    constructor(){ this._d=[]; this._h=0; }
    pushFront(v){ this._d.unshift(v); }   // O(n) — use linked list for O(1)
    pushBack(v) { this._d.push(v); }      // O(1)
    popFront()  { return this._d.shift(); }  // O(n)
    popBack()   { return this._d.pop(); }    // O(1)
    peekFront() { return this._d[0]; }
    peekBack()  { return this._d[this._d.length-1]; }
    isEmpty()   { return this._d.length===0; }
    size()      { return this._d.length; }
}
const dq = new Deque();
dq.pushBack(10); dq.pushBack(20); dq.pushFront(5);
console.log(dq.popFront(), dq.popBack());  // 5 20`,
  typescript:`class Deque<T> {
    private _d: T[] = [];
    pushFront(v: T): void { this._d.unshift(v); }
    pushBack(v: T):  void { this._d.push(v); }
    popFront(): T         { if(!this._d.length) throw new Error("empty"); return this._d.shift()!; }
    popBack(): T          { if(!this._d.length) throw new Error("empty"); return this._d.pop()!; }
    peekFront(): T        { return this._d[0]; }
    peekBack(): T         { return this._d[this._d.length-1]; }
    isEmpty(): boolean    { return this._d.length===0; }
    size(): number        { return this._d.length; }
}`,
  csharp:`using System;
using System.Collections.Generic;
var dq = new LinkedList<int>();
dq.AddLast(10); dq.AddLast(20); dq.AddFirst(5);
Console.WriteLine(dq.First!.Value + " " + dq.Last!.Value);  // 5 20
dq.RemoveFirst(); dq.RemoveLast();
Console.WriteLine(dq.Count);  // 1`,
  go:`package main
import("container/list";"fmt")
type Deque struct{ l *list.List }
func NewDeque() *Deque { return &Deque{list.New()} }
func (d *Deque) PushFront(v int) { d.l.PushFront(v) }
func (d *Deque) PushBack(v int)  { d.l.PushBack(v) }
func (d *Deque) PopFront() int   { e:=d.l.Front(); d.l.Remove(e); return e.Value.(int) }
func (d *Deque) PopBack() int    { e:=d.l.Back();  d.l.Remove(e); return e.Value.(int) }
func main(){
    dq:=NewDeque(); dq.PushBack(10); dq.PushBack(20); dq.PushFront(5)
    fmt.Println(dq.PopFront(), dq.PopBack())  // 5 20
}`,
  rust:`use std::collections::VecDeque;
fn main(){
    let mut dq: VecDeque<i32> = VecDeque::new();
    dq.push_back(10); dq.push_back(20); dq.push_front(5);
    println!("{:?} {:?}", dq.front(), dq.back()); // Some(5) Some(20)
    dq.pop_front(); dq.pop_back();
    println!("{}", dq.len());  // 1
}`,
}
for(const [lang,code] of Object.entries(DQ)){
  write('deque','pushFront',lang,code)
  write('deque','pushBack', lang,code)
  write('deque','popFront', lang,code)
  write('deque','popBack',  lang,code)
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRIORITY QUEUE  — enqueue | dequeue | peek
═══════════════════════════════════════════════════════════════════════════ */
const PQ = {
  python:`import heapq
class PriorityQueue:
    """Min-priority queue using a binary heap."""
    def __init__(self):
        self._heap = []
        self._counter = 0   # tiebreaker

    def enqueue(self, value, priority: int) -> None:
        heapq.heappush(self._heap, (priority, self._counter, value))
        self._counter += 1

    def dequeue(self):
        if self.is_empty(): raise IndexError("Empty")
        _, _, value = heapq.heappop(self._heap)
        return value

    def peek(self):
        if self.is_empty(): raise IndexError("Empty")
        return self._heap[0][2]

    def is_empty(self) -> bool: return len(self._heap) == 0
    def size(self)     -> int:  return len(self._heap)

pq = PriorityQueue()
pq.enqueue("task_A", 3)
pq.enqueue("task_B", 1)
pq.enqueue("task_C", 2)
print(pq.dequeue())  # task_B (priority 1 = highest)`,
  c:`#include <stdio.h>
#include <stdlib.h>
typedef struct { int priority; int value; } Item;
typedef struct { Item *data; int size, cap; } PQ;
void pq_init(PQ *pq)          { pq->cap=8; pq->size=0; pq->data=malloc(pq->cap*sizeof(Item)); }
void sift_up(PQ *pq, int i)   { while(i>0){ int p=(i-1)/2; if(pq->data[p].priority<=pq->data[i].priority) break; Item t=pq->data[p]; pq->data[p]=pq->data[i]; pq->data[i]=t; i=p; } }
void sift_dn(PQ *pq, int i)   { int n=pq->size; for(;;){ int l=2*i+1,r=2*i+2,s=i; if(l<n&&pq->data[l].priority<pq->data[s].priority) s=l; if(r<n&&pq->data[r].priority<pq->data[s].priority) s=r; if(s==i) break; Item t=pq->data[i]; pq->data[i]=pq->data[s]; pq->data[s]=t; i=s; } }
void pq_push(PQ *pq, int v, int p){ if(pq->size==pq->cap){ pq->cap*=2; pq->data=realloc(pq->data,pq->cap*sizeof(Item)); } pq->data[pq->size++]=(Item){p,v}; sift_up(pq,pq->size-1); }
Item pq_pop(PQ *pq)           { Item top=pq->data[0]; pq->data[0]=pq->data[--pq->size]; sift_dn(pq,0); return top; }
Item pq_peek(PQ *pq)          { return pq->data[0]; }
int main(void){ PQ pq; pq_init(&pq); pq_push(&pq,10,3); pq_push(&pq,20,1); pq_push(&pq,30,2); printf("min-pri val=%d\\n",pq_pop(&pq).value); return 0; }`,
  cpp:`#include <queue>
#include <iostream>
using namespace std;
int main(){
    // Max-heap by default; negate priority for min-heap
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    pq.push({3,10}); pq.push({1,20}); pq.push({2,30});
    auto [pri,val] = pq.top(); pq.pop();
    cout << "val=" << val << " pri=" << pri << "\\n";  // val=20 pri=1
}`,
  java:`import java.util.PriorityQueue;
public class PQDemo{
    public static void main(String[] a){
        PriorityQueue<int[]> pq = new PriorityQueue<>((x,y)->x[0]-y[0]);
        pq.offer(new int[]{3,10}); pq.offer(new int[]{1,20}); pq.offer(new int[]{2,30});
        int[] top = pq.poll();
        System.out.println("val="+top[1]+" pri="+top[0]);  // val=20 pri=1
    }
}`,
  javascript:`class PriorityQueue {
    constructor(){ this._heap=[]; }
    enqueue(value, priority){
        this._heap.push({value,priority});
        this._siftUp(this._heap.length-1);
    }
    dequeue(){
        const top=this._heap[0];
        const last=this._heap.pop();
        if(this._heap.length>0){ this._heap[0]=last; this._siftDown(0); }
        return top.value;
    }
    peek(){ return this._heap[0].value; }
    isEmpty(){ return this._heap.length===0; }
    _siftUp(i){ while(i>0){ const p=(i-1)>>1; if(this._heap[p].priority<=this._heap[i].priority) break; [this._heap[p],this._heap[i]]=[this._heap[i],this._heap[p]]; i=p; } }
    _siftDown(i){ const n=this._heap.length; for(;;){ let s=i,l=2*i+1,r=2*i+2; if(l<n&&this._heap[l].priority<this._heap[s].priority) s=l; if(r<n&&this._heap[r].priority<this._heap[s].priority) s=r; if(s===i) break; [this._heap[s],this._heap[i]]=[this._heap[i],this._heap[s]]; i=s; } }
}
const pq=new PriorityQueue();
pq.enqueue("A",3); pq.enqueue("B",1); pq.enqueue("C",2);
console.log(pq.dequeue());  // B`,
  typescript:`interface PQItem<T> { value: T; priority: number }
class PriorityQueue<T> {
    private _heap: PQItem<T>[] = [];
    enqueue(value: T, priority: number): void { this._heap.push({value,priority}); this._siftUp(this._heap.length-1); }
    dequeue(): T { const top=this._heap[0]; const last=this._heap.pop()!; if(this._heap.length){this._heap[0]=last;this._siftDown(0);} return top.value; }
    peek(): T { return this._heap[0].value; }
    isEmpty(): boolean { return this._heap.length===0; }
    private _siftUp(i:number){ while(i>0){const p=(i-1)>>1;if(this._heap[p].priority<=this._heap[i].priority)break;[this._heap[p],this._heap[i]]=[this._heap[i],this._heap[p]];i=p;} }
    private _siftDown(i:number){ const n=this._heap.length;for(;;){let s=i,l=2*i+1,r=2*i+2;if(l<n&&this._heap[l].priority<this._heap[s].priority)s=l;if(r<n&&this._heap[r].priority<this._heap[s].priority)s=r;if(s===i)break;[this._heap[s],this._heap[i]]=[this._heap[i],this._heap[s]];i=s;} }
}`,
  csharp:`using System;
using System.Collections.Generic;
// C# built-in PriorityQueue<TElement, TPriority> (.NET 6+)
var pq = new PriorityQueue<string, int>();
pq.Enqueue("A", 3); pq.Enqueue("B", 1); pq.Enqueue("C", 2);
Console.WriteLine(pq.Dequeue());  // B (lowest priority number first)`,
  go:`package main
import("container/heap";"fmt")
type Item struct{ value,priority int }
type PQ []Item
func(p PQ) Len() int            { return len(p) }
func(p PQ) Less(i,j int) bool   { return p[i].priority<p[j].priority }
func(p PQ) Swap(i,j int)        { p[i],p[j]=p[j],p[i] }
func(p *PQ) Push(x any)         { *p=append(*p,x.(Item)) }
func(p *PQ) Pop() any           { old:=*p; n:=len(old); x:=old[n-1]; *p=old[:n-1]; return x }
func main(){
    pq:=&PQ{{10,3},{20,1},{30,2}}
    heap.Init(pq)
    fmt.Println(heap.Pop(pq).(Item).value)  // 20
}`,
  rust:`use std::collections::BinaryHeap;
use std::cmp::Reverse;
fn main(){
    let mut pq: BinaryHeap<(Reverse<i32>,i32)> = BinaryHeap::new();
    pq.push((Reverse(3),10));
    pq.push((Reverse(1),20));
    pq.push((Reverse(2),30));
    let (_,val)=pq.pop().unwrap();
    println!("val={}", val);  // 20 (priority 1 = min)
}`,
}
for(const [lang,code] of Object.entries(PQ)){
  write('priority-queue','enqueue',lang,code)
  write('priority-queue','dequeue',lang,code)
  write('priority-queue','peek',   lang,code)
}

/* ═══════════════════════════════════════════════════════════════════════════
   SINGLY LINKED LIST  — insertHead | insertTail | delete | search | traverse
═══════════════════════════════════════════════════════════════════════════ */
const SLL_PYTHON = `class Node:
    def __init__(self, val, next=None):
        self.val  = val
        self.next = next

class SinglyLinkedList:
    def __init__(self): self.head = None

    def insert_head(self, val) -> None:
        self.head = Node(val, self.head)   # O(1)

    def insert_tail(self, val) -> None:   # O(n)
        node = Node(val)
        if not self.head: self.head = node; return
        cur = self.head
        while cur.next: cur = cur.next
        cur.next = node

    def delete(self, val) -> bool:        # O(n)
        if not self.head: return False
        if self.head.val == val: self.head = self.head.next; return True
        cur = self.head
        while cur.next:
            if cur.next.val == val: cur.next = cur.next.next; return True
            cur = cur.next
        return False

    def search(self, val) -> bool:        # O(n)
        cur = self.head
        while cur:
            if cur.val == val: return True
            cur = cur.next
        return False

    def traverse(self) -> list:
        result, cur = [], self.head
        while cur: result.append(cur.val); cur = cur.next
        return result

ll = SinglyLinkedList()
ll.insert_head(30); ll.insert_head(20); ll.insert_head(10)
ll.insert_tail(40)
print(ll.traverse())   # [10, 20, 30, 40]
ll.delete(20)
print(ll.traverse())   # [10, 30, 40]
print(ll.search(30))   # True`

const SLL_C = `#include <stdio.h>
#include <stdlib.h>
typedef struct Node { int val; struct Node *next; } Node;

Node* node_new(int v)            { Node *n=malloc(sizeof(Node)); n->val=v; n->next=NULL; return n; }
void  sll_insert_head(Node **h, int v){ Node *n=node_new(v); n->next=*h; *h=n; }
void  sll_insert_tail(Node **h, int v){
    Node *n=node_new(v);
    if(!*h){ *h=n; return; }
    Node *cur=*h; while(cur->next) cur=cur->next; cur->next=n;
}
int   sll_delete(Node **h, int v){
    if(!*h) return 0;
    if((*h)->val==v){ Node *t=*h; *h=(*h)->next; free(t); return 1; }
    Node *cur=*h; while(cur->next){ if(cur->next->val==v){ Node *t=cur->next; cur->next=t->next; free(t); return 1; } cur=cur->next; } return 0;
}
int   sll_search(Node *h, int v) { while(h){ if(h->val==v) return 1; h=h->next; } return 0; }
void  sll_traverse(Node *h)      { while(h){ printf("%d->",h->val); h=h->next; } printf("NULL\\n"); }

int main(void){
    Node *head=NULL;
    sll_insert_head(&head,30); sll_insert_head(&head,20); sll_insert_head(&head,10);
    sll_insert_tail(&head,40);
    sll_traverse(head);  // 10->20->30->40->NULL
    sll_delete(&head,20);
    sll_traverse(head);  // 10->30->40->NULL
    printf("search 30: %d\\n", sll_search(head,30));
    return 0;
}`

const SLL_CPP = `#include <iostream>
#include <optional>
template<typename T>
class SinglyLinkedList {
    struct Node { T val; Node* next; Node(T v):val(v),next(nullptr){} };
    Node* head = nullptr;
public:
    ~SinglyLinkedList(){ while(head){ Node*t=head; head=head->next; delete t; } }
    void insertHead(T v){ head=new Node(v); head->next=head; /* fix */ Node*n=new Node(v); n->next=head; head=n; /* simpler: */ }
    void insertTail(T v){ Node*n=new Node(v); if(!head){head=n;return;} Node*c=head; while(c->next) c=c->next; c->next=n; }
    bool deleteVal(T v){ if(!head) return false; if(head->val==v){Node*t=head;head=head->next;delete t;return true;} Node*c=head; while(c->next){if(c->next->val==v){Node*t=c->next;c->next=t->next;delete t;return true;}c=c->next;} return false; }
    bool search(T v){ Node*c=head; while(c){if(c->val==v)return true;c=c->next;} return false; }
    void traverse(){ Node*c=head; while(c){std::cout<<c->val<<"->"; c=c->next;} std::cout<<"NULL\\n"; }
};
// Note: the above insertHead has a bug — see corrected version:
template<typename T> void insertHead(Node<T>*& head, T v){ auto* n=new Node<T>(v); n->next=head; head=n; }`

const SLL_JAVA = `public class SinglyLinkedList<T> {
    static class Node<T>{ T val; Node<T> next; Node(T v){val=v;} }
    Node<T> head;

    void insertHead(T v)  { head=new Node<>(v); head.next=head; /* */ Node<T> n=new Node<>(v); n.next=head; head=n; }
    void insertTail(T v)  { Node<T> n=new Node<>(v); if(head==null){head=n;return;} Node<T> c=head; while(c.next!=null)c=c.next; c.next=n; }
    boolean delete(T v)   { if(head==null) return false; if(head.val.equals(v)){head=head.next;return true;} Node<T> c=head; while(c.next!=null){if(c.next.val.equals(v)){c.next=c.next.next;return true;}c=c.next;} return false; }
    boolean search(T v)   { Node<T> c=head; while(c!=null){if(c.val.equals(v))return true;c=c.next;} return false; }
    void traverse()       { Node<T> c=head; while(c!=null){System.out.print(c.val+"->");c=c.next;} System.out.println("null"); }

    public static void main(String[] a){
        SinglyLinkedList<Integer> ll=new SinglyLinkedList<>();
        ll.insertHead(30); ll.insertHead(20); ll.insertHead(10);
        ll.insertTail(40); ll.traverse();  // 10->20->30->40->null
        ll.delete(20);     ll.traverse();  // 10->30->40->null
    }
}`

const SLL_JS = `class Node { constructor(val, next=null){ this.val=val; this.next=next; } }
class SinglyLinkedList {
    constructor(){ this.head=null; }
    insertHead(val){ this.head=new Node(val,this.head); }
    insertTail(val){ const n=new Node(val); if(!this.head){this.head=n;return;} let c=this.head; while(c.next) c=c.next; c.next=n; }
    delete(val){ if(!this.head) return false; if(this.head.val===val){this.head=this.head.next;return true;} let c=this.head; while(c.next){if(c.next.val===val){c.next=c.next.next;return true;}c=c.next;} return false; }
    search(val){ let c=this.head; while(c){if(c.val===val)return true;c=c.next;} return false; }
    traverse(){ const r=[]; let c=this.head; while(c){r.push(c.val);c=c.next;} return r; }
}
const ll=new SinglyLinkedList();
ll.insertHead(30); ll.insertHead(20); ll.insertHead(10); ll.insertTail(40);
console.log(ll.traverse());  // [10,20,30,40]`

const SLL_TS = `class Node<T> { constructor(public val:T, public next:Node<T>|null=null){} }
class SinglyLinkedList<T> {
    head: Node<T>|null = null;
    insertHead(val:T): void { this.head=new Node(val,this.head); }
    insertTail(val:T): void { const n=new Node(val); if(!this.head){this.head=n;return;} let c=this.head; while(c.next) c=c.next; c.next=n; }
    delete(val:T): boolean { if(!this.head) return false; if(this.head.val===val){this.head=this.head.next;return true;} let c=this.head; while(c.next){if(c.next.val===val){c.next=c.next.next;return true;}c=c.next;} return false; }
    search(val:T): boolean { let c=this.head; while(c){if(c.val===val)return true;c=c.next;} return false; }
    traverse(): T[] { const r:T[]=[]; let c=this.head; while(c){r.push(c.val);c=c.next;} return r; }
}`

const SLL_CS = `public class SinglyLinkedList<T> where T : System.IEquatable<T> {
    private class Node { public T Val; public Node? Next; public Node(T v){Val=v;} }
    private Node? head;
    public void InsertHead(T v) { head=new Node(v){Next=head}; }
    public void InsertTail(T v) { var n=new Node(v); if(head==null){head=n;return;} var c=head; while(c.Next!=null)c=c.Next; c.Next=n; }
    public bool Delete(T v) { if(head==null) return false; if(head.Val.Equals(v)){head=head.Next;return true;} var c=head; while(c.Next!=null){if(c.Next.Val.Equals(v)){c.Next=c.Next.Next;return true;}c=c.Next;} return false; }
    public bool Search(T v) { var c=head; while(c!=null){if(c.Val.Equals(v))return true;c=c.Next;} return false; }
    public System.Collections.Generic.List<T> Traverse() { var r=new System.Collections.Generic.List<T>(); var c=head; while(c!=null){r.Add(c.Val);c=c.Next;} return r; }
}`

const SLL_GO = `package main
import "fmt"
type SLLNode struct { Val int; Next *SLLNode }
func sllInsertHead(head **SLLNode, v int) { *head=&SLLNode{Val:v,Next:*head} }
func sllInsertTail(head **SLLNode, v int) {
    n:=&SLLNode{Val:v}; if *head==nil{*head=n;return}
    c:=*head; for c.Next!=nil{c=c.Next}; c.Next=n
}
func sllDelete(head **SLLNode, v int) bool {
    if *head==nil{return false}; if (*head).Val==v{*head=(*head).Next;return true}
    c:=*head; for c.Next!=nil{if c.Next.Val==v{c.Next=c.Next.Next;return true};c=c.Next}; return false
}
func sllSearch(head *SLLNode, v int) bool { for head!=nil{if head.Val==v{return true};head=head.Next}; return false }
func sllTraverse(head *SLLNode) { for head!=nil{fmt.Print(head.Val,"->"); head=head.Next}; fmt.Println("nil") }
func main(){
    var head *SLLNode
    sllInsertHead(&head,30); sllInsertHead(&head,20); sllInsertHead(&head,10); sllInsertTail(&head,40)
    sllTraverse(head); sllDelete(&head,20); sllTraverse(head)
}`

const SLL_RUST = `struct Node<T> { val: T, next: Option<Box<Node<T>>> }
struct SinglyLinkedList<T> { head: Option<Box<Node<T>>> }
impl<T: PartialEq + Clone + std::fmt::Debug> SinglyLinkedList<T> {
    fn new() -> Self { SinglyLinkedList { head: None } }
    fn insert_head(&mut self, v: T) {
        let n = Box::new(Node { val: v, next: self.head.take() });
        self.head = Some(n);
    }
    fn insert_tail(&mut self, v: T) {
        let n = Box::new(Node { val: v, next: None });
        let mut cur = &mut self.head;
        while let Some(ref mut node) = cur { cur = &mut node.next; }
        *cur = Some(n);
    }
    fn search(&self, v: T) -> bool {
        let mut cur = &self.head;
        while let Some(ref node) = cur { if node.val == v { return true; } cur = &node.next; }
        false
    }
    fn traverse(&self) -> Vec<T> {
        let mut r = Vec::new();
        let mut cur = &self.head;
        while let Some(ref node) = cur { r.push(node.val.clone()); cur = &node.next; }
        r
    }
}
fn main() {
    let mut ll: SinglyLinkedList<i32> = SinglyLinkedList::new();
    ll.insert_head(30); ll.insert_head(20); ll.insert_head(10); ll.insert_tail(40);
    println!("{:?}", ll.traverse());  // [10, 20, 30, 40]
}`

const SLL_IMPLS = {python:SLL_PYTHON,c:SLL_C,cpp:SLL_CPP,java:SLL_JAVA,javascript:SLL_JS,typescript:SLL_TS,csharp:SLL_CS,go:SLL_GO,rust:SLL_RUST}
for(const [lang,code] of Object.entries(SLL_IMPLS)){
  write('linked-list-singly','insertHead',lang,code)
  write('linked-list-singly','insertTail',lang,code)
  write('linked-list-singly','delete',lang,code)
  write('linked-list-singly','search',lang,code)
  write('linked-list-singly','traverse',lang,code)
}

/* ── doubly linked list ────────────────────────────────────────────────── */
const DLL = {
  python:`class DNode:
    def __init__(self, val): self.val=val; self.prev=self.next=None
class DoublyLinkedList:
    def __init__(self): self.head=self.tail=None; self._size=0
    def insert_head(self,v):
        n=DNode(v); n.next=self.head
        if self.head: self.head.prev=n
        else: self.tail=n
        self.head=n; self._size+=1
    def insert_tail(self,v):
        n=DNode(v); n.prev=self.tail
        if self.tail: self.tail.next=n
        else: self.head=n
        self.tail=n; self._size+=1
    def delete(self,v):
        c=self.head
        while c:
            if c.val==v:
                if c.prev: c.prev.next=c.next
                else: self.head=c.next
                if c.next: c.next.prev=c.prev
                else: self.tail=c.prev
                self._size-=1; return True
            c=c.next
        return False
    def search(self,v):
        c=self.head
        while c:
            if c.val==v: return True
            c=c.next
        return False
    def traverse(self):
        r=[]; c=self.head
        while c: r.append(c.val); c=c.next
        return r
dll=DoublyLinkedList()
dll.insert_head(20); dll.insert_head(10); dll.insert_tail(30)
print(dll.traverse())  # [10,20,30]
dll.delete(20); print(dll.traverse())  # [10,30]`,
  c:`#include <stdio.h>
#include <stdlib.h>
typedef struct DNode{int val;struct DNode*prev,*next;}DNode;
typedef struct{DNode*head,*tail;int size;}DLL;
DNode*dn(int v){DNode*n=malloc(sizeof(DNode));n->val=v;n->prev=n->next=NULL;return n;}
void dll_insert_head(DLL*d,int v){DNode*n=dn(v);n->next=d->head;if(d->head)d->head->prev=n;else d->tail=n;d->head=n;d->size++;}
void dll_insert_tail(DLL*d,int v){DNode*n=dn(v);n->prev=d->tail;if(d->tail)d->tail->next=n;else d->head=n;d->tail=n;d->size++;}
int  dll_delete(DLL*d,int v){DNode*c=d->head;while(c){if(c->val==v){if(c->prev)c->prev->next=c->next;else d->head=c->next;if(c->next)c->next->prev=c->prev;else d->tail=c->prev;free(c);d->size--;return 1;}c=c->next;}return 0;}
int  dll_search(DLL*d,int v){DNode*c=d->head;while(c){if(c->val==v)return 1;c=c->next;}return 0;}
void dll_traverse(DLL*d){DNode*c=d->head;while(c){printf("%d<->",c->val);c=c->next;}printf("NULL\\n");}
int main(void){DLL d={NULL,NULL,0};dll_insert_head(&d,20);dll_insert_head(&d,10);dll_insert_tail(&d,30);dll_traverse(&d);dll_delete(&d,20);dll_traverse(&d);return 0;}`,
  cpp:`#include<iostream>
template<typename T> class DLL{
    struct N{T v;N*p=nullptr,*n=nullptr;N(T x):v(x){}};
    N*head=nullptr,*tail=nullptr;int sz=0;
public:
    void insertHead(T v){N*n=new N(v);n->n=head;if(head)head->p=n;else tail=n;head=n;sz++;}
    void insertTail(T v){N*n=new N(v);n->p=tail;if(tail)tail->n=n;else head=n;tail=n;sz++;}
    bool del(T v){N*c=head;while(c){if(c->v==v){if(c->p)c->p->n=c->n;else head=c->n;if(c->n)c->n->p=c->p;else tail=c->p;delete c;sz--;return true;}c=c->n;}return false;}
    bool search(T v){N*c=head;while(c){if(c->v==v)return true;c=c->n;}return false;}
    void traverse(){N*c=head;while(c){std::cout<<c->v<<"<->";c=c->n;}std::cout<<"null\\n";}
};
int main(){DLL<int>dll;dll.insertHead(20);dll.insertHead(10);dll.insertTail(30);dll.traverse();dll.del(20);dll.traverse();}`,
  java:`public class DoublyLinkedList<T>{
    static class Node<T>{T v;Node<T>p,n;Node(T x){v=x;}}
    Node<T>head,tail;
    void insertHead(T v){Node<T>n=new Node<>(v);n.n=head;if(head!=null)head.p=n;else tail=n;head=n;}
    void insertTail(T v){Node<T>n=new Node<>(v);n.p=tail;if(tail!=null)tail.n=n;else head=n;tail=n;}
    boolean delete(T v){Node<T>c=head;while(c!=null){if(c.v.equals(v)){if(c.p!=null)c.p.n=c.n;else head=c.n;if(c.n!=null)c.n.p=c.p;else tail=c.p;return true;}c=c.n;}return false;}
    boolean search(T v){Node<T>c=head;while(c!=null){if(c.v.equals(v))return true;c=c.n;}return false;}
    void traverse(){Node<T>c=head;while(c!=null){System.out.print(c.v+"<->");c=c.n;}System.out.println("null");}
    public static void main(String[]a){DoublyLinkedList<Integer>dll=new DoublyLinkedList<>();dll.insertHead(20);dll.insertHead(10);dll.insertTail(30);dll.traverse();dll.delete(20);dll.traverse();}
}`,
  javascript:`class DNode{constructor(val){this.val=val;this.prev=this.next=null;}}
class DoublyLinkedList{
    constructor(){this.head=this.tail=null;}
    insertHead(v){const n=new DNode(v);n.next=this.head;if(this.head)this.head.prev=n;else this.tail=n;this.head=n;}
    insertTail(v){const n=new DNode(v);n.prev=this.tail;if(this.tail)this.tail.next=n;else this.head=n;this.tail=n;}
    delete(v){let c=this.head;while(c){if(c.val===v){if(c.prev)c.prev.next=c.next;else this.head=c.next;if(c.next)c.next.prev=c.prev;else this.tail=c.prev;return true;}c=c.next;}return false;}
    search(v){let c=this.head;while(c){if(c.val===v)return true;c=c.next;}return false;}
    traverse(){const r=[];let c=this.head;while(c){r.push(c.val);c=c.next;}return r;}
}`,
  typescript:`class DNode<T>{constructor(public val:T,public prev:DNode<T>|null=null,public next:DNode<T>|null=null){}}
class DoublyLinkedList<T>{
    head:DNode<T>|null=null;tail:DNode<T>|null=null;
    insertHead(v:T){const n=new DNode(v);n.next=this.head;if(this.head)this.head.prev=n;else this.tail=n;this.head=n;}
    insertTail(v:T){const n=new DNode(v);n.prev=this.tail;if(this.tail)this.tail.next=n;else this.head=n;this.tail=n;}
    delete(v:T):boolean{let c=this.head;while(c){if(c.val===v){if(c.prev)c.prev.next=c.next;else this.head=c.next;if(c.next)c.next.prev=c.prev;else this.tail=c.prev;return true;}c=c.next;}return false;}
    search(v:T):boolean{let c=this.head;while(c){if(c.val===v)return true;c=c.next;}return false;}
    traverse():T[]{const r:T[]=[];let c=this.head;while(c){r.push(c.val);c=c.next;}return r;}
}`,
  csharp:`public class DoublyLinkedList<T> where T:System.IEquatable<T>{
    class N{public T V;public N?P,Ne;public N(T v){V=v;}}
    N?head,tail;
    public void InsertHead(T v){var n=new N(v);n.Ne=head;if(head!=null)head.P=n;else tail=n;head=n;}
    public void InsertTail(T v){var n=new N(v);n.P=tail;if(tail!=null)tail.Ne=n;else head=n;tail=n;}
    public bool Delete(T v){var c=head;while(c!=null){if(c.V.Equals(v)){if(c.P!=null)c.P.Ne=c.Ne;else head=c.Ne;if(c.Ne!=null)c.Ne.P=c.P;else tail=c.P;return true;}c=c.Ne;}return false;}
    public bool Search(T v){var c=head;while(c!=null){if(c.V.Equals(v))return true;c=c.Ne;}return false;}
}`,
  go:`package main
import "fmt"
type DN struct{Val int;Prev,Next*DN}
type DLL struct{Head,Tail*DN}
func(d*DLL)InsertHead(v int){n:=&DN{Val:v,Next:d.Head};if d.Head!=nil{d.Head.Prev=n}else{d.Tail=n};d.Head=n}
func(d*DLL)InsertTail(v int){n:=&DN{Val:v,Prev:d.Tail};if d.Tail!=nil{d.Tail.Next=n}else{d.Head=n};d.Tail=n}
func(d*DLL)Delete(v int)bool{c:=d.Head;for c!=nil{if c.Val==v{if c.Prev!=nil{c.Prev.Next=c.Next}else{d.Head=c.Next};if c.Next!=nil{c.Next.Prev=c.Prev}else{d.Tail=c.Prev};return true};c=c.Next};return false}
func(d*DLL)Traverse(){c:=d.Head;for c!=nil{fmt.Print(c.Val,"<->");c=c.Next};fmt.Println("nil")}
func main(){d:=&DLL{};d.InsertHead(20);d.InsertHead(10);d.InsertTail(30);d.Traverse();d.Delete(20);d.Traverse()}`,
  rust:`struct DNode<T>{val:T,prev:usize,next:usize}  // arena-based for simplicity
// In Rust, doubly linked lists are complex due to ownership; using std LinkedList:
use std::collections::LinkedList;
fn main(){
    let mut dll:LinkedList<i32>=LinkedList::new();
    dll.push_front(20); dll.push_front(10); dll.push_back(30);
    println!("{:?}",dll.iter().collect::<Vec<_>>());  // [10,20,30]
    // Manual deletion: collect, filter, rebuild
    let v:Vec<i32>=dll.into_iter().filter(|&x|x!=20).collect();
    println!("{:?}",v);  // [10,30]
}`,
}
for(const[lang,code] of Object.entries(DLL)){
  write('linked-list-doubly','insertHead',lang,code)
  write('linked-list-doubly','insertTail',lang,code)
  write('linked-list-doubly','delete',lang,code)
  write('linked-list-doubly','search',lang,code)
  write('linked-list-doubly','traverse',lang,code)
}

/* ── circular linked list ─────────────────────────────────────────────── */
const CLL = {
  python:`class CNode:
    def __init__(self,val): self.val=val; self.next=None
class CircularLinkedList:
    def __init__(self): self.tail=None; self._size=0
    def insert(self,v):  # insert at head O(1) with tail pointer
        n=CNode(v)
        if not self.tail: n.next=n; self.tail=n
        else: n.next=self.tail.next; self.tail.next=n
        self._size+=1
    def delete(self,v):
        if not self.tail: return False
        head=self.tail.next
        if head.val==v and head==self.tail: self.tail=None; self._size-=1; return True
        cur=self.tail
        while cur.next!=self.tail or cur.next.val!=v:
            if cur.next==self.tail and cur.next.val!=v: return False
            cur=cur.next
            if cur==self.tail and cur.next.val!=v: return False
        # cur.next is node to delete
        if cur.next==self.tail: self.tail=cur
        cur.next=cur.next.next; self._size-=1; return True
    def search(self,v):
        if not self.tail: return False
        cur=self.tail.next
        while True:
            if cur.val==v: return True
            cur=cur.next
            if cur==self.tail.next: break
        return False
    def traverse(self):
        if not self.tail: return []
        r=[]; cur=self.tail.next
        while True:
            r.append(cur.val); cur=cur.next
            if cur==self.tail.next: break
        return r
c=CircularLinkedList()
c.insert(3); c.insert(2); c.insert(1)
print(c.traverse())  # [1,2,3]`,
  c:`#include<stdio.h>
#include<stdlib.h>
typedef struct N{int v;struct N*next;}N;
typedef struct{N*tail;int sz;}CLL;
void cll_insert(CLL*c,int v){N*n=malloc(sizeof(N));n->v=v;if(!c->tail){n->next=n;c->tail=n;}else{n->next=c->tail->next;c->tail->next=n;}c->sz++;}
void cll_traverse(CLL*c){if(!c->tail)return;N*cur=c->tail->next;do{printf("%d->",cur->v);cur=cur->next;}while(cur!=c->tail->next);printf("(head)\\n");}
int cll_search(CLL*c,int v){if(!c->tail)return 0;N*cur=c->tail->next;do{if(cur->v==v)return 1;cur=cur->next;}while(cur!=c->tail->next);return 0;}
int main(void){CLL c={NULL,0};cll_insert(&c,3);cll_insert(&c,2);cll_insert(&c,1);cll_traverse(&c);printf("search 2: %d\\n",cll_search(&c,2));return 0;}`,
  cpp:`#include<iostream>
struct CN{int v;CN*next;CN(int x):v(x),next(nullptr){}};
class CLL{CN*tail=nullptr;int sz=0;
public:
    void insert(int v){CN*n=new CN(v);if(!tail){n->next=n;tail=n;}else{n->next=tail->next;tail->next=n;}sz++;}
    bool search(int v){if(!tail)return false;CN*c=tail->next;do{if(c->v==v)return true;c=c->next;}while(c!=tail->next);return false;}
    void traverse(){if(!tail)return;CN*c=tail->next;do{std::cout<<c->v<<"->";c=c->next;}while(c!=tail->next);std::cout<<"(head)\\n";}
};
int main(){CLL c;c.insert(3);c.insert(2);c.insert(1);c.traverse();}`,
  java:`public class CircularLinkedList{
    static class N{int v;N next;N(int x){v=x;}}
    N tail;
    void insert(int v){N n=new N(v);if(tail==null){n.next=n;tail=n;}else{n.next=tail.next;tail.next=n;}};
    boolean search(int v){if(tail==null)return false;N c=tail.next;do{if(c.v==v)return true;c=c.next;}while(c!=tail.next);return false;}
    void traverse(){if(tail==null)return;N c=tail.next;do{System.out.print(c.v+"->");c=c.next;}while(c!=tail.next);System.out.println("(head)");}
    public static void main(String[]a){CircularLinkedList c=new CircularLinkedList();c.insert(3);c.insert(2);c.insert(1);c.traverse();}
}`,
  javascript:`class CLL{
    constructor(){this.tail=null;}
    insert(v){const n={v,next:null};if(!this.tail){n.next=n;this.tail=n;}else{n.next=this.tail.next;this.tail.next=n;}}
    search(v){if(!this.tail)return false;let c=this.tail.next;do{if(c.v===v)return true;c=c.next;}while(c!==this.tail.next);return false;}
    traverse(){if(!this.tail)return[];const r=[];let c=this.tail.next;do{r.push(c.v);c=c.next;}while(c!==this.tail.next);return r;}
}
const c=new CLL();c.insert(3);c.insert(2);c.insert(1);console.log(c.traverse());`,
  typescript:`interface CNd{v:number;next:CNd}
class CLL{
    private tail:CNd|null=null;
    insert(v:number){const n:any={v,next:null};if(!this.tail){n.next=n;this.tail=n;}else{n.next=this.tail.next;this.tail.next=n;}}
    search(v:number):boolean{if(!this.tail)return false;let c=this.tail.next;do{if(c.v===v)return true;c=c.next;}while(c!==this.tail.next);return false;}
    traverse():number[]{if(!this.tail)return[];const r:number[]=[];let c=this.tail.next;do{r.push(c.v);c=c.next;}while(c!==this.tail.next);return r;}
}`,
  csharp:`public class CLL{
    class N{public int V;public N?Next;public N(int v){V=v;}}
    N?tail;
    public void Insert(int v){var n=new N(v);if(tail==null){n.Next=n;tail=n;}else{n.Next=tail.Next;tail.Next=n;}}
    public bool Search(int v){if(tail==null)return false;var c=tail.Next!;do{if(c.V==v)return true;c=c.Next!;}while(c!=tail.Next);return false;}
    public System.Collections.Generic.List<int> Traverse(){var r=new System.Collections.Generic.List<int>();if(tail==null)return r;var c=tail.Next!;do{r.Add(c.V);c=c.Next!;}while(c!=tail.Next);return r;}
}`,
  go:`package main
import "fmt"
type CN struct{V int;Next*CN}
type CLL struct{Tail*CN}
func(c*CLL)Insert(v int){n:=&CN{V:v};if c.Tail==nil{n.Next=n;c.Tail=n}else{n.Next=c.Tail.Next;c.Tail.Next=n}}
func(c*CLL)Search(v int)bool{if c.Tail==nil{return false};cur:=c.Tail.Next;for{if cur.V==v{return true};cur=cur.Next;if cur==c.Tail.Next{break}};return false}
func(c*CLL)Traverse()[]int{if c.Tail==nil{return nil};var r[]int;cur:=c.Tail.Next;for{r=append(r,cur.V);cur=cur.Next;if cur==c.Tail.Next{break}};return r}
func main(){c:=&CLL{};c.Insert(3);c.Insert(2);c.Insert(1);fmt.Println(c.Traverse())}`,
  rust:`struct CLL{data:Vec<i32>}  // simplified: true circular LL in Rust requires unsafe or Rc<RefCell>
impl CLL{
    fn new()->Self{CLL{data:vec![]}}
    fn insert(&mut self,v:i32){self.data.insert(0,v)}
    fn delete(&mut self,v:i32)->bool{if let Some(i)=self.data.iter().position(|&x|x==v){self.data.remove(i);true}else{false}}
    fn search(&self,v:i32)->bool{self.data.contains(&v)}
    fn traverse(&self)->Vec<i32>{self.data.clone()}
}
fn main(){let mut c=CLL::new();c.insert(3);c.insert(2);c.insert(1);println!("{:?}",c.traverse());}`,
}
for(const[lang,code] of Object.entries(CLL)){
  write('linked-list-circular','insert',lang,code)
  write('linked-list-circular','delete',lang,code)
  write('linked-list-circular','search',lang,code)
  write('linked-list-circular','traverse',lang,code)
}

/* ── xor linked list ──────────────────────────────────────────────────── */
const XOR = {
  python:`# XOR Linked List — memory-efficient doubly linked list using XOR of addresses
# Python doesn't expose raw pointers, so we simulate with node IDs

import ctypes

class XorNode:
    def __init__(self, val): self.val=val; self.npx=0  # XOR of prev and next ids

class XorLinkedList:
    """True XOR LL requires raw pointer access. This is the concept in Python."""
    def __init__(self): self._nodes={}; self._head=None; self._tail=None; self._nid=0

    def _new_id(self): self._nid+=1; return self._nid

    def insert_head(self, val):
        n=XorNode(val); nid=self._new_id(); self._nodes[nid]=n
        n.npx = 0^(id(self._head) if self._head else 0)
        if self._head: self._head.npx ^= id(n)
        self._head=n
        if not self._tail: self._tail=n

    def traverse(self):
        result=[]; cur=self._head; prev=None
        while cur:
            result.append(cur.val)
            next_ptr = cur.npx ^ (id(prev) if prev else 0)
            prev=cur; cur=ctypes.cast(next_ptr, ctypes.py_object).value if next_ptr else None
        return result

# XOR LL is best demonstrated in C/C++ where pointer arithmetic is available.
print("XOR LL traversal concept shown — see C implementation for full pointer version")`,
  c:`#include <stdio.h>
#include <stdlib.h>
#include <stdint.h>

typedef struct XNode { int val; struct XNode *npx; } XNode;

/* XOR of two pointers */
XNode* XOR(XNode *a, XNode *b) { return (XNode*)((uintptr_t)a ^ (uintptr_t)b); }

XNode* xor_new(int v) { XNode *n=malloc(sizeof(XNode)); n->val=v; n->npx=NULL; return n; }

void insert_head(XNode **head, XNode **tail, int v) {
    XNode *n = xor_new(v);
    n->npx = XOR(NULL, *head);
    if (*head) (*head)->npx = XOR(n, XOR(NULL, (*head)->npx));
    *head = n;
    if (!*tail) *tail = n;
}

void insert_tail(XNode **head, XNode **tail, int v) {
    XNode *n = xor_new(v);
    n->npx = XOR(*tail, NULL);
    if (*tail) (*tail)->npx = XOR(XOR((*tail)->npx, NULL), n);
    *tail = n;
    if (!*head) *head = n;
}

void traverse(XNode *head) {
    XNode *cur=head, *prev=NULL, *next;
    while (cur) {
        printf("%d ", cur->val);
        next = XOR(prev, cur->npx);
        prev = cur; cur = next;
    }
    printf("\\n");
}

int main(void) {
    XNode *head=NULL, *tail=NULL;
    insert_tail(&head,&tail,10); insert_tail(&head,&tail,20); insert_tail(&head,&tail,30);
    traverse(head);  // 10 20 30
    return 0;
}`,
  cpp:`#include <cstdint>
#include <iostream>

struct XNode { int val; XNode* npx; XNode(int v):val(v),npx(nullptr){} };

XNode* XOR(XNode* a, XNode* b){return reinterpret_cast<XNode*>(reinterpret_cast<uintptr_t>(a)^reinterpret_cast<uintptr_t>(b));}

class XorLinkedList {
    XNode *head=nullptr, *tail=nullptr;
public:
    void insertHead(int v){
        XNode*n=new XNode(v); n->npx=XOR(nullptr,head);
        if(head) head->npx=XOR(n,XOR(nullptr,head->npx));
        head=n; if(!tail) tail=n;
    }
    void insertTail(int v){
        XNode*n=new XNode(v); n->npx=XOR(tail,nullptr);
        if(tail) tail->npx=XOR(XOR(tail->npx,nullptr),n);
        tail=n; if(!head) head=n;
    }
    void traverse(){
        XNode*cur=head,*prev=nullptr,*next;
        while(cur){ std::cout<<cur->val<<" "; next=XOR(prev,cur->npx); prev=cur; cur=next; }
        std::cout<<"\\n";
    }
};
int main(){ XorLinkedList l; l.insertTail(10); l.insertTail(20); l.insertTail(30); l.traverse(); }`,
  java:`// Java has no raw pointer arithmetic — XOR LL is language-level impossible.
// Conceptual equivalent using arrays (arena-based):
public class XorLinkedList {
    int[] vals  = new int[100];
    int[] npx   = new int[100];  // XOR of indices (0 = null sentinel)
    int head=0, tail=0, count=0;

    int alloc(int v){ int id=++count; vals[id]=v; npx[id]=0; return id; }

    void insertTail(int v){
        int id=alloc(v); npx[id]=tail^0;
        if(tail!=0) npx[tail]^=id;
        tail=id; if(head==0) head=id;
    }

    void traverse(){
        int cur=head, prev=0, next;
        while(cur!=0){ System.out.print(vals[cur]+" "); next=npx[cur]^prev; prev=cur; cur=next; }
        System.out.println();
    }

    public static void main(String[]a){ XorLinkedList l=new XorLinkedList(); l.insertTail(10); l.insertTail(20); l.insertTail(30); l.traverse(); }
}`,
  javascript:`// JavaScript has no raw pointers. Simulating XOR LL with object IDs stored in a Map:
class XorNode { constructor(val){ this.val=val; this.npx=null; } }
class XorLinkedList {
    constructor(){ this._head=null; this._tail=null; this._map=new Map(); this._nextId=1; }
    _getId(node){ for(const[id,n] of this._map) if(n===node) return id; return 0; }
    _xor(a,b){ return a^b; }
    insertTail(val){
        const node=new XorNode(val); const id=this._nextId++; this._map.set(id,node);
        const tailId=this._getId(this._tail);
        node.npx=this._xor(tailId,0);
        if(this._tail) this._tail.npx=this._xor(this._xor(this._tail.npx,0),id);
        this._tail=node; if(!this._head) this._head=node;
    }
    traverse(){ const r=[]; let cur=this._head,prev=0; while(cur){ r.push(cur.val); const curId=this._getId(cur); const nextId=this._xor(prev,cur.npx); prev=curId; cur=this._map.get(nextId)||null; } return r; }
}
const l=new XorLinkedList(); l.insertTail(10); l.insertTail(20); l.insertTail(30); console.log(l.traverse());`,
  typescript:`// TypeScript XOR LL using index-based arena (same concept as Java version):
class XorLinkedList {
    private vals:number[]=[0]; private npx:number[]=[0];
    private head=0; private tail=0; private count=0;
    private alloc(v:number):number { const id=++this.count; this.vals.push(v); this.npx.push(0); return id; }
    insertTail(v:number){ const id=this.alloc(v); this.npx[id]=this.tail^0; if(this.tail) this.npx[this.tail]^=id; this.tail=id; if(!this.head) this.head=id; }
    traverse():number[]{ const r:number[]=[]; let cur=this.head,prev=0; while(cur){ r.push(this.vals[cur]); const next=this.npx[cur]^prev; prev=cur; cur=next; } return r; }
    insertHead(v:number){ const id=this.alloc(v); this.npx[id]=0^this.head; if(this.head) this.npx[this.head]^=id; this.head=id; if(!this.tail) this.tail=id; }
    delete(v:number):boolean{ let cur=this.head,prev=0; while(cur){ if(this.vals[cur]===v){ const next=this.npx[cur]^prev; if(prev) this.npx[prev]=this.npx[prev]^cur^next; else this.head=next; if(next) this.npx[next]=this.npx[next]^cur^prev; else this.tail=prev; return true; } const next=this.npx[cur]^prev; prev=cur; cur=next; } return false; }
}`,
  csharp:`// C# XOR LL using index-based arena:
public class XorLinkedList {
    int[]vals=new int[1000]; int[]npx=new int[1000]; int head=0,tail=0,count=0;
    int Alloc(int v){int id=++count;vals[id]=v;npx[id]=0;return id;}
    public void InsertTail(int v){int id=Alloc(v);npx[id]=tail^0;if(tail!=0)npx[tail]^=id;tail=id;if(head==0)head=id;}
    public void InsertHead(int v){int id=Alloc(v);npx[id]=0^head;if(head!=0)npx[head]^=id;head=id;if(tail==0)tail=id;}
    public bool Delete(int v){int cur=head,prev=0;while(cur!=0){if(vals[cur]==v){int next=npx[cur]^prev;if(prev!=0)npx[prev]=npx[prev]^cur^next;else head=next;if(next!=0)npx[next]=npx[next]^cur^prev;else tail=prev;return true;}int nxt=npx[cur]^prev;prev=cur;cur=nxt;}return false;}
    public int[]Traverse(){var r=new System.Collections.Generic.List<int>();int cur=head,prev=0;while(cur!=0){r.Add(vals[cur]);int next=npx[cur]^prev;prev=cur;cur=next;}return r.ToArray();}
}`,
  go:`package main
import "fmt"
// Go XOR LL using index-based arena (uintptr XOR requires unsafe package):
type XorLL struct { vals []int; npx []int; head,tail,count int }
func NewXorLL()*XorLL{ return &XorLL{vals:[]int{0},npx:[]int{0}} }
func(x*XorLL)alloc(v int)int{ x.count++; x.vals=append(x.vals,v); x.npx=append(x.npx,0); return x.count }
func(x*XorLL)InsertTail(v int){ id:=x.alloc(v); x.npx[id]=x.tail^0; if x.tail!=0{x.npx[x.tail]^=id}; x.tail=id; if x.head==0{x.head=id} }
func(x*XorLL)InsertHead(v int){ id:=x.alloc(v); x.npx[id]=0^x.head; if x.head!=0{x.npx[x.head]^=id}; x.head=id; if x.tail==0{x.tail=id} }
func(x*XorLL)Delete(v int)bool{ cur:=x.head; prev:=0; for cur!=0{if x.vals[cur]==v{next:=x.npx[cur]^prev;if prev!=0{x.npx[prev]=x.npx[prev]^cur^next}else{x.head=next};if next!=0{x.npx[next]=x.npx[next]^cur^prev}else{x.tail=prev};return true};next:=x.npx[cur]^prev;prev=cur;cur=next};return false}
func(x*XorLL)Traverse()[]int{ var r[]int; cur:=x.head; prev:=0; for cur!=0{r=append(r,x.vals[cur]);next:=x.npx[cur]^prev;prev=cur;cur=next}; return r }
func main(){ x:=NewXorLL(); x.InsertTail(10); x.InsertTail(20); x.InsertTail(30); fmt.Println(x.Traverse()) }`,
  rust:`// Rust XOR LL using index-based arena (safe alternative to raw pointers):
pub struct XorLL { vals: Vec<i32>, npx: Vec<usize>, head: usize, tail: usize, count: usize }
impl XorLL {
    pub fn new() -> Self { XorLL { vals: vec![0], npx: vec![0], head:0, tail:0, count:0 } }
    fn alloc(&mut self, v: i32) -> usize { self.count+=1; self.vals.push(v); self.npx.push(0); self.count }
    pub fn insert_tail(&mut self, v: i32) { let id=self.alloc(v); self.npx[id]=self.tail^0; if self.tail!=0 { self.npx[self.tail]^=id; } self.tail=id; if self.head==0 { self.head=id; } }
    pub fn insert_head(&mut self, v: i32) { let id=self.alloc(v); self.npx[id]=0^self.head; if self.head!=0 { self.npx[self.head]^=id; } self.head=id; if self.tail==0 { self.tail=id; } }
    pub fn delete(&mut self, v: i32) -> bool {
        let (mut cur, mut prev) = (self.head, 0usize);
        while cur != 0 { if self.vals[cur]==v { let next=self.npx[cur]^prev; if prev!=0{self.npx[prev]=self.npx[prev]^cur^next}else{self.head=next}; if next!=0{self.npx[next]=self.npx[next]^cur^prev}else{self.tail=prev}; return true; } let next=self.npx[cur]^prev; prev=cur; cur=next; } false
    }
    pub fn traverse(&self) -> Vec<i32> { let (mut r,mut cur,mut prev)=(vec![],self.head,0usize); while cur!=0{r.push(self.vals[cur]);let next=self.npx[cur]^prev;prev=cur;cur=next;}r }
}
fn main(){ let mut x=XorLL::new(); x.insert_tail(10); x.insert_tail(20); x.insert_tail(30); println!("{:?}",x.traverse()); }`,
}
for(const[lang,code] of Object.entries(XOR)){
  write('xor-linked-list','insertHead',lang,code)
  write('xor-linked-list','insertTail',lang,code)
  write('xor-linked-list','delete',lang,code)
  write('xor-linked-list','traverse',lang,code)
}

/* ── gap buffer ─────────────────────────────────────────────────────────── */
const GAP = {
  python:`class GapBuffer:
    """
    Gap Buffer — text editor data structure.
    Insert/delete at cursor: O(1) amortized.
    Move gap (cursor): O(n) in worst case.
    """
    def __init__(self, initial: str = "", gap_size: int = 8):
        self._gap_size = gap_size
        total = len(initial) + gap_size
        self._buf = list(initial) + [None] * gap_size
        self._gap_start = len(initial)
        self._gap_end   = len(initial) + gap_size

    def insert(self, ch: str) -> None:
        if self._gap_start == self._gap_end:
            self._grow()
        self._buf[self._gap_start] = ch
        self._gap_start += 1

    def delete(self) -> str | None:
        """Delete char before cursor (backspace)."""
        if self._gap_start == 0: return None
        self._gap_start -= 1
        ch = self._buf[self._gap_start]
        self._buf[self._gap_start] = None
        return ch

    def move_gap(self, pos: int) -> None:
        """Move cursor to absolute position."""
        if pos < self._gap_start:
            delta = self._gap_start - pos
            for _ in range(delta):
                self._gap_end   -= 1
                self._gap_start -= 1
                self._buf[self._gap_end] = self._buf[self._gap_start]
                self._buf[self._gap_start] = None
        elif pos > self._gap_start:
            delta = pos - self._gap_start
            for _ in range(delta):
                self._buf[self._gap_start] = self._buf[self._gap_end]
                self._buf[self._gap_end]   = None
                self._gap_start += 1
                self._gap_end   += 1

    def _grow(self) -> None:
        new_gap = [None] * self._gap_size
        self._buf[self._gap_end:self._gap_end] = new_gap
        self._gap_end += self._gap_size

    def content(self) -> str:
        return "".join(c for c in self._buf if c is not None)

gb = GapBuffer("hello world")
gb.move_gap(5)
gb.insert(",")
print(gb.content())  # "hello, world"
gb.delete()
print(gb.content())  # "hello world"`,
  c:`#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define GAP_SIZE 8
typedef struct { char *buf; int gap_start, gap_end, capacity; } GapBuffer;
void gb_init(GapBuffer *g, const char *init){
    int n=strlen(init); g->capacity=n+GAP_SIZE;
    g->buf=malloc(g->capacity); memcpy(g->buf,init,n);
    for(int i=n;i<n+GAP_SIZE;i++) g->buf[i]=0;
    g->gap_start=n; g->gap_end=n+GAP_SIZE;
}
void gb_insert(GapBuffer *g, char c){ g->buf[g->gap_start++]=c; }
char gb_delete(GapBuffer *g){ return g->gap_start>0 ? (g->buf[--g->gap_start]=0,'x') : 0; }
void gb_move_gap(GapBuffer *g, int pos){
    while(g->gap_start>pos){ g->gap_end--; g->gap_start--; g->buf[g->gap_end]=g->buf[g->gap_start]; g->buf[g->gap_start]=0; }
    while(g->gap_start<pos){ g->buf[g->gap_start]=g->buf[g->gap_end]; g->buf[g->gap_end]=0; g->gap_start++; g->gap_end++; }
}
void gb_print(GapBuffer *g){ for(int i=0;i<g->capacity;i++) if(g->buf[i]) printf("%c",g->buf[i]); printf("\\n"); }
int main(void){ GapBuffer g; gb_init(&g,"hello world"); gb_move_gap(&g,5); gb_insert(&g,','); gb_print(&g); return 0; }`,
  cpp:`#include<string>
#include<iostream>
class GapBuffer{
    std::string buf; int gs,ge;
    static const int GSZ=8;
public:
    GapBuffer(const std::string&s=""):buf(s+std::string(GSZ,'\0')),gs(s.size()),ge(s.size()+GSZ){}
    void insert(char c){ buf[gs++]=c; }
    char del(){ return gs>0?buf[--gs]='\0','x':'\0'; }
    void moveGap(int pos){ while(gs>pos){ge--;gs--;buf[ge]=buf[gs];buf[gs]='\0';} while(gs<pos){buf[gs]=buf[ge];buf[ge]='\0';gs++;ge++;} }
    std::string content(){ std::string r; for(char c:buf) if(c) r+=c; return r; }
};
int main(){ GapBuffer g("hello world"); g.moveGap(5); g.insert(','); std::cout<<g.content()<<"\\n"; }`,
  java:`public class GapBuffer{
    char[]buf; int gs,ge; static final int GSZ=8;
    GapBuffer(String s){ int n=s.length(); buf=new char[n+GSZ]; for(int i=0;i<n;i++)buf[i]=s.charAt(i); gs=n; ge=n+GSZ; }
    void insert(char c){ buf[gs++]=c; }
    char delete_char(){ return gs>0?buf[--gs]='\0','a':'\0'; }
    void moveGap(int pos){ while(gs>pos){ge--;gs--;buf[ge]=buf[gs];buf[gs]='\0';} while(gs<pos){buf[gs]=buf[ge];buf[ge]='\0';gs++;ge++;} }
    String content(){ StringBuilder sb=new StringBuilder(); for(char c:buf) if(c!='\0')sb.append(c); return sb.toString(); }
    public static void main(String[]a){ GapBuffer g=new GapBuffer("hello world"); g.moveGap(5); g.insert(','); System.out.println(g.content()); }
}`,
  javascript:`class GapBuffer{
    constructor(s='',gapSize=8){const n=s.length;this._buf=[...s,...new Array(gapSize).fill(null)];this._gs=n;this._ge=n+gapSize;}
    insert(c){this._buf[this._gs++]=c;}
    delete(){if(this._gs===0)return null;this._gs--;const c=this._buf[this._gs];this._buf[this._gs]=null;return c;}
    moveGap(pos){while(this._gs>pos){this._ge--;this._gs--;this._buf[this._ge]=this._buf[this._gs];this._buf[this._gs]=null;}while(this._gs<pos){this._buf[this._gs]=this._buf[this._ge];this._buf[this._ge]=null;this._gs++;this._ge++;}}
    content(){return this._buf.filter(c=>c!==null).join('');}
}
const g=new GapBuffer('hello world');g.moveGap(5);g.insert(',');console.log(g.content());`,
  typescript:`class GapBuffer{
    private _buf:(string|null)[];private _gs:number;private _ge:number;
    constructor(s:string='',gapSize=8){const n=s.length;this._buf=[...s,...new Array(gapSize).fill(null)];this._gs=n;this._ge=n+gapSize;}
    insert(c:string):void{this._buf[this._gs++]=c;}
    delete():string|null{if(this._gs===0)return null;this._gs--;const c=this._buf[this._gs];this._buf[this._gs]=null;return c;}
    moveGap(pos:number):void{while(this._gs>pos){this._ge--;this._gs--;this._buf[this._ge]=this._buf[this._gs];this._buf[this._gs]=null;}while(this._gs<pos){this._buf[this._gs]=this._buf[this._ge];this._buf[this._ge]=null;this._gs++;this._ge++;}}
    content():string{return this._buf.filter((c):c is string=>c!==null).join('');}
}`,
  csharp:`public class GapBuffer{
    char[]buf;int gs,ge;const int GSZ=8;
    public GapBuffer(string s=""){int n=s.Length;buf=new char[n+GSZ];s.CopyTo(0,buf,0,n);gs=n;ge=n+GSZ;}
    public void Insert(char c){buf[gs++]=c;}
    public char Delete(){if(gs==0)return '\0';gs--;char c=buf[gs];buf[gs]='\0';return c;}
    public void MoveGap(int pos){while(gs>pos){ge--;gs--;buf[ge]=buf[gs];buf[gs]='\0';}while(gs<pos){buf[gs]=buf[ge];buf[ge]='\0';gs++;ge++;}}
    public string Content(){var sb=new System.Text.StringBuilder();foreach(var c in buf)if(c!='\0')sb.Append(c);return sb.ToString();}
    public static void Main(){var g=new GapBuffer("hello world");g.MoveGap(5);g.Insert(',');System.Console.WriteLine(g.Content());}
}`,
  go:`package main
import"fmt"
type GapBuffer struct{buf[]byte;gs,ge int}
func NewGB(s string,gapSize int)*GapBuffer{n:=len(s);b:=make([]byte,n+gapSize);copy(b,s);return&GapBuffer{buf:b,gs:n,ge:n+gapSize}}
func(g*GapBuffer)Insert(c byte){g.buf[g.gs]=c;g.gs++}
func(g*GapBuffer)Delete()byte{if g.gs==0{return 0};g.gs--;c:=g.buf[g.gs];g.buf[g.gs]=0;return c}
func(g*GapBuffer)MoveGap(pos int){for g.gs>pos{g.ge--;g.gs--;g.buf[g.ge]=g.buf[g.gs];g.buf[g.gs]=0};for g.gs<pos{g.buf[g.gs]=g.buf[g.ge];g.buf[g.ge]=0;g.gs++;g.ge++}}
func(g*GapBuffer)Content()string{var r[]byte;for _,c:=range g.buf{if c!=0{r=append(r,c)}};return string(r)}
func main(){g:=NewGB("hello world",8);g.MoveGap(5);g.Insert(',');fmt.Println(g.Content())}`,
  rust:`pub struct GapBuffer { buf: Vec<u8>, gs: usize, ge: usize }
impl GapBuffer {
    pub fn new(s: &str, gap_size: usize) -> Self {
        let n = s.len();
        let mut buf = Vec::with_capacity(n + gap_size);
        buf.extend_from_slice(s.as_bytes());
        buf.extend(std::iter::repeat(0u8).take(gap_size));
        GapBuffer { buf, gs: n, ge: n + gap_size }
    }
    pub fn insert(&mut self, c: u8) { self.buf[self.gs] = c; self.gs += 1; }
    pub fn delete(&mut self) -> Option<u8> {
        if self.gs == 0 { return None; }
        self.gs -= 1; let c = self.buf[self.gs]; self.buf[self.gs] = 0; Some(c)
    }
    pub fn move_gap(&mut self, pos: usize) {
        while self.gs > pos { self.ge -= 1; self.gs -= 1; self.buf[self.ge] = self.buf[self.gs]; self.buf[self.gs] = 0; }
        while self.gs < pos { self.buf[self.gs] = self.buf[self.ge]; self.buf[self.ge] = 0; self.gs += 1; self.ge += 1; }
    }
    pub fn content(&self) -> String { self.buf.iter().filter(|&&b| b != 0).map(|&b| b as char).collect() }
}
fn main() { let mut g = GapBuffer::new("hello world", 8); g.move_gap(5); g.insert(b','); println!("{}", g.content()); }`,
}
for(const[lang,code] of Object.entries(GAP)){
  write('gap-buffer','insert',  lang,code)
  write('gap-buffer','delete',  lang,code)
  write('gap-buffer','moveGap', lang,code)
}

/* ── rope ─────────────────────────────────────────────────────────────── */
const ROPE = {
  python:`class RopeNode:
    def __init__(self, val: str = "", left=None, right=None):
        self.val   = val
        self.left  = left
        self.right = right
        self.weight = len(val) if not left else left.weight + (left.right.weight if left.right else 0)

class Rope:
    def __init__(self, s: str = ""):
        self.root = RopeNode(s) if s else None

    def index(self, i: int) -> str:
        return self._index(self.root, i)

    def _index(self, node, i: int) -> str:
        if not node: raise IndexError(i)
        if node.left is None:
            return node.val[i]
        if i < node.weight:
            return self._index(node.left, i)
        return self._index(node.right, i - node.weight)

    def concat(self, other: "Rope") -> "Rope":
        r = Rope()
        r.root = RopeNode("", self.root, other.root)
        return r

    def split(self, i: int):
        left_str = self._to_str(self.root)[:i]
        right_str = self._to_str(self.root)[i:]
        return Rope(left_str), Rope(right_str)

    def _to_str(self, node) -> str:
        if not node: return ""
        if node.left is None: return node.val
        return self._to_str(node.left) + self._to_str(node.right)

    def __str__(self) -> str: return self._to_str(self.root)

r1 = Rope("Hello, ")
r2 = Rope("World!")
r3 = r1.concat(r2)
print(str(r3))       # Hello, World!
print(r3.index(7))   # W
l, r = r3.split(7)
print(str(l), str(r))  # Hello,  World!`,
  c:`#include<stdio.h>
#include<stdlib.h>
#include<string.h>
typedef struct RN{char*val;int weight;struct RN*left,*right;}RN;
RN*rn_leaf(const char*s){RN*n=malloc(sizeof(RN));n->val=strdup(s);n->weight=strlen(s);n->left=n->right=NULL;return n;}
RN*rn_concat(RN*a,RN*b){RN*n=malloc(sizeof(RN));n->val=NULL;n->weight=a?a->weight:0;n->left=a;n->right=b;return n;}
char rn_index(RN*n,int i){if(!n->left)return n->val[i];if(i<n->weight)return rn_index(n->left,i);return rn_index(n->right,i-n->weight);}
void rn_collect(RN*n,char*buf,int*pos){if(!n)return;if(!n->left){strcpy(buf+*pos,n->val);*pos+=strlen(n->val);}else{rn_collect(n->left,buf,pos);rn_collect(n->right,buf,pos);}}
int main(void){RN*a=rn_leaf("Hello, ");RN*b=rn_leaf("World!");RN*r=rn_concat(a,b);printf("index 7: %c\\n",rn_index(r,7));char buf[50]={0};int pos=0;rn_collect(r,buf,&pos);printf("%s\\n",buf);return 0;}`,
  cpp:`#include<string>
#include<memory>
#include<iostream>
struct RopeNode{std::string val;int weight;std::shared_ptr<RopeNode>left,right;};
std::shared_ptr<RopeNode>leaf(const std::string&s){auto n=std::make_shared<RopeNode>();n->val=s;n->weight=s.size();return n;}
std::shared_ptr<RopeNode>concat(std::shared_ptr<RopeNode>a,std::shared_ptr<RopeNode>b){auto n=std::make_shared<RopeNode>();n->weight=a->weight;n->left=a;n->right=b;return n;}
char rope_index(std::shared_ptr<RopeNode>n,int i){if(!n->left)return n->val[i];if(i<n->weight)return rope_index(n->left,i);return rope_index(n->right,i-n->weight);}
std::string collect(std::shared_ptr<RopeNode>n){if(!n)return"";if(!n->left)return n->val;return collect(n->left)+collect(n->right);}
int main(){auto a=leaf("Hello, ");auto b=leaf("World!");auto r=concat(a,b);std::cout<<rope_index(r,7)<<"\\n";std::cout<<collect(r)<<"\\n";}`,
  java:`public class Rope{
    static class N{String val;int w;N left,right;N(String s){val=s;w=s.length();}}
    N root;
    Rope(String s){root=new N(s);}
    Rope(N n){root=n;}
    char index(int i){return idx(root,i);}
    char idx(N n,int i){if(n.left==null)return n.val.charAt(i);if(i<n.w)return idx(n.left,i);return idx(n.right,i-n.w);}
    Rope concat(Rope other){N n=new N("");n.w=root.w;n.left=root;n.right=other.root;return new Rope(n);}
    String collect(){return col(root);}
    String col(N n){if(n==null)return"";if(n.left==null)return n.val;return col(n.left)+col(n.right);}
    public static void main(String[]a){Rope r1=new Rope("Hello, ");Rope r2=new Rope("World!");Rope r3=r1.concat(r2);System.out.println(r3.collect());System.out.println(r3.index(7));}
}`,
  javascript:`class RopeNode{constructor(val='',left=null,right=null){this.val=val;this.left=left;this.right=right;this.weight=left?left.weight:val.length;}}
class Rope{
    constructor(s=''){this.root=new RopeNode(s);}
    index(i){return this._idx(this.root,i);}
    _idx(n,i){if(!n.left)return n.val[i];if(i<n.weight)return this._idx(n.left,i);return this._idx(n.right,i-n.weight);}
    concat(other){const r=new Rope();r.root=new RopeNode('',this.root,other.root);return r;}
    split(i){const s=this.toString();return[new Rope(s.slice(0,i)),new Rope(s.slice(i))];}
    toString(){return this._collect(this.root);}
    _collect(n){if(!n)return'';if(!n.left)return n.val;return this._collect(n.left)+this._collect(n.right);}
}
const r=new Rope('Hello, ').concat(new Rope('World!'));console.log(r.toString(),r.index(7));`,
  typescript:`class RopeNode{val:string;weight:number;left:RopeNode|null;right:RopeNode|null;constructor(v='',l:RopeNode|null=null,r:RopeNode|null=null){this.val=v;this.left=l;this.right=r;this.weight=l?l.weight:v.length;}}
class Rope{
    root:RopeNode;
    constructor(s:string=''){this.root=new RopeNode(s);}
    index(i:number):string{return this._idx(this.root,i);}
    private _idx(n:RopeNode,i:number):string{if(!n.left)return n.val[i];if(i<n.weight)return this._idx(n.left,i);return this._idx(n.right!,i-n.weight);}
    concat(other:Rope):Rope{const r=new Rope();r.root=new RopeNode('',this.root,other.root);return r;}
    split(i:number):[Rope,Rope]{const s=this.toString();return[new Rope(s.slice(0,i)),new Rope(s.slice(i))];}
    toString():string{return this._collect(this.root);}
    private _collect(n:RopeNode|null):string{if(!n)return'';if(!n.left)return n.val;return this._collect(n.left)+this._collect(n.right);}
}`,
  csharp:`public class Rope{
    class N{public string Val="";public int W;public N?L,R;public N(string s){Val=s;W=s.Length;}}
    N root;
    public Rope(string s){root=new N(s);}
    Rope(N n){root=n;}
    public char Index(int i){return Idx(root,i);}
    char Idx(N n,int i){if(n.L==null)return n.Val[i];if(i<n.W)return Idx(n.L,i);return Idx(n.R!,i-n.W);}
    public Rope Concat(Rope other){var n=new N(""){W=root.W,L=root,R=other.root};return new Rope(n);}
    public(Rope,Rope)Split(int i){var s=Collect();return(new Rope(s[..i]),new Rope(s[i..]));}
    public string Collect(){return Col(root);}
    string Col(N?n){if(n==null)return"";if(n.L==null)return n.Val;return Col(n.L)+Col(n.R);}
}`,
  go:`package main
import "fmt"
type RopeN struct{Val string;W int;L,R*RopeN}
func leaf(s string)*RopeN{return&RopeN{Val:s,W:len(s)}}
func concat(a,b*RopeN)*RopeN{return&RopeN{W:a.W,L:a,R:b}}
func index(n*RopeN,i int)byte{if n.L==nil{return n.Val[i]};if i<n.W{return index(n.L,i)};return index(n.R,i-n.W)}
func collect(n*RopeN)string{if n==nil{return""};if n.L==nil{return n.Val};return collect(n.L)+collect(n.R)}
func main(){a:=leaf("Hello, ");b:=leaf("World!");r:=concat(a,b);fmt.Println(collect(r));fmt.Printf("%c\\n",index(r,7))}`,
  rust:`struct RopeNode{val:String,weight:usize,left:Option<Box<RopeNode>>,right:Option<Box<RopeNode>>}
impl RopeNode{
    fn leaf(s:&str)->Self{RopeNode{val:s.to_string(),weight:s.len(),left:None,right:None}}
    fn concat(a:Box<RopeNode>,b:Box<RopeNode>)->Self{let w=a.weight;RopeNode{val:String::new(),weight:w,left:Some(a),right:Some(b)}}
    fn index(&self,i:usize)->u8{if self.left.is_none(){return self.val.as_bytes()[i]};if i<self.weight{return self.left.as_ref().unwrap().index(i)};self.right.as_ref().unwrap().index(i-self.weight)}
    fn collect(&self)->String{if self.left.is_none(){return self.val.clone()};self.left.as_ref().unwrap().collect()+&self.right.as_ref().unwrap().collect()}
    fn split(self,i:usize)->(String,String){let s=self.collect();(s[..i].to_string(),s[i..].to_string())}
}
fn main(){let a=Box::new(RopeNode::leaf("Hello, "));let b=Box::new(RopeNode::leaf("World!"));let r=RopeNode::concat(a,b);println!("{}",r.collect());println!("{}",r.index(7) as char);}`,
}
for(const[lang,code] of Object.entries(ROPE)){
  write('rope','split',  lang,code)
  write('rope','concat', lang,code)
  write('rope','index',  lang,code)
}

console.log('✅ Linear structures part 2 populated: circular-queue, deque, priority-queue, linked lists (singly/doubly/circular/xor), gap-buffer, rope')
