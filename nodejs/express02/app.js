const express = require('express');
const app = express();
const port = 3000;

// 配置express模板引擎
app.set('view engine', 'ejs');

app.get('/', (req, res) =>{
  let title = "你好titile"
  res.render('index',{title:title} )
});

app.get('/news', (req, res) =>{
  let userInfo = {
    username: 'zhangsan',
    age: 20
  }
  let article = '<h3>我是一个h3</h3>';
  let list = ["1111","2222"];
  res.render('news',{userInfo,article,flag: true, list} )
});

// 监听端口，建议写成3000以上
app.listen(port, () => console.log(`Example app listening on port port!`));