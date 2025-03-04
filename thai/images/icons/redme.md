

// This script helps you convert the SVG Thai flag to PNG files in different sizes
// You can run this in a Node.js environment with the sharp package installed

const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

// Ensure the directory exists
const iconsDir = path.join(__dirname, 'images', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// SVG of Thai flag
const thaiFlag = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
  <rect width="900" height="600" fill="#ED1C24"/>
  <rect width="900" height="400" y="100" fill="#FFFFFF"/>
  <rect width="900" height="200" y="200" fill="#241D4F"/>
</svg>
`;

// Save SVG file
fs.writeFileSync(path.join(iconsDir, 'thai-flag.svg'), thaiFlag);

// Sizes to generate
const sizes = [16, 32, 192, 512];

// Generate PNG files for each size
Promise.all(
  sizes.map(size => {
    return sharp(Buffer.from(thaiFlag))
      .resize(size, size)
      .png()
      .toFile(path.join(iconsDir, `thai-flag-${size}x${size}.png`));
  })
)
  .then(() => {
    console.log('All Thai flag icons generated successfully!');
    
    // Also generate ICO file for favicon
    return sharp(Buffer.from(thaiFlag))
      .resize(32, 32)
      .toFormat('ico')
      .toFile(path.join(iconsDir, 'favicon.ico'));
  })
  .then(() => {
    console.log('Favicon.ico generated successfully!');
  })
  .catch(err => {
    console.error('Error generating icons:', err);
  });
