/**
 * 1、深度遍历、广度遍历
 * 2、请分别用深度优先思想和广度优先思想实现一个拷贝函数
 * 
 */
// 1、 深度遍历、广度遍历
// 深度优先递归遍历写法
function deepTraversal(node) {
  let nodes = [];
  if(node !== null) {
    nodes.push(node)
    let childrens = node.children;
    for(let i=0; i<childrens.length; i++) {
      deepTraversal(childrens[i])
    }
  }
  return nodes;
}
// 深度遍历非递归写法
function deepTraversal1(node) {
  let nodes = [];
  if(node != null) {
    let stack = []
    stack.push(node)
    while(stack.length !== 0) {
      let item = stack.pop()
      nodes.push(item)
      let childrens = item.children
      for(let i=childrens.length -1; i>=0; i--) {
        stack.push(childrens[i])
      }
    }
  }
  return nodes
}

// 广度优先遍历的递归写法
function wideTraversal(node) {
  let nodes = [], i=0
  if(node !== null) {
    nodes.push(node)
    wideTraversal(node.nextElementSibling)
    node = nodes[i++]
    wideTraversal(node.firstElementChild)
  }
  return nodes
}
// 广度优先遍历的非递归写法
function wideTraversal1(node) {
  let nodes = [], i=0
  while(node !== null) {
    nodes.push(node)
    node = nodes[i++]
    let childrens = node.children
    for(let i=0; i<childrens.length; i++) {
      nodes.push(childrens[i])
    }
  }
  return nodes
}

// 2、请分别用深度优先思想和广度优先思想实现一个拷贝函数 ??????
let _toString = Object.prototype.toString
let map = {
  array: 'Array',
  object: 'Object',
  function: 'Function',
  string: 'String',
  null: 'Null',
  undefined: 'undefined',
  boolean: 'Boolean',
  number: 'Number'
}
let getType = (item) => {
  return _toString.call(item).slice(8, -1)
}
let isTypeOf = (item, type) => {
  // ??????
}