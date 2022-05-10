const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const ejs = require('ejs');
// 引入外部模块
const login = require('./routes/login');


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
// 配置session中间件
app.use(session({
  secret: 'this is session', // 服务器端生成的session签名
  name:'rxl', // 修改session对应cookie的名称
  resave: false, // 强制存储session 即使它并没有什么变化
  saveUninitialized: true, // 强制将未初始化的session存储
  cookie: {
    maxAge: 1000*60*60,
    secure: false, // true 表示只有https协议才能访问cookie
  },
  rolling: true, // 在每次请求的时候强制设置cookie，将重置cookie过期时间
  store: new MongoStore({
    // url: 'mongodb://user12345:foobar@localhost/test-app?authSource=admins&w=1',
    url: 'mongodb://127.0.0.1:27017/shop',
    touchAfter: 24 * 3600, // 不管发出了多少请求，在24小时内只更新一次session， 除非你改变了这个session
    // mongoOptions: advancedOptions // See below for details
  })
}))

// 挂载login模块
app.use('/login', login)

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
  if(req.session.username) {
    res.send(req.session.username+'已经登录')
  }else {
    res.send('没有登录');
  }
 
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


app.get('/loginOut', (req, res) =>{
  // req.query 或者get传值
  
  // 1、设置session的过期时间为0 (他会把所有的session都销毁)
  // req.session.cookie.maxAge = 0;

  // 2、销毁指定的session
  req.session.username= "";

  // 3、销毁session destroy
  req.session.destroy();
  res.send('退出登录')
});

// 监听端口，建议写成3000以上
app.listen(port, () => console.log(`Example app listening on port port!`));