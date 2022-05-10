const express = require('express');
const router = express.Router();

router.get('/', (req, res) =>{
 res.send("导航列表")
});
router.get('/add', (req, res) =>{
  res.send("增加导航")
});
router.post('/doAdd', (req, res) =>{
  res.send("执行添加")
});
router.get('/edit', (req, res) =>{
  res.send("编辑导航")
});
router.post('/doEdit', (req, res) =>{
  res.send("执行编辑")
});



module.exports = router;