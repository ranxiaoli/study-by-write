// mock Promise.finally
Promise.prototype.finally = function(callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(()=>value),
    reson => P.resolve(callback()).then(() => {throw reson})
    )
}

// 1、 基本
const promise = new Promise(function(resovle, reject) {
  const isResolve = true;
  const val = '';
  if(isResolve) {
    resolve(val)
  }else {
    reject(val)
  }
})

promise.then(function(res) {
  console.log("resovle", res)
}, function(err) {
  console.log("reject", err)
})

Promise.prototype.finally = function(callback) {
  let P = this.constructor;
  return this.then(
    val => P.resolve(callback()).then(()=>val),
    reason => P.resolve(callback()).then(()=>{throw reason})
  )
}