# 一、脚本世界
## 1、npm script
### 1）内部变量
### 2）npm script -参数
### 3）npm script -脚本钩子
```js
  preinstall # 用户执行npm install命令时候，先执行脚本
  postinstall # 用户执行npm install命令是，安装结束后执行该脚本
  preuninstall # 卸载一个模块前执行
  postuninstall # 卸载一个模块后执行
  prelink # link模块前执行
  postlink # link模块后执行
  pretest # 运行npm test命令前执行
  posttest # 运行npm test命令后执行
```
## 2、bash简洁和快速入门
## 3、浅谈Node cli
- commander
- inquirer.js：cli交互，更友好的输入
- chalk: cli交互，更友好的输出
- shell.js、execa
# 二、规范先行
## 1、代码规范
### 1）社区已有规范
### 2）建立代码规范-ESLint
### 3）编写自己的ESLint规范
### 4）Stylelint
### 5）建立代码规范-Prettier
## 2、版本规范和Changelog

# 三、质量代码
## 1、测试基础
- jest
- mock
- Snapshot
## 2、监控和异常上报
### 1）初识监控
- 常见捕获方式
```js
// 浏览器
window.oneror//全局异常捕获
window.addEventListener('error') // // js错误、静态资源加载错误
window.adEventListener('unhandlerjection') //没有catch的Promise错误

// node端
process.on('uncaughtException') // 全局异常捕获
process.on('uncaughtException') // 没有catch的Promise错误
```
- 利用框架、三方库本身能力
- Vue.config.errorHandler
- React.ErrorBoundary
### 2）Sentry监控
# 四、工程设计范式
# 五、构建艺术
## 1、构建历史
### 1）前端进化史
### 2）现代化的前端构建
#### (1) 我们需要怎样的前端构建
- 性能：图片优化、合并资源、减少Polyfill体积
- 模块化：commonjs/es modules -> script
- 强力的语法转换： ES6，7，8
- 统一的打包过程、整体分析优化： Vue单文件组件
#### (2) Babel、webpack
## babel-token-ast
### 1）AST：一种可遍历的、描述代码的树状接口，利用AST可以方便的分析代码的结构和内容。
### 2）编译理论：解析-变换-生成
### 3）babel基本概念
#### (1) babel的作用
- 语法转换
- polyfill
- 源码修改
#### (2) Syntax & Feature
#### (3) plugin / preset / env
- plugin：babel本身不会对代码做任何操作，所有功能都靠插件实现
  - @bable/plugin-transform-arrow-functions
  - @babel/plugin-transform-destructuring
  - @bable/plugin-transform-classes
- preset： 一组插件集合
- env
### 4）babel的使用
#### (1) babel的使用方式
- 直接require
```js
const babel = require('@babel/core');
babel.transform(code, options, function(){

})
```
- babel-cli
```js
babel src --out--dir lib --ignore "src/**/*.spec.js", "src/**/*.test.js"
babel -node --inspect --presets @babel/preset-env -- scripts.js --inspect
```
- webpack/rollup
```js
module:{
  rules:[
    test:/\.m?js$/,
    exclude:/(node_modules | bower_components)/,
    use:{
      loader:'babel-loader',
      options:{
        presets:['@bable/preset-env']
      }
    }
  ]
}
```
#### (2) Babel的配置
- 配置的位置
  - 项目根目录的.babelrc.json: 对整个项目生效
  - 工程根目录的babel.config.json: 对整个工程生效（可跨项目）
  - pacakage.json的babel字段: 相当于.babel.json
- plugin
  - plugin的使用
  ```js
    module.exports={
      // "@babel/preset-env" ,下面配置的是简写，如果工程配置中找不到包，可能是被简写了
      presets:["@babel/env"],
      // same as "@babel/plugins-transform-arrow-functions"
      plugins:["@babel/transform-arrow-function"]
    }
  ```
  - plugin的几种配置
  ```js
    module.exports = {
      "plugin": [
        "pluginA",
        ["pluginA"],
        ["pluginA", {}], // 如果plugin配置成数组，第一项是插件名称，第二项是配置
      ]
    }
  ```
  - plugin的顺序：plugins在preset之前执行，plugin之间从前往后执行
- preset
  - preset的使用
  ```js
  {
    "preset": [
      ["@bable/preset-env",{
        "loose":true,
        "modules":false
      }]
    ]
  }
  // 为什么preset也需要设置？
  // A：因为preset本质就是一组plugin的集合，plugins可以配置，当然preset也可配置，甚至preset可以依赖另一个preset。
  ```
  - preset的本质
  ```js
    module.exports = {
      presets: [
        "@babel/preset-env"
      ],
      plugins: [
        [
          "@babel/plugin-proposal-class-properties",
          {loose: true}
        ],
        "@babel/plugin-proposal-object-rest-spread"
      ]
    }
  ```
  - preset的顺序：preset在plugin之后执行，preset之间从后往前依次执行
  ```js
    // 执行顺序 c->b->a，这个设计babel文档中说是历史原因造成的
    {
        "preset":[
            "a","b","c"
        ]
    }
  ```
- preset-env
  - preset-env的配置
  ```js
    // preset-env是最常用的preset，大部分情况下你只需要用这一个preset就可以了
    // 1、主要就是useBuiltins和target两个配置
    // 2、useBuiltins用来配置polyfill
    // 3、target用来告诉preset-env选择哪个插件
    {
      "presets": [
        [
          "@babel/preset-env",
          {
            "useBuiltIns": "entry",
            "target": {
              "esmodules": true,
              "chrome": "58",
              "ie": "11",
              "node": "current"
            }
          }
        ]
      ]
    }
  ```
  - target: 我们支持的平台是什么
  ```js
    {
        "targets" :{"chrome":"58","ie":"11"}
    }
    // or
    {
        "targets" : "> .5%  and not last 2 versions"
    }
  ```
  - usebuiltins的配置[usage, entry, false],默认false
  ```js
    false: 什么也不做，不自动注入polyfill
    entry: 根据环境配置自动注入polyfill
    usage: 根据实际使用自动注入polyfill
  ```
#### (3) polyfill
### 5）babel插件开发
#### (1) babel插件的本质
#### (2) babel的插件开发工具
#### (3) babel的插件实战
```js
foo?.bar 
// --------------- 把上面的转换成下面的
foo==null?void 0: foo.bar

const template = require('@babel/template').default
module.exports = function OptionalChaningPlugin(babel) {
  return {
    name: 'optional-chaining-plugin',
    visitor: {
      OptionMembeExpression(path, state) {
        path.replaceWith(
          babel.types.conditionalExpression(
            babel.types.BinaryExpression(
              '==',
              babel.types.identifier(path.node.object.name),
              babel.types.nulLiteral()
            ),
            template.expression('void 0'),
            babel.types.memberExpression(
              babel.types.identifier(path.node.object.name),
              babel.types.identifier(path.node.property.name)
            )
          )
        )
      }
    }
  }
}
```
### 6）深入webpack:设计思想
#### (1) Tapable: 是一个插件框架，也是webpack的底层依赖
```js
  const { SyncHook } = require('tapable');
  const syncHook = new SyncHook(['name', 'age']);

  // 注册事件
  syncHook.tap("1", (name, age) => {console.log("1" name, age)})
  syncHook.tap("2",(name,age)=>{console.log("2",name,age)})
  syncHook.tap("3",(name,age)=>{console.log("3",name,age)})

  syncHook.call('harry potter', 18)
```
#### (2) Webpack工作流程
- 初始化配置
```js
  class compiler extends Tapable {
    constructor(context) {
      super();
      this.hooks = {
        shouldEmit: new SyncBailHook(['compilation']),
        done: new AsyncSeriesHook(['stats']),
        beforeRun: new AsyncSeriesHook(['compiler']),
        run: new AsyncSeriesHook(['compiler']),
        emit: new AsyncSeriesHook(['compilation']),
        afterEmit: new AsyncSeriesHook(['compilation'])
      }
    }
  }
```
- 准备工作(初始化Plugins等)
```js
class SourceMapDevToolPlugin {
  apply(compiler) {
    compier.hooks.compilation.tap("sourceMapDevToolPlugin", compilation => {
      compilation
        .hooks
        .afterOptimizeChunkAssets
        .tap(xxx, () => {context, chunks})
    })
  }
}
```
- resolve源文件，构建module
- 生成chunk
- 构建资源
- 最终生成文件
#### (3) Webpack的主要概念
- entry
  - entry是webpack开始分析依赖的入口
  - webpack从entry开始，遍历整个项目的依赖
  ```js
  module.exports = {
    entry:'./path/to/my/entry/files.js'
  }
  module.exports={
    entry:{
      app:'./src/app.js',
      adminApp:'./src/adminApp.js'
    }
  }
  ```
- output
```js
const path = require('path')
module.exports = {
  entry:'./path/to/my/entry/files.js',
  output: {
    path: path.resolve(__dirname, dist),
    fileName: 'my-fist-webpack-bundle.js'
  }
}
```
- loader
  - loader能够让webpack处理非js/json的文件
  - 处理：一切格式转为js模块，以便webpack分析依赖关系和方便我们在浏览器中加载
  ```js
  const path = require('path');
  module.exports = {
    entry:'./path/to/my/entry/files.js',
    output:{
      path:path.resolve(__dirname,dist),
      fileName:'my-fist-webpack-bundle.js'
    },
    module: {
      rules: [
        {
          test: '/\.txt$/',use:'raw-loader'
        }
      ]
    }
  }
  ```
- Plugin: 负责提供更高级的构建、打包功能
```js
const HtmlWebpackPlugin = require('Html-webpack-plugin');
const path = require('path');
module.exports = {
    entry:'./path/to/my/entry/files.js',
    output:{
      path:path.resolve(__dirname,dist),
      fileName:'my-fist-webpack-bundle.js'
    },
    module: {
      rules: [
        {
          test: '/\.txt$/',use:'raw-loader'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({templage: './src/index.html'})
    ]
  }
```
- Mode (webpack 4以后)： 指明当前的构建任务所处的环境，让webpack针对特定环境启动一些优化项
```js
module.exports={
    mode:'production' // 'node' | 'development' 'production'
}
```
### 7）深入webpcak:高级使用
#### (1) 基本配置
- entry
```js
// 单入口
module.exports={
  entry:'./src/index.js',
}
// 多入口
module.exports={
  home:'./home.js',
  about:'./about.js',
  contact:'./contact.js',
}
```
- output
```js
module.exports = {
  output: {
    // 输出bundle文件名，hash是wepack使用散列算法生成一段字符串，这样每次打包的文件名都不样
    // 这样浏览器即使缓存，每次也能加载最新代码
    filename: '[name].[hash].bundle.js',
    // 输出的 chunk文件名，一般是非entry打包出的文件
    chunkFilename: '[id].js'
  }
}
```
- 资源加载
