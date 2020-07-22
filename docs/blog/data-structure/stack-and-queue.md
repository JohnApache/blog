# 栈与队列

栈与队列也是常见的数据结构，是特殊的线性表。

## 栈

`栈`是特殊的线性表, `LIFO`(last in first out);

限制`插入`和`删除`只能在一个位置进行的表，该位置叫作`栈顶`；  
访问、插入和删除元素只能在栈顶进行。

`进栈`：push，相当于插入  
`出栈`：pop，相当于删除最后一个元素

可以使用单向链表实现类似效果, 也可以使用数组实现，这里使用链表实现

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
