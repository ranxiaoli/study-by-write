/**
 * Created by asusps on 2019/3/27.
 */
// 防抖
function debounce (fn, time) {
    var timeout = null;
    return function () {
        var _this = this;
        if(timeout !== null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(function() {
            fn.call(_this);
        }, time);
    }
}

// 处理函数
function handle () {
    console.log('防抖，处理函数');
}

window.addEventListener('scroll', debounce(handle, 1000));


// 节流
var throttle = function (fn, delay) {
    var timer = null;
    var startTime = Date.now();
    return function () {
        var curTime = Date.now();
        var remaining = delay - (curTime - startTime);
        var context = this;
        var args = arguments;
        clearTimeout(timer);
        if (remaining <= 0) {
            fn.call(context, args);
            startTime = Date.now();
        }else {
            timer = setTimeout(fn, delay);
        }
    }
};
// 处理函数
function handle () {
    console.log('节流，处理函数');
}

window.addEventListener('scroll', throttle(handle, 1000));
