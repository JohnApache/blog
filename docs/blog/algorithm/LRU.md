---
group:
  title: 算法
  order: 7
---

# LRU 算法

`LRU`就是一种缓存淘汰策略。 **最近被访问的数据那么它将来访问的概率就大，缓存满的时候，优先淘汰最无人问津者。**

计算机的缓存容量有限，如果缓存满了就要删除一些内容，给新内容腾位置。但问题是，删除哪些内容呢？我们肯定希望删掉哪些没什么用的缓存，而把有用的数据继续留在缓存里，方便之后继续使用。那么，什么样的数据，我们判定为「有用的」的数据呢？

`LRU` 缓存淘汰算法就是一种常用策略。`LRU` 的全称是 `Least Recently Used`，也就是说我们认为最近使用过的数据应该是是「有用的」，很久都没用过的数据应该是无用的，内存满了就优先删那些很久没用过的数据。

`LRU` 算法实际上是让你设计数据结构：首先要接收一个 `capacity` 参数作为缓存的最大容量，然后实现两个 API，一个是 `put(key, val)` 方法存入键值对，另一个是`get(key)` 方法获取 key 对应的 val，如果 key 不存在则返回 -1。 `get` 和 `put` 方法必须都是 `O(1)` 的时间复杂度

**算法分析**
分析上面的操作过程，要让 `put` 和 `get` 方法的时间复杂度为 `O(1)`，我们可以总结出 `cache` 这个数据结构必要的条件：查找快，插入快，删除快，有顺序之分。

`哈希表`查找快，但是数据无固定顺序；`链表`有顺序之分，插入删除快，但是查找慢。所以结合一下，形成一种新的数据结构：哈希链表。

`LRU` 缓存算法的核心数据结构就是`哈希链表`，`双向链表`和`哈希表`的结合体。

**个人代码实现**

```ts
class Node {
  public next: Node | undefined;
  public prev: Node | undefined;
  public key: number | string;
  public val: any;
  constructor(key: number | string, val: any) {
    this.key = key;
    this.val = val;
  }
}

// 双向链表
class DoubleList {
  public head: Node | undefined;
  public tail: Node | undefined;
  private _size: number = 0;
  public remove(node: Node) {
    const next = node.next;
    const prev = node.prev;
    if (next) {
      next.prev = prev;
    } else if (prev) {
      // next 不存在即删除的是尾部
      prev.next = undefined;
      this.tail = prev;
    }

    if (prev) {
      prev.next = next;
    } else if (next) {
      // prev 不存在即删除的是首部
      next.prev = undefined;
      this.head = next;
    }

    if (!next && !prev) {
      // 都不存在即删除的是唯一节点
      this.head = undefined;
      this.tail = undefined;
    }
    this._size--;
  }

  public removeLast() {
    if (!this.tail) return;
    this.remove(this.tail);
  }

  public addFirst(node: Node) {
    const head = this.head;
    this.head = node;
    if (!head) {
      node.next = undefined;
      node.prev = undefined;
      this.tail = node;
    } else {
      node.next = head;
      head.prev = node;
    }
    this._size++;
  }

  public getSize(): number {
    return this._size;
  }
}

interface LRUMap {
  [key: number]: Node;
  [key: string]: Node;
}

class LRUCache {
  public capacity: number;
  public map: LRUMap = {};
  public list: DoubleList = new DoubleList();
  constructor(capacity: number) {
    if (capacity <= 0) {
      throw new Error('invalid capacity');
    }
    this.capacity = capacity;
  }

  get(key: number | string): any {
    const node = this.map[key];
    if (typeof node === 'undefined') return -1;
    this.put(key, node.val);
    return this.map[key].val;
  }

  put(key: number | string, val: any) {
    let node = this.map[key];
    if (typeof node === 'undefined') {
      if (this.list.getSize() >= this.capacity) {
        this.list.removeLast();
      }
      node = new Node(key, val);
      // 哈希表连接链表
      this.map[key] = node;
    } else {
      node.val = val;
      this.list.remove(node);
    }
    this.list.addFirst(node);
  }

  getCache() {
    const arr = [];
    let next = this.list.head;
    while (next) {
      arr.push({ key: next.key, val: next.val });
      next = next.next;
    }
    return arr;
  }
}

const cache = new LRUCache(3);
cache.put(1, { a: 1 });
console.log(cache.getCache());
cache.get(1);
console.log(cache.getCache());
cache.put(2, 2);
console.log(cache.getCache());
cache.put(3, { a: 3 });
console.log(cache.getCache());
cache.get(1);
console.log(cache.getCache());
cache.get(2);
console.log(cache.getCache());
cache.put('four', 4);
console.log(cache.getCache());
cache.put('five', 5);
console.log(cache.getCache());
cache.put('six', 6);
console.log(cache.getCache());
cache.get(3);
console.log(cache.getCache());

/*
[ { key: 1, val: { a: 1 } } ]
[ { key: 1, val: { a: 1 } } ]
[ { key: 2, val: 2 }, { key: 1, val: { a: 1 } } ]
[
  { key: 3, val: { a: 3 } },
  { key: 2, val: 2 },
  { key: 1, val: { a: 1 } }
]
[
  { key: 1, val: { a: 1 } },
  { key: 3, val: { a: 3 } },
  { key: 2, val: 2 }
]
[
  { key: 2, val: 2 },
  { key: 1, val: { a: 1 } },
  { key: 3, val: { a: 3 } }
]
[
  { key: 'four', val: 4 },
  { key: 2, val: 2 },
  { key: 1, val: { a: 1 } }
]
[
  { key: 'five', val: 5 },
  { key: 'four', val: 4 },
  { key: 2, val: 2 }
]
[
  { key: 'six', val: 6 },
  { key: 'five', val: 5 },
  { key: 'four', val: 4 }
]
[
  { key: 3, val: { a: 3 } },
  { key: 'six', val: 6 },
  { key: 'five', val: 5 },
  { key: 'four', val: 4 }
]
 */
export default LRUCache;
```
