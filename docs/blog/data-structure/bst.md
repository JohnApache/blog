# 二叉搜索树（BST 树）

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

为了解决这一问题，可能需要一种`平衡的二叉搜索树`，常用的实现方法有[AVL 树](/blog/data-structure/avl), [红黑树](/blog/data-structure/llrb) 等。
