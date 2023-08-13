const fs = require('fs');
const path = require('path');
const bestzip = require('bestzip');

const extensionFolder = 'extension';

(async function run() {
  console.log('Starting...');
  await outputOne();
})();

async function outputOne() {
  console.log(`Preparing for ${isPublic ? 'public' : 'private'}`);
  try {
    await compress(isPublic ? '_public.zip' : '_private.zip');
    console.log(`Done!`);
  } catch(e) {
    console.error(e);
  }
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
  fs.unlinkSync(filename);
  return bestzip({
    source: `${extensionFolder}/*`,
    destination: filename,  // Intentionally not inside the extension folder to avoid being included.
  });
}
