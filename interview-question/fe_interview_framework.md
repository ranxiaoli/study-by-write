# 一、Vue
## 1、Vue基础
### 1）初识
### 2）模板
#### (1)列表循环
- 不推荐在同一元素上使用v-if和v-for
- 非要用，记住v-for的优先级高于v-if
#### (2)jsx
### 3）数据
#### (1) data为什么是一个函数？
```js
因为组件复用，只有每个组件实例维护一份独立拷贝，才会互不影响
```
### 4）事件&样式
### 5）组件
## 2、探索Vue的组件世界
### 1）自定义指令
```js
Vue.directive('test', {
    // 只调用一次，指令第一次绑定元素时调用；可以进行一次性的初始化设置
    bind: function(el, binding, vnode) {},
    // 被绑定元素插入父节点时调用；仅保证父节点存在，但不一定已被插入文档中
    insterted: function(el, binding, vnode) {},
    // 所有组件Vnode更新时调用，但是可能发生在其子Vnode更新之前；
    // 指令的值可能发生了变化，也可能没有
    // 但是可以通过比较更新前后的值来忽略不必要的模板更新
    update: function(el, binding, vnode, oldVnode) {},
    // 指令所在的组件的Vnode及其子Vnode全部更新后调用
    componentUpdate: function(el, binding, vnode, oldVnode) {},
    // 只调用一次，指令与元素解绑时调用
    upbind: function(el, binding, vnode) {}
})
```
### 2）双向绑定
#### (1) v-model
```vue
<template>
  <div>
    <input type="text" v-model="text"/>
    // v-model是下面的语法糖
    <input type="text" :value="text" @input="text=$event.target.value"></input>
  </div>
</template>
```
#### (2) .sync修饰符的双向绑定
- v-bind:msg
- v-on:update:msg
### 3) 组件设计
#### (1) slot
```vue
// 父组件
<template>
  <div>
    <child>
      <!-- 作用域插槽，任何没有被包裹在带有 v-slot 的 
      <template> 中的内容都会被视为默认插槽的内容 -->
        <template>
          <div>内容1</div>
        </template>

        <!-- 具名插槽 -->
				<template v-slot:header>
						<div>头部2</div>
				</template>

        <!-- 拿到slot内部组件的内容在父作用域显示 -->
         <template #main="{user}">
						<!--  v-slot:main="{user}" 简写#main="{user}"-->
						<div>{{user.name}}</div>
          </template>
      </child>
  </div>
</template>

// 子组件
<template>
  <div>
      <slot name="header"></slot>
    <!-- 为了让 user 在父级的插槽内容中可用
    ，我们可以将 user 作为 <slot> 元素的一个 attribute 绑定上去，
    绑定在 <slot> 元素上的 attribute 被称为插槽 prop -->
      <slot name="main" v-bind:user="user">laowang</slot>
      <!-- 一个不带 name 的 <slot> 出口会带有隐含的名字“default” -->
      <slot ></slot>
  </div>

</template>

<script>
export default {
  data () {
    return {
      user: {
        name: 'zhangsan',
        age: 18
      }
    }
  }

}
</script>
```
### 4）组件通信
- props,emit： 父子通信
- ref与$parent / $children/ .sync适用父子组件通信
- EventBus适用父子组件、隔代、兄弟组件通信
- $attrs/$listener 适用于隔代组件通信
```vue
// 父组件
<div>
		<child :foo="foo" @test="test"></child>
</div>
data(){
	return{
			foo:'我是父组件数据'
	}
}
methods:{
		test(){
				console.log('我是父组件事件')
		}
}
      
// 子组件
	<div>
			<grandson v-bind="$attrs" v-on="$listeners"></grandson >
	</div>

// 孙子组件
watch:{
	"attrs"(val){
			console.log(val) //{foo:"我是父组件数据"} 
	},
	"$listeners"(){
			this.$emit('test') //我是父组件事件
	}
}
```
- provide/inject适用于 隔代组件通信
- Vuex 适用于父子，隔代，兄弟组件通信
	- state
	- getter
	- mutation
	- action
	- module
### 5）插件： mixin， vue3已经弃用了
### 6）组件复用
- Mixin/hooks
- HOC
- Renderless组件
## 3、部分源码解析
### 1）nextTick(异步队列更新)
#### (1) 异步更新队列
```js
// 收集依赖
class Dep {
	constructor() {
		this.deps = []
	}
	depend(dep) {
		this.deps.push(dep)
	}
	notify() {
		const deps = this.deps.slice()
		for(let i=0; i<deps.length; i++) {
			deps[i]
		}
	}
}
// 将数据转换成响应式
function observe(obj) {
	const keys = Object.keys(obj)
	keys.forEach(item => {
		reactive(obj, item, obj[item])
	})
}
function reactive(obj, key, val) {
  val = data[key]
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    get: function () {
      if (update) {
        dep.depend(update)
      }
      return val
    },
    set: function (newVal) {
      val = newVal
      dep.notify()
    }
  })
}
// 更新函数
let update
function watch(fn) {
  update = fn
  update()
  update = null
}
var data = {
  age: '',
  name: ''
}

observe(data) //调用oserve
let str
watch((update) => {
  console.log('触发了更新函数')
  str = '我的姓名' + data.name + '年龄' + data.age
  document.getElementById('app').innerText = str
})
// 更改数据，触发视图更新
data.name = '张三'
data.age = 3
```

# 二、Vue2.0源码
## 1、前置条件
### 1）flow基本语法
### 2）原型与原型链
### 3）Object.defineProperty
### 4）Vnode概念
### 5）函数柯里化
### 6）宏任务和微任务
### 7）递归编程
### 8）编译原理基础知识
## 2、响应式
## 3、virtualDom和Diff

# 三、react
## 1、入门介绍
### 1）什么是react：用于构建用户界面的js库
### 2）React生态
- react-redux
- react-router
- dva
- antDesign
- styled-Component
- React-Native
- Taro
### 3）为什么选择react
- 组件化的开发构思，项目便于维护
- 只需要关注业务逻辑，高效快速更新DOM
- 海量的周边生态，友好的开发环境
## 2、步入react
## 3、React正篇
### 1）事件处理
### 2）认识state
### 3）State进阶
#### (1) 通过条件判断优化渲染
#### (2) 单一数据源
#### (3) 状态提升
#### (4) 为什么使用不可变数据
- 可回溯
- 跟踪数据改变
- 确定再react中何时重新渲染
```js
不可变性最主要的优势在于它可以帮助我们在react中创建Pure Components,我们可以轻松确定不可变数据是否发生了改变，
从而去诶定何时对组件进行重新渲染。
```
#### (5) 有状态组件和无状态组件
### 4）生命周期
### 5）React组件设计模式
#### (1) 高阶组件
#### (2) 函数作为子组件
## 4、React生态
### 1）React-Router
## 5、React原理
### 1）virtual Dom原理
### 2）React Reconciler
## 6、Redux状态管理
## 7、React高级实战
### 1）TypeScript实战上
#### (1) 设计原则
- 静态识别可能出现错误的代码结构
- 为大型应用的代码提供结构化机制
- 不增加程序运行时开销，保留js运行时行为这一特性
- 语言层面提供可组合性、可推理性
- 语法层面保持和ecmascript提案一致
- 不增加额外的表示层面的语法
#### (2) typescript基础
- ts 特点
```js
1、 跨平台，mac和window都支持
2、静态类型检测
3、可选的类型检测
4、面向对象
5、es6特性的支持
6、对DOM的支持
```
- 变量声明
```ts
const name: string = ''
const money: number = 60
const boolShow: boolean = false
const list: number[] = [1,2,3]
const list2: Array<number> = [1,2,3]
// 定义元组类型
const tuple: [number, string] = [1, 'nice']
// 枚举 Monday默认值为0，剩下的一次递增
enum DateEnum {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday
}
const date:DateEnum = DateEnum.Monday
const setValue: () => void = => {

}
function otherSetVal():void {

}
const simplevalue: any = 2
```
- 接口
```ts
interface Iprops {
  name: string,
  gender: number,
  address: string
}
const staff: Iprops = {
  name: 'zxf',
  gender: 1,
  address: 'chengdu'
}
function register(): Iprops {
  return {
    name: 'zxf',
    gender: 1,
    address: 'chengdu'
  }
}
```
- 类型别名-type
  - 类型别名用来给一个类型起一个新名字
  - 字符串字面量类型用来约束取值只能时某几个字符串中的一个
  - type可以扩展，但是不能继承
```ts
type Iprops = {
  name: string,
  gender: string,
  address: string
}
const staff: Iprops = {
  name:'zk',
  gender:1,
  address:'suzhou'
}
function register(): Iprops {
  return {
    name:'zk',
    gender:1,
    address:'suzhou'
  }
}
```
- 接口 VS 类型别名
  - 接口
  ```js
  1、可以继承，可以多态，接口的实现需要implements
  2、既是抽象也是约束
  3、优先使用
  ```
  - 类型别名
  ```js
  1、只是类型的别名，没有创建新的类型，扩展可以使用&实现
  2、主要时约束作用
  ```
- 类型断言
  - ts允许你覆盖它的判断，并且能以你想要的方式分析它，这种机制被称为类型断言
  - 通常用来手动指定一个值的类型
  - JSX不能使用<>
```ts
值 as 类型   |   <类型>值
interface Hello {
  sayHello: () => void,
  name: string
}
const a = {}
a.name = 'zs' // 没有定义类型，会提示类型“{}”上不存在属性“name”

// 使用类型断言
const a = {} as Hello
const a = <Hello> {}

```
- 泛型： 在定义函数、接口或者类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性
```ts
interface IGprops {
  setName:<T>(str:T) => void
}
const nameWrapper:IGprops = {
  setName:<T>(str:T) => {
    const userNameArr2: T[] = []
    userNameArr2.push(str)
  }
}

nameWrapper.setName('zs')
nameWrapper.setName(123)
```
### 2) ts实战下
#### (1) ts & React实战
### 3）React性能优化
#### (1) React组件性能探索： react devtools、react profiler api
#### (2) 组件性能优化
- PureComponent
- memo
- 原生事件、定时器的销毁
- 使用不变的数据结构
- 拆分文件
- 依赖优化
- React.Fragments用于避免多余的HTML元素
- 避免再渲染中使用内联函数定义
- 使用防抖节流
- 避免使用index作为map的key
- 避免用props初始组件的状态
- webpac使用mode
- 在Dom元素上传递props
- CSS动画替代JS动画
- CDN
- web workers API尝试
- 虚拟长列表
- 服务端渲染
- 在web服务器上启用Gzip压缩
- useMemo进行缓存大量计算，useCallback进行缓存函数，避免重复创建
- 惰性初始化
## 8、React hooks： https://hejialianghe.gitee.io/react/react-hooks.html#_8-2-react-hooks%E5%8E%9F%E7%90%86%E8%A7%A3%E6%9E%90



