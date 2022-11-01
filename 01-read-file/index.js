const path = require('path');
const fs = require('fs');
const filePath = path.join(__dirname, 'text.txt');
const stream = new fs.ReadStream(filePath, 'utf-8');

stream.on('data', (chunk) => {
  console.log(chunk);
});

stream.on('error', (err) => {
  if (err.code == 'ENOENT') {
    console.log('File not found');
  } else {
    console.log(err);
  }
});