const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const pathFolder = path.join(__dirname, 'project-dist');

fsPromises.rm(pathFolder, { recursive: true, force: true })
  .then(() => {
    fsPromises.mkdir(pathFolder, { recursive: true })
      .then(() => createHTML())
      .then(() => createCss())
      .then(() => copyFolder(pathFromFolder, pathToFolder))
      .catch(err => console.log(err));
  });


// Create index.html
async function createHTML() {
  const template = await fsPromises.readFile(path.join(__dirname, 'template.html'), 'utf-8', (err) => {
    if (err) throw err;
  });
  let fileHTML = template;
  const tags = template.match(/\{\{+[a-w]+}}/g);
  for (let tag of tags) {
    let component = await fsPromises.readFile(path.join(__dirname, 'components', `${tag.slice(2, -2)}.html`), 'utf-8', (err) => {
      if (err) throw err;
    });
    fileHTML = fileHTML.replace(`${tag}`, `${component}`);
    await fsPromises.writeFile(path.join(pathFolder, 'index.html'), fileHTML);
  }
}


const pathFolderStyles = path.join(__dirname, 'styles');
const bundlePath = path.join(pathFolder, 'style.css');

// Create style.css
function createCss() {
  fsPromises.readdir(pathFolderStyles, { withFileTypes: true })
    .then((files) => {
      fsPromises.writeFile(bundlePath, '')
        .then(() => {
          for (let file of files) {
            if (file.isFile() && path.extname(file.name) === '.css') {
              let filePath = path.join(pathFolderStyles, file.name);
              fsPromises.readFile(filePath)
                .then((data) => {
                  fsPromises.appendFile(bundlePath, data)
                    .catch((err) => console.log(err));
                });
            }
          }
        });
    });
}




const pathFromFolder = path.join(__dirname, 'assets');
const pathToFolder = path.join(pathFolder, 'assets');

// Copy folder with files
function copyFolder(pathFromFolder, pathToFolder) {
  fs.readdir(pathFromFolder, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      if (file.isDirectory()) {
        fs.rm(`${pathToFolder}/${file.name}`, { recursive: true, force: true }, (err) => {
          if (err) throw err;
          fs.mkdir(`${pathToFolder}/${file.name}`, { recursive: true }, (err) => {
            if (err) throw err;
            copyFolder(`${pathFromFolder}/${file.name}`, `${pathToFolder}/${file.name}`);
          });
        });
      }
      else {
        fs.copyFile(`${pathFromFolder}/${file.name}`, `${pathToFolder}/${file.name}`, (err) => {
          if (err) {
            throw err;
          }
        });
      }
    });
  });
}