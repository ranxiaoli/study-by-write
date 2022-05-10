const express = require('express');
const ejs = require('ejs');
const { json } = require('express');
const app = express();
const port = 3000;

// 配置express模板引擎
app.engine('html',ejs.__express);
app.set('view engine', 'html'); // 模板文件后缀设置
app.set('views', __dirname+'/dist'); // 静态文件目录配置

// 配置静态web目录
app.use(express.static('static'))

app.get('/', (req, res) =>{
  let title = "你好titile"
  res.render('index',{title:title} )
});
app.get('/test1', (req, res) =>{
  let title = "你好titile"
  res.render('test1',{title:title} )
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