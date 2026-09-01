/* eslint-disable @typescript-eslint/no-require-imports -- standalone CommonJS utility */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const projectRoot = path.resolve(__dirname, '..');
const source = path.join(projectRoot, 'public', 'icon', 'brand-mark.svg');
const outputDirectory = path.join(projectRoot, 'public', 'icon');
const background = { r: 251, g: 249, b: 243, alpha: 1 };

async function renderIcon(size, scale) {
  const symbolSize = Math.round(size * scale);
  const symbol = await sharp(source)
    .resize(symbolSize, symbolSize, { fit: 'contain' })
    .png()
    .toBuffer();

  const offset = Math.floor((size - symbolSize) / 2);
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background,
    },
  })
    .composite([{ input: symbol, left: offset, top: offset }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

function createIco(images) {
  const headerSize = 6;
  const entrySize = 16;
  const header = Buffer.alloc(headerSize + entrySize * images.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  let offset = header.length;
  images.forEach(({ size, data }, index) => {
    const entryOffset = headerSize + entrySize * index;
    header.writeUInt8(size === 256 ? 0 : size, entryOffset);
    header.writeUInt8(size === 256 ? 0 : size, entryOffset + 1);
    header.writeUInt8(0, entryOffset + 2);
    header.writeUInt8(0, entryOffset + 3);
    header.writeUInt16LE(1, entryOffset + 4);
    header.writeUInt16LE(32, entryOffset + 6);
    header.writeUInt32LE(data.length, entryOffset + 8);
    header.writeUInt32LE(offset, entryOffset + 12);
    offset += data.length;
  });

  return Buffer.concat([header, ...images.map(({ data }) => data)]);
}

async function main() {
  fs.mkdirSync(outputDirectory, { recursive: true });

  const favicon16 = await renderIcon(16, 0.92);
  const favicon32 = await renderIcon(32, 0.92);
  const favicon48 = await renderIcon(48, 0.92);
  const appleTouchIcon = await renderIcon(180, 0.84);
  const icon192 = await renderIcon(192, 0.92);
  const icon512 = await renderIcon(512, 0.92);
  const maskable192 = await renderIcon(192, 0.66);
  const maskable512 = await renderIcon(512, 0.66);
  const publisherLogo = await renderIcon(512, 0.88);

  const files = [
    ['favicon-16.png', favicon16],
    ['favicon-32.png', favicon32],
    ['favicon-48.png', favicon48],
    ['apple-touch-icon.png', appleTouchIcon],
    ['icon-192.png', icon192],
    ['icon-512.png', icon512],
    ['icon-maskable-192.png', maskable192],
    ['icon-maskable-512.png', maskable512],
    ['publisher-logo.png', publisherLogo],
  ];

  for (const [name, data] of files) {
    fs.writeFileSync(path.join(outputDirectory, name), data);
  }

  const favicon = createIco([
    { size: 16, data: favicon16 },
    { size: 32, data: favicon32 },
    { size: 48, data: favicon48 },
  ]);
  fs.writeFileSync(path.join(projectRoot, 'src', 'app', 'favicon.ico'), favicon);
  fs.writeFileSync(path.join(projectRoot, 'public', 'favicon.ico'), favicon);
  fs.writeFileSync(path.join(projectRoot, 'src', 'app', 'icon.png'), favicon32);
  fs.writeFileSync(path.join(projectRoot, 'src', 'app', 'apple-icon.png'), appleTouchIcon);

  console.log(`Generated ${files.length + 4} icon assets from ${path.relative(projectRoot, source)}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
