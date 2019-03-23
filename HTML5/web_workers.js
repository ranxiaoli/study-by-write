/**
 * Created by asusps on 2019/3/22.
 */
// 解决的问题 避免页面有时反应迟缓，甚至假死的现象
/**
 * postMessage: 向任务池发送任务请求， 执行完之后，通过postMessage返回消息给创建者指定的事件处理程序
 * onmessage: 捕获返回的消息
 * */

// 创建workers 对象
var worker = new Worker('worker.js'); // 后台对象不能访问页面和窗口对象哟

// onmessage 事件获取在后台线程之中的接收消息
worker.onmessage = function(event) {
    // 处理收到的消息
};

//postMessage 给后台线程发送消息
var obj = [];
var message = JSON.stringify(obj) || 'text';
worker.postMessage(message);

// 确认浏览器是否支持worker
function testWorker() {
    if(typeof Worker !== 'undefined') {
        document.getElementById('support').innerHTML = '浏览器不支持HTML5 Web Workers';
    }
}

var myWoker = new Worker('easyui.js');
myWoker.onmessage = function (event) {
    alert('called hack for the worker!');
};

// importScripts() 接收空的参数或多个脚本文件
importScripts();
importScripts('1.js');
importScripts('1.js','2.js');//下载顺序可能不一样，但执行顺序是按importScript中列出的顺序