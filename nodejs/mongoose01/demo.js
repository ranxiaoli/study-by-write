// 1、引入
const mongoose = require('mongoose');

// 2、建立连接
mongoose.connect('mongodb://127.0.0.1:27017/rxl');

// 3、操作users集合， 定义一个shecma
// shecma中的对象，需要跟表里面的字段一一对应
const UserShecma = mongoose.Schema({
  name: String,
  username: String,
  age: Number
});

// 4、定义数据库模型，操作数据库
// model中里面的第一个参数， 注意：首字母大写，要和数据库表（集合名称）对应
// 这个模型会和模型名称相同的复数的数据库建立连接，如通过下面方法建立模型，那么这个模型将会操作users这个数据库
// const User = mongoose.model('User', UserShecma); // 默认会操作users表（集合）
const User = mongoose.model('User', UserShecma, 'user'); // 默认会操作第三个参数配置的表（集合）

// 5、查询users表的数据
// User.find({},function(err,doc) {
//   if(err) {
//     console.log(err);
//     return;
//   }
//   console.log(doc)
// })

// 6、增加数据
  // 6、1实例化model 通过实例化User Model 创建增加的数据
  // 实例.save()增加数据
const u = new User({
  name:'李四四',
  username: 'lisisi',
  age: 20
});
u.save(function(err){
  if(err) {
    console.log(err);
    return;
  }
  console.log('成功')
}); // 执行增加操作


