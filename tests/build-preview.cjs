const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const out = '/tmp/cunxian-deploy';
fs.mkdirSync(out, { recursive: true });
for (const filename of ['index.html', 'script.js', 'styles.css', 'opera-stage.js', 'heroic-stage.js', 'strauss-stage.js', 'illustrated-obstacles.js']) {
  fs.copyFileSync(path.join(root, filename), path.join(out, filename));
}
fs.cpSync(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true });
console.log(`Preview ready: ${out}`);
