const fs = require('fs');
const path = "./upload";

fs.stat(path, (err,data) => {
  if(err) {
    // 创建文件
    mkdir(path);
    return;
  }
  if(data.isDirectory) {
    console.log("目录已经存在")
  }else {
    fs.unlink(path, () => {
      console.log('删除文件失败')
    });
    mkdir(path)
  }
})

const mkdir = function(path) {
  fs.mkdir(path, (err) => {
    if(err) {
      console.log('创建文件失败');
      return;
    }
  })
}