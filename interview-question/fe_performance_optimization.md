# 35条前端性能优化军规[https://learnku.com/docs/f2e-performance-rules]
## 1、减少HTTP请求
## 2、使用CDN（内容分发）
## 3、Expires或者cache-control响应头
## 4、使用Gzip压缩
## 5、将css放在也没顶部
## 6、将javascript放在底部
## 7、避免使用CSS表达式
## 8、使用外部的javascript和css
## 9、避免301|302重定向
## 10、移除重复的javascript脚本
## 11、设置ETags来控制换成
## 12、缓存AJAX请求
## 13、尽早输出（flush)缓冲 ？？？
## 14、ajax时尽量使用GET方法 ？？？
## 15、延迟加载
## 16、预加载
## 17、减少DOM元素数量
## 18、使用多个域名
## 19、避免使用iframe
## 20、杜绝404
## 21、给cookie减肥 ？？？
## 22、使用不带Cookie的域名 ？？？
## 23、减少DOM操作
## 24、使用高效的事件处理
## 25、使用<link>代替@import
## 26、不要使用filter
## 27、优化图片
## 28、优化css sprite
## 29、不要在HMTL中缩放图片 ？？？
## 30、使用体积小、可缓存的favicon.ico
## 31、文件不要大于25K
## 32、分段文档 ？？？
## 33、避免图片src为空
## 34、减少DNS查询
## 35、压缩js和css

# 7000字前端性能优化总结 | 干货建议收藏
## 1、优化分类
- 加载时优化： 一个网站加载过程更快，检查加载性能一般看： 白屏时间和首屏时间
```js
// 白屏时间： 输入网址，到页面开始显示
new Date().getTime() - performance.timing.navigationStart
// 首屏时间： 输入网址，首屏也没内容渲染完成
window.onload = function() {
  new Date().getTime() - performance.timing.navigationStart
}

```
- 运行时优化

## 2、加载时性能优化
### 1）DNS解析优化，浏览器访问DNS的时间就可以缩短
- DNS解析查找流程： 浏览器缓存 ->系统缓存 ->路由器缓存 ->ISP DNS缓存 ->递归搜索
- DNS解析的实现
```js
// 用meta信息来告知浏览器, 当前页面要做DNS预解析:
<meta http-equiv="x-dns-prefetch-control" content="on" />
// 在页面header中使用link标签来强制对DNS预解析: dns-prefetch需慎用，多页面重复DNS预解析会增加重复DNS查询次数。
<link rel="dns-prefetch" href="http://bdimg.share.baidu.com" />
```
### 2）使用HTTP2
### 3）减少HTTP请求数量、减少http请求大小
- 压缩文件
- 文件合并
- 采用svg图片或字体图标：不会失真，文件特别小
- 按需加载，减少冗余代码
- 雪碧图
- 图片懒加载
### 5）服务器渲染
### 6）使用defer加载js
### 7）静态资源使用cdn
### 8）资源缓存，不重复加载相同的资源

## 3、运行时优化
### 1）减少重绘与重排
### 2）避免页面卡顿
### 3）长列表优化
### 4）滚动事件性能优化
### 5）使用Web Worker
### 6）写代码的优化点
- 使用事件委托
- if-else 对比 switch
- 布局上使用flex