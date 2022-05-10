const fs = require('fs');

exports.getFileMime = function(extname) {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/mime.json', (err,data) => {
      if(err) {
        reject(err);
        return;
      }
      let mimeObj = JSON.parse(data.toString());
      resolve(mimeObj[extname])
    })
  })
}