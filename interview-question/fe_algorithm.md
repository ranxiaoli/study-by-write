## 1、说说你对时间复杂度、空间复杂度的理解？如何计算？
## 2、说说你的栈、队列的理解？应用场景
### 1）栈：先进后出，栈顶操作
```js
class Stack {
    constructor() {
        this.items = []
    }

    push(element) {
        this.items.push(element)
    }

    pos() {
        return this.items.pop()
    }

    /**
     * 返回栈顶的元素，不对栈做任何修改（这个方法不会移除栈顶的元素，仅仅返回它）
     */
    peek() {
        return this.items[this.items.length -1]
    }

    isEmpty() {
        return this.items.length === 0
    }

    clear() {
        this.items = []
    }

    size() {
        return this.items.length
    }
}
```
### 2）队列：先进先出，只允许在表头删除，表尾插入
```js
class Queue {
    constructor(size) {
        this.size = size; // 长度需要限制, 来达到空间的利用, 代表空间的长度
        this.list = [];
        this.font = 0; // 指向首元素
        this.rear = 0;  // 指向准备插入元素的位置
    }
    enQueue() {
        if (this.isFull() == true) {
            return false
        }
        this.rear = this.rear % this.k;
        this._data[this.rear++] = value;
        return true
    }
    deQueue() {
        if(this.isEmpty()){
            return false;
        }
        this.font++;
        this.font = this.font % this.k;
        return true;
    }
    isEmpty() {
        return this.font == this.rear - 1;
    }
    isFull() {
        return this.rear % this.k == this.font;
    }
}
```
## 3、说说常见的排序算法有哪些？区别？
### 1）是什么
通过时间复杂度，空间复杂度，稳定性来判定衡量排序算法的好坏
### 2）有哪些
#### (1)冒泡排序：时间[O(n^2)]，空间[O(1)], 稳定性[稳定]
- 比较相邻的元素，如果第一个比第二个大，就交换它们
- 对每一对相邻元素做同样工作，从开始第一到结尾的最后一对，这样在最后的元素应该是最大的数
- 针对所有重复以上操作，除了最后一个
- 重复上述步骤，直到没有任何一堆数字需要比较
#### (2)选择排序：时间[O(n^2)]，空间[O(1)], 稳定性[不稳定]
- 在未在排序序列中找到最小（大）的元素，存放在排序序列的起始位置
- 从剩余未排序元素中继续寻找最小（大）元素，放在已排序序列的末尾
- 重复第二步，直到所有元素均排序完毕
#### (3)插入排序：时间[O(n^2)]，空间[O(1)], 稳定性[稳定]
- 把待排序的数组分成已排序和未排序两部分，初始的时候把第一个元素认为是已排序的
- 从第二个元素开始，在已排序好的子数组中寻找到该元素合适的位置并插入到该位置（如果待插入的元素与有序序列中的某个元素相等，则将插入元素插入到相等元素的后面）
- 重复上述过程直到最后一个元素被插入有序子数组中
#### (4)归并排序： 时间[O(nlog(n))]，空间[O(n)], 稳定性[稳定]
- 申请空间，使其大小为两个已经排序序列之和，该空间用来存放合并后的数据
- 设定两个指针，最初位置分别为两个已经排序序列的起始位置
- 比较两个指针所指向的元素，选择相对小的元素放入到合并空间，并移动指针到一下个位置
- 重复步骤3，直到某一指针到达序列尾
- 将另一序列剩下的所有元素直接复制到合并序列尾
#### (5)快速排序：时间[O(nlog(n))]，空间[O(logn)], 稳定性[不稳定]
- 从序列中挑出一个元素，成为“基准”
- 重新排序数列，所有基准值小的元素摆放在基准前面，所有比基准值大的元素放在基准值的后面（相同元素可以放在任何一边）。这个分区结束之后，该基准就处于数列中间的位置。这个称为分区操作。
- 递归地把小于基准值元素地子数列和大于基准值元素地子数列进行排序

#### (6)希尔排序
#### (7)堆排序
#### (8)计数排序
#### (9)桶排序
#### (10)基数排序

## 4、说说你对二分查找的理解？如何实现？应用场景？
### 1）是什么？
想要应用二分查找，则这堆数应有如下特征
- 存储在数组中
- 有序排序
### 2）如何实现？
```js
function BinarySearch(arr, target) {
    if(arr.length <= 1) return -1 // ???
    let lowIndex = 0
    let hightIndex = arr.length -1
    while(lowIndex <= hightIndex) {
        const midIndex = Math.floor((lowIndex + highIndex) / 2)
        if(target < arr[midIndex]) {
            highIndex = midIndex -1
        }else if(target > arr[midIndex]) {
            lowIndex = midIndex + 1
        }else {
            if(midIndex === 0 || arr[midIndex - 1] < target) return midIndex
            highIndex = midIndex -1
        }
    }
    return -1
}
```

## 5、说说你对分而治之，动态规划的理解？区别？
### 1）分而治之： 分解、解决、合并

## 6、说说你对贪心算法、回溯算法的理解？应用场景？