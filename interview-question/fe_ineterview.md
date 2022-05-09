## 一、React
### 1、受控组件和非受控组件
  - 受控组件：UI操作控制这组件中的state的变化的组件，称之为受控组件。
  - 非受控组件：不是由state作为数据驱动的，比如在表单中通过DOM来传递数据的，叫做非受控组件
  - **如何实现受控组件？？？**

### 2、高阶组件
  - 地址： https://juejin.cn/post/6940422320427106335#comment

### 3、react的生命周期
  - 优化主要在哪个钩子，怎么做？
    ``` 
    // shouldComponentUpdate(nextProps, nextState) 性能优化
    ```

### 4、Refs转发：将ref自动通过组件传递到其一子组件的技巧
- 转发refs到DOM组件
```js
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">{props.children}</button>
))
```
- 在高阶组件中转发refs
```jsx
  function logProps(WrappedComponent) {
    class LogProps extends React.Component {s
      componentDidUpdate(prevProps) {
        console.log('old props:', prevProps);
        console.log('new props:', this.props)
      }
      render() {
        return <WrappedComponent {...this.props}>
      }
    }
    return LogProps
  }

  class FancyButton extends React.Component {
    focus() {
      // ...
    }

    // ...
  }

  // 我们导出 LogProps，而不是 FancyButton。
  // 虽然它也会渲染一个 FancyButton。
  export default logProps(FancyButton);
```
```js
import FancyButton from './FancyButton';

const ref = React.createRef();
// 我们导入的 FancyButton 组件是高阶组件（HOC）LogProps。
// 尽管渲染结果将是一样的，
// 但我们的 ref 将指向 LogProps 而不是内部的 FancyButton 组件！
// 这意味着我们不能调用例如 ref.current.focus() 这样的方法
<FancyButton
  label="Click Me"
  handleClick={handleClick}
  ref={ref}
/>
```
用forwardRef解决这类问题
```js
function logProps(WrappedComponent) {
  class LogProps extends React.Component {s
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps)
      console.log('new props:', this.props)
    }
    render() {
      const {forwardedRef, ...rest} = this.props
      return <WrappedComponent ref={forwardedRef} {...this.props}>
    }
  }
  return React.forwardRef((props, ref) => <LogProps forwardedRef={ref} prps={...props}/>)
}

const WrappedComponent = React.forwardRef((props, ref) => {
  return <LogProps {...props} forwardedRef={ref} />;
});
```

### 5、react性能优化的方法
  - 1) React.memo 缓存组件
  ```js
    export default React.memo((props) => {
      return (
        <div>{props.value}</div>
      )
    })
  ```
  - 2) useMemo 缓存大量计算
    ```js
      // 避免这样做
      function Component(props) {
        const someProp = heavyCalculation(props.item)
        return <AnotherComponent someProp={sompeProp}>
      }

      // 只有`props.item`改变时someProp值才会被重新计算
      funtion Component(props) {
        const someProp = useMemo(() => heavyCalculation(props.item), [props.item])
        return <AnotherComponent someProp={sompeProp}>
      }
    ```
    - useCallback： 返回一个memoized函数，相当于useMemo(() => fn, deps)

  - 3) React.PureComponent, shouldComponentUpdate
    - 父组件状态的每次更新，都会导致子组件的重新渲染，即使是传入相同props。但是这里的重新渲染不是说会更新DOM,而是每次都会调用diif算法来判断是否需要更新DOM。这对于大型组件例如组件树来说是非常消耗性能的。
    - PureComponent会进行浅比较来判断组件是否应该重新渲染，对于传入的基本类型props，只要值相同，浅比较就会认为相同，对于传入的引用类型props，浅比较只会认为传入的props是不是同一个引用，如果不是，哪怕这两个对象中的内容完全一样，也会被认为是不同的props。
    - 需要注意的是在对于那些可以忽略渲染时间的组件或者是状态一直变化的组件则要谨慎使用PureComponent，因为进行浅比较也会花费时间，这种优化更适用于大型的展示组件上。大型组件也可以拆分成多个小组件，并使用memo来包裹小组件，也可以提升性能。
  
  - 4) 避免使用内联对象
    使用内联对象时，react会在每次渲染时重新创建对此对象的引用，这会导致接收此对象的组件将其视为不同的对象,因此，该组件对于prop的浅层比较始终返回false,导致组件一直重新渲染。

  - 5) 避免使用匿名函数
    ```js
    // 避免这样做
    function Component(props) {
      return <AnotherComponent onChange={() => props.callback(props.id)} />  
    }
    // 优化方法一
    function Component(props) {
      const handleChange = useCallback(() => props.callback(props.id), [props.id])
      return <AnotherComponent onChange={handleChange} />
    }
    // 优化方法二
    class Component extends React.Component {
      handleChange = () => {
        this.props.callback(this.props.id)
      }
      render() {
        return <AnotherComponent onChange={this.handleChange} />
      }
    }
    ```
    6) **延迟加载不是立即需要的组件： React.lazy 和React.Suspense**
    ```js
      const MUITooltip = React.lazy(() => import('@material-ui/core/Tooltip'))
      function Tooltip({children, title}) {
        return (
          <React.Suspense fallback={children}>
            <MUITooltip title={title}>
              {children}
            </MUITooltip>
          </React.Suspense>
        )
      }

      function Component(props) {
        return (
          <Tooltip title={props.title}>
            <AnotherComponent />
          </Tooltip>
        )
      }
    ```
    7) 调整CSS而不是强制组件加载和卸载
      渲染成本很高，尤其是在需要更改DOM时。每当你有某种手风琴或标签功能，例如想要一次只能看到一个项目时，你可能想要卸载不可见的组件，并在它变得可见时将其重新加载。如果加载/卸载的组件“很重”，则此操作可能非常消耗性能并可能导致延迟。在这些情况下，最好通过CSS隐藏它，同时将内容保存到DOM。
    8) 使用React.Fragment避免添加额外的DOM


### 6、react-redux
#### 1） Redux原理
- state： 数据集
- action： 改变state的指令
- reducer： action发出命令后将state放入reducer加工函数中，返回新的state
- store： 
  ```js
    // 1) 维持应用的 state；
    // 2) 提供 getState() 方法获取 state；
    // 3) 提供 dispatch(action) 方法更新 state；
    // 4) 通过 subscribe(listener) 注册监听器;
    // 5) 通过 subscribe(listener) 返回的函数注销监听器。

    
    const redux = require('redux')
    const initState = {
      counter: 0
    }
    // 创建reducer
    const reducer = (state = initState, action) => {
      switch (action.type) {
        case "INCREMENT":
          return {...state, counter: state.counter + 1};
        case "DECREMENT":
          return {...state, counter: state.counter - 1};
        case "ADD_NUMBER":
          return {...state, counter: state.counter + action.number}
        default: 
          return state;
      }
    }
    // 根据reducer创建store
    const store = redux.createStore(reducer)
    store.subscribe(() => {
      console.log(store.getState())
    })

    // 修改store的state
    store.dispatch({
      type: 'INCREMENT'
    })
    store.dispatch({
      type: "DECREMENT"
    })
    store.dispatch({
      type: "ADD_NUMBER",
      number: 5
    })
  ```
#### 2） react-redux 核心
  - 1) Provider store; connect([mapStateProps], [mapDispatchToProps], [mergeProps], [options])
  Provider 内的任何一个组件（比如这里的 Comp），如果需要使用 state 中的数据，就必须是「被 connect 过的」组件——使用 connect 方法对「你编写的组件（MyComp）」进行包装后的产物。
  这个函数允许我们将 store 中的数据作为 props 绑定到组件上。
  - 2) react-redux中的connect方法将store上的getState 和 dispatch 包装成组件的props。
  ```js
  // index.js
  import React, { Component } from 'react';
  import store from '../store';
  import actions from '../store/actions/list';
  import { connect } from 'react-redux';

  class Todos extends Component {
    render(){
        return(
            <div onCLick={()=>this.props.del_todo() }>test</div>
        )
    }
  }
  export default connect(state => state, actions)(Todos)
  ```

  

  ```js
  // reduecer.js 操作state
  export default function (state = { lists: [{text:'移动端计划'}],newType:'all'}, action) {
    switch (action.type) {
      case types.ADD_TODO:
        return {...state,lists:[...state.lists,{text:action.text}]}
      case types.TOGGLE_TODO:
        return {...state,lists:state.lists.map((item,index)=>{
          if(index == action.index){
            item.completed = !item.completed
          }
          return item
        })}
      case types.DEL_TODO:
        return {...state,lists:[...state.lists.slice(0,action.index),...state.lists.slice(action.index+1)]}
      case types.SWITCH_TYPE:
        console.log({...state,newType:action.newType})
        return {...state,newType:action.newType}
      default:
        return state;
    }
  }
  ```
  ```js
  // 更改后的的index.js
   class Todos extends Component {
    render(){
      return(
        {
          + <ul>
          +   this.props.state.lists.map(list =>(
          +     <li>{list.text}</li>
          +   ))
          + </ul>
        }
        <div onCLick={()=>this.props.del_todo() }>test</div>
      )
    }
  }

  export default connect(state => state, actions)(Todos)
  ```
  -3) mapDispatchToProps(dispatch, ownProps): connect的第二参数， 将action作为props绑定到MyComp上
  ```js
  // actions
  import * as types from "../action-types";
  export default{
    add_todo(text){
        return { type: types.ADD_TODO, text: text}
    },
    del_todo(idx){
        return {type:types.DEL_TODO, index: idx}
    },
    toggle_todo(index){
        return {type:types.TOGGLE_TODO, index}
    },
    del_todo(index){
        return {type:types.DEL_TODO, index}
    },
    switch_type(newType){
        return {type:types.SWITCH_TYPE, newType}
    }
  }
  ```
  ```
  // 使用时
    <div onClick={()=>this.props.del_todo() }>test</div>
  ```
#### 3） connect方法：接受4个参数
  - mapStateToProps: [mapStateToProps(state, [ownProps]): stateProps] (Function)
    ```js
    state => ({
      count: state.counter.count
    })

    // or
    const mapStateToProps = (state) => {
      return ({
        count: state.counter.count
    })}
    ```
  - mapDispatchToProps: [mapDispatchToProps(dispatch, [ownProps]): dispatchProps] (Object or Function)
  ```js
    dispatch => ({
      login: (...args) => dispatch(loginAction.login(..args)),
    })

    // or
    const mapDispatchToProps = (dispatch, ownProps) => {
      return {
        increase: (...args) => dispatch(actions.increase(...args)),
        decrease: (...args) => dispatch(actions.decrease(...args))
      }
    }
  ```
  - mergeProps: [mergeProps(stateProps, dispatchProps, ownProps): props] (Function)
  - options
#### 4） connect原理简化版
```js
import React,{Component} from 'react';
import {bindActionCreators} from 'redux';
import propTypes from 'prop-types';

export default function(mapStateToProps,mapDispatchToProps){
   return function(WrapedComponent){
      class ProxyComponent extends Component{
          static contextTypes = {
              store:propTypes.object
          }
          constructor(props,context){
            super(props,context);
            this.store = context.store;
            this.state = mapStateToProps(this.store.getState());
          }
          componentWillMount(){
              this.unsubscribe = this.store.subscribe(()=>{
                  this.setState(mapStateToProps(this.store.getState()));
              });
          }
          componentWillUnmount(){
              this.unsubscribe();
          }
          render(){
              let actions= {};
              if(typeof mapDispatchToProps == 'function'){
                actions = mapDispatchToProps(this.store.disaptch);
              }else if(typeof mapDispatchToProps == 'object'){
                  console.log('object', mapDispatchToProps)
                actions = bindActionCreators(mapDispatchToProps,this.store.dispatch);
              }
                return <WrapedComponent {...this.state} {...actions}/>
         }
      }
      return ProxyComponent;
   }
}

```

### 7、dva
#### 1) 基础知识
```js
// 典型例子
app.model({
  namespace: 'todo',
  state: [],
  reducers: {
    add(state, { payload: todo }) {
      // 保存数据到 state
      return [...state, todo];
    },
  },
  effects: {
    *save({paload: todo}, {put, call}) {
      // 调用 saveTodoToServer，成功后触发 `add` action 保存到 state
      yield call(saveTodoToServer, todo)
      yield put({type: 'add', payload: todo})
    }
  },
  // 用于订阅一个数据源，执行对应的dispatch, 数据源可以是当前的时间，服务器的websocket, keyboard, geolocaiton, history变化等等，那么sessionStorage应该也是可以的？
  subscriptions: {
    setup({history, dispatch}) {
      return history.listen(({pathname}) => {
        if(pathname === '/') {
          dispatch({type: 'load'})
        }
      })
    }
  }
})
```
model中包含5个属性： namespace, state, reducers, effects, subscriptions

#### 2) 使用
```js
// 1、UI
import React from 'react';
import PropTypes from 'prop-types';
import { Table, Popconfirm, Button } from 'antd';

const ProductList = ({ onDelete, products }) => {
  const columns = [{
    title: 'Name',
    dataIndex: 'name',
  }, {
    title: 'Actions',
    render: (text, record) => {
      return (
        <Popconfirm title="Delete?" onConfirm={() => onDelete(record.id)}>
          <Button>Delete</Button>
        </Popconfirm>
      );
    },
  }];
  return (
    <Table
      dataSource={products}
      columns={columns}
    />
  );
};

ProductList.propTypes = {
  onDelete: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
};

export default ProductList;

// 2、定义model
export default {
  namespace: 'products',
  state: [],
  reducers: {
    'delete'(state, {paylod: id}) {
      return state.filter(item => item.id !== id)
    }
  }
}

// 3、在index.js里面载入他
app.model(require('./models/products').default)

// 4、通过connect连接起来，就是react-redux的connect
import React from 'react'
import { Connect } from 'dva'
import ProductList from './components/ProductList'

const Products = ({dispatch, products}) => {
  function handleDelete(id) {
    dispatch({
      type: 'products/delete',
      payloda: id
    })
  }
  return (
    <div>
      <h2>List of Products</h2>
      <ProductList onDelete={handleDelete} products={products} />
    </div>
  )
}
export default connect(({products}) => ({
  products
}))(Products)
```

### 8、mbox

### 9、react引入css方式有哪几种？区别？
#### 1）方式
- 在组件内直接使用
  ```jsx
  import React, { Component } from "react";

  const div1 = {
    width: "300px",
    margin: "30px auto",
    backgroundColor: "#44014C",  //驼峰法
    minHeight: "200px",
    boxSizing: "border-box"
  };

  class Test extends Component {
    constructor(props, context) {
      super(props);
    }
  
    render() {
      return (
      <div>
        <div style={div1}>123</div>
        <div style={{backgroundColor:"red"}}>
      </div>
      );
    }
  }

  export default Test;
  ```
- 组件中引入.css文件: 这种方式样式是全局生效，样式之间会互相影响
  ```css
  /* App.css */
  .title {
    color: red;
    font-size: 20px;
  }

  .desc {
    color: green;
    text-decoration: underline;
  }
  ```
  ```jsx
  import React, { PureComponent } from 'react';

  import Home from './Home';

  import './App.css';

  export default class App extends PureComponent {
    render() {
      return (
        <div className="app">
          <h2 className="title">我是App的标题</h2>
          <p className="desc">我是App中的一段文字描述</p >
          <Home/>
        </div>
      )
    }
  }
  ```
- 组件中引入.module.css文件
- CSS in JS
  ```js
  // 创建style.js文件用于存放组件样式
  export const SelfLink = styled.div`
    height: 50px;
    border: 1px solid red;
    color: yellow;
  `;

  export const SelfButton = styled.div`
    height: 150px;
    width: 150px;
    color: ${props => props.color};
    background-image: url(${props => props.src});
    background-size: 150px 150px;
  `;

  // 引入样式组件
  import React, { Component } from "react";

  import { SelfLink, SelfButton } from "./style";

  class Test extends Component {
    constructor(props, context) {
      super(props);
    }  
  
    render() {
      return (
      <div>
        <SelfLink title="People's Republic of China">app.js</SelfLink>
        <SelfButton color="palevioletred" style={{ color: "pink" }} src={fist}>
            SelfButton
          </SelfButton>
      </div>
      );
    }
  }

  export default Test;
  ```

### 10、说说对React的理解，有哪些特性？
#### 1）特性
- JSX语法
- 单向数据流
- 虚拟DOM
- 声明式编程：是一种变成范式，它关注的式你要做什么，而不是如何做
- Component：在React中，一切皆为组件，通常将应用逻辑分为小的单个组件，

### 11、说说React中的setState执行机制
用来改变state的值的
#### 1）更新类型
- 同步更新
- 异步更新


### 12、说说React的事件机制
#### 1）总结
  - React上注册的事件最终会绑定到document这个Dom上，而不是React组件对应的DOM(减少内存的开销，就是因为所有的事件都绑定在document上，其他节点没有当定事件)
  - React自身实现一套事件冒泡机制，所以这也就是为什么我们event.stopPropation()无效的原因
  - React通过队列的形式，从触发组件向父组件回溯，然后调用他们JSX中定义的callback
  - React有一套自己的合成事件SyntheticEvent

### 13、React事件绑定的方式有哪些？区别
#### 1）render方法中使用bind
```jsx
class App extends React.Component {
  handleClick() {
    console.log('this > ', this);
  }
  render() {
    return (
      <div onClick={this.handleClick.bind(this)}>test</div>
    )
  }
}
// 这种方式在组件每次render渲染的时候，都会重新进行bind，影响性能
```
#### 2）render方法中使用箭头函数
```jsx
class App extends React.Component {
  handleClick() {
    console.log('this > ', this);
  }
  render() {
    return (
      <div onClick={(e) => this.handleClick(e)}>test</div>
    )
  }
}
// 同上，每次render，都要bind， 影响性能
```
#### 3）constructor中bind
```jsx
class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    console.log('this > ', this);
  }
  render() {
    return (
      <div onClick={this.handleClick}>test</div>
    )
  }
}
```
#### 4）定义阶段使用箭头函数绑定
```jsx
class App extends React.Component {
  constructor(props) {
    super(props);
  }
  handleClick = () => {
    console.log('this > ', this);
  }
  render() {
    return (
      <div onClick={this.handleClick}>test</div>
    )
  }
}

```

### 14、React构建组件的方式有哪些？区别？
#### 1）如何构建
- 函数式构建
- 通过React.createClass方法构建
  ```jsx
  // 基本上不用
  function HelloComponent(props) {
    return React.createElement("div", null, "Hello ", props.name)
  }
  ```
- 继承React.Component构建

### 15、React组件中的通信
- 父组件向子组件传递： 属性
- 子组件向父组件传递： 事件
- 兄弟组件之间的通信： 利用同一个父组件，进行数据的传递
- 父组件向后代组件的传递： Context
- 非关系组件传递： Redux， mbox， dva

### 16、类组件和函数组件
#### 1）区别
- 编写形式
- 状态管理
- 生命周期
- 调用方式
  ```jsx
    // 1) 函数组件: 直接调用
    function sayHi() {
      return <p>Hello, React</p>
    }
    const result = sayHi()

    // 2) 类组件
    class SayHi extends React.Component {
      constructor() {
        super(props)
      }
      render() {
        return <p>Hello, React</p>
      }
    }
    // React内部 
    const instance = new SayHi(props) // » SayHi {} 
    const result = instance.render() // » <p>Hello, React</p >
  ```
- 获取渲染的值

### 17、React Router有几种模式？实现原理
#### 1）hash模式: 通过hashchange监听url的变化，从而进行dom操作来模拟跳转
```js
import React, { Component } from 'react'
import Provider from './context'

class HashRouter extends Component {
  constructor() {
    super()
    this.state = {
      location: {
        pathname: window.location.hash.slice(1) || '/'
      }
    }

    componentDidMount() {
       window.location.hash = window.location.hash || '/' // ???
       window.addEventListener('hashchange', () => {
         this.setState({
           location: {
             ...this.state.location,
             pathname: window.location.hash.slice(1) || '/'
           }
         }, () => console.log(this.state.location))
       })
    }

    render(){
      let value = {
        location: this.state.location
      }
      return (
        <Provider value={value}>{this.props.children}</Provider>
      )
    }
  }
}
export default HashRouter
```
```js
import React, { Component } from 'react';
import { Consumer } from './context'
const { pathToRegexp } = require("path-to-regexp");
class Route extends Component {
  render() {
    return (
      <Consumer>
        {
          state => {
            console.log(state)
            let {path, component: Component} = this.props
            let pathname = state.location.pathname
            let reg = pathToRegexp(path, [], {end: false})
            // 判断当前path是否包含pathname
            if(pathname.match(reg)) {
              return <Component></Component>
            }
            return null
          }
        }
      </Consumer>
    )
  }
}
export default Route
```
#### 2）history模式

### 18、说说你对immutable的理解，如何应用在React项目中？
#### 1）是什么？
对Immutable对象的任何修改或删除操作，都会返回一个新的Immutable对象， 其实现原理是数据持久化
- 用一种数据结构来保存数据
- 当数据被修改时，会返回一个对象，但是新的对象会尽可能的利用之前的数据结构而不会对内存造成浪费

### 19、说说React render方法的原理，在什么时候会被触发？
#### 1）触发时机
- 类组件|函数组件的state改变
- 类组件|函数组件的重现渲染
#### 2）总结
- render函数里面可以写jsx，转换成createElement这种形式，用于生成虚拟dom，最终转化成真是dom
- 在React中，类组件只要执行了setState方法，就一定会触发render函数的执行；函数组件使用useState更改状态不一定导致重新render
- 组件的props改变了，不一定触发render函数的执行，但是如果props的值来自于父组件或者祖先组件的state，这种情况下父组件或者祖先组件的state发生改变，就会导致子组件的重新渲染。
#### 1） 原理

### 20、说说React diff的原理是什么？
#### 1）是什么？
diff算法就是更高效地通过对比新旧Virtual Dom来找出真正的DOM变化之处。
#### 2）原理
- tree层：DOM节点跨层级不做优化，只会对相同层级的节点进行比较；只有删除、创建，没有移动操作
- component层：如果是同一个类组件，则会继续diff运算，如果不是同一个类组件，那么直接删除这个组件下的所有子节点，创建新的
- element层


### 21、说说对Fiber架构的理解，解决了什么问题？
#### 1）问题
JS线程引擎和GUI渲染引擎是互斥的，换而言之，其中一个在执行，那么另外一个就只能挂起，这就会导致React15在渲染大量数据的时候，出现卡顿的问题：他必须得等到VDOM计算完成之后，才会去做渲染工作。
#### 2）是什么： 算法
- 为每个增加了优先级， 优先级高的任务可以中断优先级低的任务，然后在重新，注意是重新执行优先级低的任务
- 增加了异步任务，调用requestIdleCallback api, 浏览器空闲的时候执行
- dom diff树变成了链表，一个dom对应连个fiber，对应两个队列，这都是为了找到被中断的任务，重新执行。
从架构角度来看，Fiber是对React核心算法（即调和过程）的重写
从编码角度来看，Fiber是React内部所定义的一种数据结构，它是Fiber树结构的节点单位，也就是React16新架构的虚拟DOM
```ts
type Fiber = {
  // 用于标记fiber的WorkTag类型，主要表示当前fiber代表的组件类型如FunctionComponent、ClassComponent等
  tag: WorkTag,
  // ReactElement里面的key
  key: null | string,
  // ReactElement.type，调用`createElement`的第一个参数
  elementType: any,
  // The resolved function/class/ associated with this fiber.
  // 表示当前代表的节点类型
  type: any,
  // 表示当前FiberNode对应的element组件实例
  stateNode: any,

  // 指向他在Fiber节点树中的`parent`，用来在处理完这个节点之后向上返回
  return: Fiber | null,
  // 指向自己的第一个子节点
  child: Fiber | null,
  // 指向自己的兄弟结构，兄弟节点的return指向同一个父节点
  sibling: Fiber | null,
  index: number,

  ref: null | (((handle: mixed) => void) & { _stringRef: ?string }) | RefObject,

  // 当前处理过程中的组件props对象
  pendingProps: any,
  // 上一次渲染完成之后的props
  memoizedProps: any,

  // 该Fiber对应的组件产生的Update会存放在这个队列里面
  updateQueue: UpdateQueue<any> | null,

  // 上一次渲染的时候的state
  memoizedState: any,

  // 一个列表，存放这个Fiber依赖的context
  firstContextDependency: ContextDependency<mixed> | null,

  mode: TypeOfMode,

  // Effect
  // 用来记录Side Effect
  effectTag: SideEffectTag,

  // 单链表用来快速查找下一个side effect
  nextEffect: Fiber | null,

  // 子树中第一个side effect
  firstEffect: Fiber | null,
  // 子树中最后一个side effect
  lastEffect: Fiber | null,

  // 代表任务在未来的哪个时间点应该被完成，之后版本改名为 lanes
  expirationTime: ExpirationTime,

  // 快速确定子树中是否有不在等待的变化
  childExpirationTime: ExpirationTime,

  // fiber的版本池，即记录fiber更新过程，便于恢复
  alternate: Fiber | null,
}
```
#### 3）如何解决
- Fiber把渲染更新过程拆分成多个子任务，每次只做一小部分，做完看是否还有剩余时间，如果有继续执行下一个任务，如果没有，挂起当前任务，将时间控制权交给主线程，等主线程不忙的时候再继续执行。
- window.requestIdleCallback()

### 22、说说React JSX转换成真是DOM的过程？
#### 1）是什么？
#### 2）总结
- 使用React.createElment或JSX编写React组件，实际上所有的JSX代码最后都会转换成React.createElement(),Babel会帮我们完成这个过程
- createElement函数对key和ref等特殊的props进行处理，并获取defaultProps对默认的props进行赋值，并且对传入的孩子节点进行处理，最终构造成一个虚拟的DOM对象
- ReactDOM.render将生成好的虚拟DOM渲染到指定容器上，其中采用了批处理、事物等待机制并对特定浏览器进行了性能优化，最终转换成真实的DOM

### 23、说说React优化手段有哪些？
#### 1）避免使用内联函数
#### 2）使用React.Fragment避免额外标记
#### 3）使用Immutable
#### 4）懒加载组件
#### 5）事件绑定方式
#### 6）服务端渲染

### 24、React项目是如何捕获异常的？
#### 1）如何做
- 形成错误边界有两个条件
  - static getDerivedStateFromError()
  - componentDidCatch()
  ```jsx
  class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        hasError: false
      }
    }
    static getDerivedStateFromError(err) {
      // 更新 state 使下一次渲染能够显示降级后的 UI
      return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
      // 你同样可以将错误日志上报给服务器
      logErrorToMyService(error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        // 你可以自定义降级后的 UI 并渲染
        return <h1>Something went wrong.</h1>;
      }

      return this.props.children;
    }
  }

  // 
  <ErrorBoundary>
    <MyWidget />
  </ErrorBoundary>
  ```
- try...catch
- onerror
```js
window.addEventListener('error', function(event){})
```

### 25、说说React服务器渲染怎么做？原理是什么？
#### 1）是什么？
由服务侧完成页面的HTML结构的拼接技术，发送到浏览器，然后为其绑定状态和事件，成为完全可以交互的页面
#### 2）如何做？
- 手动搭建一个SSR框架
- 使用成熟的SSR框架，如nextjs
#### 3）手动搭建一个SSR框架
```js
// 1）通过express启动一个app.js文件
const express = require('express')
const app = express()
app.get('/', (req, res) => res.send(`
<html>
   <head>
       <title>ssr demo</title>
   </head>
   <body>
       Hello world
   </body>
</html>
`))

app.listen(3000, () => console.log('Exampleapp listening on port 3000!'))

```

```js
// 2）在服务器中写react代码，在app.js中进行引用
import React from 'react'

const Home = () => {
  return <div>Home</div>
}
export default Home
```

```js
// 3）让服务器能够识别JSX，需要用webpack对项目进行一个大包转换，创建一个webpack.server.js
const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  target:'node',
  mode:'development',           //开发模式
  entry:'./app.js',
  output: {                     //打包出口
    filename:'bundle.js',     //打包后的文件名
    path:path.resolve(__dirname,'build')    //存放到根目录的build文件夹
  },
  externals: [nodeExternals()],  //保持node中require的引用方式
  module: {
    rules: [{                  //打包规则
      test:   /\.js?$/,       //对所有js文件进行打包
      loader:'babel-loader',  //使用babel-loader进行打包
      exclude: /node_modules/,//不打包node_modules中的js文件
      options: {
        presets: ['react','stage-0',['env', { //loader时额外的打包规则,对react,JSX，ES6进行转换
          targets: {
            browsers: ['last 2versions']   //对主流浏览器最近两个版本进行兼容
          }
        }]]
      }
    }]
  }
}
```

```js
// 4）借助react-dom提供了服务器端渲染的renderToString方法，负责把React组件解析成html
import express from 'express'
import React from 'react'
import { renderToString } from 'react-dom/server'//引入renderToString方法
import Home from'./src/containers/Home'
const app = express()
// 5）使用express提供的static中间件，将所有静态文件的路由执行public文件夹
app.use(express.static('public'))
const content = renderToString(<Home />)
app.get('/', (req, res) => res.send(`
<html>
   <head>
       <title>ssr demo</title>
   </head>
   <body>
       ${content}
   </body>
</html>
`))

app.listen(3001, () => console.log('Exampleapp listening on port 3000!'))
```

```js
// 6）新建webpack.client.js作为客户端React代码的webpack配置文件
const path = require('path')                    //node的path模块

module.exports = {
  mode:'development',                         //开发模式
  entry:'./src/client/index.js',              //入口
  output: {                                   //打包出口
    filename:'index.js',                    //打包后的文件名
    path:path.resolve(__dirname,'public')   //存放到根目录的build文件夹
  },
  module: {
    rules: [{                               //打包规则
      test:   /\.js?$/,                    //对所有js文件进行打包
      loader:'babel-loader',               //使用babel-loader进行打包
      exclude: /node_modules/,             //不打包node_modules中的js文件
      options: {
        presets: ['react','stage-0',['env', {     
          //loader时额外的打包规则,这里对react,JSX进行转换
          targets: {
              browsers: ['last 2versions']   //对主流浏览器最近两个版本进行兼容
          }
        }]]
      }
    }]
  }
}
```

```js
// 7）做完初始化渲染的时候，一个应用会存在路由的情况
import React from 'react'                   //引入React以支持JSX
import { Route } from 'react-router-dom'    //引入路由
import Home from './containers/Home'        //引入Home组件

export default (
  <div>
    <Route path="/" exact component={Home}></Route>
  </div>
)
```

```js
// 8）可以通过index.js引用路由信息
import React from 'react'
import ReactDom from 'react-dom'
import { BrowserRouter } from'react-router-dom'
import Router from'../Routers'

const App= () => {
  return (
    <BrowserRouter>
      {Router}
    </BrowserRouter>
  )
}

ReactDom.hydrate(<App/>, document.getElementById('root'))
```

```js
// 9）
import express from 'express'
import React from 'react'//引入React以支持JSX的语法
import { renderToString } from 'react-dom/server'//引入renderToString方法
import { StaticRouter } from 'react-router-dom'
import Router from '../Routers'
 
const app = express()
app.use(express.static('public'));
//使用express提供的static中间件,中间件会将所有静态文件的路由指向public文件夹

app.get('/',(req,res)=>{
    const content  = renderToString((
        //传入当前path
        //context为必填参数,用于服务端渲染参数传递
        <StaticRouter location={req.path} context={{}}>
           {Router}
        </StaticRouter>
    ))
    res.send(`
   <html>
       <head>
           <title>ssr demo</title>
       </head>
       <body>
       <div id="root">${content}</div>
       <script src="/index.js"></script>
       </body>
   </html>
    `)
})


app.listen(3001, () => console.log('Exampleapp listening on port 3001!'))
```

## 二、javascript， ES6
  ### 1.bind第一个参数传null会有什么问题
  第一个参数传null的话不改变this的指向
  #### 1） call, apply, bind
  - 都是改变函数执行的上下文
  - apply(this, args: Array)
  - call(this, arg1, arg2, [, arg3, arg4])
  - bind(this, arg1, arg2, [, arg3, arg4]): 不会立即执行
  - 小结：
    - 三个都是可以改变函数的作用域
    - 三个的第一次参数都是this要指向的对象，如果没有或者为null、undefine的，则默认指向全局window对象
    - bind不会立即执行，是永久改变; 而applay、call会立即执行，只改变一次
    - bind可以多次传入参数，而apply，call只会传一次
    - 传参形式：bind(context, xx, xxx, xx), call(context, xx, xxx, xxxx), apply(context, [xx, xxxx, xxxx,])
  ```js
  // 方式一：只在bind中传递函数参数
  fn.bind(obj,1,2)()
  // 方式二：在bind中传递函数参数，也在返回函数中传递参数
  fn.bind(obj,1)(2)
  ```
  #### 2) 实现bind
  ```js
  Function.prototype.myBind = function(context) {
    if(typeof this !== "funciton") {
      throw new TypeError("Error");
    }
    // 获取参数
    const args = [...arguments].slice(1), fn = this
    return function Fn() {
      // this instanceof Fn
      return fn.apply(this instanceof Fn ? new fn(...arguments): context, args.concat(...arguments))
    }
  }
  ```

  ### 2、预编译
  #### 1） 预编译公式
    JS的声明和执行是分开的，声明属于预编译环节
    - 创建GO/AO对象
    - 找形参和变量声明，将变量和形参名作为AO的属性名，值为undefined
    - 将实参值和形参统一
    - 在函数体里面找函数声明，值赋予函数体

  ### 3、函数作用域，作用域链
  - 自己理解： 
    - 作用域就是函数+变量的结合，形成一个作用域
    - 作用域链：在嵌套的作用域中，内部作用域逐层向外部作用域寻找，就形成了作用域链
  - 作用域分类
    - 全局作用域
    - 局部作用域
    - 块级作用域

  创建函数的时候，已经声明了当前函数的作用域==>当前创建函数所处的上下文。如果是在全局下创建的函数就是[[scope]]:EC(G)，函数执行的时候，形成一个全新的私有上下文EC(FN)，供字符串代码执行(进栈执行)

  定义：简单来说作用域就是变量与函数的可访问范围，由当前环境与上层环境的一系列变量对象组成

  1.全局作用域：代码在程序的任何地方都能被访问，window 对象的内置属性都拥有全局作用域。
  2.函数作用域：在固定的代码片段才能被访问

  作用：作用域最大的用处就是隔离变量，不同作用域下同名变量不会有冲突。

  作用域链参考链接一般情况下，变量到 创建该变量 的函数的作用域中取值。但是如果在当前作用域中没有查到，就会向上级作用域去查，直到查到全局作用域，这么一个查找过程形成的链条就叫做作用域链。


  ### 4、什么场景会用到闭包，闭包的缺点
  一个函数对其周围状态的引用绑定到一起，这样的组合就是闭包。形成闭包的条件，函数嵌套 + 内部函数引用外部函数的局部变量
  #### 1） 闭包的作用
  - 解决外部访问不到函数内部变量的问题
  - 局部变量会常驻在内存中
  - 避免使用全局变量，造成变量污染
  #### 2) 使用场景
  - 柯里化， 请看第4）点
  - 模块化,
    ```js
      // 定义一个立即执行函数，让其返回 3 个方法
    let Counter = (function(){
        // 初始化一个计数器，值为 0
        let num = 0
        function changeBy(val){
            num += val;
        }
        return {
            up:function(){
                changeBy(1)
            },
            down:function(){
                changeBy(-1)
            },
            value:function(){
                return num
            }
        }
    })()

    console.log(Counter.value()); // => 0
    Counter.up()
    Counter.up()
    console.log(Counter.value()); // => 2
    Counter.down()
    console.log(Counter.value()); // => 1
    ```
  #### 3）闭包的缺点
    - 变量不会被释放掉

  #### 4) 柯里化
    柯里化技术，主要体现在函数里面返回函数，利用闭包，可以形成一个不销毁的作用域，把预先处理的内容都存在这个不销毁的作用域里面，并且返回一个函数，后面执行的就是这个函数
  - 常见应用
    - 参数复用：
      ```js
      function uri_curring(protocol) {
        return function(hostname, pathname) {
          return `${protocol}${hostname}${pathname}`; 
        }
      }

      // 测试一下
      const uri_https = uri_curring('https://');

      const uri1 = uri_https('www.fedbook.cn', '/frontend-languages/javascript/function-currying/');
      const uri2 = uri_https('www.fedbook.cn', '/handwritten/javascript/10-实现bind方法/');
      const uri3 = uri_https('www.wenyuanblog.com', '/');

      console.log(uri1);
      console.log(uri2);
      console.log(uri3);
      ```
    - 提前返回：
    - 延迟计算/运行
    ```js
      function add() {
        // slice 截取 数据元素
        let args = Array.prototype.slice.call(arguments) // 浅拷贝
        let inner = function() {
          args.push(...arguments)
          return inner
        }
        inner.toString = function() {
          return args.reduce(function(prev, cur) {
            return prev + cur
          })
        }
        return inner
      }

      // 测试一下
      let result = add(1)(2)(3)(4);
      console.log(result);
    ```

  ### 5、Array
  - Array.prototype.some: 检测数组中是不是至少有一个元素通过了被提供的函数测试
  - 如何将一个数组转化为一个对象
  - for in 、 for of
  - 遍历数组的几个方法： 
    - 不改变原数组： forEach, map: 返回一个数组, filter: 返回一个数组， some,every, reduce, for of
  
  ### 6、优化递归的两种方法
    - 尾递归
    ```js
    /**
     * n:
     * acc:充当收集器，收集上一次运行的值
     * cal: 每一次递归的计算
     */
     const fiboTail = function (n, acc, cal) {
       if(n === 1) return acc
       if(n === 2) return cal
       return fiboTail(n-1, cal, acc+cal)
     }

    ```
    - 利用缓存
    ```js
    
    ```
  
  ### 7、新增的Set、Map两种数据结构怎么理解？
  Set是一种叫做集合的数据结构，Map是一种叫做字典的数据结构。
    - 1）Set: 类似于数组，
    ```js
    const s = new Set()
    s.add(1).add(2).add(2)
    s.delete(1)
    s.has(1)
    s.clear()
    // 遍历
    for(let key of s.keys()) {

    }
    for(let value of s.values()) {

    }
    for(let item of s.entries()) {

    }
    s.forEach((item, index) => {})

    // 数组去重
    let arr = [3, 5, 2, 2, 5, 5];
    const unique = [...new Set(arr)]

    // 实现并集， 交集， 差集
  
    let a = new Set([1, 2, 3]);
    let b = new Set([4, 3, 2]);

    // 并集
    let union = [...a, ...b]
    // 交集
    let jiaoji = new Set([...a].filter(item => b.has(item)))

    // 差集 a-b
    let chaji = new Set([...a].fitler(item => !b.has(item)))
    ```
  - 2）Map
  ```js
  cosnt m = new Map()
  m.size
  m.set()
  m.get()
  m.has()
  m.delete()
  m.clear()
  // 遍历
  const map = new Map([
    ['F', 'no'],
    ['T',  'yes'],
  ]); 

  for (let key of map.keys()) {
    console.log(key);
  }
  // "F"
  // "T"

  for (let value of map.values()) {
    console.log(value);
  }
  // "no"
  // "yes"

  for (let item of map.entries()) {
    console.log(item[0], item[1]);
  }
  // "F" "no"
  // "T" "yes"

  // 或者
  for (let [key, value] of map.entries()) {
    console.log(key, value);
  }
  // "F" "no"
  // "T" "yes"

  // 等同于使用map.entries()
  for (let [key, value] of map) {
    console.log(key, value);
  }
  // "F" "no"
  // "T" "yes"

  map.forEach(function(value, key, map) {
    console.log("Key: %s, Value: %s", key, value);
  });
  ```
  - 3）WeakSet 和 WeakMap



  ### 8、Web常见的攻击方式有哪些？如何防御？
  常用的攻击方式有：XSS， CSRF， SQL注入
  
  ### 9、什么是防抖和节流？有什么区别？如何实现？
  都是优化高频执行代码的一种手段。resize, scroll, keypress, mousemove会不断调用绑定的事件，大大地浪费资源，降低前端性能。
  - 节流：n秒内执行一次，若在n秒内重复触发，只有一次有效
  - 防抖：n秒后执行该事件，若在n秒内被重复触发，则重新计时
  #### 1） 节流
  ```js
    // throttle1 时间戳节流
    function throttle1(fn, delay) {
      let ot = Date.now()
      return function(...args) {
        const nt = Date.now()
        if(nt - ot >= delay) {
          fn.call(null, args)
          ot = Date.now()
        }
      }
    }

    // throttle2 定时器
    function throttle2(fn, delay) {
      let timer = null
      return function(...args) {
        timer = setTimeout(() => {
          if(!timer) {
            fn.call(this, args)
            timer = null
          }
        }, delay)
      }
    }
    // throttle 时间戳+定时器
    function throttle(fn, delay) {
      let timer = null
      let ot = Date.now()
      return function() {
        let nt = Date.now()
        let remaining = delay - (nt - ot)
        let context = this
        clear(timer)
        if(remaining <= 0) {
          fn.applay(context, args)
          nt = Date.now()
        }else {
          timer = setTimeout(fn, remaining)
        }
      }
    }
  ```
  #### 2）防抖
  ```js
    // 简单版
    function debounce(fn, delay) {
      let timer
      return function() {
        clearTime(timer)
        const args = arguments
        timer = setTimeout(() => {
          fn.apply(this, args)
        }, delay)
      }
    }
    // 防抖如果需要立即执行，可加入第三个参数用于判断
    function debouce(fn, delay, immediate) {
      let timeout 
      return function() {
        let context = this
        let args = arguments
        if(timeout) clearTimeout(timeout)
        if(immediate) {
          let callNow = !timeout
          timeout = = setTimeout(function() {
            timeout = null
          }, delay)
          if(callNow) {
            fun.applay(context, args)
          }
        }else {
          timeout = setTimeout(function() {
            fn.applay(context, args)
          }, delay)
        }
      }
    }

  ```
  
  ### 10、如何判断一个元素是否在可视区中
  #### 1) 使用场景
  - 图片的懒加载
  - 列表的无限滚动
  - 计算广告元素的曝光情况
  - 可点击连接的预加载
  #### 2）实现方式
  - offsetTop, scrollTop
    ```js
     function isInViewportOfOne(el) {
       const viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
       const offsetTop = el.offsetTop
       const scrollTop = document.documentElement.scrollTop
       const top = offsetTop - scrollTop
       return top <=  viewportHeight
     }
    ```
  - getBoundingClientRect
    ```js
      function isInViewport(el) {
        const viewWidth = window.innerWidth || document.documentElement.clientWidth
        const viewHeight = window.innerHeight || document.documentElement.clientHeight
        const {top, bottom, left, right} = el.getBoundingClientRect()
        return top>=0 && bottom <= viewHeight && left>=0 && right <= viewWidth
      }
    ```
  - Intersection Observer
    ```js
      const options = {
        // 表示重叠面积占被观察者的比例，从 0 - 1 取值，
        // 1 表示完全被包含
        threshold: 1.0,
        root: document.querySelector('#scrollArea') // 必须是目标元素的父级元素
      }

      // 监听回调
      const callback = (entries, observer) => {
        // 常用属性
        entries.forEach(entry => {
          entry.time; // 触发时间
          entry.rootBounds; // 根元素的位置矩形，这种情况下为视窗位置
          entry.boundingClientRect; // / 被观察者的位置矩形
          entry.intersectionRect;   // 重叠区域的位置矩形
          entry.intersectionRatio;  // 重叠区域占被观察者面积的比例（被观察者不是矩形时也按照矩形计算）
          entry.target;             // 被观察者
        })
      }
      const observer = new IntersectionObserver(callback, options)
    ```
  #### 3） 案例分析：创建一个十万个节点的长列表，当节点滚入视窗中时，背景就会从红色的变为黄色的
  ```html
  <!-- html 结构如下 -->
  <div class="container"></div>
  <!-- css 样式 -->
  <style> 
    .container {
      display: flex;
      flex-wrap: wrap;
    }
    .target {
      margin: 5px;
      width: 20px;
      height: 20px;
      background: red;
    }
  </style>
  ```
  ```js
    // 往container插入100000个元素
    const $container = $('.container')
    function createTags() {
      const htmlString = new Array(100000).fill('<div class="target"></div>').join('')
      $container.html(htmlString)
    }

    // 首先用getBoundingClientRect判断元素是否在可视区
    function isInViewport(el) {
      const viewWidth = window.innerWidth || document.documentElement.clientWidth
      const viewHeight = window.innerHeight || document.documentElement.clientHeight
      const {top, bottom, left, right} = el.getBoundingClientRect()
      return top>=0 && bottom <= viewHeight && left>=0 && right <= viewWidth
    }
    $(window).on('scroll', () => {
      $targes.each((index, element) => {
        if(isInViewport(element)) {
          $(element).css("background-color", "yellow")
        }
      })
    })

    // InsectionObserver
    const observer = new InsectionObserver(getYellow, {threhold: 1})
    function getYellow(entries, observer) {
      entries.forEach(entry => {
        $(entry.target).css("background-color", "yellow");
      });
    }
    $targets.each((index, element) => {
      observer.observe(element)
    })
  ```

  ### 11、大文件如何实现断点续传？ [https://juejin.cn/post/6844904046436843527]
    - 分片上传
    - 断点续传
    #### 1）实现思路：拿到文件，保存文件唯一性标识，切割文件，分段上传，每次上传一段，根据唯一性标识判断文件上传进度，直到文件的全部片段上传完毕
    ```js
      // 读取文件内容
      const input = document.querySelector('input')
      input.addEventListener('change', function() {
        var file = this.files[0]
      })
      // 使用md5实现文件的唯一性
      const md5code = md5(file)
      // 对文件进行分割
      var reader = new FileReader()
      reader.readerArrayBuffer(file)
      reader.addEventListener('load', function(e) {
        // 每10M切割一段,这里只做一个切割演示，实际切割需要循环切割，
        var slice = e.target.result.slice(0, 10*1012*1024)
      })
      // h5上传一个（一片）
      const formData = new FormData()
      formData.append('0', slice)
      //这里是有一个坑的，部分设备无法获取文件名称，和文件类型，这个在最后给出解决方案
      formData.append('filename', file.filename)
      var xhr = new XMLHttpRequest()
      xhr.addEventListener('load', function() {})
      xhr.open('POST', '')
      xhr.send(formData)
      xhr.addEventListener('progress', updateProgress)
      xhr.upload.addEventListener('progress', updateProgress)

      function updateProgress(event) {
        if(event.lengthComputable) {
          //进度条
        }
      }

      // 常见图片和视频的文件类型判断
      function checkFileType(type, file, back) {
        /**
        * type png jpg mp4 ...
        * file input.change=> this.files[0]
        * back callback(boolean)
        */
        var args = arguments;
        if (args.length != 3) {
            back(0);
        }
        var type = args[0]; // type = '(png|jpg)' , 'png'
        var file = args[1];
        var back = typeof args[2] == 'function' ? args[2] : function() {};
        if (file.type == '') {
          // 如果系统无法获取文件类型，则读取二进制流，对二进制进行解析文件类型
          var imgType = [
              'ff d8 ff', //jpg
              '89 50 4e', //png

              '0 0 0 14 66 74 79 70 69 73 6F 6D', //mp4
              '0 0 0 18 66 74 79 70 33 67 70 35', //mp4
              '0 0 0 0 66 74 79 70 33 67 70 35', //mp4
              '0 0 0 0 66 74 79 70 4D 53 4E 56', //mp4
              '0 0 0 0 66 74 79 70 69 73 6F 6D', //mp4

              '0 0 0 18 66 74 79 70 6D 70 34 32', //m4v
              '0 0 0 0 66 74 79 70 6D 70 34 32', //m4v

              '0 0 0 14 66 74 79 70 71 74 20 20', //mov
              '0 0 0 0 66 74 79 70 71 74 20 20', //mov
              '0 0 0 0 6D 6F 6F 76', //mov

              '4F 67 67 53 0 02', //ogg
              '1A 45 DF A3', //ogg

              '52 49 46 46 x x x x 41 56 49 20', //avi (RIFF fileSize fileType LIST)(52 49 46 46,DC 6C 57 09,41 56 49 20,4C 49 53 54)
          ];
          var typeName = [
              'jpg',
              'png',
              'mp4',
              'mp4',
              'mp4',
              'mp4',
              'mp4',
              'm4v',
              'm4v',
              'mov',
              'mov',
              'mov',
              'ogg',
              'ogg',
              'avi',
          ];
          var sliceSize = /png|jpg|jpeg/.test(type) ? 3 : 12;
          var reader = new FileReader();
          reader.readAsArrayBuffer(file);
          reader.addEventListener("load", function(e) {
            var slice = e.target.result.slice(0, sliceSize);
            reader = null;
            if (slice && slice.byteLength == sliceSize) {
                var view = new Uint8Array(slice);
                var arr = [];
                view.forEach(function(v) {
                    arr.push(v.toString(16));
                });
                view = null;
                var idx = arr.join(' ').indexOf(imgType);
                if (idx > -1) {
                    back(typeName[idx]);
                } else {
                    arr = arr.map(function(v) {
                        if (i > 3 && i < 8) {
                            return 'x';
                        }
                        return v;
                    });
                    var idx = arr.join(' ').indexOf(imgType);
                    if (idx > -1) {
                        back(typeName[idx]);
                    } else {
                        back(false);
                    }

                }
            } else {
                back(false);
            }
          });
        } else {
          var type = file.name.match(/\.(\w+)$/)[1];
          back(type);
        }       
      }
      // 调用方法
      checkFileType('(mov|mp4|avi)',file,function(fileType){
          // fileType = mp4,
          // 如果file的类型不在枚举之列，则返回false
      });
      // 上传文件， 改成如下
      formdata.append('filename', md5code+'.'+fileType);
    ```
    #### 2）遗留问题
    - 切片上次失败怎么办？
    - 上传过程中刷新页面怎么办？
    - 如何进行并行上传？
    - 切片什么时候按数量切？什么时候按大小切？
    - 如何结合web worker处理大文件上传？
    - 如何实现秒传？


  ### 12、如何实现断点续下载？ [https://blog.csdn.net/conan729/article/details/105505046]

  ### 13、常见的加密类型， 如md5, base64等加密

  ### 14、FileReader

  ### 15、怎么理解ES6中的Generator？使用场景？
  Generator一种异步编程解决方案。
  ```js
    function *helloWorldGenerator() {
      yield 'hello'
      yield 'world'
      return 'ending'
    }
  ```
  #### 1）使用
  ```js
  // 1、Generator 函数会返回一个遍历器对象，即具有Symbol.iterator属性，并且返回给自己
  function *gen() {
    // some code
  }
  var g = gen()
  g[Symbol.iterator] === g  // true

  // 2、通过yield关键字可以暂停generator函数返回的对象的状态
  function *helloWorldGenerator() {
    yield 'hello'
    yield 'world'
    return 'ending'
  }
  var hw = helloWorldGenerator();
  // 上述存在三种状态：hello， world， return

  // 3、yield 表达式本身是没有返回值的，或者总是返回undefined；通过next方法可以第一个参数，该参数就会被当做上一个yield表达式的返回值
  function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
  }

  var a = foo(5);
  a.next() // Object{value:6, done:false}
  a.next() // Object{value:NaN, done:false}
  a.next() // Object{value:NaN, done:true}

  var b = foo(5);
  b.next() // { value:6, done:false }
  b.next(12) // { value:8, done:false }
  b.next(13) // { value:42, done:true }

  // 4、因为Generator的返回值是iterator对象，所以我们可以通过for... of进行遍历
  function *foo() {
    yield 1
    yield 2
    yield 3
    yield 4
    return 5
  }
  const res = foo()
  for(v of res) {
    console.log(v)
  }
  // // 1 2 3 4 
  ```
  #### 2）异步解决方案
  - 回调函数
  - promise
  - generator
  - async/await
  ```js
  // 1、回调函数
  fs.readFile('/etc/fstab', function(err, data) {
    if(err) throw err
    console.log(data)
    fs.readFile('/etc/shells', function(err, data) {
      if(err) throw err
      console.log(data)
    })
  })
  // 2、pormise
  const fs = require('fs')
  const redaFile = function(fileName) {
    const promise = new Promise((resolve, reject) => {
      fs.readFile(fileName, function(err,data) {
        if(err) return reject(err)
        resovle(data)
      })
    })
    return promise
  }

  readFile('/etc/fstab').then(res => {
    console.log(data)
    return readFile('/etc/shells').then(res => {
       console.log(data)
     })
  }).catch(err => {
    throw err
  })

  // 3、generator 将异步同步话
  const gen = *function() {
    const f1 = yield readFile('/etc/fstab')
    const f2 = yield readFile('/etc/shells')
    console.log(f1.toString())
    console.log(f2.toString())
  }

  // 4、 async/ await
  const asyncReadFile = async function () {
    const f1 = await readFile('/etc/fstab')
    const f2 = await readFile('/etc/shells')
    console.log(f1.toString())
    console.log(f2.toString())
  }
  ```
  #### 3）使用场景
  ```js
  // Generator是异步解决的一种方案，最大特点则是将异步操作同步化表达出来
  function* loadUI() {
    showLoadingScreen();
    yield loadUIDataAsynchronously();
    hideLoadingScreen();
  }
  var loader = loadUI();
  // 加载UI
  loader.next()

  // 卸载UI
  loader.next()
  ```
  ```js
  // redux-saga中间件也充分利用了Generator特性
  import { call, put, takeEvery, takeLatest } from 'redux-saga/effects' // 副作用， 异步函数的时候
  import Api from '...'

  function *fetchUser(action) {
    try{
      const user = yield call(Api.fetchUser, action.payload.userId)
      yield put({type: "USER_FETCH_SUCCEEDED", user: user})
    }catch(e) {
      yield put({type: "USER_FETCH_FAILED", message: e.message})
    }
  }

  function* mySaga() {
    yield takeEvery("USER_FETCH_REQUESTED", fetchUser);
  }

  function* mySaga() {
    yield takeLatest("USER_FETCH_REQUESTED", fetchUser);
  }

  export default mySaga;


  // 利用Generator在对象上实现Iterator
  function* iterEntries(obj) {
    let keys = Object.keys(obj);
    for (let i=0; i < keys.length; i++) {
      let key = keys[i];
      yield [key, obj[key]];
    }
  }

  let myObj = { foo: 3, bar: 7 };

  for (let [key, value] of iterEntries(myObj)) {
    console.log(key, value);
  }
  // foo 3
  // bar 7
  ```


  ### 16、Iterator对象

  ### 17、你是怎么理解ES6中的Proxy的？使用场景？
  - 定义：用于定义基本操作的自定义行为
  - 本质：修改的是程序默认行为，就形同于在编程语言层面上做修改，属于元编程。
  Proxy用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找，赋值，枚举，函数调用等）
  #### 1）用法
  ```js
  var proxy = new Proxy(target, handler)
  ```
  - target: 要拦截的目标对象
  - handler： 以函数为属性的对象
    - get(target, proKey, receiver): 拦截对象属性的读取
    - set(target, proKey, value, receiver): 拦截对象属性的设置
    - has(target, proKey): 拦截proKey in proxy的操作，返回一个布尔值
    - deleteProperty(target, proKey): 拦截delete proxy[proxyKey]的操作， 返回一个布尔值
    - ownKeys(target): 拦截Object.keys(proxy), for... in 等循环，返回一个数组
    - getOwnPropertyDescriptor(target, proKey)
    - defineProperty(target, proKey, proDesc)
    - preventExtensions(target)
    - getPropertyOf(target)
    - isExtensible(target)
    - setPropertyOf(target, proto)
    - apply(target, object, args): 拦截Proxy实例作为函数的操作
    - construct(target, args): 拦截Proxy作为构造函数的操作
  #### 2） Reflect
    - 只要Proxy对象具有代理方法，Reflect对象全部具有，以静态方法的形式存在
    - 修改某些Object方法的返回值，让其变得更合理
    - 让Object操作变成函数行为
  #### 3）使用场景
  - 拦截和监视外部对对象的访问
  - 降低函数或类的复杂度
  - 在复杂操作前对操作进行校验或对所需资源进行管理
  ```js
  // 1、使用Proxy保证数据的准确性
  let numericDataStore = {count: 0, amount: 1234, total: 14}
  numericDataStore = new Proxy(numericDataStore, {
    set(target, value, proxy) {
      if(typeof value !== 'number') {
        throw Error('属性只能是number类型')
      }
      return Reflect.set(target, key, value, proxy)
    }
  })
  numericDataStore.count = "foo" // Error: 属性只能是number类型
  numericDataStore.count = 333 // 赋值成功

  // 2、声明了一个私有的 apiKey，便于 api 这个对象内部的方法调用，但不希望从外部也能够访问 api._apiKey
  let api = {
    _apiKey: '123abc456def',
    getUsers: function(){ },
    getUser: function(userId){ },
    setUser: function(userId, config){ }
  };
  const RESTRICTED = ['_apiKey']; 
  api = new Proxy(api, {
    get(target, key, proxy) {
      if(RESTRICTED.indexOf(key) > -1) {
        throw Error(`${key} 不可访问.`);
      }
      return Reflect.get(target, key, proxy)
    },
    set(target, key, value, proxy) {
      if(RESTRICTED.indexOf(key) > -1) {
        throw Error(`${key} 不可修改`)
      }
      return Reflect.get(target, key, value, proxy) 
    }
  })
  console.log(api._apiKey)
  api._apiKey = '987654321'
  // 上述都抛出错误

  // 3、通过Proxy实现观察者模式
  const queueObservers = new Set()
  const observe = fn => queueObservers.add(fn)
  const observable = obj => new Proxy(obj, {set})
  function set(target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver)
    queueObservers.forEach(observer => observer())
    return result
  }
  ```

  ### 18、js数字精度丢失的问题，如何解决？
    - 计算机存储双精度浮点数需要先把浮点数转换为二进制的科学计数法的形式，然后计算机以自己的规则{符号位+(指数位+指数偏移量的二进制)+小数部分}存储二进制的科学计数法，因为存储时有位数限制，会造成二进制舍入操作
    - 转成整数计算
  
  ### 19、**如何实现上拉加载，下拉刷新？**
    - 关键词： scrollTop, clientHeight, scrollHeight | touchstart, e.touches[0].pageY, touchmove, touchend
  
  ### 20、数组常用的方法
  #### 1） 操作方法
    - 增：push、unshift、splice、concat
    - 删：pop, shift, splice：传两个参数, slice：不影响原数组
    - 改：splice
    - 查：indexOf, find, includes
  #### 2）排序操作： sort, reserse
  #### 3) 转换方法: join
  #### 4) 迭代方法
    - 不改变原数组： map, forEach, filter, some, every

  ### 21、js字符串常用的方法有哪些？

  ### 22、深拷贝浅拷贝的区别？如何实现一个深拷贝？
  浅拷贝只拷贝一层，如果属性是基本类型，会直接拷贝；如果是引用类型，则共享引用地址
  #### 1） 浅拷贝
  - Object.assign, {...obj}
  - Array.prototype.concat, Array.prototype.slice(), [...arr]
  #### 2） 深拷贝
  - stringify
  - _deepclone
  - jquery.extend()
  - **手写循环递归**

  ### 23、js原型，原型链？有什么特点？
  #### 1）原型：原型对象的构造函数，就是指向该函数的本身。
  ```js
    function doSomething(){}
    // doSomething.prototype.constructor ==> doSomething 图片要好理解一下
  ```
  #### 2）原型链：原型对象也可能拥有原型，并从中继承方法和属性，一层一层，以此类推，这种关系被称为原型链。
  ```js
  function Person(name) {
      this.name = name;
      this.age = 18;
      this.sayName = function() {
          console.log(this.name);
      }
  }
  // 第二步 创建实例
  var person = new Person('person')
  ```
  ```js
    person.__proto__ --> Person.prototype
    Person.prototype.constructor --> Person
    Person.__proto__ --> Function.prototype
    Function.prototype.__proto__ --> Object.prototype
    Object.prototype.__proto__ --> null
  ```
  
  ### 24、js中如何实现继承， es5的继承和es6的继承有什么区别？
  #### 1） 实现方式
    - 原型链继承
    ```js
    function Parent() {
      this.name = '1'
      this.arr = [1,2,3]
      getName (
        return this.name
      )
    }
    function Child() {
      this.set = 'femal'
    }

    // 原型链继承
    Child.prototype = new Parent()

    // 存在问题
    var s1 = new Child();
    var s2 = new Child();
    s1.play.push(4);
    console.log(s1.arr, s2.arr); // [1,2,3,4]
    ```
    - 构造函数继承（借助call)
    ```js
    function Parent() {
      this.name = '1'
      this.arr = [1,2,3]
      getName () {
        return this.name
      }
    }
    Parent.prototype.getName1 = function () {
      return this.name
    }
    function Child() {
      Parent.call(this)
      this.set = 'femal'
    }

    // 存在问题
    let child = new Child();
    console.log(child);  // 没问题
    console.log(child.getName());  // 会报错
    ```
    - 组合继承
    ```js
    function Parent() {
      this.name = '1'
      this.arr = [1,2,3]
      getName () {
        return this.name
      }
    }
    Parent.prototype.getName1 = function () {
      return this.name
    }
    function Child() {
      Parent.call(this)
      this.set = 'femal'
    }

    Child.prototype = new Parent()
    Child.prototype.constructor = Child

    // 存在的问题： Parent执行了两次
    ```
    - 原型式继承
    ```js
    let parent4 = {
    name: "parent4",
    friends: ["p1", "p2", "p3"],
    getName: function() {
      return this.name;
      }
    };

    let person4 = Object.create(parent4);
    person4.name = "tom";
    person4.friends.push("jerry");

    let person5 = Object.create(parent4);
    person5.friends.push("lucy");

    console.log(person4.name); // tom
    console.log(person4.name === person4.getName()); // true
    console.log(person5.name); // parent4
    // 存在问题， 因为Object.create是浅拷贝
    console.log(person4.friends); // ["p1", "p2", "p3","jerry","lucy"]
    console.log(person5.friends); // ["p1", "p2", "p3","jerry","lucy"]
    ```
    - 寄生式继承
    ```js
    let parent5 = {
        name: "parent5",
        friends: ["p1", "p2", "p3"],
        getName: function() {
            return this.name;
        }
    };

    function clone(original) {
        let clone = Object.create(original);
        clone.getFriends = function() {
            return this.friends;
        };
        return clone;
    }

    let person5 = clone(parent5);

    console.log(person5.getName()); // parent5
    console.log(person5.getFriends()); // ["p1", "p2", "p3"]
    ```
    - 寄生组合式继承
    ```js
    function clone (parent, child) {
      // 这里改用 Object.create 就可以减少组合继承中多进行一次构造的过程
      child.prototype = Object.create(parent.prototype);
      child.prototype.constructor = child;
    }
    function Parent6() {
        this.name = 'parent6';
        this.play = [1, 2, 3];
    }
    Parent6.prototype.getName = function () {
        return this.name;
    }
    function Child6() {
        Parent6.call(this);
        this.friends = 'child5';
    }

    clone(Parent6, Child6);

    Child6.prototype.getFriends = function () {
        return this.friends;
    }

    let person6 = new Child6(); 
    console.log(person6); //{friends:"child5",name:"child5",play:[1,2,3],__proto__:Parent6}
    console.log(person6.getName()); // parent6
    console.log(person6.getFriends()); // child5
    ```
  
  ### 25、说说new操作符具体干了什么？
  #### 1）是什么： new 操作符用于创建一个给定构造函数的实例对象
  #### 2）流程
    - 创建一个对象obj
    - 添加__proto__原型属性，指向函数的原型对象
    - 改变作用域
    - 判断函数的返回值，如果返回的是对象则返回该对象，如果没有返回值，则返回该函数的所创建的对象
  #### 3）手动实现一个new
  ```js
  function myNew(Fn, ...args) {
    const obj = {}
    obj.__proto__ = Fn.prototype
    let res = Fn.apply(obj, args)
   return res instanceof Object ? result : obj

  }
  ```
  
  ### 26、说说你对事件循环的理解
  #### 1）是什么: 是实现单线程非阻塞操作方法
  #### 2）宏任务和微任务
  - 微任务
    - Promise.then
    - MutationObserver
    - Object.observe
    - process.nextTick(node.js)
  - 宏任务
    - script代码块
    - setTimeout/setInterval
    - UI rendering/UI事件
    - postMessage, MessageChannel
    - setImmediate, I/O, (node.js)


  ### 27、函数式编程的理解？优缺点
  #### 1）是什么？
  是一种"编程范式"，编写程序的方法论。主要的编程范式有三种：命令式编程，声明式编程和函数式编程
  - 自己理解：就是将逻辑处理放入函数中，定义好输入，只关心输出。
  #### 2）概念
  - 纯函数：无状态+数据不可变
  - 高阶函数：以函数作为输入或输出的函数，被称为高阶函数
  ```js
  // 高阶函数存在缓存的特性，主要是利用闭包
  const once = (fn) => {
    let done = false
    return function() {
      if(!done) {
        fn.apply(this, fn)
      }else {
        console.log('该函数已经执行')
      }
      done = true
    }
  }
  ```
  - 柯里化
  - 组合与管道：目的是将多个函数组合成一个函数
  ```js
  // 多函数组合， 从右到左
  const compose = (...fns) => val => fns.reverse().reduce((acc, fn)=>fn(acc), val)
  // 管道函数，从左到右
  const pipe = (...fns) => val => fns.reduce((acc, fn) => fn(acc), val)
  ```
  #### 3）优缺点

  ### 28、js中如何实现函数缓存？函数缓存有哪些应用场景？
  函数缓存，就是将函数计算结果进行的缓存，常用于缓存计算的结果和对象
  #### 1）如何实现：闭包，柯里化，高阶函数
  ```js
  // 高阶函数实现函数缓存
  const memorize = function(func, content) {
    let cache = Object.create(null)
    content = content || this
    return (...key) => {
      if(!cache[key]) {
        cache[key] = func.apply(content, key)
      }
      return cache[key]
    }
  }
  ```
  #### 2）应用场景
  - 对于昂贵的函数调用，执行复杂计算的函数
  - 对于具有有限且高度复用输入范围的函数
  - 对于具有重复输入值的递归函数
  - 对于纯函数，即每次使用特定输入调用时返回相同输出的函数

  ### 29、什么是单点登录？如何实现？
  #### 1）是什么？
  当一个系统成功登录以后，passport将会颁发一个令牌给子系统，子系统可以拿着令牌获取各自的受保护资源，为了减少频繁认证，各个子系统在被passport授权以后，会建立一个局部会话，在一定的时间内可以无需再次向passport发起认证。
  #### 2）如何实现
  - 同域名下的单点登录
  - 不同域名的单点登录：应用->认证中心->返回给token给应用->应用再次想认证中心验证token的合法性->应用保持token，并将其放于cookie中，请求携带上;应用系统验证token，发现已经登录，则不会去认证中心了。
  - 不同域名下的单点登录2：将token或者session ID保持到浏览器的localStorage中，让前端将主动将localStorage的数据传递给服务器。
  ```js
  // 单点登录完全可以在前端实现。除了可以写在自己域中，还可以通过特殊手段将它写入多个其他域下的LocalStorage中
  var token = result.data.token
  var iframe = document.createElement('iframe')
  iframe.src = "http://app1.com/localstorage.html"
  document.body.append(iframe)
  setTimeout(function() {
    iframe.contentWindow.postMessage(token, "http://app1.com")

  }, 4000)

  setTimeout(function() {
    iframe.remove()
  }, 6000)

  // 在这个iframe所加载的HTML中绑定一个事件监听器，当事件被触发时，把接收到的token数据写入localStorage
  window.addEventListener('message',function(event) {
    localStorage.setItem('token', event.data)
  }, false)
  ```

## 三、DOM2， HTML5， CSS3, Less, Sass
  ### 1、 事件冒泡捕获： 捕获阶段， 目标阶段， 冒泡阶段
  
  ### 2、less 编写函数
  ```less
    @default-w: 375px;
    .convert(@px, @width: @default-w) {
      @var: unit(@px / @width) * 10;
      @rem: ~'@{var}rem';
    }
    
    .el-mixin {
      width: .convert(300px)[@rem];
      height: .convert(150px)[@rem];
      background: red;
    }

  ```
  webpack里面中对less-loader设置javascriptEnabled,就可以编写js了
  ```js
    // module.rules
    {
      test: /\.less/,
      exclude: /node_modules/,
      use: ['style-loader', 'css-loader', {
        loader: 'less-loader',
        options: {
          javascriptEnabled: true // POINT
        }
      }],
    }

    .remMixin() {
      @functions: ~`(function() {
        var clientWidth = '375px';
        function convert(size) {
          return typeof size === 'string' ? 
            +size.replace('px', '') : size;
        }
        this.rem = function(size) {
          return convert(size) / convert(clientWidth) * 10 + 'rem';
        }
      })()`;
    }
    .remMixin();

    .el-function {
      width: ~`rem("300px")`;
      height: ~`rem(150)`;
      background: blue;
    }


  ```
  
  ### 3、DOM常见的操作有哪些？
  #### 1）创建节点
    - document.createElement
    - document.createTextNode
    - document.createDocumentFragment
    - document.createAttribute
  #### 2）查询节点
    - document.querySelector
    - document.querySelectorAll
    - document.getElementById, document.getElementByClassName, document.getElementByTagName, document.getElementByName
  #### 3）更新节点
    - innerHTML
    - innerText, textContent
    - style
  #### 4）添加节点
    - innerHTML
    - appendChild
    - insertBefore
    - setAttribute
  #### 5）删除节点
    - removeChild

## 四、移动端
### 1、 如何解决1px的问题： 在移动端web开发中，UI设计稿中设置边框为1像素，前端在开发过程中如果出现border:1px，测试会发现在retina屏机型中，1px会比较粗，即是较经典的移动端1px像素问题。
  - 1） 0.5px 方案
  ```
    /* 这是css方式*/
    .border { border: 1px solid #999 }
    @media screen and (-webkit-min-device-pixel-ratio: 2) {
        .border { border: 0.5px solid #999 }
    }
    /*ios dpr=2和dpr=3情况下border相差无几，下面代码可以省略*/
    @media screen and (-webkit-min-device-pixel-ratio: 3) {
        .border { border: 0.333333px solid #999 }
    }

    // js
    if (window.devicePixelRatio && devicePixelRatio >= 2) {
      var testElem = document.createElement('div');
      testElem.style.border = '.5px solid transparent';
      document.body.appendChild(testElem);
    }
    if (testElem.offsetHeight == 1) {
      document.querySelector('html').classList.add('hairlines');
    }
      document.body.removeChild(testElem);
    }

    div {
      border: 1px solid #bbb;
    }
    .hairlines div {
      border-width: 0.5px;  
    }

  ```
  - 2） 伪类+transform: 原理：把原先元素的border去掉，然后利用:before或者:after重做border，并 transform的scale缩小一半，原先的元素相对定位，新做的border绝对定位。
  - 3） viewport + rem: 同时通过设置对应viewport的rem基准值，这种方式就可以像以前一样轻松愉快的写1px了。
    在devicePixelRatio=2 时，设置meta：
    ```js
      <meta name="viewport" content="width=device-width,initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no">
    ```
    在devicePixelRatio=3 时，设置meta：
    ```js
    <meta name="viewport" content="width=device-width,initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no">
    ```
    ```
     var viewport = document.querySelector("meta[name=viewport]");
        var dpr = window.devicePixelRatio || 1;
        var scale = 1 / dpr;
        //下面是根据设备dpr设置viewport
        viewport.setAttribute(
            "content", +
            "width=device-width," +
            "initial-scale=" +
            scale +
            ", maximum-scale=" +
            scale +
            ", minimum-scale=" +
            scale +
            ", user-scalable=no"
        );

        var docEl = document.documentElement;
        var fontsize = 10 * (docEl.clientWidth / 320) + "px";
        docEl.style.fontSize = fontsize;
    ```
    - 4） border-image:
    ```
    .border-image-1px {
      border-bottom: 1px solid #666;
    } 

    @media only screen and (-webkit-min-device-pixel-ratio: 2) {
        .border-image-1px {
            border-bottom: none;
            border-width: 0 0 1px 0;
            border-image: url(../img/linenew.png) 0 0 2 0 stretch;
        }
    }
    ```
    - 5) background-image
    ```
      .background-image-1px {
        background: url(../img/line.png) repeat-x left bottom;
        background-size: 100% 1px;
      }
    ```

    - 6) postcss-write-svg
     使用border-image每次都要去调整图片，总是需要成本的。基于上述的原因，我们可以借助于PostCSS的插件postcss-write-svg来帮助我们。如果你的项目中已经有使用PostCSS，那么只需要在项目中安装这个插件。然后在你的代码中使用
     ```
      @svg 1px-border {
        height: 2px;
        @rect {
          fill: var(--color, black);
          width: 100%;
          height: 50%;
        }
    }
    .example {
        border: 1px solid transparent;
        border-image: svg(1px-border param(--color #00b1ff)) 2 2 stretch;
    }

    // 编译出来的模样
    .example {
      border: 1px solid transparent;
      border-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' height='2px'%3E%3Crect fill='%2300b1ff' width='100%25' height='50%25'/%3E%3C/svg%3E")
            2 2 stretch;
    }
     ```

### 2、响应式布局
  - 1） 布局特点： 每个屏幕分辨率下面会有一个布局样式，即元素位置和大小都会变
  - 2） 设计方式： 媒体查询+流式布局 @media

### 3、前端几种布局方式
  #### 1) 流式布局
  - 1） 布局特点：屏幕分辨率变化时，页面里元素的大小会变化而但布局不变。（这就导致如果屏幕太大或者太小都会导致元素无法正常显示）
  - 2） 设计方法：使用%百分比定义宽度，高度大都是用px来固定住，可以根据可视区域 (viewport) 和父元素的实时尺寸进行调整，尽可能的适应各种分辨率。往往配合 max-width/min-width 等属性控制尺寸流动范围以免过大或者过小影响阅读
  #### 2）自适应布局
  - 1）布局特点：屏幕分辨率变化时，页面里面元素的位置会变化而大小不会变化。
  - 2）设计方法：使用 @media 媒体查询给不同尺寸和介质的设备切换不同的样式。在优秀的响应范围设计下可以给适配范围内的设备最好的体验，在同一个设备下实际还是固定的布局。
  #### 3）弹性布局
  - 1）布局特点：包裹文字的各元素的尺寸采用em/rem做单位，而页面的主要划分区域的尺寸仍使用百分数或px做单位（同「流式布局」或「静态/固定布局」）
  - 2) px2rem, cssrem ： 将rem转换成px
    ```js
      @function double($fontsize) {
          @return ($fontsize/75px) * 1rem;
      }
    ```
  - 3) 移动端适配总结
    - 设置视口
    ```js
      <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    ```
    - 用js动态修改html的font-size 如: font-size = 屏幕宽度 / 10
    - 使用rem

### 4、CSS3 动画： transform、transition和animation
#### 1）transform: 变形， rotate(旋转)， scale(缩放)， skew(扭曲)，translate(移动)和 matrix(矩阵变形)
#### 2）transition: 过渡效果
  - transition-property
  - transition-duration
  - transition-timing-function
  - transition-delay
#### 3）animation： 逐帧动画


## 五、webpack

### 1、组件按需加载： 借助插件或者部分引用的写法，使得项目代码或者babel编译后，只包含使用的部分。
```js
// 组件按需加载： 减少项目构建打包产物的大小，提高项目线上首屏渲染速度，减少白屏时间，减少流量消耗。
module.exports = {
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: true
    }, 'vant']
  ]
};

// 按需引入用法
import { Button } from 'vant';
Vue.use(Button);
```
  - babel-plugin-import插件： 词法、语法分析，AST 转换，代码生成。

### 2、webpack懒加载：运行到相应的组件时，再去加载， 他讲import或者require引入的内容按照加载动态配置语法分割成较小的chunk包

### 3、说说如何借助webpack来优化前端性能
  #### 1） js压缩： terser-webpack-plugin
  #### 2） css压缩： 通常是去除无用的空格，css-minimizer-webpack-plugin
  #### 3） html文件代码压缩： HtmlWebpackPlugin
  #### 4） 文件大小压缩： compression-webpack-plugin
  #### 5） 图片压缩： file-loader， image-webpack-loader
  #### 6） tree shaking
    - useusedExports
      ```js
        // webpack
        module.exports = {
          optimization: {
            usedExport
          }
        }
        // 使用之后，没被用的代码在webpack打包中会加入unused harmony export mul 的注释
      ```
    - sideEffects: 用于告知webpack compiler哪些模块有副作用，配置方法在package.json中设置sideEffects
      ```js
      // 如果sideEffects设置为false，就是告知webpack可以安全的删除未用到的exports;如果有些文件需要保留，可以设置为数组的形式
      // package.json
      "sideEffecis":[
          "./src/util/format.js",
          "*.css" // 所有的css文件
      ]
      ```
    - css tree shaking: purgecss-plugin-webpack
    ```js
    const PurgeCssPlugin = require('purgecss-webpack-plugin')
    module.exports = {
      
      plugins:[
        new PurgeCssPlugin({
          path:glob.sync(`${path.resolve('./src')}/**/*`), {nodir:true}// src里面的所有文件
          satelist:function(){
            return {
                standard:["html"]
            }
          }
        })
      ]
    }
    ```
  #### 7）代码分离： splitChunksPlugin
    ```js
    module.exports = {
    ...
    optimization:{
            splitChunks:{
                chunks:"all"
            }
        }
    }
    ```
  #### 8）内联chunk: InlineChunkHtmlPlugin
  可以通过InlineChunkHtmlPlugin插件将一些chunk的模块内联到html，如runtime的代码（对模块进行解析、加载、模块信息相关的代码），代码量并不大，但是必须加载的
  ```js
  const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin')
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  module.exports = {
      ...
      plugin:[
          new InlineChunkHtmlPlugin(HtmlWebpackPlugin,[/runtime.+\.js/]
  }
  ```


### 4、如何提供webpack的构建速度
 #### 1） 优化loader配置
 #### 2） 合理化使用resolve.extensions
 #### 3） 优化resolve.modules
 #### 4） 优化resolve.alias
 #### 5） 使用DLLPlugin插件
 #### 6） 使用cache-loader
 #### 7） terser启动多线程
 #### 8） 合理使用sourceMap


## 六、Vue
### 1、Vue与React的对比
- 数据流向不同：React单向数据流，Vue双向数据流。
- 数据变化的实现原理不同： React用的是不可变数据，而Vue用的是可变的数据。
- 组件化通信的不同：react中我们通过使用回调函数来进行通信的，而Vue中子组件向父组件传递消息有两种方式：事件和回调函数。
- diff算法不同：react主要使用diff队列保存需要更新哪些DOM，得到patch树，再统一操作批量更新DOM。Vue 使用双向指针，边对比，边更新DOM

### 2、如何给SPA做SEO
- 1）SSR服务端渲染：将组件或页面通过服务器生成html，再返回给浏览器。
- 2）静态化
- 3）使用Pantomjs针对爬虫处理： 通过配置nginx，判断访问来源是否为爬虫，如果是则搜索引擎的爬虫请求转发到一个node server,在通过pantomjs来解析完整的html，返回给爬虫。

### 3、SPA首屏加载速度慢怎么解决
- 1）什么是首屏加载： 用户从浏览器输入，到第一个页面加载的时间。
  - 获取首屏时间: DomContentLoad, performance
    ```js
    // 方案一
    document.addEventListener('DOMContentLoaded', (event) => {
      
    })
    // 方案二
    performance.getEntriesByName("first-contentful-paint")[0].startTime
    // performance.getEntriesByName("first-contentful-paint")[0]
    // 会返回一个 PerformancePaintTiming的实例，结构如下：
    {
      name: "first-contentful-paint",
      entryType: "paint",
      startTime: 507.80000002123415,
      duration: 0,
    };
    ```
- 2）加载慢的原因
  - 网络延迟
  - 资源文件体积过大
  - 资源是否重复发送请求
  - 加载脚本的时候，渲染内容堵塞了
- 3）解决方案
  - **解决入口文件体积： 常用路由懒加载**
  - 静态资源本地缓存： 
    - **Http缓存**
    - **service Worker**
    - **合理利用localStorage**
  - **UI框架按需加载**: babel-import-plugin
  - 图片资源的压缩
  - **组件重复打包: minChunks**: 假设A.js文件是一个常用的库，现在有多个路由使用了A.js文件，这就造成了重复下载; 解决方案：在webpack的config文件中，修改CommonsChunkPlugin的配置
  - 开启Gzip压缩
    ```js
      // vue.config.js
      const CompressionPlugin = require('compression-webpack-plugin')
      configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
            config.mode = 'production'
            return {
                plugins: [new CompressionPlugin({
                    test: /\.js$|\.html$|\.css/, //匹配文件名
                    threshold: 10240, //对超过10k的数据进行压缩
                    deleteOriginalAssets: false //是否删除原文件
                })]
            }
        }
      }
      // express node
      const compression = require('compression')
      app.use(compression())  // 在其他中间件使用之前调用
    ```
  - **使用SSR**: nuxt.js next.js



### 4、说说你对Vue中mixin的理解，有什么使用场景
  是一个类，主要是放入公共代码，然后通入mixin选项，混入其中。**PS：当组件存在与mixin对象相同的选项的时候，进行递归合并的时候组件的选项会覆盖mixin的选项，但是如果相同选项为生命周期钩子的时候，会合并成一个数组，先执行mixin的钩子，再执行组件的钩子**

  ```js
  var myMixin = {
    created() {
      this.hello()
    },
    methods: {
      hello() {
        console.log("mixin")
      }
    }
  }
  // 局部
  Vue.component('componentA', {
    mixins: [MyMixin]
  })
  // 全局
  Vue.mixin({
    created: function () {
        console.log("全局混入")
      }
  })
  ```
  #### 1）使用场景
  我们经常会遇到在不同的组件中经常会需要用到相同或相似的代码，这些代码的功能相互独立，可以通过Vue的mixin将功能相同或相似的代码提出来
  ```js
  // 定义一个modal弹窗组件，内部通过isShowing来控制显示
  const Modal = {
    template: '#modal',
    data() {
      return {
        isShowing: false
      }
    },
    methods: {
      toggleShow() {
        this.isShowing = !this.isShowing;
      }
    }
  }
  // 定义一个tooltip提示框，内部通过isShowing来控制显示
  const Tooltip = {
    template: '#tooltip',
    data() {
      return {
        isShowing: false
      }
    },
    methods: {
      toggleShow() {
        this.isShowing = !this.isShowing;
      }
    }
  }

  // 首先抽出共同代码，编写一个mixin
  const toggle = {
    data() {
      return {
        isShowing: false
      }
    },
    methods: {
      toggleShow() {
        this.isShowing = !this.isShowing;
      }
    }
  }
  // 两个组件在使用上，只需要引入mixin
  const Modal = {
    template: '#modal',
    mixins: [toggle]
  };
  
  const Tooltip = {
    template: '#tooltip',
    mixins: [toggle]
  }
  ```
  #### 2）源码分析
  - 源码位置：/src/core/global-api/mixin.js
  ```js
    export function initMixin(Vue: GlobalAPI) {
      Vue.mixin = function(mixin: Object) {
        this.options = mergeOptions(this.options, mixin)
        return this
      }
    }
  ```
  - 主要是调用mergeOptions，位置：/src/core/util/options.js
  ```js
  export function mergeOptions(
    parent: Object,
    child: Object,
    vm?: Component
  ): Object {
    // 判断有没有mixin 也就是mixin里面挂mixin的情况 有的话递归进行合并
    if(child.mixins) {
      for(let i=0, l=child.mixins.length;i<l ; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm)
      }
    }

    const options = {}
    let key
    for (key in parent) {
       // 先遍历parent的key 调对应的strats[XXX]方法进行合并
      mergeField(key)
    }
    for(key in child) {
      // 如果parent已经处理过某个key 就不处理了
      if(!hasOwn(parent, key)) {
        mergeField(key)
      }
    }
    mergeField(key) {
      const strats = stract[key] || defaultStract
      options[key] = stract(parent[key], child[key], vm, key)
    }
    return options
  }
  ```
  - 合并策略： 替换型， 合并型， 队列型， 叠加型
  ```js
  // 替换型: 同名的props、methods、inject、computed会被后来者代替
  stracts.props = 
  stracts.methods = 
  stracts.inject = 
  stracts.computed = function(
    parentVal: ?Object,
    childVal: ?Object,
    vm?: Component,
    key: string
  ): ?Object {
    if(!parentVal) return childVal  // 如果parentVal没有值，直接返回childVal
    const ret = Object.create(null) // 创建一个第三方对象 ret
    extend(ret, parentVal)
    if(childVal) extend(ret, childVal)
    return ret
  }
  stracts.provide = mergeDataFn
  ```
  ```js
  // 合并型: data
  stract.data = function(parentVal, childVal, vm) {
    return mergeDataFn(parentVal, childVal, vm)
  }
  function mergeDataFn(parentVal, childVal, vm) {
    return function mergedInstanceDataFn() {
      var childData = childVal.call(vm, vm)
      var parentData = parent.call(vm, vm)
      if(childData) {
        return mergeData(childData, parentData) // 将2个对象进行合并
      }else {
        return parentData // 如果没有childData 直接返回parentData
      }
    }
  }
  function mergeData(to, from) {
    if(!from) return to
    var key, toVal, fromVal
    var keys = Object.keys(from)
    for(var i=0;i<keys.length; i++) {
      key = keys[i]
      toVal = to[key]
      fromVal = from[key]
       // 如果不存在这个属性，就重新设置
      if(!to.hasOwnProperty(key)) {
        set(to, key, fromVal)
      }
      // 存在相同属性，合并对象
      else if(typeof toVal == "object" && typeof fromVal =="object") {
        mergeData(toVal, fromVal)
      }
    }
    return to
  }
  ```

  ```js
  // 队列型： 全部生命周期和watch, 合并成数组，正序遍历执行
  function mergeHook(
    parentVal: ?Array<Function>,
    childVal: ?Function | ?Array<Function>
  ): ?Array<Function> {
    return childVal ? 
      parentVal 
      ? parentVal.concat(childVal) 
      : Array.isArray(childVal) 
        ? childVal
        : [childVal]
    : parentVal
  }
  LIFECYCLE_HOOKS.forEach(hook => {
    stracts[hook] = mergeHook
  })
  // watch
  stract.watch = function(
    parentVal, 
    chilVal,
    vm,
    key
  ) {
    // work around Firefox's Object.prototype.watch...
    if (parentVal === nativeWatch) { parentVal = undefined; }
    if (childVal === nativeWatch) { childVal = undefined; }
     /* istanbul ignore if */
    if (!childVal) { return Object.create(parentVal || null) }

    {
      assertObjectType(key, childVal, vm);
    }
    if (!parentVal) { return childVal }
    var ret = {};
    extend(ret, parentVal);
    for (var key$1 in childVal) {
      var parent = ret[key$1];
      var child = childVal[key$1];
      if (parent && !Array.isArray(parent)) {
        parent = [parent];
      }
      ret[key$1] = parent
        ? parent.concat(child)
        : Array.isArray(child) ? child : [child];
    }
    return ret
  }
  ```
  ```js
  // 叠加型： component, directives, filters
  strats.component = 
  strats.directives = 
  strats.filter = function mergeAssets (parentVal, childVal, vm, key) {
    var res = Object.create(parentVal || null)
    if(childVal) {
      for(var key in childVal) {
        res[key] = childVal(key)
      }
    }
    return res
  }

  ```

### 5、说说你对slot的理解，slot的使用场景有哪些？
可以在组件中自定义自己所需要的内容
```js
  // 定义
  <template id="element-details-template">
    <slot name="element-name">Slot template</slot>
  </template>

  // 使用
  <element-details>
    <span slot="element-name">1</span>
  </element-details>
  <element-details>
    <span slot="element-name">2</span>
  </element-details>
```
```js
customElement.define('element-details', 
  class extends HTMLElement {
    constructor() {
      super()
      const template = document.getElementById('element-details-template').content
      const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(template.cloneNode(true))
    }
  }
)
```
#### 1) 分类
  - 默认插槽
  - 具名插槽
  ```vue
  <!-- 子组件 -->
  <template>
    <slot>插槽后备的内容</slot>
    <slot name="content">插槽后备的内容</slot>
  </template>

  <!-- 父组件 -->
  <child>
    <template v-slot:default>具名插槽</template>
     <template v-slot:content>内容...</template>
  </child>
  ```
  - 作用域插槽
  ```vue
  <!-- 子组件 -->
  <template>
    <slot name="footer" testProps="子组件的值">
      <h3>没传footer插槽</h3>
    </slot>
  </template>
  <!-- 父组件 -->
  <child>
    <template v-slot:footer="slotProps">
       来⾃⼦组件数据：{{slotProps.testProps}}
    </template>
    <template #footer="slotProps">
      来⾃⼦组件数据：{{slotProps.testProps}}
    </template>
  </child>
  ```
  #### 2) 原理分析： slot本质上是一个返回VNode的函数
  ```js
    // 编写一个buttonCounter组件，使用匿名插槽
    Vue.component('button-counter', {
      template: '<div><slot>我是默认内容</slot></div>'
    })
    // 使用该组件
    new Vue({
      el: '#app',
      template: '<button-counter><span>我是slot传入内容</span></button-counter>',
      component:{buttonCounter}
    })
  ```
  ```js
  // 获取buttonCounter组件渲染函数
  (function anonymous() {
    with(this) {return _c('div', [_t('default', [_v('我是默认内容')])], 2)}
  })
  // _v表示穿件普通文本节点，_t表示渲染插槽的函数
  ```
  ```js
  // 渲染插槽函数renderSlot（做了简化）
  function renderSlot(name, fallback, props, bindObject) {
     // 得到渲染插槽内容的函数 
    var scopedSlotFn = this.$scopedSlots[name]
    var nodes
    // 如果存在插槽渲染函数，则执行插槽渲染函数，生成nodes节点返回
    // 否则使用默认值
    nodes = scopedSlotFn(props) || fallback
    return nodes
  }
  ```
  ```js
  // 关于this.$scopredSlots是什么，我们可以先看看vm.slot
  function initRender(vm) {
     ...
    vm.$slots = resolveSlots(options._renderChildren, renderContext)
     ...
  }
  // resolveSlots函数会对children节点做归类和过滤处理，返回slots
  function resolveSlot(children, context) {
     if(!children || !chidren.length) {
       return {}
     }
     var slots = {}
     for(var i=0,l=children.length; i<l; i++) {
      var child= children[i]
      var data = child.data
      if(data && data.attrs && data.attrs.slot) {
         delete data.attrs.slot
       }
      if((child.context===context|| child.fnContext === context) && data && data.slot != null) {
        // 如果slot存在(slot="header") 则拿对应的值作为key
        var name = data.slot;
        var slot = (slots[name] || (slots[name] = []));
         // 如果是tempalte元素 则把template的children添加进数组中，这也就是为什么你写的template标签并不会渲染成另一个标签到页面
        if (child.tag === 'template') {
          slot.push.apply(slot, child.children || []);
        } else {
          slot.push(child);
        }
      } else {
        // 如果没有就默认是default
        (slots.default || (slots.default = [])).push(child);
      }
    }
    for (var name$1 in slots) {
      if (slots[name$1].every(isWhitespace)) {
        delete slots[name$1];
      }
    }
    return slots
  }

  // _render渲染函数通过normalizeScopedSlots得到vm.$scopedSlots
  vm.$scopeSlot = normalizeScopeSlots( _parentVnode.data.scopedSlots, vm.$slots, vm.$scopedSlots)
  ```


### 6、你了解Vue的diff算法吗？说说看
通过同层的树节点，进行高效比较的算法： 比较只会在同层；diff比较过程中，循环从两边向中间比较
#### 1） 比较方式：深度优先，同层比较
#### 2） 原理分析：当数据发生变化，set方法会调用Dep.notify通知所有订阅者Watcher,订阅者就会调用patch给真是的DOM打补丁，更新相应的视图
  - 当数据发生改变时，订阅watcher就会调用patch给真实的dom打补丁
  - 通过isSameOne进行判断，相同则调用patchVnode方法
  - patchVnode做了一下操作：
    - 如果找到对应的dom，称为el
    - 如果都有文本节点且不相等，将el的文本节点设置为Vnode的文本节点
    - 如果oldVnode有子节点而Vnode没有，则删除el的子节点
    - 如果oldVnode没有子节点而Vnode有，则将VNode的子节点真实化后加到el
    - 如果两者都有子节点，则执行updateChildren函数比较子节点
  - updateChildren主要做了以下操作：
    - 设置新旧Vnode的头尾指针
    - 新旧头尾指针进行比较，循环向中间靠拢，根据情况调用patchNode进行patch重复流程，调用createElem创建一个新的节点，从哈希表寻找key一致的Vnode节点再分情况操作

### 7、SSR解决了什么问题？有做过SSR吗？你是怎么做的？
- Vue SSR 是一个在SPA上进行改良的服务端渲染
- 通过 Vue SSR渲染的页面，需要在客户端激活才能实现交互
- Vue SSR包含两个部分：服务端渲染的首屏，包含交互的SPA
#### 1）解决以下两种问题
  - seo
  - 首屏呈现渲染
#### 2）小结
  - 使用ssr不存在单例模式，每次用户请求都会创建一个新的Vue实例
  - 实现ssr需要实现服务端的首屏渲染和客户端激活
  - 服务端异步获取数据asyncData可以分为首屏异步获取和切换组件获取
    - 首屏异步获取数据，在服务端渲染的时候就应该已经完成
    - 切换组件通过mixin混入，在beforeMount钩子完成数据获取
#### 3）个人理解
ssr分为客户端和服务端，服务端拿到首屏渲染的页面，组合成html给客户端，同时客户端将对应的路由和store等数据在加载的时候进行处理，之后用户访问的其实还是一个SPA页面。

### 8、Vue.observable你有了解过吗？ 说说看
  可以理解为监听者模式的实现
  #### 1) 使用场景
  ```js
    // 引入vue
    import Vue from 'vue'
    // 创建state对象，使用observable让state对象可响应
    export let  state = Vue.observable({
      name: 'xxx',
      age: 18
    })
    export let mutations = {
      changeName(name) {
        state.name = name
      },
      setAge(age) {
        state.age = age
      }
    }

  ```
  ```ts
  <template>
    <div>
      姓名：{{ name }}
      年龄：{{ age }}
      <button @click="changeName('李四')">改变姓名</button>
      <button @click="setAge(18)">改变年龄</button>
    </div>
  </template>

  import { state, mutations } from '@/store'
  export default {
    // 在计算属性中拿到值
    computed: {
      name() {
      return state.name
    },
    age() {
      return state.age
    }
    },
    // 调用mutations里面的方法，更新数据
    methods: {
      changeName: mutations.changeName,
      setAge: mutations.setAge
    }
  }
  ```

  #### 2）原理分析
  ```js
  // 位置：src\core\observer\index.js
  export function observe(value: any, asRootData: ?boolean): Observer | void {
    if(!isObject(value) || value instanceof VNode) {
      return
    }
    let ob: Observer | void
    // 判断是否存在__ob__响应式属性
    if(hasOwn(value,'__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__
    }else if(shouldObserve && !isServerRendering() && 
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtendsible(value) ** !value._isVue) {
      // 实例化observer响应对象
      ob = new Observer(value)
    } 
    if(asRootData && ob) {
      ob.vmCount++
    }
    return ob
  }
  ```
  ```js
  // Observer 类
  export class Observer {
    value: any;
    dep: Dep;
    vmCount: number;

    construtor(value: any) {
      this.value = value
      this.dep = new Dep()
      this.vmCount = 0
      def(value, '__ob__', this)
      if(Array.isArray(value)) {
        if(hasProto) {
          protoAugment(value, arrayMethods)
        }else {
          copyAugment(value, arrayMethods, arrayKeys)
        }
        this.observeArray(value)
      }else {
        // 实例化是一个对象，进入walk方法
        this.walk(value)
      }
    }
  }
  // walk函数
  walk(obj: Object) {
    const keys = Object.keys(obj)
    for(let i=0; i<keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
  // defineReactive方法
  export function defineReactive(
    obj: Object,
    key: string,
    val: any,
    customSetter?: ?Function,
    shallow?: boolean
  ) {
    const dep = new Dep()
    const property = Object.getOwnPropertyDescriptor(obj, key)
    if(property && property.configurable === false) {
      return
    }
    const getter = property && property.set
    const setter = property && property.set
    if((!getter || setter) && arguments.length === 2) {
      val = obj[key]
    }
    let childOb = !shallow && observe(val)
    // 接下来调用Object.defineProperty()给对象定义响应式属性
    Object.defineProperty(obj, key, {
      enumerable: true, 
      configurable: true,
      get: function reactiveGetter () {
        const value  = getter ? getter.call(obj) : val
        if(Dep.target) {
          dep.depend()
          if(childOb) {
            childOb.dep.depend()
            if(Array.isArray(value)) {
              dependArray(value)
            }
          }
        }
        return value
      },
      set: function reactiveSetter(newVal) {
        const value = getter ? getter.call(obj) : val
        if(newVal === value || (newVal !== newVal && value !== value)) {
          return
        }
        if(process.env.NODE_ENV !== 'production' && customSetter) {
          customSetter()
        }
        if(getter && !setter) return 
        if(setter) {
          setter.call(obj, newVal)
        }else {
          val = newVal
        }
        childOb = !shallow && observe(newVal)
        // 对观察者watchers进行通知,state就成了全局响应式对象
        dep.notify()
      }
    })
  }
  ```

### 9、Vue3.0的设计目标是什么？做了哪些优化
  #### 1）设计目标
  - 更小：移除不常用的API，引入tree-shaking
  - 更快：体现在编译方面，diff算法优化、静态提升、事件监听缓存和ssr优化
  - 更友好： 兼容option API, 引入composition API, 大大增加了代码的逻辑组织和代码复用
  ```js
    import { toRefs, reactive } from 'vue'
    function useMouse() {
      const state = reactive({x:0,y:0})
      const update = e => {
        state.x = e.pageX
        state.y = e.pageY
      }
      onMounted(() => {
        window.addEventListener('mousemove',update)
      })
      onUnMounted(() => {
        window.removeEventListener('mousemove',update)
      })
      return toRefs(state)
    }
  ```
  #### 2）优化方案：源码、性能、语法API
  - 源码： 源码管理和typescript
  - 性能： 体积优化、编译优化、数据劫持优化
  - 语法API：composition API, 优化逻辑组织，优化逻辑复用

### 10、Vue3的性能主要通过哪些方面体现的？
#### 1）编译阶段
  - diff算法优化：在diff算法中添加了静态标记
  - 静态提升：对不参与更新的元素，会做静态提升，只会被创建一次，在渲染时直接复用
  - 事件监听缓存
  - SSR优化
#### 2）源码体积
  移除一些不常用的API，引入tree shaking, 在任何一个函数，如ref， reavtived, computed等，仅仅在用的时候才打包，没有用到的模块都被摇掉，打包的整体体积变小。
#### 3）响应式系统
  - 可以监听动态属性的添加
  - 可以监听到数组的索引和数组length属性
  - 可以监听删除属性

### 11、**用Vue3.0写过组件吗？ 如果想实现一个Modal你会怎么设计？**

### 12、keep-alive原理分析
- 疑问：缓存了实例，是怎么实现拿缓存中的实例而没有更新的，换句话说，缓存的实例是通过什么方式显示出来的，我能想到的是重新渲染，但是如果重新渲染是耗费很大的资源的。就是，实例我缓存了，那么渲染那一步是怎么做到的？
- 源码位置：src/core/components/keep-alive.js
```js
export defaut {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number]
  },

  created() {
    this.cache = Object.create(null)
    this.keys = []
  },

  destory() {
    for( const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },

  mounted() {
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })

    this.$watch('exclude', val => {
      prunCache(this, name => !matches(val, name))
    })
  }

  render() {
    const slot = this.$slot.default
    const vnode = getFristComponentChild(slot)
    const componentOptions = vnode && vnode.componentOptions

    if(componentOptions) {
      const name = getComponentName(componentOptions)
      const {include, exclude} = this
      if(
        (include && (!name || !matches(include, name))) || 
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      const { cache, keys } = this
      const key = vnode.key == null ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '') : vnode.key

      if(cache[key]) {
        vnode.componentInstance = cache[key].componentInstance
        remove(keys, key)
        keys.push(key)
      }else {
        cache[key] = vnode
        keys.push(key)
        if(this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }
      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
  }
}
```



### 13、Vue中组件和插件有什么区别？
#### 1）组件：将图形界面和非图形界面整合的一套代码，称为组件，比如说.vue文件就是一个组件。
#### 2）插件：用来给vue添加全局功能的
  - 添加全局方法或属性
  - 添加全局资源
  - 通过全局混入来添加一些组件选项，如vue-router
  - 添加Vue的实例方法，在Vue.prototype上实现
  - 一个库，提供自己的API
#### 3）区别：编写形式、注册形式、使用场景
- 编写
  ```js
  // 插件编写
  MyPlugin.install = function(Vue, options) {
    // 1、添加全局方法或property
    Vue.myGlobalMethod = function() {
      // 逻辑
    }
    // 2、添加全局资源
    Vue.directive('my-directive', {
      bind(el, binding, vnode, oldVnode) {
        // 逻辑
      }
    })
    // 3、注入组件选项
    Vue.mixin({
      created: function(){
        // 逻辑
      }
    })
    // 4、添加实例方法
    Vue.prototype.$myMethod = function(methodOptions) {
      // 逻辑
    }
  }
  ```
- 注册
```js
  //插件注册
  Vue.use(插件名称， {/*……*/})
```



### 14、Vue组件的通信方式
- props
- emit
- ref
- vuex
- eventBus
- $attr, $listener
- provide, inject
- $parrent, $root

### 15、双向绑定的原理：属性接触+订阅发布模式+compiler

### 16、谈谈nextclick的理解
- 前提： vue更新Dom是异步的
- 源码位置： /src/core/util/next-tick.js
```js
export function nextTick(cb?: Function, ctx?: Object) {
  let _resolve

  callbacks.push(() => {
    if(cb) {
      try {
        cb.call(ctx)
      }catch(e) {
        handleError(e, ctx, 'nextTick')
      }
    }else if(_resolve) {
      _resovle(ctx)
    }
  })
  if(!pending) {
    pending = true
    timerFunc()
  }
  if(!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```
```js
export let isUsingMicroTack = false
if(typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resovle()
  timerFunc = () => {
    p.then(flushCallbacks)
    if(isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
}else if(!isIE && typeof MutationObserver !== 'undefined' && 
  isNative(MutationObserver) ||
  MutationObserver.toString() === '[object MutationObserverConstructor]') {
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
}else if(typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  //判断3：是否原生支持setImmediate ?? nodejs?
  timerFunc = () => {
    setImmediate(flushCallbacks)
  }
}else {
  //判断4：上面都不行，直接用setTimeout
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

function flushCallbacks() {
  pending = false
  const copies = callbacks.slice(0)
  callbacks.length = 0
  for(let i= 0; i<copies.length; i++) {
    copies[i]()
  }
}
```


### 17、Vue中key的原理
 ```
 key值主要是vnode的唯一id， 也是diff算法的一种优化策略，更准确、更快的去寻找vnode节点
 ```
 - 源码位置：core/vdom/patch.js
 ```js
 function sameVnode(a, b) {
   return (
     a.key === b.key && (
       (a.tag === b.tag) && a.isComment === b.isComment && 
       isDef(a.data) === isDef(b.data) &&
       sameInputType(a,b)
     ) || (
       isTrue(a.isAsyncPlaceholder) &&
       a.asyncFactory === b.asyncFactory &&
       idUndef(b.asyncFactory.error)
     )
   )
 }

 function updateChildren(parentElem, oldCh, newCh, insertedVnodeQueue, removeOnly) {
   // ...
   while(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
     if (isUndef(oldStartVnode)) {
            ...
        } else if (isUndef(oldEndVnode)) {
            ...
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
            ...
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
            ...
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
            ...
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
            ...
        } else {
          if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)
          idxInOld = isDef(newStartVnode.key)
                ? oldKeyToIdx[newStartVnode.key]
                : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
          if (isUndef(idxInOld)) { // New element
                createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
            } else {
                vnodeToMove = oldCh[idxInOld]
                if (sameVnode(vnodeToMove, newStartVnode)) {
                    patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
                    oldCh[idxInOld] = undefined
                    canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
                } else {
                    // same key but different element. treat as new element
                    createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
                }
            }
            newStartVnode = newCh[++newStartIdx]
        }
   }
 }
 ```

### 18、你有写过自定义指令吗？ 自定义指令的应用场景有哪些
#### 1）什么是指令
  v-开头的行内属性，都是指令，如v-model, v-show
#### 2）如何实现：全局注册、局部注册
```js
// 1、全局注册
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function(el) {
    el.focus()
  }
})
// 2、局部注册
directives: {
  focus: {
    inserted: function(el) {
      el.focus()
    }
  }
}

// 3、使用
<input v-focus>
```
#### 3）应用场景
- 输入框防抖
```js
Vue.directive('throttle', {
  bind: (el, binding) => {
    let throttleTime = binding.value
    if(!throttleTime) {
      throttleTime = 2000
    }
    let cbFun
    el.addEventListener('click', event => {
      if(!cbFun) {
        cbFn = setTimeout(() => {
          cbFn = null
        }, throttleTime)
      }else {
        event && event.stopImmediatePropagation()
      }
    }, true)
  }
})

// 为button标签设置v-throttle自定义指令
<button @click="sayHello" v-throttle>提交</button>
```
- 图片懒加载
```js
const lazyLoad = {
  install(Vue, options) {
    // 代替图片的loading图
    let defaultSrc = options.default
    Vue.directive('lazy', {
      bind(el, binding) {
        LazyLoad.init(el, binding.value, defaultSrc)
      },
      inserted(el) {
        // 兼容处理
        if('InsectionObserver' in window) {
          LazyLoad.observe(el)
        }else {
          LazyLoad.listenerScroll(el)
        }
      }
    })
  },
  init(el, val, ref) {
    // data-src 储存真实src
    el.setAttribute('data-src', val)
    // 设置src为loading图
    el.setAttribute('src', def)
  },
  // 利用IntersectionObserver监听el 
  observe(el) {
    let io = new IntersectionObserver(entries => {
      let realSrc = el.dataset.src
      if(entries[0].isIntersecting) {
        if(realSrc) {
          el.src = realSrc
          el.removeAttribute('data-src')
        }
      }
    })
    io.observe(el)
  },
  listenerScroll(el) {
    let handler = LazyLoad.throttle(LazyLoad.load, 300)
    LazyLoad.load(el)
    window.addEventListener('scroll', () => {
      handler(el)
    })
  },
  // 加载真实图片
  load(el) {
    let windowHeight = document.documentElement.clientHeight
    let elTop = el.getBoundingClientRect().top
    let elBtm  = el.getBoundingClientRect().bottom
    let realSrc = el.dataset.src
    if(elTop - windowHeight < 0 && elBtm > 0) {
      if(realSrc) {
        el.src = realSrc
        el.removeAttribute('data-src')
      }
    }
  },
  // 节流
  throttle(fn, delay) {
    let timer
    let prevTime
    return function(...arg) {
      let curTime = Date.now()
      let context = this
      if(!prevTime) prveTime = curTime
      clearTimeout(timer)
      if(curTime - prevTime > delay) {
        prevTime = curTime
        fn.apply(fn, args)
        clearTimeout(timer)
        return 
      }
      timer = setTimeout(function() {
        prevTime = Date.now()
        timer = null
        fn.apply(fn, args)
      }, delay)
    }
  }
}
export default LazyLoad
```
- 一键Copy的功能
```js
import { Message } from 'ant-design-vue'

const vCopy = {
  bind(el, {value}) {
    el.$value = value
    el.handler = () => {
      if(!el.$value) {
        // 值为空的时候，给出提示，我这里的提示是用的 ant-design-vue 的提示，你们随意
        Message.warning('无复制内容');
        return;
      }
      const textarea = document.createElment('textarea')
      textarea.readOnly = 'readonly'
      textarea.style.position = 'absolute'
      textarea.value.left = '-9999px'
      textarea.value = el.$value
      document.body.appendChild(textarea)
      textarea.select()

      const result = document.execCommand('copy')
      if(result) {
        Message.success('复制成功');
      }
      document.body.removeChild(textarea);
    }
    el.addEventListener('click', el.handler)
  },
  componentUpdate(el, {value}) {
    el.$value = value
  }
  unbind(el) {
    el.removeEventListener('click', el.handler)
  }
}
```

### 19、什么是虚拟DOM？如何实现一个虚拟DOM，说说你的思路
是一个对象，是对真实DOM的抽象，用对象属性来描述节点，通过一系列的操作映射到真实的DOM上。
#### 1）为什么需要虚拟DOM
  提高页面性能
#### 2）如何实现虚拟DOM
```js
// 源码位置：src/core/vdom/vnode.js
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void;
  functionalContext: Component | void;
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void;
  parent: VNode | void;
  raw: boolean;
  isStatic: boolean;
  isRootInsert: boolean;
  isComment: boolean;
  isCloned: boolean;
  isOnce: boolean;

  constructor(
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions
  ) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.ns = undefined;
    this.context = context;
    /*函数化组件作用域*/
    this.functionalContext = undefined
    /*节点的key属性，被当作节点的标志，用以优化*/
    this.key = data && data.key
    /*组件的option选项*/
    this.componentOptions = componentOptions
    /*当前节点对应的组件的实例*/
    this.componentInstance = undefined
    /*当前节点的父节点*/
    this.parent = undefined
    /*简而言之就是是否为原生HTML或只是普通文本，innerHTML的时候为true，textContent的时候为false*/
    this.raw = false
    /*静态节点标志*/
    this.isStatic = false
    /*是否作为跟节点插入*/
    this.isRootInsert = true
    /*是否为注释节点*/
    this.isComment = false
    /*是否为克隆节点*/
    this.isCloned = false
    /*是否有v-once指令*/
    this.isOnce = false
  }

  get child(): Component | void {
    return this.componentInstance
  }
}
```

```js
// vue是通过createElement生成VNode的
// 源码地址: src/core/vdom/create-element.js
export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
) {
  // ...
  return _createElement(context, tag, data, children, normalizationType)
}

export function __createElement(
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode | Array<VNode> {

}
```
#### 3) 小结
createElement 创建 VNode 的过程，每个 VNode 有 children，children 每个元素也是一个VNode，这样就形成了一个虚拟树结构，用于描述真实的DOM树结构

### 20、基于axios请求封装，axios原理分析
#### 1）封装
- 请求头
- 请求拦截
- 响应拦截
- method方法
- 开发、测试环境的baseUrl
##### 2）原理分析
```js
// 1、axios(config) // 直接传入配置
// Axios 类
class Axios {
  constructor() {
    this.interceptors = {
      request: new InterceptorManage, // ?
      response: new InterceptorManage
    }
  }
  request(config) {
    let chain = [this.sendAjax.bind(this), undefined]
    this.interceptors.request.handlers.forEach(interceptor => {
      chain.unshift(interceptors.fufilled, interceptors.rejected)
    })

    // 响应拦截
    this.interceptors.response.handlers.forEach(interceptor => {
      chain.push(interceptor.fullfield, interceptor.rejected)
    })

    let promise = Promise.resolve(config)
    // 一次性 shift 两个，执行拦截器，再执行sendAjax
    while(chain.length > 0) {
      promise = promise.then(chain.shift(), chain.shift())
    }
    return promise
    // chains大概是['fulfilled1','reject1','fulfilled2','reject2','this.sendAjax','undefined','fulfilled2','reject2','fulfilled1','reject1'] ???
    // 为什么我得出的是 chains大概是['fulfilled1','reject1','this.sendAjax','undefined','fulfilled2','reject2']
  }
  sendAjax(config) {
    return new Promise(resolve => {
      const {url = '', method='get', data={}} = config
      const xhr = new XMLHttpRequest()
      xhr.open(method, url, true)
      xhr.send(data)
      xhr.onload = function() {
        resovle(xhr.responseText)
      }
    })
  }
}
// 导出axios实例
function CreateAxiosFn() {
  const axios = new Axios()
  let req = axios.request.bind(axios)
  // 实现axios.method形式：定义get,post...方法，挂到Axios原型上 
  utils.extend(req, Axios.prototype, axios)
  utils.extend(req, axios)
  return req
}
let axios = new CreateAxiosFn()



// 2、实现axios.method形式：定义get,post...方法，挂到Axios原型上
const methodsArr = ['get', 'delete', 'head', 'options', 'put', 'patch', 'post']
methodArr.forEach(met => {
  Axios.prototype[met] = function () {
    if(['get', 'delete', 'head', 'options'].includes(met)) { // 2个参数(url[, config])
      return this.request({
        method: met,
        url: arguments[0],
        ...arguments[1] || {}
      })
    }else { // 3个参数(url[,data[,config]])
      return this.request({
        method: met,
        url: arguments[0],
        data: arguments[1] || {},
        ...arguments[2] || {}
      })
    }
  }
})

const utils = {
  extend(a, b, context) {
    for(let key in b) {
      if(b.hasOwnProperty(key)) {
        if(typeof b[key] === 'function') {
          a[key] = b[key].bind(context)
        }else {
          a[key] = b[key]
        }
      }
    }
  }
}
```
```js
// 3、拦截器的构造函数
class InterceptorManage {
  constructor() {
    this.handlers = []
  }

  use(fullfield, rejected) {
    this.handlers.push({
      fulllfield,
      rejected
    })
  }
}
```

### 21、Vuex

## 七、Nodejs
### 1、nodejs的理解，优缺点，应用场景
#### 1）应用场景
- 用户表单收集系统、后台管理系统、实时交互系统、考试系统、联网软件、高并发量应用系统
- 基于web、canvas等多人联网游戏
- 基于web的多人实时聊天客户端、聊天室、图文直播
- 单页面浏览应用程序
- 操作数据库、为前端和移动端提供基于json的API
### 2、Nodejs有哪些全局对象
分成两类，一个是真正的全局对象，另一个是模块级别的全局对象。
#### 1）真正的全局对象
- Class:Buffer: 可以处理二进制或Unicode编码的数据
- process: 进程对象，提供有关当前进程的信息和控制
```js
node app.js arg1 arg2 arg3
process.argv.forEach((val, inde) => {
  console.log(`${index}: ${val}`)
})
// 0:/usr/local/bin/node
// 1:/Users/mjr/work/node/process-args.js
// 2:参数1
// 3:参数2
// 4:参数3
```
- console：打印stdout和stderr
- clearInterval, setInterval
- clearTimeout, setTimeout
- global
```js
console.log(process === global.process) // true
```
#### 2）模块级别的全局变量
- __dirname: 当前文件所在的路径，不包括后面的文件名
  ```js
  // 从 /Users/mjr 运行 node example.js
  console.log(__dirname);
  // 打印: /Users/mjr
  ```
- __filename: 获取当前文件所在的路径及文件名，包括后面的文件
  ```js
  // 从 /Users/mjr 运行 node example.js
  console.log(__filename);
  // 打印: /Users/mjr/example.js
  ```
- exports
- module
- require
### 3、说说对Node中process的理解？有哪些常用的方法？
process是一个对象，提供了有关当前nodejs进程的信息并对其进行控制，
#### 1）属性与方法
- process.env
- process.nextTick
- process.pid
- process.ppid
- process.cwd()
- process.platform: 获取当前运行的操作系统
- process.uptime()
- 进程事件：process.on('xxx',cb)
- 三个标准流：process.stdout, process.stdin, process.stderr
- process.title
### 4、说说对Node中的fs模块的理解？有哪些常用的方法？
### 5、说说对中间件概念的理解，如何封装node中间件？
#### 1）是什么？
在nodejs中，中间件主要指封装http请求细节的处理方法
#### 2）封装（针对koa进行中间件封装）
```js
// koa的中间件就是函数，可以是async函数，或者普通函数
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
})

// 普通函数
app.use((ctx, next) => {
  const start = Date.now();
  return next().then(() => {
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  })
})
```
```js
// token校验
module.exports = (options) => async (ctx, next) {
  try {
    // 获取 token
    const token = ctx.header.authorization
    if(token) {
      try {
        await verify(token)
      }catch(err) {
        console.log(err)
      }
      // 进入下一个中间件
      await next()
    }
  }catch(err) {
    console.log(err)
  }
}
```

```js
// 日志模块
const fs = require('fs')
module.exports = (options) => async (ctx, next) => {
  const startTime = Date.now()
  const requestTime = new Date()
  await next()
  const ms = Date.now() - startTime;
  let logout = `${ctx.request.ip} -- ${requestTime} -- ${ctx.method} -- ${ctx.url} -- ${ms}ms`;
  // 输出日志文件
  fs.appendFileSync('./log.txt', logout + '\n')
}
```

```js

```

#### 3）总结
- 在实现中间件的时候，单个中间件应该足够简单，职责单一，中间件的代码编写应该高效，必要的时候通过缓存重复获取数据
- koa本身比较简洁，但是通过中间件的机制能够实现各种所需要的功能，使得web应用具备良好的可扩展性和组合性
- 通过将公共逻辑处理编写在中间件中，可以不用在每一个接口回调中做相同的代码编写，减少冗杂代码，过程就如装饰者模式。
### 6、如何实现jwt鉴权机制，说说你的思路？
#### 1）是什么？
JWT，json web token，本质就是一个字符串书写规范，作用是用来在用户和服务器之间传递安全可靠的信息。

在前后端分离的开发过程中，使用token鉴权机制用于身份验证是最常见的方案，流程如下：
- 服务器当验证用户账号和密码正确的时候，给用户颁发一个令牌，这个令牌作为后续用户访问一些接口的凭证；
- 后续访问会根据这个令牌判断用户是否有权限访问
#### 2）如何实现
- 生成token: 登录成功的时候，颁发token
- 验证token: 访问某些资源或接口时，验证token

```js
// 1) 生成token， 采用三方库jsonwebtoken
const crypto = require('crypto'), jwt = require('jsonwebtoken')
// TODO:使用数据库
// 这里应该是用数据库存储，这里只是演示用
let userList = []

class UserController {
  static async login(ctx) {
    const data = ctx.request.body
    if (!data.name || !data.password) {
      return ctx.body = {
        code: "000002", 
        message: "参数不合法"
      }
    }
    const result = userList.find(item => item.name === data.name && item.password === crypto.createHash('md5').update(data.password).digest('hex'))
    if(result) {
      const token = jwt.sign(
        {
          name: result.name
        },
        "test_token",
        {expiration: 60*60}
      )
      return ctx.body = {
        code: "0",
        message: "登录成功",
        data: {
          token
        }
      }
    } else {
      return ctx.body = {
        code: "000002",
        message: "用户名或密码错误"
      };
    }
  }
}

module.exports = UserController
```

```js
// 2) 前端接收到token后，一般情况会通过localStoragen进行缓存，然后将token放到HTTP的Authorization中
axios.interceptores.request.use(config => {
  const token = localStorage.getItem('token')
  config.headers.common['Authorization'] = 'Bearer ' + token
  return config
})
```

```js
// 3) 校验token， 使用koa-jwt中间件进行校验
app.use(koajwt({
  secret: 'test_token'
}).unless({ // 配置白名单
  path: [/\/api\/register/, /\/api\/login/]
}))
```

```js
// 4) 获取token用户的信息如下
router.get('/api/userInfo', async (ctx, next) => {
  const authoriztion = ctx.header.authorization // 获取jwt
  const token = authorization.replace('Beraer ','')
  const result = jwt.verify(token, 'test_token')
  return result
})
```



## 八、TypeScript
### 1、说说你对typescript理解，与javascript的区别？
typescript是javascript的类型的超集，支持面向对象编程的概念，如类，接口，继承，泛型
### 2、说说你对typescript中高级类型的理解，有哪些？
#### 1）有哪些？
- 交叉类型： 通过&将多个类型合并成一个类型，包含了所需的所有类型的特性，本质上是一种操作语法
  ```ts
  // T & U
  function extend<T, U>(first: T, second: U): T & U {
    let result: <T & U> = {}
    for(let key in first) {
      result[key] = first[key]
    }
    for(key in second) {
      if(!result.hasOwnProperty(key)) {
        result[key] = second[key]
      }
    }
    return result
  }
  ```
- 联合类型: T | U, 联合类型的语法规则和逻辑“或”的符号一致
  ```ts
  function formatCommandline(command: string[] | string) {
    let line = ''
    if(typeof command === 'string') {
      line = command.trim()
    }else{
      line = command.jion(' ').trim()
    }
  }
  ```
- 类型别名： 给类型起一个新名字
  ```ts
  // 1）基本使用
  type some = boolean | string

  const b: some = true
  const c: some = 'hello'
  const d: some = 123 // 不能将类型“123”分配给类型“some”
  
  // 2）类型别名可以是泛型
  type Container<T> = {value: T}

  // 3）使用类型别名在属性里引用自己
  type Tree<T> = {
    value: T,
    left: Tree<T>,
    right: Tree<T>
  }
  ```
- 类型索引: keyof， 用于获取一个接口中Key的联合类型
  ```ts
  interface Button {
    type: string
    text: string
  }

  type ButtonKeys = keyof Button
  // 等效于
  type ButtonKeys = "type" | "text"
  ```
- 类型约束：通过关键字 extend 进行约束，不同于在class 后使用extends，泛型内使用主要作用是对泛型加以约束
  ```ts
  type BaseType = string | number | boolean
  function copy<T extends BaseType>(args: T): T {
    return args
  }

  function getValue<T, K extends keyof T>(obj: T, key: K) {
    return obj[key]
  }

  const obj = { a: 1 }
  const a = getValue(obj, 'a')
  ```

- 映射类型: 通过 in 关键字做类型的映射，遍历已有接口的key或者遍历联合类型
  ```ts
  type Readonly<T> = {
    readonly [P in keyof T]: T<P>
  }
  interface Obj {
    a: string
    b: string
  }
  type ReadonlyObj = ReadOnly<Obj>
  ```
- 条件类型
  ```ts
  T extends U ? X : Y
  ```
## 三十、衍生问题
### 1、nodejs 爬虫实现
### 2、对比Vue3的Teleport， React中的portal传送门
### 3、MutationObserver
### 4、vue2中的defineReactive函数，创建响应式对象
### 5、stopImmediatePropagation：阻止绑定在该元素的其他事件被调用 +1
如果多个事件监听被附加到相同元素得相同事件类型上，当此事件触发时，它们会按其被添加得顺序被调用。如果在其中一个事件监听器中只想stopImmediatePropagation(),那么剩下的事件监听器都不会被调用。
### ~~6、单例模式,参考fe_difficuty~~
### 7、断点续传的实现、断点下载
### 8、装饰者设计模式
### 9、冒泡排序，快速排序
### 10、window.requestIdleCallback
### 11、编码类型: base64, rsa256
### 12、requestAnimationFrame
### 13、如何做线上的错误监控
### 14、大量数据的计算或者渲染被卡住，如何优化？
### 15、虚拟列表的实现原理
### 16、vuepress搭建个人博客
### 17、压缩图片的工具
### 18、vue3中ref与reactive的区别，用法
### 19、Object.observer
### 20、postMessage
### 21、web worker
### 22、Service Worker