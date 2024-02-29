const fs = require('fs');
const path = require('path');

const imageDirectory = path.join(__dirname, '../thucimg');
const imageFiles = fs.readdirSync(imageDirectory);

function getRandomImage() {
  const randomIndex = Math.floor(Math.random() * imageFiles.length);
  return path.join(imageDirectory, imageFiles[randomIndex]);
}

module.exports = {
  getRandomImage,
};
