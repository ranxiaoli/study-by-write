// 原型及原型链
function Elem(id) {
  this.elem = document.getElementById(id)
}

Elem.prototype.html = function(val) {
  const elem = this.elem;
  if(val) {
    elem.innerHTML = val;
  }else {
    return elem.innerHTML;
  }
}

Elem.prototype.on = function(type, fn) {
  const elem = this.elem;
  elem.addEventListener(type, fn)
}

const div1 = new Elem("div1");
console.log(div1)