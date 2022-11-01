const fsPromises = require('fs/promises');
const path = require('path');
const pathFolder = path.join(__dirname, 'files');

fsPromises.rm(`${__dirname}/files-copy`, { recursive: true, force: true })
  .then(() => {
    fsPromises.mkdir(`${__dirname}/files-copy`, { recursive: true })
      .then(() => copyFolder())
      .catch((err) => console.log('Error', err));
  });

function copyFolder() {
  fsPromises.readdir(pathFolder)
    .then((files) => {
      files.forEach(file => {
        fsPromises.copyFile(`${pathFolder}/${file}`, `${__dirname}/files-copy/${file}`)
          .catch((err) => console.log('Error', err));
      });
    });
}
