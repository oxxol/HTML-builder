const fs = require('fs');
const path = require('path');
const pathFolder = path.join(__dirname, 'secret-folder');

fs.readdir(pathFolder, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  }
  else {
    files.forEach(file => {
      if (file.isFile()) {
        let filePath = path.join(pathFolder, file.name);
        fs.stat(filePath, function (err, stats) {
          if (err) {
            console.log(err);
          } else {
            console.log(path.parse(filePath).name + ' - ' + path.extname(file.name).slice(1) + ' - ' + (stats.size / 1024).toFixed(3) + 'kB');
          }
        });
      }
    });
  }
});