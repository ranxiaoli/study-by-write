#### javascript预解析与变量提升
```js
// global context
executionContextObj = {
    'scopeChain': {/* 变量对象 + 所有父级执行上下文中的变量对象 */ },
    'variableObject': { a: undefined, f: pointer to function f() }, /*  函数参数 / 参数, 内部变量以及函数声明*/ 
    'this': {...}
}
...
}//首先在全局执行环境中声明了变量a以及函数f,此时a虽然被声明,但是尚未赋值
x = 1;
function f() {
    executionContextObj {
    'scopeChain': { ... },
    'variableObject': {
    arguments: {},
    a: undefined
        },
    'this': {...}
    }
    //内部词法环境中声明了变量a,此时a虽然被声明,但是尚未赋值
    console.log(a);//此时a需要被被打印出来,在作用域内寻找a变量赋值,于是被赋值undefined
    a = 2;
}
```
##### 变量对象创建如下
- 根据函数的参数，创建并初始化arguments object
- 扫描函数内部，查找函数声明
  - 对于所有找的的函数声明，将函数名和引用存储在变量对象中
  - 如果变量有同名，则覆盖
- 扫描函数内部代码，查找变量声明（Variable declaration）
  - 对于所有找到的变量声明，将变量名存入变量对象中，并初始化为"undefined"
  - 如果变量名称跟已经声明的形式参数或函数相同，则变量声明不会干扰已经存在的这类属性


#### Event Loop详解
Event Loop即事件循环，是指浏览器或Node的一种解决javaScript单线程运行时不会阻塞的一种机制，也就是我们经常使用异步的原理。

##### 堆、栈的概念
- 栈
栈在计算机科学中是限定仅在表尾进行插入或删除操作的线性表。 栈是一种数据结构，它按照后进先出的原则存储数据，先进入的数据被压入栈底，最后的数据在栈顶，需要读数据的时候从栈顶开始弹出数据。
栈是只能在某一端插入和删除的特殊线性表。

- 队列
特殊之处在于它只允许在表的前端（front）进行删除操作，而在表的后端（rear）进行插入操作，和栈一样，队列是一种操作受限制的线性表。
进行插入操作的端称为队尾，进行删除操作的端称为队头。 队列中没有元素时，称为空队列。
队列的数据元素又称为队列元素。在队列中插入一个队列元素称为入队，从队列中删除一个队列元素称为出队。因为队列只允许在一端插入，在另一端删除，所以只有最早进入队列的元素才能最先从队列中删除，故队列又称为先进先出（FIFO—first in first out）


#### 不可变数据的解决方案
```js
const target = {name: 'Messi', age: 29};
const handler = {
  get: function(target, key, receiver) {
    console.log(`getting ${key}!`);
    if (key === 'age') {
      const age = Reflect.get(target, key, receiver)
      Reflect.set(target, key, age+1, receiver);
      return age+1
    }
    return Reflect.get(target, key, receiver);
  }
};
const a = new Proxy(target, handler);
console.log(a.age, a.age);
```

```js
function createState(target) {
  this.modified = false; // 是否被修改
  this.target = target; // 目标对象
  this.copy = undefined; // 拷贝的对象
}
createState.prototype = {
    // 对于get操作,如果目标对象没有被修改直接返回原对象,否则返回拷贝对象
    get: function(key) {
      if (!this.modified) return this.target[key];
      return this.copy[key];
    },
    // 对于set操作,如果目标对象没被修改那么进行修改操作,否则修改拷贝对象
    set: function(key, value) {
      if (!this.modified) this.markChanged();
      return (this.copy[key] = value);
    },
    // 标记状态为已修改,并拷贝
    markChanged: function() {
      if (!this.modified) {
        this.modified = true;
        this.copy = shallowCopy(this.target);
      }
    },
  };
  // 拷贝函数
  function shallowCopy(value) {
    if (Array.isArray(value)) return value.slice();
    if (value.__proto__ === undefined)
      return Object.assign(Object.create(null), value);
    return Object.assign({}, value);
  }

```
