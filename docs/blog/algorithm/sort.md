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

**算法描述**

> 和选择排序一样，归并排序的性能不受输入数据的影响，但表现比选择排序好的多，因为始终都是`O(n log n）`的时间复杂度。代价是需要额外的内存空间。

> 归并排序是建立在归并操作上的一种有效的排序算法。该算法是采用`分治法`（Divide and Conquer）的一个非常典型的应用。归并排序是一种稳定的排序方法。将已有序的子序列合并，得到完全有序的序列；即先使每个子序列有序，再使子序列段间有序。若将两个有序表合并成一个有序表，称为`2-路归并`。

**算法实现**

1. 申请空间，使其大小为两个已经排序序列之和，该空间用来存放合并后的序列
2. 设定两个指针，最初位置分别为两个已经排序序列的起始位置
3. 比较两个指针所指向的元素，选择相对小的元素放入到合并空间，并移动指针到下一位置
4. 重复步骤 3 直到某一指针超出序列尾
5. 将另一序列剩下的所有元素直接复制到合并序列尾

总结：

- 将两个已排好序的数组合并成一个有序的数组,称之为`归并排序`
- 步骤：遍历两个数组，比较它们的值。谁比较小，谁先放入大数组中，直到数组遍历完成

```ts
const DefaultCompareFn = <T>(a: T, b: T): number => {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
};

const merge = <T = any>(
  leftArr: T[],
  rightArr: T[],
  compare: (a: T, b: T) => number,
): T[] => {
  let lpos = 0;
  let rpos = 0;
  let pos = 0;
  const lLen = leftArr.length;
  const rLen = rightArr.length;
  const result: T[] = new Array(lLen + rLen);
  while (lpos < lLen && rpos < rLen) {
    if (compare(leftArr[lpos], rightArr[rpos]) <= 0) {
      result[pos++] = leftArr[lpos++];
    } else {
      result[pos++] = rightArr[rpos++];
    }
  }
  while (lpos < lLen) {
    result[pos++] = leftArr[lpos++];
  }
  while (rpos < rLen) {
    result[pos++] = rightArr[rpos++];
  }
  return result;
};

const _mergeSort = <T = any>(
  arr: T[],
  compare: (a: T, b: T) => number,
): T[] => {
  if (arr.length <= 1) return arr;
  const M = Math.floor(arr.length / 2);
  const Left = arr.slice(0, M);
  const Right = arr.slice(M);
  return merge(_mergeSort(Left, compare), _mergeSort(Right, compare), compare);
};

const MergeSort = <T = any>(
  arr: T[],
  compareFn?: (a: T, b: T) => number,
): T[] => {
  const compare = compareFn || DefaultCompareFn;
  if (arr.length <= 1) return [...arr];
  return _mergeSort(arr, compare);
};

export default MergeSort;
```

**算法分析**

- 最佳情况：T(n) = O(n)
- 最差情况：T(n) = O(nlogn)
- 平均情况：T(n) = O(nlogn)

## 快速排序 Quick Sort

> Tips: 快排深度优化 <https://juejin.im/post/5aa94ca6518825558252120c>

**算法描述**

快速排序的基本思想：通过一趟排序将待排记录分隔成独立的两部分，其中一部分记录的关键字均比另一部分的关键字小，则可分别对这两部分记录继续进行排序，以达到整个序列有序。

**算法实现**

1. 在数据集之中，选择一个元素作为"基准"（pivot）。
2. 所有小于"基准"的元素，都移到"基准"的左边；所有大于"基准"的元素，都移到"基准"的右边。
3. 对"基准"左边和右边的两个子集，不断重复第一步和第二步，直到所有子集只剩下一个元素为止。

> Tips: 三路快速排序是快速排序的的一个优化版本， 将数组分成三段， 即小于基准元素、 等于 基准元素和大于基准元素， 这样可以比较高效的处理数组中存在相同元素的情况,其它特征与快速排序基本相同。

```ts
const DefaultCompareFn = <T>(a: T, b: T): number => {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
};

const _quickSort = <T = any>(
  arr: T[],
  compare: (a: T, b: T) => number,
): T[] => {
  const len = arr.length;
  if (len <= 1) return arr;
  const pivot = arr[0];
  const left = [];
  const middle = [];
  const right = [];
  for (let i = 0; i < len; i++) {
    if (compare(arr[i], pivot) < 0) {
      left.push(arr[i]);
      continue;
    }
    if (compare(arr[i], pivot) === 0) {
      middle.push(arr[i]);
      continue;
    }
    right.push(arr[i]);
  }

  // 三路快排
  return _quickSort(left, compare)
    .concat(middle)
    .concat(_quickSort(right, compare));
};

const QuickSort = <T = any>(
  arr: T[],
  compareFn?: (a: T, b: T) => number,
): T[] => {
  const resultArr = [...arr];
  const compare = compareFn || DefaultCompareFn;
  const len = resultArr.length;
  if (len <= 1) return resultArr;
  return _quickSort(resultArr, compare);
};

export default QuickSort;
```

**算法分析**

- 最佳情况：T(n) = O(nlogn)
- 最差情况：T(n) = O(n2)
- 平均情况：T(n) = O(nlogn)

## 堆排序 Heap Sort

堆排序可以说是一种利用堆的概念来排序的选择排序。

**算法描述**

> 堆排序（Heapsort）是指利用堆这种数据结构所设计的一种排序算法。堆积是一个近似完全二叉树的结构，并同时满足堆积的性质：即子结点的键值或索引总是小于（或者大于）它的父节点。

**算法实现**

1. 将初始待排序关键字序列(R1,R2....Rn)构建成大顶堆，此堆为初始的无序区；
2. 将堆顶元素 R[1]与最后一个元素 R[n]交换，此时得到新的无序区(R1,R2,......Rn-1)和新的有序区(Rn),且满足 R[1,2...n-1]<=R[n]；
3. 由于交换后新的堆顶 R[1]可能违反堆的性质，因此需要对当前无序区(R1,R2,......Rn-1)调整为新堆，然后再次将 R[1]与无序区最后一个元素交换，得到新的无序区(R1,R2....Rn-2)和新的有序区(Rn-1,Rn)。不断重复此过程直到有序区的元素个数为 n-1，则整个排序过程完成。

```ts
const DefaultCompareFn = <T>(a: T, b: T): number => {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
};

const maxHeapify = <T = any>(
  array: T[],
  index: number,
  heapSize: number,
  compare: (a: T, b: T) => number,
) => {
  let iLeft: number, iMax: number, iRight: number;
  while (true) {
    iMax = index;
    iLeft = 2 * index + 1;
    iRight = 2 * (index + 1);

    if (iLeft < heapSize && compare(array[index], array[iLeft]) < 0) {
      iMax = iLeft;
    }

    if (iRight < heapSize && compare(array[iMax], array[iRight]) < 0) {
      iMax = iRight;
    }

    if (iMax !== index) {
      [array[iMax], array[index]] = [array[index], array[iMax]];
      index = iMax;
    } else {
      break;
    }
  }
};

const buildMaxHeap = <T = any>(array: T[], compare: (a: T, b: T) => number) => {
  const iParent: number = Math.floor(array.length / 2) - 1;
  for (let i = iParent; i >= 0; i--) {
    maxHeapify(array, i, array.length, compare);
  }
};

const HeapSort = <T = any>(
  arr: T[],
  compareFn?: (a: T, b: T) => number,
): T[] => {
  const resultArr = [...arr];
  const compare = compareFn || DefaultCompareFn;
  if (resultArr.length <= 1) return resultArr;
  buildMaxHeap(resultArr, compare);
  for (let i = resultArr.length - 1; i > 0; i--) {
    [resultArr[0], resultArr[i]] = [resultArr[i], resultArr[0]];
    maxHeapify(resultArr, 0, i, compare);
  }
  return resultArr;
};

export default HeapSort;
```

> Todo: 代码没太理解，- -

**算法分析**

- 最佳情况：T(n) = O(nlogn)
- 最差情况：T(n) = O(nlogn)
- 平均情况：T(n) = O(nlogn)

## 计数排序 Counting Sort

**算法描述**

> 计数排序的核心在于将输入的数据值转化为键存储在额外开辟的数组空间中。 作为一种线性时间复杂度的排序，计数排序要求输入的数据必须是有`确定范围的整数`。

> 计数排序(Counting sort)是一种稳定的排序算法。计数排序使用一个额外的数组 C，其中第 i 个元素是待排序数组 A 中值等于 i 的元素的个数。然后根据数组 C 来将 A 中的元素排到正确的位置。它只能对整数进行排序。

**算法实现**

1. 找出待排序的数组中最大和最小的元素；
2. 统计数组中每个值为 i 的元素出现的次数，存入数组 C 的第 i 项；
3. 对所有的计数累加（从 C 中的第一个元素开始，每一项和前一项相加）；
4. 反向填充目标数组：将每个元素 i 放在新数组的第 C(i)项，每放一个元素就将 C(i)减去 1。

```ts
const CountingSort = (arr: number[]): number[] => {
  const len = arr.length;
  if (len <= 1) return [...arr];

  let max: number = arr[0];
  let min: number = arr[0];

  for (let i = 0; i < len; i++) {
    if (arr[i] > max) max = arr[i];
    if (arr[i] < min) min = arr[i];
  }

  const buckets: number[] = new Array(max - min + 1);
  const resultArr: number[] = [];

  for (let i = 0; i < len; i++) {
    // 兼容负数
    buckets[arr[i] - min] = (buckets[arr[i] - min] || 0) + 1;
  }

  for (let i = 0; i < max - min + 1; i++) {
    let count = buckets[i] || 0;
    while (count > 0) {
      resultArr.push(i + 1);
      count--;
    }
  }
  return resultArr;
};

export default CountingSort;
```

**算法分析**

> 当输入的元素是 n 个 0 到 k 之间的整数时，它的运行时间是 O(n + k)。计数排序不是比较排序，排序的速度快于任何比较排序算法。由于用来计数的数组 C 的长度取决于待排序数组中数据的范围（等于待排序数组的最大值与最小值的差加上 1），这使得计数排序对于数据范围很大的数组，需要大量时间和内存。

- 最佳情况：T(n) = O(n+k)
- 最差情况：T(n) = O(n+k)
- 平均情况：T(n) = O(n+k)

## 桶排序 Bucket Sort

**算法描述**

> 桶排序是`计数排序的升级版`。它利用了函数的映射关系，高效与否的关键就在于这个映射函数的确定

> 桶排序 (Bucket sort)的工作的原理：假设输入数据服从均匀分布，将数据分到有限数量的桶里，每个桶再分别排序（有可能再使用别的排序算法或是以递归方式继续使用桶排序进行排序)

**算法实现** 1.设置一个定量的数组当作空桶； 2.遍历输入数据，并且把数据一个一个放到对应的桶里去； 3.对每个不是空的桶进行排序； 4.从不是空的桶里把排好序的数据拼接起来。

```ts
import QuickSort from './quick-sort';
const DEFAULT_BUCKET_SIZE = 10; // 默认桶大小

const BucketSort = (arr: number[], size: number): number[] => {
  const len = arr.length;
  if (size <= 0 || size > len) size = DEFAULT_BUCKET_SIZE;

  let max: number = arr[0];
  let min: number = arr[0];

  for (let i = 0; i < len; i++) {
    if (arr[i] > max) max = arr[i];
    if (arr[i] < min) min = arr[i];
  }

  const count: number = Math.ceil((max - min) / size);
  const buckets: number[][] = new Array(count);
  let resultArr: number[] = [];

  for (let i = 0; i < len; i++) {
    const index = Math.ceil((arr[i] - min) / size);
    if (!buckets[index]) {
      buckets[index] = [arr[i]];
      continue;
    }
    buckets[index].push(arr[i]);
  }

  for (let i = 0; i < count; i++) {
    const bucket = buckets[i];
    if (bucket && bucket.length > 0) {
      // 使用快排， 排序每个小桶
      resultArr = resultArr.concat(...QuickSort(bucket));
    }
  }

  return resultArr;
};

export default BucketSort;
```

**算法分析**

> 桶排序最好情况下使用线性时间 O(n)，桶排序的时间复杂度，取决与对各个桶之间数据进行排序的时间复杂度，因为其它部分的时间复杂度都为 O(n)。很显然，桶划分的越小，各个桶之间的数据越少，排序所用的时间也会越少。但相应的空间消耗就会增大。

- 最佳情况：T(n) = O(n+k)
- 最差情况：T(n) = O(n+k)
- 平均情况：T(n) = O(n2)

## 基数排序

**算法描述**

> 基数排序也是非比较的排序算法，对每一位进行排序，从最低位开始排序，复杂度为 O(kn), n 为数组长度，k 为数组中的数的最大的位数；

> 基数排序是按照低位先排序，然后收集；再按照高位排序，然后再收集；依次类推，直到最高位。有时候有些属性是有优先级顺序的，先按低优先级排序，再按高优先级排序。最后的次序就是高优先级高的在前，高优先级相同的低优先级高的在前。基数排序基于分别排序，分别收集，所以是稳定的。

基数排序按照对位数分组的顺序的不同，可以分为`LSD（Least significant digit）`基数排序和`MSD（Most significant digit）`基数排序。

- `LSD`基数排序，是按照从低位到高位的顺序进行分组排序。
- `MSD`基数排序，是按照从高位到低位的顺序进行分组排序。  
  上述两种方式不仅仅是对位数分组顺序不同，其实现原理也是不同的。

### LSD 基数排序实现

1. 获取最大数的位数，假设为 3 位
2. 建立 10 个桶，亦即 10 个数组。
3. 遍历所有元素，取其个位数，个位数是什么就放进对应编号的数组，1 放进 1 号桶。
4. 再依次将元素从桶里最出来，覆盖原数组，或放到一个新数组，我们把这个经过第一次排序的数组叫 sorted。
5. 我们再一次遍历 sorted 数组的元素，这次取十位的值。这时要注意，不存在十位，那么默认为 0
6. 再依次将元素从桶里最出来，覆盖原数组，
7. 开始百位上的入桶操作，没有百位就默认为 0。 重复上述操作，直到达到最大位数， 循环结束返回 sorted

```ts
const DEFAULT_RADIX_BUCKET_COUNT = 10;

const getLoopTimes = (max: number): number => max.toString().length;

const getBucketRadixNumber = (num: number, index: number): number => {
  const numStr = num.toString();
  return Number(numStr.charAt(numStr.length - index) || 0);
};

const LSDRadixSort = (arr: number[]): number[] => {
  const len = arr.length;
  const resultArr: number[] = [...arr];
  if (len <= 1) return resultArr;

  let max: number = arr[0];
  let min: number = arr[0];

  for (let i = 0; i < len; i++) {
    if (arr[i] > max) max = arr[i];
    if (arr[i] < min) min = arr[i];
  }

  const buckets: number[][] = new Array(DEFAULT_RADIX_BUCKET_COUNT);
  const loopTime = getLoopTimes(max - min);
  for (let i = 1; i <= loopTime; i++) {
    for (let j = 0; j < len; j++) {
      const num = getBucketRadixNumber(resultArr[j] - min, i);
      if (!buckets[num]) {
        buckets[num] = [resultArr[j]];
        continue;
      }
      buckets[num].push(resultArr[j]);
    }

    // 末尾bucket 填充完毕即排序
    let pos = 0;
    for (let k = 0; k < DEFAULT_RADIX_BUCKET_COUNT; k++) {
      const bucket = buckets[k];
      if (!bucket || bucket.length <= 0) continue;
      for (let z = 0; z < bucket.length; z++) {
        resultArr[pos++] = bucket[z];
      }
      bucket.length = 0; // 清空bucket
    }
  }
  return resultArr;
};

export { LSDRadixSort };
```

### MSD 基数排序实现

1. 最开始时也是遍历所有元素，取最大值，得到最大位数，建立 10 个桶。这时从最大位取起。不足最大位，对应位置为 0.
2. 对每个长度大于 1 的桶进行内部排序。内部排序也是用基数排序。我们需要建立另 10 个桶，对 0 号桶的元素进行入桶操作，这时比原来少一位。
3. 然后继续递归上一步，因此每个桶的长度，都没有超过 1，于是开始 0 号桶的收集工作：
4. 将这步骤应用其他桶，最后就排序完毕。

```ts
const DEFAULT_RADIX_BUCKET_COUNT = 10;

const getLoopTimes = (max: number): number => max.toString().length;

const getBucketRadixNumber = (num: number, index: number): number => {
  const numStr = num.toString();
  return Number(numStr.charAt(numStr.length - index) || 0);
};

const _msdRadixSort = (arr: number[], radix: number) => {
  const len = arr.length;
  if (len <= 1 || radix < 1) return;
  let max: number = arr[0];
  let min: number = arr[0];

  for (let i = 0; i < len; i++) {
    if (arr[i] > max) max = arr[i];
    if (arr[i] < min) min = arr[i];
  }

  const buckets: number[][] = new Array(DEFAULT_RADIX_BUCKET_COUNT);

  for (let j = 0; j < len; j++) {
    const num = getBucketRadixNumber(arr[j] - min, radix);
    if (!buckets[num]) {
      buckets[num] = [arr[j]];
      continue;
    }
    buckets[num].push(arr[j]);
  }

  for (let k = 0; k < DEFAULT_RADIX_BUCKET_COUNT; k++) {
    const bucket = buckets[k];
    if (!bucket || bucket.length <= 0) continue;
    if (bucket.length > 1) {
      _msdRadixSort(bucket, radix - 1);
    }
  }

  let pos: number = 0;
  for (let k = 0; k < DEFAULT_RADIX_BUCKET_COUNT; k++) {
    const bucket = buckets[k];
    if (!bucket || bucket.length <= 0) continue;
    for (let j = 0; j < bucket.length; j++) {
      arr[pos++] = bucket[j];
    }
    bucket.length = 0;
  }
};

const MSDRadixSort = (arr: number[]): number[] => {
  const len = arr.length;
  const resultArr: number[] = [...arr];
  if (len <= 1) return resultArr;

  let max: number = arr[0];
  let min: number = arr[0];

  for (let i = 0; i < len; i++) {
    if (arr[i] > max) max = arr[i];
    if (arr[i] < min) min = arr[i];
  }

  const loopTime: number = getLoopTimes(max - min);
  _msdRadixSort(resultArr, loopTime);

  return resultArr;
};

export { MSDRadixSort };
```

> Tips: 为了支持负数，可以使用最小值作为偏差值，所有的数据基于最小值的偏差值去存储到对应的 bucket 即可

**算法实现**

1. 取得数组中的最大数，并取得位数；
2. arr 为原始数组，从最低位开始取每个位组成 radix 数组；
3. 对 radix 进行计数排序（利用计数排序适用于小范围数的特点）；

**基数排序 vs 计数排序 vs 桶排序**

这三种排序算法都利用了`bucket`的概念，但对桶的使用方法上有明显差异：

- 基数排序：根据键值的每位数字来分配桶
- 计数排序：每个桶只存储单一键值
- 桶排序：每个桶存储一定范围的数值
