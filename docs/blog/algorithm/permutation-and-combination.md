# 排列组合算法 Permutaion-And-Combination

## 算法描述

`排列(Permutation)`指的是**从 n 个不同元素中，任取 m(m≤n,m 与 n 均为自然数,下同）个不同的元素按照一定的顺序排成一列，叫做从 n 个不同元素中取出 m 个元素的一个排列**。

`组合(Combination)`指的是**从 n 个不同元素中，任取 m(m≤n）个元素并成一组，叫做从 n 个不同元素中取出 m 个元素的一个组合**。

## 算法示例

1. 有 n 个不同元素的数组, 打印出所有的排列组合
   如`[1, 2, 3]`， 打印出[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]。

2. 进阶：有 n 个不同元素的数组, 取出 k 个元素，打印出所有的排列组合
   如`[1, 2, 3]`，取出 2 个元素的可能组合， 打印出[1, 2], [1, 3], [2, 3], [2, 1], [3, 1], [3, 2]。

3. 进阶： A13 A23 A33 有序组合 C13 C23 C33 无序组合

## 算法实现

```ts
/**
 * 排列组合问题
 * @param {number[]} source 排列数组
 * @param {number} pickNumber 取出的数量
 * @param {boolean} isDisorder 是否有序
 * @returns {Array.<number[]>} 返回值
 */
const PermutationAndCombination = (
  source: number[],
  pickNumber?: number,
  isDisorder?: boolean,
): number[][] => {
  const result: number[][] = [];
  pickNumber = pickNumber || source.length;
  if (pickNumber < 1 || pickNumber > source.length)
    throw new Error('invalid pick number');

  const backtrack = (source: number[], track: number[], startIndex: number) => {
    if (track.length === pickNumber) {
      result.push([...track]);
      return;
    }
    for (let i = startIndex; i < source.length; i++) {
      if (track.indexOf(source[i]) !== -1) continue;
      track.push(source[i]);
      backtrack(source, track, isDisorder ? i + 1 : 0);
      track.pop();
    }
  };

  backtrack(source, [], 0);
  return result;
};

export default PermutationAndCombination;
```

## 个人答案

```ts
// 原数组 100
const arr = [1, 2, 3, 4, 5];
// 取 10 个
const k = 3;
// 有序组合
PermutationAndCombination(arr, k); // A5_3
PermutationAndCombination(arr, k, true); // C5_3
/*
A5_3
[
  [ 1, 2, 3 ], [ 1, 2, 4 ], [ 1, 2, 5 ], [ 1, 3, 2 ],
  [ 1, 3, 4 ], [ 1, 3, 5 ], [ 1, 4, 2 ], [ 1, 4, 3 ],
  [ 1, 4, 5 ], [ 1, 5, 2 ], [ 1, 5, 3 ], [ 1, 5, 4 ],
  [ 2, 1, 3 ], [ 2, 1, 4 ], [ 2, 1, 5 ], [ 2, 3, 1 ],
  [ 2, 3, 4 ], [ 2, 3, 5 ], [ 2, 4, 1 ], [ 2, 4, 3 ],
  [ 2, 4, 5 ], [ 2, 5, 1 ], [ 2, 5, 3 ], [ 2, 5, 4 ],
  [ 3, 1, 2 ], [ 3, 1, 4 ], [ 3, 1, 5 ], [ 3, 2, 1 ],
  [ 3, 2, 4 ], [ 3, 2, 5 ], [ 3, 4, 1 ], [ 3, 4, 2 ],
  [ 3, 4, 5 ], [ 3, 5, 1 ], [ 3, 5, 2 ], [ 3, 5, 4 ],
  [ 4, 1, 2 ], [ 4, 1, 3 ], [ 4, 1, 5 ], [ 4, 2, 1 ],
  [ 4, 2, 3 ], [ 4, 2, 5 ], [ 4, 3, 1 ], [ 4, 3, 2 ],
  [ 4, 3, 5 ], [ 4, 5, 1 ], [ 4, 5, 2 ], [ 4, 5, 3 ],
  [ 5, 1, 2 ], [ 5, 1, 3 ], [ 5, 1, 4 ], [ 5, 2, 1 ],
  [ 5, 2, 3 ], [ 5, 2, 4 ], [ 5, 3, 1 ], [ 5, 3, 2 ],
  [ 5, 3, 4 ], [ 5, 4, 1 ], [ 5, 4, 2 ], [ 5, 4, 3 ]
]
C5_3
[
  [ 1, 2, 3 ], [ 1, 2, 4 ],
  [ 1, 2, 5 ], [ 1, 3, 4 ],
  [ 1, 3, 5 ], [ 1, 4, 5 ],
  [ 2, 3, 4 ], [ 2, 3, 5 ],
  [ 2, 4, 5 ], [ 3, 4, 5 ]
]
*/
```
