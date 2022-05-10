const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/article', (req, res) => res.send('新闻页面'));
app.get('/login', (req, res) => res.send('登录页面'));
app.get('/register', (req, res) => res.send('注册页面'));
app.post("/doLogin", (reg, res) => {res.send('登录操作')});
app.put('/edit', (req, res) => {
  res.send("修改")
});
app.delete('/del', (req, res) => {
  res.send("删除")
});

app.get('/admin/user', (req, res) => res.send('admin user'));

// 动态路由 配置路由的时候注意顺序
app.get('/article/add', (req,res) => {
  const id = req.params["id"];
  res.send(`article add`);
})

app.get('/article/:id', (req,res) => {
  const id = req.params["id"];
  res.send(`动态路由${id}`);
});

// get传值
app.get('/product', (req,res) => {
  let qurey = req.query;
  res.send(`product--${qurey.id}`)
})

app.listen(port, () => console.log(`Example app listening on port  !`))