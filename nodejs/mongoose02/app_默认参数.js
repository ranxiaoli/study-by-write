const mongoose = require('mongoose');

// useNewUrlParser这个属性会在url里识别验证用户所需的db，未升级前是不需要指定的，升级的一定要指定
mongoose.connect('mongodb://127.0.0.1:27017/rxl', { useNewUrlParser: true }, function(err){
  if(err) {
    console.log(err);
    return;
  }
  console.log('数据库连接成功');
});

// 定义数据表（集合）的映射, 字段名称必须和数据库保持一致
const UserShecma = mongoose.Schema({
  name: String,
  username: String,
  age: {
    type: Number,
    default: 20, // 
  }
})

// 定义model操作数据库
const UserModel = mongoose.model('User', UserShecma, 'user');

// 查询
UserModel.find({},function(err,doc) {
  if(err) {
    console.log(err);
    return;
  }
  console.log(doc)
})

// 数据的增加
const user = new UserModel({
  name: 'wuhaha',
  username: '呜哈哈',
});
user.save(function(err) {
  if(err) {
    console.log(err);
    return;
  }
  console.log('增加成功')
})