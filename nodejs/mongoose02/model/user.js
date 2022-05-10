const mongoose = require('./db');

const UserShecma = mongoose.Schema({
  name: {
    type: String,
    trim: true, // 定义mongoose模式修饰符，去掉空格
    required: true,
    get(params) {
      return 'a001'+params;
    }
  },
  username: String,
  sn: {
    type: String,
    index: true,
    match:/^sn(.*)/i,
    validate: function(sn) {
      return sn.length >= 10
    }
    // maxlength: 20,
    // minlength: 10
  },
  age: {
    type: Number,
    min: 0,
    max: 150,
    default: 20, // 
  },
  status: {
    type: String,
    enum: ['success', 'fail'], 
  redirect: {
    type: String,
    set(params) { // 增加数据的时候对redirect字段进行处理
      // params可以获取到redirect的值
      if(!params) return params;
      if(params.indexOf('http://') !== 0 &&params.indexOf('https://') !== 0) {
        return 'http://' + params;
      }
      return params;
    }
  }
})

// 静态方法
UserShecma.statics.findByUsername = function(username, cb) {
  // 通过find方法获取sn的数据， this 获取当前的model
  this.find({username}, function(err,doc) {
    cb(err,doc);
  })
}

// 实例方法(基本不用)
UserShecma.methods.print = function() {
  // this 代表实例化的书
  console.log(this.name)
}

// 定义model操作数据库
const UserModel = mongoose.model('User', UserShecma, 'user');

module.exports = UserModel;