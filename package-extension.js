const fs = require('fs');
const path = require('path');
const bestzip = require('bestzip');

const extensionFolder = 'extension';

const privatePath = path.join(extensionFolder, 'manifest-private.json');
const publicPath = path.join(extensionFolder, 'manifest-public.json');
const targetPath = path.join(extensionFolder, 'manifest.json');
const tempPath = path.join(extensionFolder, 'manifest-temp.json');

(async function run() {
  console.log('Starting...');
  await outputOne(false);
  await outputOne(true);
})();

async function outputOne(isPublic) {
  console.log(`Preparing for ${isPublic ? 'public' : 'private'}`);
  copy(targetPath, tempPath, true);
  copy(isPublic ? publicPath : privatePath, targetPath);
  await compress(isPublic ? '_public.zip' : '_private.zip');
  copy(tempPath, targetPath, true);
  console.log(`Done!`);
}

function copy(from, to, ignoreError) {
  fs.copyFile(from, to, (err) => {
    if (!ignoreError && err) {
      console.error(err);
      process.exit(1);
    }
  });
}

function compress(filename) {
  return bestzip({
    source: `${extensionFolder}/*`,
    destination: filename,  // Intentionally not inside the extension folder to avoid being included.
  });
}
