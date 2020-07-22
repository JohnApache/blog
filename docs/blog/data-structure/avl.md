# 平衡二叉搜索树 (AVL 树)

普通二叉搜索树可能出现一条分支有多层，而其他分支却只有几层的情况，这会导致添加、移除和搜索树具有性能问题。因此提出了自平衡二叉树的概念，`AVL` 树（阿德尔森-维尔斯和兰迪斯树）是`自平衡二叉树`的一种，AVL 树的任一子节点的左右两侧子树的高度之差不超过 `1`，所以它也被称为`高度平衡树`。

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
