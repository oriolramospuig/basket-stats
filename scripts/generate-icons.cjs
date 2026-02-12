const sharp = require('sharp');

async function generateIcons() {
  await sharp('public/icons/icon.svg')
    .resize(512, 512)
    .png()
    .toFile('public/icons/icon-512.png');

  await sharp('public/icons/icon.svg')
    .resize(192, 192)
    .png()
    .toFile('public/icons/icon-192.png');

  console.log('Icons generated successfully');
}

generateIcons().catch(console.error);
