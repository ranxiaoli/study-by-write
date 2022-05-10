const multer  = require('multer');
const path = require('path');
const sd = require('silly-datetime');
const mkdirp = require('mkdirp')

let tools = {
  multer() {
    const storage = multer.diskStorage({
      // 配置上传的目录
      destination: async function (req, file, cb) {
        // 1、获取当前日期
        let day = sd.format(new Date(), 'YYYYMMDD');
        let dir = path.join( 'static/uploads', day);
        // 2、按照日期生成图片存储目录, mkdir 是一个异步方法
        await mkdirp(dir);
        cb(null, dir); // 上传之前目录必须存在
      },
      // 修改上传后的文件名
      filename: function (req, file, cb) {
        // 1、获取后缀名
        const extname = path.extname(file.originalname);
        cb(null,  Date.now()+extname)
      }
    })
     
    const upload = multer({ storage: storage });
    return upload;
  }
}

module.exports = tools;