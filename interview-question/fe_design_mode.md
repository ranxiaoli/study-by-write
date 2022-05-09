## 一、说说对设计模式的理解，常见的设计模式有哪些？
### 1、是什么
设计模式并不直接用来完成代码的编写，而是描述在不同情况下，要怎么解决问题的一种方案；
### 2、有哪些？
- 单例模式： 保证一个类仅有一个实例，并提供一个访问它的全局访问点。
- 工厂模式
  - 工厂角色：负责实现创建所有实例的内部逻辑
  - 抽象产品角色：是所创建的所有对象的父类，负责描述所有实例所共有的接口
  - 具体产品角色：是创建目标，所有创建的对象都充当这个角色的某个具体类的实例
- 策略模式: 定义一系列的算法，把他们一个一个封装起来，并且使他们可以互相替换[类型dev,prod环境变量的封装？]
  - 策略类（可变）：策略封装了具体的算法，并负责具体的计算过程
  - 环境类（不可变）：接受了客户的请求，随后将请求委托给某一个策略类
- 代理模式：为对象提供一个代用品或占位符，以便控制对他的访问
- 中介者模式：通过一个中介者对象，其他所有对象都通过该中介者对象来通信，而不是互相引用，当其中给一个对象发生改变时，只要通知中介者对象即可
- 装饰者模式：在不改变对象自身的基础上，在程序运行期间给对象动态的添加方法
### 3、总结
- 减少重复工作
- 有助于快速理解系统

## 二、单例模式
### 1、实现
```js
// 1）方法一
function Singleton(name) {
  this.name = name
  this.instance = null
}
// 原型扩展类的一个方法getName()
Singleton.prototype.getName = function() {
  console.log(this.name)
}

// 获取类的实例
Singleton.getInstance = function(name) {
  if(!this.instance) {
    this.instance = new Singleton(name)
  }
  return this.instance
}

// 获取对象1
const a = Singleton.getInstance('a');
// 获取对象2
const b = Singleton.getInstance('b');
// 进行比较
console.log(a === b);

// 2）闭包方式
function Singleton(name) {
  this.name = name
}
// 原型扩展类的一个方法getName()
Singleton.prototype.getName = function() {
  console.log(this.name)
}

Singleton.getInstance = (function() {
  const instance = null
  return function(name) {
    if(!this.instance) {
      this.instance = new Singleton(name)
    }
    return instance
  }
})()
// 获取对象1
const a = Singleton.getInstance('a');
// 获取对象2
const b = Singleton.getInstance('b');
// 进行比较
console.log(a === b);

// 3）构造函数
function CreateSingleton(name) {
  this.name = name
  this.getName()
}

CreateSingleton.prototype.getName = function() {
  console.log(this.name)
}
// 单列模式
const Singleton = (function() {
  const instance = null
  return function(name) {
    if(!instance) {
      instance = new CreateSingleton(name)
    }
    return instance
  }
})()

// 创建实例对象1
const a = new Singleton('a');
// 创建实例对象2
const b = new Singleton('b');

console.log(a===b); // true
```
#### 2) 应用场景：全局弹窗
```js
const getSingle = function(fn) {
  let result
  return function() {
    return result || (result = fn.apply(this, arguments))
  }
}

const createLoginLayer = function() {
  var div = document.createElement('div')
  div.innerHTML = '我是浮窗'
  div.style.display = 'none'
  document.body.appendChild(div)
  return div
}

const createSingleLoginLayer = getSingle(createLoginLayer)

document.getElementById('loginBtn').onclick = function() {
  var loginLayer = createSingleLoginLayer()
  loginLayer.style.display = 'block'
}
// 惰性单例，意图解决需要时才创建实列对象， Vuex. Redux全局状态管理也应用了单例模式
```

## 三、工厂模式
### 1、是什么
工厂模式是用来创建对象的一种常用的模式，不暴露创建对象的具体逻辑，而是将逻辑封装在一个函数中，那么这个函数就视为一个工厂
### 2、实现
- 简单工厂模式
- 工厂方法模式
- 抽象工厂模式
### 3、简单工厂模式: 用一个工厂对象创建同一类对象类的实例
```js
function Factory(career) {
  function User(career, work) {
    this.carrer = carrer
    this.work = work
  }
  let work
  switch(career) {
    case 'coder':
      work =  ['写代码', '修Bug'] 
      return new User(career, work)
      break
    case 'hr':
      work = ['招聘', '员工信息管理']
      return new User(career, work)
      break 
    case 'driver':
      work = ['开车']
      return new User(career, work)
      break
    case 'boss':
      work = ['喝茶', '开会', '审批文件']
      return new User(career, work)
      break
  }
}
let coder = new Factory('coder')
console.log(coder)
let boss = new Factory('boss')
console.log(boss)
```

### 4、工厂方法模式
```js
function Factory(career) {
  if(this instanceof Factory) {
    var a = new this[career]()
    return a
  }else {
    return new Factory(career)
  }
}

// 工厂方法函数的原型中设置所有对象的构造函数
Factory.prototype = {
  'coder': function() {
    this.careerName = '程序员'
    this.work = ['写代码', '修Bug']
  },
  'hr': function(){
    this.careerName = 'HR'
    this.work = ['招聘', '员工信息管理']
  },
  'driver': function () {
    this.careerName = '司机'
    this.work = ['开车']
  },
  'boss': function(){
    this.careerName = '老板'
    this.work = ['喝茶', '开会', '审批文件']
  }
}

let coder = new Factory('coder')
console.log(coder)
let hr = new Factory('hr')
console.log(hr)
// 工厂方法关键核心代码是工厂里面的判断this是否属于工厂，也就是做了分支判断，这个工厂只做我能做的产品
```
### 5、抽象工厂模式
- 用于创建抽象类的函数
- 抽象类
- 具体类
- 实例化具体类
```js
let CareerAbstractFactory = function(subType, superType) {
  if(typeof CareerAbstractFactory[superType] === 'function') {
    // 缓存类
    function F() {}
    // 继承父类的属性和方法
    F.prototype = new CareerAbstractFactory[superType]()
    subType.constructor = subType
    subType.prototype = new F()
  }else {
    throw new Error('抽象类不存在')
  }
}
```
### 6、应用场景

## 四、策略模式
### 1、是什么？
定义一系列算法，把它们一个个封装起来，目的就是将算法的使用与算法的实现分离开来
基于策略模式的程序至少由两部分组成
- 策略类，封装了具体的算法，并负责具体的计算过程
- 环境类，接受客户的请求，随后把请求委托给某一个策略类

## 五、发布订阅模式、观察者模式
### 1、观察者模式
```js
// 被观察者
class Subject {
  constructor() {
    this.observerList = []
  }

  addObserver(observer) {
    this.observerList.push(observer)
  }

  removeObserver(observer) {
    const index = this.observerList.findIndex(o => o.name === observer.name)
    this.observerList.splice(index, 1)
  }

  notifyObservers(message) {
    const observers = this.observerList
    observers.forEach(observer => observer.notified(message))
  }
}
// 观察者
class Observer {
  constructor(name, subject) {
    this.name = name
    if(subject) {
      subject.addObserver(this)
    }
  }
  notified(message) {
    console.log(this.name, 'got message', message)
  }
}

const subject = new Subject()
const observerA = new Observer('observerA', subject)
const observerB = new Observer('observerB')
subject.addObserver(observerB)
subject.notifyObservers('hello from subject')
subject.removeObserver(observerA)
subject.notifyObservers('hello again')
```
### 2、发布订阅模式
```js
class PubSub {
  constructor() {
    this.messages = {}
    this.listeners = {}
  }
  // 添加发布者
  publish(type, content) {
    const existContent = this.messages[type]
    if(!existContent) {
      this.message[type] = []
    }
    this.message[type].push(content)
  }
  subscribe(type, cb) {
    const existListener = this.listeners[type]
    if(!existListener) {
      this.listeners[type] = []
    }
    this.listeners[type].push(cb)
  }

  // 通知
  notify(type) {
    const message = this.messages[type]
    const subscribes = this.listeners[type] || []
    subscribes.forEach((cb, index) => cb(messages[index]))
  }
}

// 发布者代码
class Publisher {
  constructor(name, context) {
    this.name = name
    this.context = context
  }
  publish(type, content) {
    this.context.publish(type, content)
  }
}

// 订阅者代码
class Subscriber {
  constructor(name, context) {
    this.name = name
    this.context = context
  }

  subscribe(type, cb) {
    this.context.subscribe(type, cb)
  }
}
// 代码使用
const TYPE_A = 'music'
const TYPE_B = 'movie'
const TYPE_C = 'novel'

const pubsub = new PubSub()
const publisherA = new Publisher('publisherA', pubsub)
publisherA.publish(TYPE_A, 'we are young')
publisherA.publish(TYPE_B, 'bbbb')
const publisherB = new Publiser('publisherB', pubsub)
publisherB.publish(TYPE_A, 'stronger')
const publisherC = new Publisher('publisherC', pubsub);
publisherC.publish(TYPE_C, 'a brief history of time');

const subscriberA = new Subscriber('subscriberA', pubsub);
subscriberA.subscribe(TYPE_A, res => {
  console.log('subscriberA received', res)
});
const subscriberB = new Subscriber('subscriberB', pubsub);
subscriberB.subscribe(TYPE_C, res => {
  console.log('subscriberB received', res)
});
const subscriberC = new Subscriber('subscriberC', pubsub);
subscriberC.subscribe(TYPE_B, res => {
  console.log('subscriberC received', res)
});

pubsub.notify(TYPE_A);
pubsub.notify(TYPE_B);
pubsub.notify(TYPE_C);
```

## 六、装饰器模式
在不改变原对象得基础上，对其进行包装扩展（添加属性或者方法），使原有对象可以满足用户更复杂需求
### 1）面向切面编程：把一些与核心业务逻辑无关的功能抽离出来，在通过“动态织入”方式参入业务模块中