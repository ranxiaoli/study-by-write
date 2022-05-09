针对面试bd预判一些面试知识点

### 1、MVVM: 数据与UI分离的设计模式
- https://www.cnblogs.com/joyco773/p/14768877.html
- model-view-viewmodel: 通过数据劫持+订阅发布模式实现的
#### 1.1、 vue中v-model的实现原理: v-model是一个语法糖，包含两个步骤：通过v-bind绑定一个value; 通过v-on指令给当前元素绑定input事件
  - 组件中使用v-model实现
    ```html
    <input v-model="searchText"> 
    <!-- 等价于 -->
    <input :value="searchText" @input="searchText = $event.target.value" />
    ```
    ```js
    // 将其value atrribute绑定到一个名叫modelValue的prop上
    // 在其input事件被触发时，将新的值通过自定义的update:modelValue事件抛出

    export defalut {
      props: {
        cusVal: 'xxx'
      },
      setup(props, {emit}) {
        const changeInput(value) => {
          emit('update:cusVal', value)
        }
      }
    }
    ```
    ```vue
    <template>
      <input @input="changeInput" :value="cusVal"/>
    </template>
    ```
#### 1.1 MVVM源码【observer + proxy】
  - 资料地址： https://blog.csdn.net/i15730384741/article/details/106782390
  - 其他问题：
    - document.querySelector
    - document.createDocumentFragment()
    - RegExp.$1

### 2、Vue、React相关知识点
- 网址： https://blog.csdn.net/QXXXD/article/details/115352270
- 1、构建的 vue-cli 工程都到了哪些技术，它们的作用分别是什么？
    - webpack: 用来打包; vue: 工程核心,主要是MVVM和组件化;vue-router;vuex;axios
- 2、Vue常用的修饰符
    - v-model: lazy:光标离开input框的时候才会更新数据;trim:去掉首尾空格;number:限制只能输入数字
    - 事件修饰符：1）.stop: 阻止冒泡，event.stopPropagation();2）.prevent:阻止默认事件，event.preventDefault()；3）.self:只触发元素本身的方法；**4）.capture:事件的完整机制时捕获-目标-冒泡，事件触发时目标往外冒泡；5）.sync:对prop进行双向绑定**；.keyCode:监听按键的指令
- 3、vue事件中如何使用event对象？
    ```js
    <button @click="click($event, 233)">click me</button>
    ```
- 4、$nextTick使用场景：1）created中操作dom,要放到nextTick中；2）dom结构发生变化的时候，再nextTick中操作
- 5、v-if和v-for的优先级
  - **源码地址：src/compiler/codegen/index.js**
  ```js
      if (el.staticRoot && !el.staticProcessed) {
      return genStatic(el, state)
    } else if (el.once && !el.onceProcessed) {
      return genOnce(el, state)
    } else if (el.for && !el.forProcessed) {
      return genFor(el, state)
    } else if (el.if && !el.ifProcessed) {
      return genIf(el, state)
    } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
      return genChildren(el, state) || 'void 0'
    } else if (el.tag === 'slot') {
      return genSlot(el, state)
    } else {
        // ......
    }
  ```
  - v-for 要优先于v-if被解析，如果同时出现，则先循环再判断，每次消耗都会增大；所以使用的时候最好将v-if提到v-for的父元素上。
- 6、vue中子组件调用父组件的方法：1）子组件中抛出emit一个方法，回调到父组件中；2）通过this.$parent.event()来调用
- 7、vue中keep-alive的作用
  - 1）答案：缓存组件，避免第二次渲染；keep-alive的生命周期：created->mounted->activated,退出时deactivated,再次进入的时候只触发activated
  - 2）源码的实现逻辑
  - 3）对比react中为什么没有keep-alive
- 8、如何编写可服用的组件（vue, react)
  - 核心思想：高内聚，低耦合
  - 基本使用：props, events, slots
  - 原则：上下文无关；数据扁平化
- 9、vue更新数组时触发视图更新的方法
  - push(), pop(), shift(), unshift(), splice(), sort(), reverse()
  - 不更改：filter, concat(), slice()
- 10、解决非工程化项目初始化页面闪动的问题
  - v-cloak指令 + display: none
  ```
      [v-cloak] {
          display: none;
      }
  ```
- 11、v-model语法糖再组件中的使用
  ```js
    <input :value="cusVal" @input="inputHandle"/>
    inputHandle(val) {
        emit('upate:cusVal', val)
    }
  ```
- 12、Vue计算属性：它就是一个能够将计算结果缓存起来的属性（将行为转换成静态的属性）
- 13、vue弹窗后如何禁止滚动条滚动？
  ```js
  // 1、通过overflow: hidden实现
      //禁止滚动
      stop(){
          var mo=function(e){e.preventDefault();};
          document.body.style.overflow="hidden";
          document.addEventListener("touchmove",mo,false);//禁止页面滑动
      },
      
      /***取消滑动限制***/
      move(){
          var mo=function(e){e.preventDefault();};
          document.body.style.overflow="";//出现滚动条
          document.removeEventListener("touchmove",mo,false);
      }
  // 2、overflow: hidden, + css
      stop(){//禁止滑动限制
          var mo=function(e){e.preventDefault();};
          document.getElementsByTagName('body')[0].classList.add("sroll");; //设置为新的
          document.addEventListener("touchmove",mo,false);//禁止页面滑动
      },
      move(){//取消滑动限制
          var mo=function(e){e.preventDefault();};
          document.getElementsByTagName('body')[0].classList.remove("sroll"); //设置为新的
          document.removeEventListener("touchmove",mo,false);
      },
      // 样式
      body.sroll{
          overflow: hidden;
          position: fixed;
      }
  
  ```
- 14、自定义指令：directives
  - 基本： 1）钩子函数： created, beforeMount, mounted, beforeUpdate, updated, beforeUnmount, unmounted
  - demo
  - 实现原理； 源码
- 15、vue-router
- 1）**源码**
- 2）如何相应路由参数的变化？watch监听，导航守卫
- 3）解析流程：1）导航被触发；2）在失活的组件中调用离开守卫；3）调用全局的beforeEach守卫；4）在重用的组件里调用beforeRouteUpdate守卫；5）在路由配置里调用beforeEnter；6）解析异步路由组件；7）在被激活的组件里调用beforeRouterEnter；8）调用全局的beforeResolve守卫；9）导航被确认；10）调用全局的afterEach钩子；11）触发DOM更新；12）用创建好的实例调用beforeRouterEnter守卫中传给next的回调函数
- 4）有哪几种导航钩子：
    - 全局路由：前置守卫（beforeEach), 解析守卫（beforeResolve), 后置钩子（afterEach)
    - 路由守卫:路由的独享守卫（在配置文件中，beforeEnter)
    - 组件守卫:beforeRouterEnter, beforeRouteUpdate, beforeRouteLeave
- 5）路由懒加载：路由被访问时才加载对应的组件
    - 原理
    - 方式: require方式, ES6中的import()方式【常用】，webpack中的require.ensure方式
    ```js
    // 写法1：使用ADM风格的require
    const routers = [
        {
            path: '/',
            name: 'index',
            component: (resolve) => require(['./view/index.vue'], resolve)
        }
    ]
    // 写法2： 使用import
    const Index = () => import(/*webpackChunkName: "group-name"*/ '@/views/index')
    const routers = [
        {
            path: '/',
            name: 'index',
            component:=Index
    ]
    // 写法3：使用webpack特有的require.ensure
    const Index = r => require.ensure([], () => r(require('./views/index')),'group-name')
    const routers = [
        {
            path: '/',
            name: 'index',
            component: Index
        }
    ]
    // 4、把组件按组分块
    // require.ensure
    const Foo = r => require.ensure([], () => r(require('./Foo.vue')), 'group-foo')
    const Bar = r => require.ensure([], () => r(require('./Bar.vue')), 'group-foo')
    const Baz = r => require.ensure([], () => r(require('./Baz.vue')), 'group-foo')
    // import()
    const Foo = () => import(/* webpackChunkName: "group-foo" */ './Foo.vue')
    const Bar = () => import(/* webpackChunkName: "group-foo" */ './Bar.vue')
    const Baz = () => import(/* webpackChunkName: "group-foo" */ './Baz.vue')
    ```
- 100、其他问题：
  - 事件冒泡和之间捕获； .self如何实现；.once如何实现【addEventListener】
  - DOM2级事件, addEnventListener, removeEventListener
  - keep-alive实现原理，源码
  - e2e
  - pwa
  - react-router 懒加载

