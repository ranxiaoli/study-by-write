const express = require('express');
const tools = require('../../model/tools');

const router = express.Router();



router.get('/', (req, res) =>{
 res.send("导航列表")
});
router.get('/add', (req, res) =>{
  res.render("admin/nav/add")
});
// 多文件
const cpUpload = tools.multer().fields([{ name: 'pic1', maxCount: 1 }, { name: 'pic2', maxCount: 8 }]);
// 单文件
// tools.multer().single('pic');
router.post('/doAdd', cpUpload, (req, res) =>{
  // 获取表单传过来的数据
  const body = req.body;
  res.send({
    body,
    // file: req.file, 单文件
    files: req.files
  })
});
router.get('/edit', (req, res) =>{
  res.send("编辑导航")
});
router.post('/doEdit', (req, res) =>{
  res.send("执行编辑")
});



module.exports = router;