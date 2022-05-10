// 引入mongodb
const MongoClient = require('mongodb').MongoClient;

// 定义数据库连接的地址
const url = 'mongodb://localhost:27017';

// 定义要操作的数据库
const dbname = 'rxl';

// 实例化mongoClient,传入数据库连接地址
const client = new MongoClient(url, { useUnifiedTopology: true });

// 连接数据库
client.connect((err) => {
  if(err) {
    console.log(err);
    return;
  }
  console.log("数据库连接成功")
  let db = client.db(dbname);

  // 查找数据
  // db.collection('user').find({age: 22}).toArray((err,data) => {
  //   console.log(data);
  //   // 操作数据库完毕以后一定要关闭数据库
  //   client.close();
  // })

  // 增加数据
  // db.collection("user").insertOne({username: "nodejs操作db", age: 10},(err,result) => {
  //   if(err) {
  //     console.log(err);
  //     return;
  //   }
  //   console.log("增加成功");
  //   console.log(result);
  //   client.close();
  // })

  // 修改数据
  // db.collection('user').updateOne({username: "nodejs操作db"}, {$set: {age: 23}}, (err, result) => {
  //   if(err) {
  //     console.log("修改失败")
  //     console.log(err);
  //     return;
  //   }
  //   console.log("修改成功");
  //   console.log(result);
  //   client.close();
  // })

  // 删除数据
  // db.collection('user').deleteOne({username: 'nodejs操作db'}, (err) => {
  //   if(err) {
  //     console.log("删除失败")
  //     console.log(err);
  //     return;
  //   }
  //   console.log("删除一条数据成功")
  //   client.close();
  // })

  // 删除多条数据
  db.collection('user').deleteMany({username: 'nodejs操作db'}, (err) => {
    if(err) {
      console.log("删除失败")
      console.log(err);
      return;
    }
    console.log("删除多条数据成功")
    client.close();
  })
});