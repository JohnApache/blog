---
group:
  title: 常规面试题
  order: 1
---

# 排序类算法

## 冒泡排序 Bubble Sort

**算法描述:**

> 冒泡排序是一种简单的排序算法。它重复地走访过要排序的数列，一次比较两个元素，如果它们的顺序错误就把它们交换过来。走访数列的工作是重复地进行直到没有再需要交换，也就是说该数列已经排序完成。这个算法的名字由来是因为越小的元素会经由交换慢慢“浮”到数列的顶端。

**算法实现：**

1. 比较相邻的元素。如果第一个比第二个大，就交换它们两个；
2. 对每一对相邻元素作同样的工作，从开始第一对到结尾的最后一对，这样在最后的元素应该会是最大的数；
3. 针对所有的元素重复以上的步骤，除了最后一个；
4. 重复步骤 1~3，直到排序完成。

```ts
const DefaultCompareFn = <T>(a: T, b: T): number => {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
};

const BubbleSort = <T = any>(
  arr: T[],
  compareFn?: (a: T, b: T) => number,
): T[] => {
  const resultArr = [...arr];
  const compare = compareFn || DefaultCompareFn;
  if (resultArr.length <= 1) return resultArr;
  for (let i = 0; i < resultArr.length - 1; i++) {
    let hasFinished = true;
    for (let j = 0; j < resultArr.length - 1 - i; j++) {
      if (compare(resultArr[j], resultArr[j + 1]) > 0) {
        [resultArr[j], resultArr[j + 1]] = [resultArr[j + 1], resultArr[j]];
        hasFinished = false;
      }
    }
    if (hasFinished) break;
  }
  return resultArr;
};
```

**算法分析:**

- 最佳情况：T(n) = O(n) : 当输入的数据已经是正序时
- 最差情况：T(n) = O(n^2): 当输入的数据是反序时
- 平均情况：T(n) = O(n2)

## 选择排序 Selection Sort

**算法描述：**

> 选择排序(Selection-sort)是一种简单直观的排序算法。它的工作原理：首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置，然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕。

**算法实现：**

n 个记录的直接选择排序可经过 n-1 趟直接选择排序得到有序结果。具体算法描述如下：

1. 初始状态：无序区为 R[1..n]，有序区为空；
2. 第 i 趟排序(i=1,2,3...n-1)开始时，当前有序区和无序区分别为 R[1..i-1]和 R(i..n）。该趟排序从当前无序区中-选出关键字最小的记录 R[k]，将它与无序区的第 1 个记录 R 交换，使 R[1..i]和 R[i+1..n)分别变为记录个数增加 1 个的新有序区和记录个数减少 1 个的新无序区；
3. n-1 趟结束，数组有序化了。

```typescript
const DefaultCompareFn = <T>(a: T, b: T): number => {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
};

const SelectionSort = <T = any>(
  arr: T[],
  compareFn?: (a: T, b: T) => number,
): T[] => {
  const resultArr = [...arr];
  const compare = compareFn || DefaultCompareFn;
  if (resultArr.length <= 1) return resultArr;
  for (let i = 0; i < resultArr.length - 1; i++) {
    let pos = i;
    for (let j = i + 1; j < resultArr.length; j++) {
      if (compare(resultArr[pos], resultArr[j]) > 0) {
        pos = j;
      }
    }

    [resultArr[i], resultArr[pos]] = [resultArr[pos], resultArr[i]];
  }
  return resultArr;
};

export default SelectionSort;
```

**算法分析：**

- 最佳情况：T(n) = O(n2)
- 最差情况：T(n) = O(n2)
- 平均情况：T(n) = O(n2)

## 插入排序 Insertion Sort

**算法描述**

> 插入排序（Insertion-Sort）的算法描述是一种简单直观的排序算法。它的工作原理是通过构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。插入排序在实现上，通常采用 in-place 排序（即只需用到 O(1)的额外空间的排序），因而在从后向前扫描过程中，需要反复把已排序元素逐步向后挪位，为最新元素提供插入空间

**算法实现**  
一般来说，插入排序都采用 in-place 在数组上实现。具体算法描述如下：

1. 从第一个元素开始，该元素可以认为已经被排序；
2. 取出下一个元素，在已经排序的元素序列中从后向前扫描；
3. 如果该元素（已排序）大于新元素，将该元素移到下一位置；
4. 重复步骤 3，直到找到已排序的元素小于或者等于新元素的位置；
5. 将新元素插入到该位置后；
6. 重复步骤 2~5。

```ts
const DefaultCompareFn = <T>(a: T, b: T): number => {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
};

// 普通插入排序
const InsertionSort = <T = any>(
  arr: T[],
  compareFn?: (a: T, b: T) => number,
): T[] => {
  const resultArr = [...arr];
  const compare = compareFn || DefaultCompareFn;
  if (resultArr.length <= 1) return resultArr;
  for (let i = 1; i < resultArr.length; i++) {
    let pos = i - 1;
    const temp = resultArr[i];
    while (pos >= 0 && compare(resultArr[pos], temp) > 0) {
      resultArr[pos + 1] = resultArr[pos];
      pos--;
    }
    resultArr[pos + 1] = temp;
  }
  return resultArr;
};

// 二分法插入排序
const BinaryInsertionSort = <T = any>(
  arr: T[],
  compareFn?: (a: T, b: T) => number,
): T[] => {
  const resultArr = [...arr];
  const compare = compareFn || DefaultCompareFn;
  if (resultArr.length <= 1) return resultArr;
  for (let i = 1; i < resultArr.length; i++) {
    const temp = resultArr[i];
    let left = 0;
    let right = i - 1;
    while (left <= right) {
      const middle = Math.floor((right + left) / 2);
      if (compare(resultArr[middle], temp) > 0) {
        right = middle - 1;
      } else {
        left = middle + 1;
      }
    }

    for (let j = i - 1; j >= left; j--) {
      resultArr[j + 1] = resultArr[j];
    }
    resultArr[left] = temp;
  }
  return resultArr;
};

export { InsertionSort, BinaryInsertionSort };
```

**算法分析**

- 最佳情况：输入数组按升序排列。T(n) = O(n)
- 最坏情况：输入数组按降序排列。T(n) = O(n2)
- 平均情况：T(n) = O(n2)

## 希尔排序

**算法描述**
希尔排序又叫做`步长递减插入排序`或`增量递减插入排序`

> 1959 年 Shell 发明； 第一个突破 O(n^2)的排序算法；是简单插入排序的改进版；它与插入排序的不同之处在于，它会优先比较距离较远的元素。希尔排序又叫缩小增量排序

> 希尔排序的核心在于间隔序列的设定。既可以提前设定好间隔序列，也可以动态的定义间隔序列。动态定义间隔序列的算法是《算法（第 4 版》的合著者 Robert Sedgewick 提出的。

**算法实现**

1. 选择一个递增序列。并在递增序列中，选择小于数组长度的最大值，作为初始步长 `gap`。
2. 开始的时候，将数组分为 n 个独立的子数组， 每个子数组中每个元素等距离分布，各个元素距离都是`gap`。
3. 对 2 中分割出的子数组分别进行插入排序
4. 第一轮分组的插入排序完成后，根据递增序列（逆向看）减少`gap`的值并进行第二轮分组， 同样对各个子数组分别插入排序。 不断循环 1、2、4, 直到`gap`减少到 1 时候， 进行最后一轮插入排序，也就是针对整个数组的直接插入排序（这个时候分组只有 1 个，即整个数组本身）
5. 一开始的时候`gap`的值是比较大的（例如可以占到整个数组长度的一半），所以一开始的时候子数组的数量很多，而每个子数组长度很小。 随着 h 的减小，子数组的数量越来越少，而单个子数组的长度越来越大。

```ts
const DefaultCompareFn = <T>(a: T, b: T): number => {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
};

const GAP_MAGIC_NUMBER = 3;

const ShellSort = <T = any>(
  arr: T[],
  compareFn?: (a: T, b: T) => number,
): T[] => {
  const resultArr = [...arr];
  const compare = compareFn || DefaultCompareFn;
  const len = resultArr.length;
  if (len <= 1) return resultArr;
  let gap = 1;
  while (gap < len / GAP_MAGIC_NUMBER) {
    // 动态定义间隔序列
    gap = gap * GAP_MAGIC_NUMBER + 1;
  }
  while (gap > 0) {
    for (let i = gap; i < len; i++) {
      const temp = resultArr[i];
      let j;
      for (j = i - gap; j >= 0 && compare(resultArr[j], temp) > 0; j -= gap) {
        resultArr[j + gap] = resultArr[j];
      }
      resultArr[j + gap] = temp;
    }
    gap = Math.floor(gap / GAP_MAGIC_NUMBER);
  }
  return resultArr;
};

export default ShellSort;
```

**算法分析**

- 最佳情况：T(n) = O(nlog2 n)
- 最坏情况：T(n) = O(nlog2 n)
- 平均情况：T(n) =O(nlog n)

## 归并排序 Merge Sort
