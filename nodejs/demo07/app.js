const fs = require('fs');
// const path = './wwwroot'
// const dirs = []
// fs.readdir(path, (err, data) => {
//   if(err) {
//     console.log(err);
//     return;
//   }

const { resolve } = require("path");

  
  
//   (function getDir(i) {
//     if(i === data.length) {
//       console.log(dirs);
//       return;
//     }
//     fs.stat(path+"/"+data[i], (err,stats) => {
//       if(stats.isDirectory()) {
//         dirs.push(data[i])
//       }
//       getDir(i+1)
//     })
//   })(0)
// })

async function isDir(path) {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err,stats) => {
      if(err) {
        console.log(err);
        reject(error);
        return;
      }
      if(stats.isDirectory()) {
        resolve(true);
      }else {
        resolve(false);
      }
    
    })
  })
}

function main() {
  const path = "./wwwroot";
  const dirArr = [];
  fs.readdir(path, async (err,files) => {
    if(err) {
      console.log(err);
      return;
    }
    for(let i=0; i<files.length; i++) {
      if(await isDir(`${path}/${files[i]}`)) {
        dirArr.push(files[i])
      }
    }
    console.log(dirArr)
  })

}

main();