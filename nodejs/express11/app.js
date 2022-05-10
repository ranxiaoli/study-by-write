const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const ejs = require('ejs');
// 引入外部模块
const admin = require('./routes/admin');
const api = require('./routes/api');
const index = require('./routes/index');


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

// 配置外部路由模块
app.use('/admin', admin);
app.use('/api', api);
app.use('/', index);

// 监听端口，建议写成3000以上
app.listen(port, () => console.log(`Example app listening on port port!`));