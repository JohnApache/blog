---
group:
  title: 数据结构
  order: 6
---

# 链表 （Linked-List）

链表是线性表的一种，链表分很多种类型

- 单链表：
- 循环单链表：链表的最后一个节点指向第一个节点，整体构成一个链环；
- 双向链表：节点中包含两个指针部分，一个指向前驱元，一个指向后继元；
- 循环双向链表：节点中包含两个指针部分，一个指向前驱元，一个指向后继元，最后一个节点指向第一个节点。

## 单链表

```ts
class Node {
  public next: Node | undefined;
  public element: any;
  constructor(element: any) {
    this.element = element;
  }
}

// 单链表的结构
class LinkedList {
  private head: Node | undefined;
  private tail: Node | undefined;
  private _size: number = 0;

  push(element: any) {
    const node = new Node(element);
    if (!this.tail) {
      this.tail = node;
      this.head = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this._size++;
  }

  pop() {
    if (!this.tail || !this.head) return;
    let next: Node | undefined = this.head;
    if (next === this.tail) {
      this.tail = undefined;
      this.head = undefined;
    } else {
      while (next) {
        if (next.next === this.tail) {
          this.tail = next;
          next.next = undefined;
        }
        next = next.next;
      }
    }

    this._size--;
  }

  unshift(element: any) {
    const node = new Node(element);
    if (!this.head) {
      this.tail = node;
      this.head = node;
    } else {
      node.next = this.head;
      this.head = node;
    }
    this._size++;
  }

  shift() {
    if (!this.tail || !this.head) return;
    const next = this.head;
    if (next === this.tail) {
      this.head = undefined;
      this.tail = undefined;
    } else {
      this.head = next.next;
    }
    this._size--;
  }

  size(): number {
    return this._size;
  }

  traverse(cb: (node: Node) => void) {
    let next = this.head;
    while (next) {
      cb(next);
      next = next.next;
    }
  }

  display(): any[] {
    const result: any[] = [];
    this.traverse(node => {
      result.push(node.element);
    });
    return result;
  }
}

export { LinkedList };
```

由于没有`prev` 指针。 单链表删除一个元素只能依赖遍历的方式效率很低, 算法复杂度 O(N)。 因此产生了 `双向链表`

## 双向链表

增加 `Node` 节点 `prev` 指针控制

```ts
class Node {
  public next: Node | undefined;
  public prev: Node | undefined;
  public element: any;
  constructor(element: any) {
    this.element = element;
  }
}

class DoubleLinkedList {
  private head: Node | undefined;
  private tail: Node | undefined;
  private _size: number = 0;

  push(element: any) {
    const node = new Node(element);
    if (!this.tail) {
      this.tail = node;
      this.head = node;
    } else {
      this.tail.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this._size++;
  }

  pop() {
    if (!this.tail || !this.head) return;
    const prev = this.tail.prev;
    if (!prev) {
      this.head = undefined;
      this.tail = undefined;
    } else {
      prev.next = undefined;
      this.tail = prev;
    }
    this._size--;
  }

  unshift(element: any) {
    const node = new Node(element);
    if (!this.head) {
      this.tail = node;
      this.head = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }
    this._size++;
  }

  shift() {
    if (!this.tail || !this.head) return;
    const next = this.head;
    if (next === this.tail) {
      this.head = undefined;
      this.tail = undefined;
    } else {
      this.head = next.next;
      this.head && (this.head.prev = undefined);
    }
    this._size--;
  }

  size(): number {
    return this._size;
  }

  traverse(cb: (node: Node) => void) {
    let next = this.head;
    while (next) {
      cb(next);
      next = next.next;
    }
  }

  display(): any[] {
    const result: any[] = [];
    this.traverse(node => {
      result.push(node.element);
    });
    return result;
  }
}

export { DoubleLinkedList };
```

通过增加了 prev 指针，现在 删除节点的 算法 复杂度变成了 O(1);

## 单向循环列表

循环链表和单链表相似，节点类型都是一样，唯一的区别是，链表的最后一个节点指向第一个节点，整体构成一个链环；

```ts
class Node {
  public next: Node | undefined;
  public element: any;
  constructor(element: any) {
    this.element = element;
  }
}
class LoopLinkedList {
  private head: Node | undefined;
  private tail: Node | undefined;
  private _size: number = 0;

  push(element: any) {
    const node = new Node(element);
    if (!this.tail) {
      this.tail = node;
      this.head = node;
      node.next = node;
    } else {
      this.tail.next = node;
      this.tail = node;
      node.next = this.head;
    }
    this._size++;
  }

  pop() {
    if (!this.tail || !this.head) return;
    let next: Node | undefined = this.head;
    if (next === this.tail) {
      this.tail = undefined;
      this.head = undefined;
    } else {
      while (next) {
        if (next.next === this.tail) {
          next.next = this.head;
          this.tail = next;
          next = undefined;
        } else {
          next = next.next;
        }
      }
    }

    this._size--;
  }

  unshift(element: any) {
    const node = new Node(element);
    if (!this.head || !this.tail) {
      this.tail = node;
      this.head = node;
      node.next = node;
    } else {
      node.next = this.head;
      this.head = node;
      this.tail.next = node;
    }
    this._size++;
  }

  shift() {
    if (!this.tail || !this.head) return;
    const next = this.head;
    if (next === this.tail) {
      this.head = undefined;
      this.tail = undefined;
    } else {
      this.head = next.next;
      this.tail.next = this.head;
    }
    this._size--;
  }

  size(): number {
    return this._size;
  }

  traverse(cb: (node: Node) => void) {
    let next = this.head;
    while (next) {
      cb(next);
      if (next === this.tail) {
        next = undefined;
      } else {
        next = next.next;
      }
    }
  }

  display(): any[] {
    const result: any[] = [];
    this.traverse(node => {
      result.push(node.element);
    });
    return result;
  }
}

export { LoopLinkedList };
```

## 双向循环链表

```ts
class Node {
  public next: Node | undefined;
  public prev: Node | undefined;
  public element: any;
  constructor(element: any) {
    this.element = element;
  }
}
class LoopDoubleLinkedList {
  private head: Node | undefined;
  private tail: Node | undefined;
  private _size: number = 0;

  push(element: any) {
    const node = new Node(element);
    if (!this.tail) {
      node.next = node;
      node.prev = node;
      this.tail = node;
      this.head = node;
    } else {
      node.prev = this.tail;
      node.next = this.head;
      this.tail.next = node;
      this.tail = node;
    }
    this._size++;
  }

  pop() {
    if (!this.tail || !this.head) return;
    const prev = this.tail.prev;
    if (!prev) {
      this.head = undefined;
      this.tail = undefined;
    } else {
      prev.next = this.head;
      this.tail = prev;
    }
    this._size--;
  }

  unshift(element: any) {
    const node = new Node(element);
    if (!this.head || !this.tail) {
      node.next = node;
      node.prev = node;
      this.tail = node;
      this.head = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
      this.tail.next = this.head;
    }
    this._size++;
  }

  shift() {
    if (!this.tail || !this.head) return;
    const next = this.head;
    if (next === this.tail) {
      this.head = undefined;
      this.tail = undefined;
    } else {
      this.head = next.next;
      this.head && (this.head.prev = undefined);
    }
    this._size--;
  }

  size(): number {
    return this._size;
  }

  traverse(cb: (node: Node) => void) {
    let next = this.head;
    while (next) {
      cb(next);
      if (next === this.tail) {
        next = undefined;
      } else {
        next = next.next;
      }
    }
  }

  display(): any[] {
    const result: any[] = [];
    this.traverse(node => {
      result.push(node.element);
    });
    return result;
  }
}
export { LoopDoubleLinkedList };
```

> 循环链表的优点就是从链尾到链头比较方便。它适合解决具有环型结构特点的数据，
