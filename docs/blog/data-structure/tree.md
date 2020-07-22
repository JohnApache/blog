---
group:
  title: 数据结构
  order: 6
---

# 树与二叉树

树是由 n(n>=1)个有限节点组成一个具有层次关系的集合。

**特点**

- 每个节点有零个或多个字节点
- 根结点： 没有父节点的节点
- 非根结点：每个非根节点有且只有一个父节点
- 子节点：每个子节点可以分为多个不相交的子树+

## 二叉树

二叉树是每个节点最多有两棵子树的树结构。子树被称为“左子树”和“右子树”

**性质**

- 二叉树的每个节点至多只有两棵子树(不存在大于 2 的节点)，二叉树的子树有左右之分，次序不能颠倒
- 二叉树第 i 层至多有 2(i-1)个节点
- 深度为 k 的二叉树至多有 2k-1 个节点
- 满二叉树：深度为 k，且有 2k-1 个节点的二叉树。
- 完全二叉树：深度为 k，有 n 个节点的二叉树，当且仅当其每个节点都与深度为 k 的满二叉树中序号为 1-n 的节点对应时，称为完全二叉树。

**遍历方法**

- **先序遍历**：先访问根节点，再先序遍历左子树，最后遍历右子树。(根-左-右)
- **中序遍历**：先中序遍历左子树，再访问根节点，最后中序遍历右子树。(左-根-右)
- **后序遍历**：先后序遍历左子树，在后续遍历右子树，最后访问根节点。(左-右-根)
- **层序遍历**：所有深度为 d 的节点要在深度 d+1 的节点之前执行；用到队列、属于广度优先。

## 二叉搜索树

`二叉搜索树` 又称为 `二叉排序树`或`二叉查找树`

**特征**

1. 若它的左子树不空，则左子树上所有结点的值均小于它的根结点的值
2. 若它的右子树不空，则右子树上所有结点的值均大于它的根结点的值
3. 它的左、右子树也分别为二叉查找树

**具体实现**

```ts
class BinaryTreeNode {
  public left: BinaryTreeNode | undefined;
  public right: BinaryTreeNode | undefined;
  public count: number = 0;
  public data: number;
  constructor(data: number) {
    this.data = data;
    this.count++;
  }
}

// 前序遍历 先根节点 => 左节点 => 右节点
const preOrderTraverse = (
  rootNode: BinaryTreeNode,
  cb: (node: BinaryTreeNode) => void,
) => {
  cb(rootNode);
  rootNode.left && preOrderTraverse(rootNode.left, cb);
  rootNode.right && preOrderTraverse(rootNode.right, cb);
};

// 中序遍历 左节点 => 根节点 => 右节点
const inOrderTraverse = (
  rootNode: BinaryTreeNode,
  cb: (node: BinaryTreeNode) => void,
) => {
  rootNode.left && inOrderTraverse(rootNode.left, cb);
  cb(rootNode);
  rootNode.right && inOrderTraverse(rootNode.right, cb);
};

// 后序遍历 左节点 => 右节点 => 根节点
const postOrderTraverse = (
  rootNode: BinaryTreeNode,
  cb: (node: BinaryTreeNode) => void,
) => {
  rootNode.left && postOrderTraverse(rootNode.left, cb);
  rootNode.right && postOrderTraverse(rootNode.right, cb);
  cb(rootNode);
};

// 获取最大节点
const getMaxNode = (rootNode: BinaryTreeNode): BinaryTreeNode => {
  let maxNode = rootNode.right;
  if (!maxNode) return rootNode;
  while (maxNode) {
    if (!maxNode.right) return maxNode;
    maxNode = maxNode.right;
  }
  return maxNode;
};

// 获取最小节点
const getMinNode = (rootNode: BinaryTreeNode): BinaryTreeNode => {
  let minNode = rootNode.left;
  if (!minNode) return rootNode;
  while (minNode) {
    if (!minNode.left) return minNode;
    minNode = minNode.left;
  }
  return minNode;
};

// 搜索节点
const search = (
  rootNode: BinaryTreeNode,
  data: number,
): BinaryTreeNode | undefined => {
  if (!rootNode) return;
  if (rootNode.data === data) return rootNode;
  if (rootNode.data < data && rootNode.right) {
    return search(rootNode.right, data);
  }
  if (!rootNode.left) return;
  return search(rootNode.left, data);
};

// 复制节点
const cloneNode = (sourceNode: BinaryTreeNode): BinaryTreeNode => {
  const newNode = new BinaryTreeNode(sourceNode.data);
  newNode.count = sourceNode.count;
  return newNode;
};

// 删除节点
const removeNode = (
  rootNode: BinaryTreeNode,
  data: number,
): BinaryTreeNode | undefined => {
  let node: BinaryTreeNode | undefined = rootNode;
  if (!node) return node;
  if (node.data === data) {
    if (!node.left && !node.right) return;
    if (node.right && !node.left) return node.right;
    if (node.left && !node.right) return node.left;
    if (node.left && node.right) {
      const newRootNode = cloneNode(getMinNode(node.right));
      newRootNode.left = node.left;
      newRootNode.right = removeNode(node.right, newRootNode.data);
      return newRootNode;
    }
  } else if (node.data < data) {
    if (node.right) {
      node.right = removeNode(node.right, data);
    }
  } else if (node.left) {
    node.left = removeNode(node.left, data);
  }
  return node;
};

// 插入节点
const insertNode = (rootNode: BinaryTreeNode, data: number): BinaryTreeNode => {
  if (rootNode.data === data) {
    rootNode.count++;
  } else if (rootNode.data < data) {
    if (rootNode.right) {
      rootNode.right = insertNode(rootNode.right, data);
    } else {
      const node = new BinaryTreeNode(data);
      rootNode.right = node;
    }
  } else if (rootNode.left) {
    rootNode.left = insertNode(rootNode.left, data);
  } else {
    const node = new BinaryTreeNode(data);
    rootNode.left = node;
  }
  return rootNode;
};

/*
    1. 若它的左子树不空，则左子树上所有结点的值均小于它的根结点的值
    2. 若它的右子树不空，则右子树上所有结点的值均大于它的根结点的值
    3. 它的左、右子树也分别为二叉查找树
 */
class BinarySearchTree {
  public root: BinaryTreeNode | undefined;

  insert(data: number) {
    if (!this.root) {
      this.root = new BinaryTreeNode(data);
      return;
    }
    this.root = insertNode(this.root, data);
  }

  preOrderTraverse(cb: (node: BinaryTreeNode) => void) {
    if (!this.root) return;
    preOrderTraverse(this.root, cb);
  }

  inOrderTraverse(cb: (node: BinaryTreeNode) => void) {
    if (!this.root) return;
    inOrderTraverse(this.root, cb);
  }

  postOrderTraverse(cb: (node: BinaryTreeNode) => void) {
    if (!this.root) return;
    postOrderTraverse(this.root, cb);
  }

  getMinNode(): BinaryTreeNode | undefined {
    if (!this.root) return;
    return getMinNode(this.root);
  }

  getMaxNode(): BinaryTreeNode | undefined {
    if (!this.root) return;
    return getMaxNode(this.root);
  }

  search(data: number): BinaryTreeNode | undefined {
    if (!this.root) return;
    return search(this.root, data);
  }

  cloneNode(node: BinaryTreeNode): BinaryTreeNode {
    return cloneNode(node);
  }

  remove(data: number) {
    if (!this.root) return;
    this.root = removeNode(this.root, data);
  }
}

export { BinaryTreeNode };
export default BinarySearchTree;
```

> Tips：
>
> 1. 这里使用`count` 标记节点数字的个数，让二叉搜索树可以支持，相等数字的存在
> 2. 二叉搜索树的特征，让二叉搜索 `中序遍历`， 返回的节点顺序是 从小到大 排序好的节点顺序
> 3. 删除节点最为复杂
>    - 先判断节点是否为 null，如果等于 null 直接返回。
>    - 判断要删除节点小于当前节点，往树的左侧查找
>    - 判断要删除节点大于当前节点，往树的右侧查找
>    - 节点已找到，另划分为四种情况
>      - 当前节点即无左侧节点又无右侧节点，直接删除，返回 null
>      - 若左侧节点为 null，就证明它有右侧节点，将当前节点的引用改为>右侧节点的引用，返回更新之后的值
>      - 若右侧节点为 null，就证明它有左侧节点，将当前节点的引用改为>左侧节点的引用，返回更新之后的值
>      - 若左侧节点、右侧节点都不为空情况, 查询节点右侧最小节点或节点左侧最大节点，我这里使用的是第一种方式，**cloneNode** 复制当前节点 生成 **newNode**，**newNode**左侧引用改为当前节点的左侧引用，右侧引用改为删除右侧节点树最小节点后的节点引用，返回当前 **newNode** 替换原始节点

**二分搜索树局限性**

同样的数据，不同的插入顺序，树的结果是不一样的

这就是二叉搜索树存在的问题，它可能是极端的，并不总是向左侧永远是一个平衡的二叉树

如果我顺序化插入树的形状会退化成一个链表，试想如果我需要查找节点 40，在右图所示的树形中需要遍历完所有节点，相比于左侧时间性能会消耗一倍。

为了解决这一问题，可能需要一种`平衡的二叉搜索树`，常用的实现方法有`红黑树`、`AVL树` 等。

## 平衡二叉搜索树 (AVL 树)

普通二叉搜索树可能出现一条分支有多层，而其他分支却只有几层的情况，这会导致添加、移除和搜索树具有性能问题。因此提出了自平衡二叉树的概念，AVL 树（阿德尔森-维尔斯和兰迪斯树）是`自平衡二叉树`的一种，AVL 树的任一子节点的左右两侧子树的高度之差不超过 1，所以它也被称为`高度平衡树`。

要将不平衡的二叉搜索树转换为平衡的 AVL 树需要对树进行一次或多次旋转，旋转方式分为`左单旋`、`右单旋`、`左-右双旋`、`右-左双旋`。

这里使用之前完成的 `BSTTree` 二叉搜索树，作为父类，重写 `insert` 插入方法，实现每次插入自平衡, `remove`删除节点方法，删除后当前节点自平衡，其他 api 不需要改动,具体代码如下

**AVL 树代码实现**

```ts
// 普通二叉搜索树可能出现一条分支有多层，而其他分支却只有几层的情况，如图1所示，这会导致添加、移除和搜索树具有性能问题。因此提出了自平衡二叉树的概念，AVL树（阿德尔森-维尔斯和兰迪斯树）是自平衡二叉树的一种，AVL树的任一子节点的左右两侧子树的高度之差不超过1，所以它也被称为高度平衡树。
import BSTTree, { BinaryTreeNode } from './binarySearchTree';

const getAVLTreeHeight = (rootNode: BinaryTreeNode): number => {
  if (!rootNode.left && !rootNode.right) return 1;
  let leftHeight = 0;
  let rightHeight = 0;
  if (rootNode.left) {
    leftHeight += getAVLTreeHeight(rootNode.left);
  }
  if (rootNode.right) {
    rightHeight += getAVLTreeHeight(rootNode.right);
  }
  return Math.max(leftHeight, rightHeight) + 1;
};

// 左单旋转 (节点右侧高度高于左侧高度时)
const rotateLeft = (rootNode: BinaryTreeNode): BinaryTreeNode => {
  if (!rootNode.right) return rootNode;
  const newRootNode = rootNode.right;
  rootNode.right = newRootNode.left;
  newRootNode.left = rootNode;
  return newRootNode;
};

// 右单旋转 (节点左侧高度高于右侧高度时)
const rotateRight = (rootNode: BinaryTreeNode): BinaryTreeNode => {
  if (!rootNode.left) return rootNode;
  const newRootNode = rootNode.left;
  rootNode.left = newRootNode.right;
  newRootNode.left = rootNode;
  return newRootNode;
};

// 右-左双旋转 (节点右侧高度高于左侧高度时, 且其右侧节点最大高度在其左侧节点)
// 先右侧节点右旋，再根节点左旋
const rotateRightLeft = (rootNode: BinaryTreeNode): BinaryTreeNode => {
  if (!rootNode || !rootNode.right) return rootNode;
  rootNode.right = rotateRight(rootNode.right);
  return rotateRight(rootNode);
};

// 左-右双旋转 (节点左侧高度高于右侧高度时, 且其左侧节点最大高度在其右侧节点)
// 先左侧节点左旋，再根节点右旋
const rotateLeftRight = (rootNode: BinaryTreeNode): BinaryTreeNode => {
  if (!rootNode || !rootNode.left) return rootNode;
  rootNode.left = rotateLeft(rootNode.left);
  return rotateRight(rootNode);
};

// 二叉树任意节点自平衡
const balance = (rootNode: BinaryTreeNode): BinaryTreeNode => {
  const leftNode = rootNode.left;
  const rightNode = rootNode.right;
  if (!leftNode && !rightNode) return rootNode;
  let leftHeight = 0;
  let rightHeight = 0;
  if (leftNode) {
    leftHeight = getAVLTreeHeight(leftNode);
  }
  if (rightNode) {
    rightHeight = getAVLTreeHeight(rightNode);
  }
  if (leftHeight - rightHeight === 0) return rootNode;
  if (leftHeight - rightHeight > 1 && leftNode) {
    // 左侧节点比右侧节点高 1； 右自旋 或 左-右双旋转
    const llHeight = leftNode.left ? getAVLTreeHeight(leftNode.left) : 0;
    const lrHeight = leftNode.right ? getAVLTreeHeight(leftNode.right) : 0;

    // 左侧节点的右侧节点比左侧节点高  左-右双旋转
    if (llHeight < lrHeight) {
      rootNode = rotateLeftRight(rootNode);
    } else {
      rootNode = rotateRight(rootNode);
    }
  }

  if (rightHeight - leftHeight > 1 && rightNode) {
    // 右侧节点比左侧节点高 1； 左自旋 或 右-左双旋
    const rlHeight = rightNode.left ? getAVLTreeHeight(rightNode.left) : 0;
    const rrHeight = rightNode.right ? getAVLTreeHeight(rightNode.right) : 0;

    // 右侧节点的左侧节点比右侧节点高  右-左双旋
    if (rrHeight < rlHeight) {
      rootNode = rotateRightLeft(rootNode);
    } else {
      rootNode = rotateLeft(rootNode);
    }
  }
  return rootNode;
};

// 插入节点
const insertNode = (rootNode: BinaryTreeNode, data: number): BinaryTreeNode => {
  if (rootNode.data === data) {
    rootNode.count++;
  } else if (rootNode.data < data) {
    if (rootNode.right) {
      rootNode.right = insertNode(rootNode.right, data);
      // 插入节点不在当前层时，需要自平衡一下当前节点
      rootNode = balance(rootNode);
    } else {
      const node = new BinaryTreeNode(data);
      rootNode.right = node;
    }
  } else if (rootNode.left) {
    rootNode.left = insertNode(rootNode.left, data);
    // 插入节点不在当前层时，需要自平衡一下当前节点
    rootNode = balance(rootNode);
  } else {
    const node = new BinaryTreeNode(data);
    rootNode.left = node;
  }
  return rootNode;
};

// 删除节点
const removeNode = (
  rootNode: BinaryTreeNode,
  data: number,
): BinaryTreeNode | undefined => {
  let node: BinaryTreeNode | undefined = rootNode;
  if (!node) return node;
  if (node.data === data) {
    if (!node.left && !node.right) return;
    if (node.right && !node.left) return node.right;
    if (node.left && !node.right) return node.left;
    if (node.left && node.right) {
      const newRootNode = cloneNode(getMinNode(node.right));
      newRootNode.left = node.left;
      newRootNode.right = removeNode(node.right, newRootNode.data);
      return newRootNode;
    }
  } else if (node.data < data) {
    if (node.right) {
      node.right = removeNode(node.right, data);
      node = balance(node);
    }
  } else if (node.left) {
    node.left = removeNode(node.left, data);
    node = balance(node);
  }
  return node;
};

class AVLTree extends BSTTree {
  // 插入节点
  insert(data: number) {
    if (!this.root) {
      this.root = new BinaryTreeNode(data);
      return;
    }
    this.root = insertNode(this.root, data);
  }

  remove(data: number) {
    if (!this.root) return;
    this.root = removeNode(this.root, data);
  }
}

export default AVLTree;
```

**特点**
特点：

1. n 个结点的 AVL 树最大深度约 1.44log2 n；
2. 在高度为 h 的在高度为 h 的 AVL 树中，最少节点数 S(h)由 S(h-1)+S(h-2)+1 给出
3. 查找、插入和删除在平均和最坏情况下都是 O(log n)；

增加和删除可能需要通过一次或多次树旋转来重新平衡这个树。

可以优化点 减少 `balance`回溯

1. 插入更新时：如果当前节点的高度没有改变，则停止向上回溯父节点。
2. 删除更新时：如果当前节点的高度没有改变，且平衡值在 [-1, 1] 区间则停止回溯。

## 红黑树

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
