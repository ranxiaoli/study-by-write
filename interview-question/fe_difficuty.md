## 一、柯里化：主要体现函数里面返回函数
柯里化的目的在于避免频繁调用具有相同参数函数的同时，又能轻松复用
```js
  function uri_curring(protocol) {
    return function(hostname, pathname) {
      return `${protocl}${hostname}${pathname}`
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
### 使用场景
  - 参数复用，如上面代码
  - 提前返回： [兼容性问题]
  ```js
    // 因为浏览器的发展和各种原因，有些函数和方法是不被部分浏览器支持的，此时需要提前进行判断，从而确定用户的浏览器是否支持相应的方法。

    // 以事件监听为例，IE（IE9 之前） 支持的是 attachEvent 方法，其它主流浏览器支持的是 addEventListener 方法，我们需要创建一个新的函数来进行两者的判断。
  const addEvent  = function(element, type, listener, useCapture) {
    if(window.addEventListener) {
      console.log('判断为其它浏览器')
      // 和原生 addEventListener 一样的函数
      // element: 需要添加事件监听的元素
      // type: 为元素添加什么类型的事件
      // listener: 执行的回调函数
      // useCapture: 要进行事件冒泡或者事件捕获的选择
      element.addEventListener(type, function(e) {
        // 为了规避 this 指向问题，用 call 进行 this 的绑定
        listener.call(element, e);
      }, useCapture);
    } else if(window.attachEvent) {
      console.log('判断为 IE9 以下浏览器')
      // 原生的 attachEvent 函数
      // 不需要第四个参数，因为 IE 支持的是事件冒泡
      // 多拼接一个 on，这样就可以使用统一书写形式的事件类型了
      element.attachEvent('on' + type, function(e) {
        listener.call(element, e);
      });
    }
  }

  // 测试一下
  let div = document.querySelector('div');
  let p = document.querySelector('p');
  let span = document.querySelector('span');

  addEvent(div, 'click', (e) => {console.log('点击了 div');}, true);
  addEvent(p, 'click', (e) => {console.log('点击了 p');}, true);
  addEvent(span, 'click', (e) => {console.log('点击了 span');}, true);
  ```
  ```js
  // 使用立即执行函数，当我们把这个函数放在文件的头部，就可以先进行执行判断
  const addEvent  = (function() {
    if(window.addEventListener) {
      console.log('判断为其它浏览器')
      return function(element, type, listener, useCapture) {
        element.addEventListener(type, function(e) {
          listener.call(element, e);
        }, useCapture);
      }
    } else if(window.attachEvent) {
      console.log('判断为 IE9 以下浏览器')
      return function(element, type, handler) {
        element.attachEvent('on'+type, function(e) {
          handler.call(element, e);
        });
      }
    }
  }) ();

  // 测试一下
  let div = document.querySelector('div');
  let p = document.querySelector('p');
  let span = document.querySelector('span');

  addEvent(div, 'click', (e) => {console.log('点击了 div');}, true);
  addEvent(p, 'click', (e) => {console.log('点击了 p');}, true);
  addEvent(span, 'click', (e) => {console.log('点击了 span');}, true);
  ```
  - 延迟计算/运行
  ```js
    function add() {
      let args = Array.prototype.slice.call(arguments)
      let inner = function() {
        args.push(...arguments)
        return inner
      }
      inner.toString = function() {
        return args.reduce(function(prev, next) {
          return prev + next
        })
      }
      return inner
    }
  ```

## 二、继承