async function test() {
  return '您好nodejs'
}

console.log(test())

async function main() {
  const data = await test();
  console.log(data)
}

main();