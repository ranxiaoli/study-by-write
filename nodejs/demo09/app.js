const http = require('http');
const fs = require('fs');


http.createServer(function (request, response) {
  // 获取地址
  let pathname = request.url;
  pathname = pathname === "/" ? '/index.html' : pathname;

  if(pathname !== "./favicon.ico") {
    fs.readFile('./static'+pathname, (err, data) => {
      if(err) {
        response.writeHead(404, {"Content-Type": "text/html;charset='utf-8'"});
        response.end("404页面不存在")
      }
      response.writeHead(200, {"Content-Type": "text/html;charset='utf-8'"});
      response.end(data)
    })
  }
}).listen(8081);

console.log('Server running at http://127.0.0.1:8081/');