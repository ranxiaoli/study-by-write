# Node.js基础
## 1、Node.js简介
## 2、nodejs提供的原生能力上
### 1）了解nodejs提供的数据类型
#### (1) Buffer
#### (2) Stream
#### (3) EventEmitter
#### (4) Error
#### (5) URL
#### (6) global
- 看上去像是全局变量的存在，实际上仅存在于模块的作用域中
```
__dirname, __filename, exports, module, require()
```
- 从js继承而来的全局变量
```js
console, timer全家桶， global
```
- nodejs特有的全局变量
```js
Buffer, process, URL, WebAssembly
```
### 2）nodejs工具库
