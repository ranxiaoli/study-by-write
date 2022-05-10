const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>{
  // req.query 或者get传值
  
  // 设置session
  req.session.username = "lisi";
  res.render('login',{})
});

router.post('/doLogin', (req, res) =>{
  // req.body 获取post传值
  const body = req.body;
  console.log(body)
  res.send('执行提交'+body.username)
});

module.exports = router;