# 左倾红黑树 （LLRB 树）

红黑树是平衡二叉树的一种，它保证在最坏情况下基本动态集合操作的事件复杂度为 O(log n)

红黑树和平衡二叉树区别如下：

1. 红黑树放弃了追求完全平衡，追求大致平衡，在与平衡二叉树的时间复杂度相差不大的情况下，保证每次插入最多只需要三次旋转就能达到平衡，实现起来也更为简单；
2. 平衡二叉树追求绝对平衡，条件比较苛刻，实现起来比较麻烦，每次插入新节点之后需要旋转的次数不能预知。

**特点**

1. 每个节点或者是黑色或者是红色
2. 根节点是黑色
3. 每个叶子节点（null）是黑色
4. 如果一个节点是红色，则它的子节点必须是黑色，即两个红色节点不能直接相连
5. 从一个节点到该节点的子孙节点的所有路径上包含相同数目的黑色节点

> 红黑树的五个性质避免了二叉查找树退化成单链表的情况，并且性质 4 和性质 5 确保了任意节点到其每个叶子节点路径中最长路径不会超过最短路径的 2 倍，即一颗树是黑红节点相间的树，另一颗全是黑节点的树；也就是红黑树是相对黑色节点的平衡二叉树；

> 新节点 N 默认是红色， 因为插入一个红色节点不会破坏红黑树性质 5，而插入黑色节点，必定当前分支比其他分支多一个黑色节点很难调整

我们用`2-3-4树`表示`红黑树`，但是存在一个问题，就是对于一棵`2-3-4树`可能有多种不同的表示，这是在于对于`3-node`的表示，红色的边可以向`左倾`，也可以向`右倾`。我们在此只考虑`左倾`的情况，所以这种树也叫做`左倾红黑树`, `Left Leaning RedBlackTree`, 简称 `LLRB`,

具体代码只需继承 `BST` 树的，重写 `insert` 和 `remove` 部分代码即可

**左倾红黑树代码实现**

```ts
import BSTTree, { BinaryTreeNode, getMinNode } from './binarySearchTree';

enum Color {
  RED = 'red',
  BLACK = 'black',
}

const isRed = (node: RedBlackTreeNode | undefined): boolean =>
  !!node && node.color === Color.RED;

const isBlack = (node: RedBlackTreeNode | undefined): boolean =>
  !node || node.color === Color.BLACK;

const toggleColor = (node: RedBlackTreeNode): RedBlackTreeNode => {
  node.color = isRed(node) ? Color.BLACK : Color.RED;
  return node;
};

class RedBlackTreeNode extends BinaryTreeNode {
  public left: RedBlackTreeNode | undefined;
  public right: RedBlackTreeNode | undefined;
  public color: Color = Color.RED;

  constructor(data: number) {
    super(data);
    this.data = data;
  }
}

// 左旋操作就是将右倾的3-node变成左倾的3-node
const rotateLeft = (rootNode: RedBlackTreeNode): RedBlackTreeNode => {
  if (!rootNode.right) return rootNode;
  const newRootNode = rootNode.right;
  rootNode.right = newRootNode.left;
  newRootNode.left = rootNode;
  // 旋转后的根结点颜色赋值原父节点的颜色， 原父亲节点颜色设置为红色
  newRootNode.color = rootNode.color;
  rootNode.color = Color.RED;
  return newRootNode;
};
// 右旋就是与左旋操作相反
const rotateRight = (rootNode: RedBlackTreeNode): RedBlackTreeNode => {
  if (!rootNode.left) return rootNode;
  const newRootNode = rootNode.left;
  rootNode.left = newRootNode.right;
  newRootNode.right = rootNode;
  // 旋转后的根结点颜色赋值原父节点的颜色， 原父亲节点颜色设置为红色
  newRootNode.color = rootNode.color;
  rootNode.color = Color.RED;
  return newRootNode;
};

//我们发现在红黑树中4-node进行切分工作很简单，只要将两个红节点变成黑，然后父节点变成红就可以了。这个变换的过程，我们叫做 color flip。(颜色翻转)
const colorFilp = (rootNode: RedBlackTreeNode): RedBlackTreeNode => {
  toggleColor(rootNode);
  rootNode.left && toggleColor(rootNode.left);
  rootNode.right && toggleColor(rootNode.right);
  return rootNode;
};

// 如果我们向2-node的节点插入的话，有两种情况，如果插入左孩子，那么直接插入就可以，但如果插入的是右孩子，为了保持左倾，插入之后，我们需要进行一个左旋操作
// 我们向3-node插入一个节点，那么我们就需要将它变成2-3-4树中对应的树节点, 这也是为什么我们之前定义的不允许的情况中的第二种，不允许两条红边连在一起，也就是不允许两个红节点互为父子节点，因为插入的节点一定是红节点
// 向3-node插入有三种情况：
// 向4-node插入：根据我们之前在2-3-4树中学习的可以知道，我们需要对4-node进行切分，切分的方法就是将4-node的中间节点向上移动到父节点中。
// 首先，当父节点是2-node时候：有两种情况
// 对于父节点为3-node的情况：观察这五种情况，我们发现首先都是先惊醒color flip操作，然后就变成了之前的操作，左旋和右旋。

// 左倾红黑树插入算法的实现
const insertNode = (node: RedBlackTreeNode | undefined, data: number) => {
  if (!node) return new RedBlackTreeNode(data);

  if (node.data === data) {
    node.count++;
  } else if (node.data < data) {
    node.right = insertNode(node.right, data);
  } else {
    node.left = insertNode(node.left, data);
  }
  // 4-node 切分
  if (isRed(node.left) && isRed(node.right)) {
    node = colorFilp(node);
  }
  // 调整右倾
  if (isRed(node.right)) {
    node = rotateLeft(node);
  }
  // 对连续的两个红节点进行转换
  if (isRed(node.left) && isRed(node.left?.left)) {
    node = rotateRight(node);
  }

  return node;
};

// 首先我们介绍一下，删除完成之后，如何调整红黑树为左倾的红黑树？
// 这里有一个方法，主要就是进行三个调整的步骤

const fixUp = (rootNode: RedBlackTreeNode): RedBlackTreeNode => {
  if (isRed(rootNode.right)) {
    rootNode = rotateLeft(rootNode);
  }
  if (isRed(rootNode.left) && isRed(rootNode.left?.left)) {
    rootNode = rotateRight(rootNode);
  }
  if (isRed(rootNode.left) && isRed(rootNode.right)) {
    rootNode = colorFilp(rootNode);
  }
  return rootNode;
};

// 如果我们删除的节点在3-node或者4-node中，我们直接删除掉就可以了
// 最复杂的情况，是我们要删除的节点是2-node，如果我门直接删除就会破坏红黑树的平衡，
// 所以我们再删除之前，要进行一定的变换，变成3-node或者4-node，也就是借一个或者两个节点过来。
// 根据父节点的不同。3-node或者4-node和兄弟节点的不同可以分为六种情况，但其中又可以分为两类
// 第一种处理方法就是兄弟节点不是2-node，就可以直接从兄弟节点借一个节点过来
// 第二种处理方法兄弟节点是2-node，则从父节点中借一个过来，然后和兄弟节点合并成一个4-node
// 这六种情况的条件根据2-3-4树转换成红黑树，就是h.right和h.right.left均为黑色。
// 但其中有需要分为两种
// 对于上述提到的第二种处理方法，处理比较简单，直接color flip即可
// 对于h.left.left为红的情况，就对应上述的第一种处理方法，首先color filp，然后还要借一个节点过来

// 将上面两种方法合并：
const moveRedRight = (rootNode: RedBlackTreeNode): RedBlackTreeNode => {
  // 第二种处理方法，处理比较简单，直接color flip即可
  colorFilp(rootNode);
  // 对于h.left.left为红的情况，就对应上述的第一种处理方法，首先color filp，然后还要借一个节点过来
  if (isRed(rootNode.left?.left)) {
    rootNode = rotateRight(rootNode);
    colorFilp(rootNode);
  }
  return rootNode;
};

const moveRedLeft = (rootNode: RedBlackTreeNode): RedBlackTreeNode => {
  // 第二种处理方法，处理比较简单，直接color flip即可
  colorFilp(rootNode);
  // 对于h.right.left为红的情况，，则可以直接从兄弟节点借一个节点过来。
  if (rootNode.right && isRed(rootNode.right.left)) {
    rootNode.right = rotateRight(rootNode.right);
    rootNode = rotateLeft(rootNode);
    colorFilp(rootNode);
  }
  return rootNode;
};

// 首先如果左旋则变为右旋，因为找最大节点在最右边
// 如果，已经到了最底部，那么直接移除就行，移除的要求是最底部的节点一定是red
// 如果遇到了2-node就借一个节点  isBlack(rootNode.right) && isBlack(rootNode.right.left)
// 继续往下递归查找
// 删除完毕，就恢复红黑树
const removeMax = (
  rootNode: RedBlackTreeNode,
): RedBlackTreeNode | undefined => {
  if (isRed(rootNode.left)) {
    // lean 3-nodes to the right
    rootNode = rotateRight(rootNode);
  }
  // remove node on bottom level
  if (!rootNode.right) return;

  // borrow from sibling if necessary, 右侧right.left节点是 2-node 节点,
  if (isBlack(rootNode.right) && isBlack(rootNode.right.left)) {
    rootNode = moveRedRight(rootNode);
  }

  if (rootNode.right) {
    rootNode.right = removeMax(rootNode.right);
  }
  return fixUp(rootNode);
};

const removeMin = (
  rootNode: RedBlackTreeNode,
): RedBlackTreeNode | undefined => {
  // remove node on bottom level
  if (!rootNode.left) return;

  // borrow from sibling if necessary, 左侧left.left 节点是 2-node 节点，
  if (isBlack(rootNode.left) && isBlack(rootNode.left.left)) {
    rootNode = moveRedLeft(rootNode);
  }

  if (rootNode.left) {
    rootNode.left = removeMin(rootNode.left);
  }

  return fixUp(rootNode);
};

// 删除的当前节点不能是2-node
// 如果有必要可以变换成4-node
// 从底部删除节点
// 向上的fix过程中，消除4-node
const removeNode = (rootNode: RedBlackTreeNode, data: number) => {
  if (rootNode.data > data) {
    if (isBlack(rootNode.left) && isBlack(rootNode.left?.left)) {
      rootNode = moveRedLeft(rootNode);
    }
    if (rootNode.left) {
      rootNode.left = removeNode(rootNode.left, data);
    }
  } else {
    if (isRed(rootNode.left)) {
      rootNode = rotateRight(rootNode);
    }
    if (rootNode.data === data && !rootNode.right) return;

    if (isBlack(rootNode.right) && isBlack(rootNode.right?.left)) {
      rootNode = moveRedRight(rootNode);
    }

    if (rootNode.data === data) {
      if (rootNode.right) {
        const node = getMinNode(rootNode.right);
        rootNode.data = node.data;
        rootNode.count = node.count;
        rootNode.right = removeMin(rootNode.right);
      }
    } else {
      if (rootNode.right) {
        rootNode.right = removeNode(rootNode.right, data);
      }
    }
  }
  return fixUp(rootNode);
};

class RedBlackTree extends BSTTree {
  public root: RedBlackTreeNode | undefined;

  insert(data: number) {
    if (!this.root) {
      // 场景1，直接插入新节点。并改变颜色为黑色
      this.root = new RedBlackTreeNode(data);
      this.root.color = Color.BLACK;
      return;
    }
    this.root = insertNode(this.root, data);
    isRed(this.root) && (this.root.color = Color.BLACK);
  }

  remove(data: number) {
    if (!this.root) return;
    this.root = removeNode(this.root, data);
    this.restoreRootColor();
  }

  removeMax() {
    if (!this.root) return;
    this.root = removeMax(this.root);
    this.restoreRootColor();
  }

  removeMin() {
    if (!this.root) return;
    this.root = removeMin(this.root);
    this.restoreRootColor();
  }

  private restoreRootColor() {
    if (this.root) {
      isRed(this.root) && (this.root.color = Color.BLACK);
    }
  }
}

export default RedBlackTree;
```

> 首先从`2-3-4树`开始讲起，然后引出`红黑树`其实就是`2-3-4树`的`BST`的表示。接着介绍插入和删除算法。  
> 可以从该文章查找更多`2-3-4树` 和 `红黑树`的相关内容内容<https://assets.cjw.design/pdf/RedBlack.pdf>
