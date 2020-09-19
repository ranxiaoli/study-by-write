// 如何把一个字符串的大小写取反（大写变小写小写变大写），例如 ’AbC' 变成 'aBc' 。
const reverseFun = (str) => {
  const strArr = str.split("");
  const newArr = strArr.map(item => {
    return item === item.toLowerCase() ? item.toUpperCase() : item.toLowerCase()
  })
  return newArr.join('')
}

console.log(reverseFun("ADDnnddSOOO"))