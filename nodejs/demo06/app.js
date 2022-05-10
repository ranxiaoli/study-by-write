const fs = require('fs');
const path = './wwwroot'
const dirs = []
fs.readdir(path, (err, data) => {
  if(err) {
    console.log(err);
    return;
  }
  
  
  (function getDir(i) {
    if(i === data.length) {
      console.log(dirs);
      return;
    }
    fs.stat(path+"/"+data[i], (err,stats) => {
      if(stats.isDirectory()) {
        dirs.push(data[i])
      }
      getDir(i+1)
    })
  })(0)
})
