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

