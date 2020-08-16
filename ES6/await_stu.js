/**
 * async函数返回一个Promise对象，可以使用then方法添加回调函数。
 */

/**
 * async 关键字：
 * async 函数， 要等到它函数中所有await 后面的异步函数处理完之后，才会执行后面返回操作，
 * 除非是遇到了throw或者return。
 * 也就是说只有async函数内部异步操作执行完，才会执行then方法的回调函数。
 */

/**
 * await 关键字
 * await 正常情况下，后面是跟一个Promise对象，如果不是，则返回对应的值；
 * 另外一种情况是， await命令后面是一个thenable对象（即定义了then方法的对象）
 */



/**
 * 任何一个await语句后面的 Promise 对象变为reject状态，那么整个async函数都会中断执行。
 */
async function f() {
  await Promise.reject('出错了');
  await Promise.resolve('hello world'); // 不会执行
}



//TODO: 注意注意
/**
 * 第一： await命令后面的Promise对象，运行结果可能是rejected，所以最好把await命令放在try...catch代码块中。
 */
async function myFunction() {
  try {
    await somethingThatReturnsAPromise();
  } catch (err) {
    console.log(err);
  }
}

// 另一种写法

async function myFunction() {
  await somethingThatReturnsAPromise()
    .catch(function (err) {
      console.log(err);
    });
}

/**
 * 第二：多个await命令后面的异步操作，如果不存在继发关系，最好让它们同时触发。
 */

// 写法一
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

// 写法二
let fooPromise = getFoo();
let barPromise = getBar();
let foo = await fooPromise;
let bar = await barPromise;

/**
 * 第三： await命令只能用在async函数之中，如果用在普通函数，就会报错。
 */

async function dbFuc(db) {
  let docs = [{}, {}, {}];

  // 报错
  docs.forEach(function (doc) {
    await db.post(doc);
  });
}

/**
 * 第四点，async 函数可以保留运行堆栈。
 */

 /**
  * 函数a内部运行了一个异步任务b()。
  * 当b()运行的时候，函数a()不会中断，而是继续执行。
  * 等到b()运行结束，可能a()早就运行结束了，b()所在的上下文环境已经消失了。
  * 如果b()或c()报错，错误堆栈将不包括a()。
  */
const a = () => {
  b().then(() => c());
};

// 改为
const a = async () => {
  await b();
  c();
};

// TODO： 实现原理
async function fn(args) {
  // ...
}

// 等同于

function fn(args) {
  return spawn(function* () {
    // ...
  });
}

function spawn(genF) {
  return new Promise(function(resolve, reject) {
    const gen = genF();
    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch(e) {
        return reject(e);
      }
      if(next.done) {
        return resolve(next.value);
      }
      Promise.resolve(next.value).then(function(v) {
        step(function() { return gen.next(v); });
      }, function(e) {
        step(function() { return gen.throw(e); });
      });
    }
    step(function() { return gen.next(undefined); });
  });
}