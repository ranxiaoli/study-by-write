const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const ejs = require('ejs');
const app = express();
const port = 3000;

// 配置express模板引擎
app.engine('html',ejs.__express);
app.set('view engine', 'html'); // 模板文件后缀设置
app.set('views', __dirname+'/dist'); // 静态文件目录配置

// 配置静态web目录
app.use(express.static('static'))

// 配置第三方中间件 bodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
// 配置cookieParser中间件
app.use(cookieParser('xxxx'));

app.get('/', (req, res) =>{
  // 设置cookie
  // res.cookie('username', 'zhangsan', {maxAge:1000*60*60})
  // 多个域名共享cookie
  // res.cookie('username', 'zhangsan', {maxAge:1000*60*60, path:'/article', domain:'.rxl.com'})
  // 中文cookie
  // res.cookie('username', '张三', {maxAge:1000*60*60})

  /**
   *  cookie的加密
   * 1、配置中间件的时候需要传入加密的参数
   *  如： app.use(cookieParser('xxxx'));
   * 2、res.cookie('username', 'zhangsan', {maxAge:1000*60*60, signed: true})
   * 3、req.singedCookies
   */
  
  res.cookie('username', 'zhangsan', {maxAge:1000*60*60, signed: true})

  res.send('首页');
});
app.get('/article', (req, res) =>{
  // 获取cookie
  const username = req.cookies.username;
  res.send('文章' + username);
});
app.get('/product', (req, res) =>{
  // 获取加密的cookie
  const username = req.signedCookies.username;
  res.send('产品' + username);
});
app.get('/user', (req, res) =>{
  // 获取cookie
  const username = req.cookies.username;
  res.send('用户'+username);
});

app.get('/login', (req, res) =>{
  // req.query 或者get传值
  res.render('login',{})
});
app.post('/doLogin', (req, res) =>{
  // req.body 获取post传值
  const body = req.body;
  console.log(body)
  res.send('执行提交'+body.username)
});

// 监听端口，建议写成3000以上
app.listen(port, () => console.log(`Example app listening on port port!`));