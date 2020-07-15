# 线性表

线性表主要由顺序表示或链式表示  
实现线性表的两种方式：

- **数组**：顺序表示，又称顺序表
- **链表**：链式表示

## 数组

**优点**：可以通过下标(index)来访问或者修改元素，比较高效。
**缺点**：插入和删除花费的开销比较大。

- 最坏情况：在位置 0 的插入、删除，时间复杂度 O(N)
- 平均情况：插入和删除都需要移动表的一半的元素
- 最优情况：在表的高端进行插入、删除，没有元素需要移动，时间复杂度 O(1)

## 链表

链表分很多种类型

- 单链表：
- 循环单链表：链表的最后一个节点指向第一个节点，整体构成一个链环；
- 双向链表：节点中包含两个指针部分，一个指向前驱元，一个指向后继元；
- 循环双向链表：节点中包含两个指针部分，一个指向前驱元，一个指向后继元，最后一个节点指向第一个节点。

### 单链表

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

## 栈

`栈`是特殊的线性表, `LIFO`(last in first out);

限制`插入`和`删除`只能在一个位置进行的表，该位置叫作`栈顶`；  
访问、插入和删除元素只能在栈顶进行。

`进栈`：push，相当于插入  
`出栈`：pop，相当于删除最后一个元素

可以使用单向链表实现类似效果

```ts
class Stack {
  private list: LinkedList = new LinkedList();

  push(element: any) {
    this.list.unshift(element);
  }

  pop() {
    this.list.shift();
  }
}
```

## 队列

`队列`是元素只能从`队列尾`(后端 rear)插入，从`队列头`(前端 front)访问和删除。

`插入`：enqueue 入队，队尾(末端)  
`删除`：dequeue 出队，队头(前端)，删除也在队头

队列又叫作`FIFO`(First In First Out)，先进先出(普通队列)。

队列的实现：队列也是表，链表可以实现队列。

```ts
class Queue {
  private list: LinkedList = new LinkedList();

  enqueue(element: any) {
    this.list.push(element);
  }

  dequeue() {
    this.list.shift();
  }
}
```
