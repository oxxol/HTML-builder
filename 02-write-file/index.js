const fs = require('fs');
const path = require('path');
const process = require('process');

const filePath = path.join(__dirname, 'text.txt');
fs.writeFile(filePath, '', err => {
  if (err) throw err;
});

const { stdin } = process;
console.log('Please, write some text: ');

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    console.log('Goodbye!');
    process.exit();
  }
  fs.appendFile(filePath, data, err => {
    if (err)
      throw err;
  });
});

process.on('SIGINT', () => {
  console.log('Goodbye!');
  process.exit();

});
