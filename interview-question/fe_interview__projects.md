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
- 资源加载:我们可以使用loader来加载非js的资源
```js // css/rest.css
  body {
    margin:0px;
  }
  // app.js
  import './css/reset.css'
  // 对于加载非js的资源我们都应该使用loader，所有要加载css的资源我们可以选择sytle-loader、css-loader
  // css-loader使你可以在别的css中？？？？？？？？
  // style-loader把js代码中import导入的样式文件代码，以一种特殊的方式打包到js bundle中，然后再js运行时，将样式自动插入


  module.exports = {
      entry:path.resolve(__dirname,'src/index.js'),
      output:{
          filename:path.resolve(__dirname,'dist/'
      }
      mode:"develoment",
      plugins:[....],
      module: {
        rules: [
          {
            test:/\.css$/,
            use:[{
              loader:'style-loader',
            },
            {
              loader:'css-loader',
            },
            {
              loader:'sass-loader',
              options:{sourceMap:true}
            }],
            exclude:'/node_modules/'
          }
        ]
      }
  }
```
- 资源的处理
- HTML的处理
- 静态资源的处理
```js
{
  test: /\.(png | jpe?g | gif | svg)$/,
  use:[{
    loader:'url-loader',
    options:{
      // 小于8192字节的图片打包成base64图片
      limit:8192,
      name:'images/[name].[hash:8].[ext]',
      publicPath:''
    }
  }]
}

{
  test:/\.(woff | woff2 | svg | eot | ttf)$/
  use:[
    loader:'file-loader',
    options :{
      limit:8192,
      name:'font/[name].[ext]?[hash:8]'
    }
  ]
}
```
- js的处理
```js
module:{
  reles:[
    {
      test: /\.(js | jsx)$/,
      use: 'babel-loader',
      include:path.resolve(__dirname,'src')
    }
  ]
}
```
#### (2) 高级使用
- mode
- devServer
- HMR
- 代码分离
  - 为什么要代码分离？为了将代码分成多个bundle,并灵活制定加策略（按需加载，并行加载），从而大大提升应用的加载速度。
  - 如何代码分离
  ```js
  1、入口起点：使用entry配置手动地分离代码
  2、防止重复：使用splitChunkPlugin去重和分离chunk
  3、动态导入：通过在代码中使用动态加载模块的语法来分离代码。
  ```
  - 多入口构建
  ```js
  module.exports={
    mode:'development',
    entry:{
      index:'./src/index.js',
      another:'./src/another-module.js'
    },
    output:{
      path:path.resolve(__dirname,'dist'),
      filename:'[name].bundle.js'
    }
  }
  // 最终结果：index.bundle.js another.bundle.js
  // 问题：1.资源可能被重复引用，2.不够灵活
  ```
  - splitChunks
  ```js
  module.exports={
    mode:'development',
    entry:{
      index:'./src/index.js',
      another:'./src/another-module.js'
    },
    output:{
      path:path.resolve(__dirname,'dist'),
      filename:'[name].bundle.js'
    },
    // 在webpack4 中将splitChunks统一到了optimization中
   optimization :{
    //    查询相关用法，不是插询optimization，而是查询SplitChunksPlugin这个插件
      splitChunks:{
        chunks:'all'
      }
   }

  }
  ```
  - 动态导入
  ```js
  1、import(): es module提供语言级的方法
  2、require.ensure: 在没有import()方法之前，webpack提供的方法
  // 动态导入是异步的
  import(/*webpackChunkName:loaash*/,'lodash').then(({default:_})=>{
      
  })
  .catch(err=>{

  })
  ```
### 8）深入webpack: loader和plugin详解
#### (1) loader编写
- webpack loader基本结构
```js
// 同步loader
module.exports = input => input + input;
// 异步loader
module.exports = function(input) {
  const callback = this.async();
  callback(null, input + input)
}
```
- loader-utils
```js
// loader-utils是编写webpack loader的官方工具库
const loaderUtils = require('loader-utils');
module.exports = function(source) {
  const options = loaderUtils.getOptions(this);
  const result = source.replace('word', options.name);
  return result;
}
```
- loader中的"洋葱模型"
```js
const loaderUtils = require('loader-utils')
module.exports = function(input) {
  const { text } = loaderUtils.getOptions(this);
  return input + input;
}
/*
 remainingReg 是loader链中排在当前这个loader后面所有的loader以及资源文件组成的一个链接，这个链接我们可以理解为一个路径
 在所有的loader处理完毕后，我们可以在webpack中使用一个特殊的require函数，去require这个路径，从而得到当前loader后所有的loader的处理结果。

 precedingReq 是loader链中排在当前这个loader前面所有的loader以及资源文件所组成的链接

 input 是一个对象，各个loader把共享的数据挂载这个对象上，如果pitch返回一个值；那么webpack就会跳过余下的loader pitch和execute的过程，
 也就是说pitch返回阻断了后续loader的执行

*/

module.exports.pitch = function(remainingReg, precedingReg, input) {
  console.log(`
    remainingReg request :${remainingReg}
    precedingReq request :${precedingReq}
    Input: ${JSON.stringify(input,null,2)}
  `)
  return "pitched"
}
```
- 调试loader
```js
const fs = require('fs');
const path = require('path');
const { runLoaders } = require('loader-runner');
runLoaders(
  {
    resource : "./demo.txt",
    loaders:[path.resolve(__dirname,"./loaders/demo-loader")],
    readResource: fs.readFile.bind(fs)
  },
  (err, result) => (err ? console.error(err): console.log(result))
)
```
#### (2) plugin编写
- 搭建开发环境
```js
const path = require('path');
const DemoPlugin = require("./plugins/demo-plugin.js");
const PATHS = {
  lib: path.join(__dirname, "app", "shake.js"),
  build:path.join(__dirname,"build")
}
module.exports = {
  entry: {
    lib: PATHS.lib,
  },
  output: {
    path: PATHS.build,
    filename:"[name].js"
  },
  plugins:[new DemoPlugin()]
}
```
- Compiler和Complition
```js
/**
 * webpack Plugin 的本质就是由apply方法的类，通过apply的方法的类我们可以在运行时获取compiler和complilation这两个实例，compiler是编译器的实例(即webpack),Complilation是每一次的编译过程。
 */
module.exports = class DemoPlugin {
  constructor() {
    this.options = options
  }
  apply(compiler) {
    compiler.plugin('emit', (complilation, cb) => {
      cb()
    })
  }
}
```
```js
// 案例实战
const webpackResource = require('webpack-source');
class WebpackSizePlugin {
  constructor(options) {
    this.options = options;
    this.PLUGIN_NAME = 'WebpackSizePlugin'
  }
  apply(compiler) {
    // 拿到output配置，拿到文件最终的输出路径是什么
    const outputOptions = compiler.options.output;
      // 我们插件的目的是统计出打包出来文件的大小，所以我们需要注册到打包结果后的hooks上，由于要输出json，所以要在输出硬盘之前   
    compiler.hooks.emit.tap(
      this.PLUGIN_NAME,
      compilation => {  // 在这个函数中可以读取和操作本次编译的结果
        const assets = compilation.assets; // 所有的编译结果都可以通过compilation.assets拿到
        const buildSize = {};
        const file = Object.keys(assets);
        let total = 0;
        for(let file of files) {
          const size = assets[file].size(); // 拿到字符数
          buildSize[file] = size;
          total += size;
        }
        console.log('Build Size', buildSize);
        console.log('Total Size', total);
        buildSize.total = total;
        // 想要webpack生成一个文件，只需这个文件以键值对的形式加入到assets对象中，那么在打包执行完毕之后，webpack会自动帮我们生成
        assets[
          outputOptions.publicPath + '/' + this.options ? this.options.fileName : 'build-size.json')
        ] = new WebackResource.RawSource(JSON.stringify(buildSize, null, 4))
        // assets对象中文件的内容，也就是说assets对象中每一项的值它是一个RawSource对象，而不是一个普通的字符串，上面要输出rawsource对象
      }
    )
  }
}
// webpack 配置
plugins: [new WebpackSizePlugin({ fileName: 'size.json' })]
```
### 9）webpack性能优化
#### (1) webpack数据分析
- webpack-bundle-analyzer(文件体积分析)
  - webpack.config.js
  ```js
  const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
  module.exports={
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled', // 不启动展示打包报告的http服务器
      generateStatsFile: true, // 是否生成stats.json文件 
    })
  ] 
  }
  ```
  - package.json
  ```js
  "scripts": {
    "build": "webpack",
    "start": "webpack serve",
    "dev":"webpack  --progress",
    "analyzer": "webpack-bundle-analyzer --port 8888 ./dist/stats.json"
  }
  ```
- speed-measure-webpack-plugin(分析打包速度)
```js
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack5-plugin');
const smw = new SpeedMeasureWebpackPlugin();
module.exports = smw.wrap({
  mode: "development",
  devtool: 'source-map',
  ...
});
```
- friendly-errors-webpack-pluginK(美化输出日志)
```js
// yarn friendly-errors-webpack-plugin  node-notifier -D
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const notifier = require('node-notifier');

module.exports = {
  mode: "development",
  devtool: 'source-map',
  context: process.cwd(),
  entry: {
    main: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js"
}, 
plugins:[
    new HtmlWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin({
    onErrors: (severity, errors) => {
    const error = errors[0];
    notifier.notify({
    title: "Webpack编译失败",
    message: severity + ': ' + error.name, subtitle: error.file || '',
    })
    }
  })
 ] 
};
```
#### (2) 编译时间优化
- extensions
```js
module.exports = {
  resolve: {
    extensions:[".js"、".jsx"、".json"]
  }
}
```
- alias: 配置文件别名可以加快webpack查找模块的速度
```js
const elementUi = path.resolve(__dirname,'node_modules/element-ui/lib/theme-chalk/index.css')
module.exports = {
  resolve: {
  extensions:[".js"、".jsx"、".json"],
  alias: {'element-ui'}
}
}
```
- modules
```js
const elementUi = path.resolve(__dirname,'node_modules/element-ui/lib/theme-chalk/index.css')
module.exports = {
  resolve: {
    extensions:[".js"、".jsx"、".json"],
    modules: ['node_modules']
  }
}
```
- oneOf
```js
// 每个文件对于rules中的所有规则都会遍历一遍，如果使用oneOf，只要能匹配一个就立即退出
// 在oneOf中不能2个配置处理同一类型文件
module.exports = {
  module: {
    rules: [{
     oneOf:[
         {
          test: /\.js$/,
          include: path.resolve(__dirname, "src"),
          exclude: /node_modules/,
          use: [
                {
                loader: 'thread-loader',
                options: {
                workers: 3 
                }
            },
            {
              loader:'babel-loader',
              options: {
                cacheDirectory: true
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: ['cache-loader','logger-loader', 'style-loader', 'css-loader']
       } 
     ]
    }]
  }
}
```
- external:如果某个库我们不想让它被webpack打包，想让它用cdn的方法是引入，并且不影响我们在程序中以CMD、AMD方式进行使用
```js
// 下载插件
yarn add html-webpack-externals-plugin -D
// html
<script src="https://cdn.abc.com/vue/2.5.11/vue.min.js"></script>
// webpack
externals: {
  vue: 'vue',
},
```
- resolveLoader
```js
// 就是指定loader的resolve，只作用于loader；resolve配置用来影响webpack模块解析规则。解析规则也可以称之为检索，索引规则。配置索引规则能够缩短webpack的解析时间，提升打包速度。
 
module.exports = {
  resolve: {
    extensions:[".js"、".jsx"、".json"],
    modules: ['node_modules']
  },
  resolveLoader:{
    modules: [path.resolve(__dirname, "loaders"),'node_modules'],
  },   
}
```
- noParse
```js
// 用于配置哪些模块的文件内容不需要进行解析
// 不需要解析依赖就是没有依赖的第三方大型类库，可以配置这个字段，以提高整体的构建速度
// 使用noparse进行忽略的模块文件中不能使用import、require等语法
module.exports = {
  module: {
    noParse: /test.js/, // 正则表达式
  } 
}
```
- thread-loader(多进程)
```js
// 把thread-loader放置在其他 loader 之前
// include 表示哪些目录中的 .js 文件需要进行 babel-loader
// exclude 表示哪些目录中的 .js 文件不要进行 babel-loader
// exclude 的优先级高于 include ,尽量避免 exclude ，更倾向于使用 include
module.exports = {
  module: {
    rules: [{
     oneOf:[
         {
          test: /\.js$/,
          include: path.resolve(__dirname, "src"),
          exclude: /node_modules/,
          use: [
                {
                loader: 'thread-loader',
                options: {
                  workers: require('os').cpus().length - 1 // 自己电脑的核心数减1
                }
            },
            {
              loader:'babel-loader',
              options: {
             // babel在转移js非常耗时间，可以将结果缓存起来，下次直接读缓存；默认存放位置是 node_modules/.cache/babel-loader
                cacheDirectory: true 
              }
            }
          ]
        },
        {
          test: /\.css$/,
          use: ['cache-loader','logger-loader', 'style-loader', 'css-loader']
       } 
     ]
    }]
  }
}
```
- cache-loader
```js
// 在一些性能开销较大的loader之前添加cache-loader，可以将结果缓存到磁盘中
// 默认保存在 node_modules/.cache/cache-loader 目录下
module.exports = {
  module: {
    rules: [{
     oneOf:[
        {
          test: /\.css$/,
          use: ['cache-loader','logger-loader', 'style-loader', 'css-loader']
       } 
     ]
    }]
  }
}
```
- hard-source-webpack-plugin
```js
// HardSourceWebpackPlugin 为模块提供了中间缓存,缓存默认的存放路径是 node_modules/.cache/hard-source
// 配置 hard-source-webpack-plugin 后，首次构建时间并不会有太大的变化，但是从第二次开始， 构建时间大约可以减少80% 左右
// webpack5中已经内置了模块缓存,不需要再使用此插件

yarn add hard-source-webpack-plugin -D
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
module.exports = {
  plugins: [
    new HardSourceWebpackPlugin()
  ] 
}
```
#### (3) 编译体积优化
- 压缩js、css、HTML和图片
```js
// optimize-css-assets-webpack-plugin是一个优化和压缩CSS资源的插件
// terser-webpack-plugin是一个优化和压缩JS资源的插件
// image-webpack-loader可以帮助我们对图片进行压缩和优化
yarn terser-webpack-plugin optimize-css-assets-webpack-plugin image-webpack-
loader -D

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {,
  optimization: {
     minimize: true
     minimizer: [
         new TerserPlugin()
     ]
  },
   module:{
     rules:[
         {
          test: /\.(png|svg|jpg|gif|jpeg|ico)$/,
          use: [
            'url-loader',
            {
                loader: 'image-webpack-loader',
                options: {
                    mozjpeg: {
                       progressive:true,
                       quality: 65 
                    },
                    optipng: {
                        enabled: false
                    },
                    pngquant: {
                        quality: '65-90',
                        speed: 4
                    },
                    gifsicle: {
                        interlaced: false
                    },
                    webp: {
                         quality: 75,
                    }
                }
            }
         }]
     ]
  },
  plugins:[
     new HtmlWebpackPlugin({
         template: './src/index.html',
          minify: {
              collapseWhitespace: true,
              removeComments: true
         }
     }) 
    new OptimizeCssAssetsWebpackPlugin(), 
  ]
 }
```
- 清除无用的css: purgecss-webpack-plugin单独提取CSS并清除用不到的CSS
```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require("purgecss-webpack-plugin");
const glob = require("glob");
const PATHS = {
    src: path.join(__dirname, "src"),
};

module.exports = {,
  optimization: {
     minimize: true
     minimizer: [
         new TerserPlugin()
     ]
  },
   module:{
     rules:[
         {
          test: /\.css$/,
          include: path.resolve(__dirname, "src"),
          exclude: /node_modules/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,  
            },
             "css-loader",
         }]
     ]
  },
  plugins:[
     new MiniCssExtractPlugin({
         filename: "[name].css"
     }) 
    new OptimizeCssAssetsWebpackPlugin({
        paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true})
    }), 
  ]
 }
```
- Tree shaking
```js
// webpack默认支持,可在 production mode下默认开启
// 在package.json 中配置:
// "sideEffects": false 所有的代码都没有副作用(都可以进行 tree shaking)
// 可能会把 css和@babel/polyfill 文件干掉可以设置 "sideEffects":["*.css"]
```
-  Scope Hoisting
```js
// Scope Hoisting 可以让 Webpack 打包出来的代码文件更小、运行的更快，它又译作 "作用域提升"，是在 Webpack3 中新推出的功能。
// scope hoisting的原理是将所有的模块按照引用顺序放在一个函数作用域里，然后适当地重命名一 些变量以防止命名冲突
// 这个功能在mode为 下默认开启,开发环境要用 webpack.optimizeModuleConcatenationPlugin 插件
```
#### (4) 运行速度优化
- 入口点分割
```js
module.exports = {
 entry: {
    index: "./src/index.js",
    login: "./src/login.js"
 }
}
// 这种方法的问题
// 如果入口chunks之间包含重复的模块(lodash)，那些重复模块都会被引入到各个bundle中
// 不够灵活，并且不能将核心应用程序逻辑进行动态拆分代码
```
- 懒加载
```js
可以用import()方式去引入模块，当需要的时候在加载某个功能对应代码
const Login = () => import(/* webpackChunkName: "login" */'@/components/Login/Login')
```
- prefetch
```js
// 使用预先拉取，你表示该模块可能以后会用到。浏览器会在空闲时间下载该模块
// prefetch的作用是告诉浏览器未来可能会使用到的某个资源，浏览器就会在闲时去加载对应的资 源，若能预测到用户的行为，比如懒加载，点击到其它页面等则相当于提前预加载了需要的资源
// <link rel="prefetch" as="script" href="test.js">此方法添加头部，浏览器会在空闲时间预先拉取
import(/* webpackChunkName: 'login', webpackPrefetch: true
*/'./login').then(result => {
        console.log(result.default);
})
```
- 提取公共代码: splitChunk
```js
module.exports = {
output:{
      filename:'[name].js',
      chunkFilename:'[name].js'
    },
 entry: {
        index: "./src/index.js",
        login: "./src/login.js"
 },
optimization: {
    splitChunks: {
    chunks: 'all',  // 分割同步异步的代码
    minSize: 0,    // 最小体积
    minRemainingSize: 0, // 代码分割后的最小保留体积，默认等于minSize
    maxSize: 0,  // 最大体积
    minChunks: 1,  // 最小代码快
    maxAsyncRequests: 30, // 最大异步请求数
    maxInitialRequests: 30, // 最小异步请求数
    automaticNameDelimiter: '~', // 名称分离符
    enforceSizeThreshold: 50000, //执行拆分的大小阈值，忽略其他限制
    // (minRemainingSize、maxAsyncRequests、maxInitialRequests) 
    cacheGroups: {
    defaultVendors: {
        test: /[\\/]node_modules[\\/]/,//控制此缓存组选择哪些模块
        priority: -10,//一个模块属于多个缓存组,默认缓存组的优先级是负数，自定义缓存组的优先级更高，默认值为0 //如果当前代码块包含已经主代码块中分离出来的模块，那么它将被重用，而不是生成新的模块。这可能会影响块的结果文件名。
    }, 
    default: {
      minChunks: 2,
      priority: -20
    } 
    } 
  }
}
 plugins: [
      new HtmlWebpackPlugin({
        template:'./src/index.html',
        filename:'page1.html',
        chunks:['index']
      }),
      new HtmlWebpackPlugin({
        template:'./src/index.html',
        filename:'page2.html',
        chunks:['login']
      }),
 ]
}
```
- CDN
