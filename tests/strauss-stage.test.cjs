const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

function extract(name) {
  const match = script.match(new RegExp(`^(?:async )?function ${name}\\([^]*?^}`, 'm'));
  assert.ok(match, `missing real script function ${name}`);
  return match[0];
}

function pngSize(data, filename) {
  assert.ok(data.length >= 33, filename);
  assert.equal(data.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', filename);
  assert.equal(data.readUInt32BE(8), 13, filename);
  assert.equal(data.toString('ascii', 12, 16), 'IHDR', filename);
  return [data.readUInt32BE(16), data.readUInt32BE(20)];
}

function jpegSize(data, filename) {
  assert.equal(data.readUInt16BE(0), 0xffd8, filename);
  for (let offset = 2; offset < data.length;) {
    assert.equal(data[offset++], 0xff, `${filename}: invalid JPEG marker`);
    while (data[offset] === 0xff) offset += 1;
    const marker = data[offset++];
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    assert.notEqual(marker, 0xda, `${filename}: SOF must precede scan data`);
    const length = data.readUInt16BE(offset);
    assert.ok(length >= 2 && offset + length <= data.length, `${filename}: truncated JPEG segment`);
    if ((marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) || (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf)) {
      return [data.readUInt16BE(offset + 5), data.readUInt16BE(offset + 3)];
    }
    offset += length;
  }
  assert.fail(`${filename}: JPEG has no SOF`);
}

function webpSize(data, filename) {
  assert.equal(data.toString('ascii', 0, 4), 'RIFF', filename);
  assert.equal(data.toString('ascii', 8, 12), 'WEBP', filename);
  for (let offset = 12; offset + 8 <= data.length;) {
    const type = data.toString('ascii', offset, offset + 4);
    const length = data.readUInt32LE(offset + 4);
    const payload = offset + 8;
    assert.ok(payload + length <= data.length, `${filename}: truncated ${type}`);
    if (type === 'VP8X') return [data.readUIntLE(payload + 4, 3) + 1, data.readUIntLE(payload + 7, 3) + 1];
    if (type === 'VP8 ') {
      assert.equal(data.toString('hex', payload + 3, payload + 6), '9d012a', filename);
      return [data.readUInt16LE(payload + 6) & 0x3fff, data.readUInt16LE(payload + 8) & 0x3fff];
    }
    if (type === 'VP8L') {
      assert.equal(data[payload], 0x2f, filename);
      const bits = data.readUInt32LE(payload + 1);
      return [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1];
    }
    offset = payload + length + (length & 1);
  }
  assert.fail(`${filename}: no WebP image chunk`);
}

function imageSize(filename) {
  const clean = filename.split('?')[0];
  const data = fs.readFileSync(path.join(root, clean));
  let size;
  if (/\.png$/i.test(clean)) size = pngSize(data, clean);
  else if (/\.jpe?g$/i.test(clean)) size = jpegSize(data, clean);
  else if (/\.webp$/i.test(clean)) size = webpSize(data, clean);
  else assert.fail(`unsupported image format: ${clean}`);
  assert.ok(size.every(value => Number.isInteger(value) && value > 0), `${clean}: invalid ${size.join('x')}`);
  return size;
}

class TestImage {
  set src(value) {
    this._src = value;
    [this.naturalWidth, this.naturalHeight] = imageSize(value);
    this.complete = true;
  }
  get src() { return this._src; }
}

const draws = [];
let transform = [0, 0];
const stack = [];
let numericChecks = 0;
function finite(values) {
  for (const value of values) if (typeof value === 'number') {
    assert.ok(Number.isFinite(value), `non-finite canvas argument: ${value}`);
    numericChecks += 1;
  }
}
const ctx = new Proxy({
  save() { stack.push([...transform]); },
  restore() { assert.ok(stack.length); transform = stack.pop(); },
  translate(x, y) { transform[0] += x; transform[1] += y; },
  drawImage(image, x, y, width, height) {
    const rect = { image, x: x + transform[0], y: y + transform[1], width, height };
    finite([rect.x, rect.y, width, height]);
    draws.push(rect);
  },
  createLinearGradient() { return { addColorStop(...args) { finite(args); } }; },
}, {
  get(target, key) {
    if (key in target && typeof target[key] !== 'function') return target[key];
    return (...args) => {
      finite(args);
      if (key in target) return target[key](...args);
      assert.ok(['fillRect', 'beginPath', 'moveTo', 'lineTo', 'stroke'].includes(key), `unexpected canvas operation: ${String(key)}`);
    };
  },
  set(target, key, value) { finite([value]); target[key] = value; return true; },
});
function node() {
  const classes = new Set();
  const handlers = {};
  return {
    disabled: false, hidden: false, textContent: '', handlers,
    addEventListener(event, fn) { handlers[event] = fn; },
    classList: { add: value => classes.add(value), remove: value => classes.delete(value), contains: value => classes.has(value) },
  };
}

const storage = new Map();
let clock = 0;
const c = vm.createContext({
  Image: TestImage, ctx, console,
  stage: { floorY: 610, height: 720, width: 1280, ceilingY: 72 },
  state: { level: 16, running: false, gameOver: false, levelComplete: false, score: 0, elapsed: 0, speed: 374, spawnTimer: 10, obstacleCount: 0, lastSpawnLane: 'ground', bestScores: {}, completedLevels: {} },
  player: { x: 136, y: 366, width: 186, height: 244, vy: 0, bob: 0, blink: 0, runCycle: 0, impact: 0 },
  obstacles: [], particles: [], orientationTip: node(),
  localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) },
  performance: { now: () => clock },
  setTimeout: (fn, ms) => { clock += ms; fn(); }, clearTimeout() {},
  document: { querySelector: () => null }, canvas: {}, CLEAR_SCORE: 1500,
  heroSpriteFrames: { 15: {}, 16: {} }, heroSprites: { 15: new TestImage(), 16: new TestImage() },
  prepareHeroSprite(level) { this.heroSpriteFrames[level] = {}; },
  heroicBackdrop: new TestImage(), heroicPropImages: {}, heroicAssetsReady: () => true,
  hitHot: async () => null, setHotBadge() {},
  loadIllustratedLevel() {}, isIllustratedReady: () => false,
  drawIllustratedObstacle: () => false, illustratedHitbox: () => null,
  operaPropBounds: () => null, heroicPropBounds: () => null,
  operaPropHitbox: () => null, heroicPropHitbox: () => null,
});
c.heroSprites[15].src = 'assets/cunxian-level15.png?v=test';
c.heroSprites[16].src = 'assets/cunxian-level16.png?v=test';
c.heroicBackdrop.src = 'assets/heroic/harbour.jpg?v=test';
for (const name of ['scoreNode', 'bestScoreNode', 'finalScoreText', 'levelCompleteTitle', 'levelCompleteText', 'levelCompleteFinalText', 'nextLevelButton', 'allLevelsCompleteText', 'levelCompleteOverlay', 'startOverlay', 'gameOverOverlay', 'startLevel15Button', 'startLevel16Button', 'restartButton', 'replayLevelButton']) c[name] = node();
for (const name of ['updateLevelTexts', 'updateMobileGameLayout', 'syncBackgroundMusic', 'requestGameFullscreen', 'refreshCompletionStamps', 'fireConfetti']) c[name] = () => {};

vm.runInContext(fs.readFileSync(path.join(root, 'strauss-stage.js'), 'utf8'), c, { filename: 'strauss-stage.js' });
const levels = script.match(/const LEVELS = (\{[^]*?^\});/m);
assert.ok(levels);
vm.runInContext(`globalThis.LEVELS = ${levels[1]};`, c);
for (const name of ['isFlappyLevel', 'obstacleCatalog', 'spawnObstacle', 'drawObstacles', 'getObstacleHitbox', 'rectsOverlap', 'updateGame', 'resetGame', 'startGame', 'getLevelConfig', 'isLevelCompleted', 'markLevelCompleted', 'saveCompletedLevels', 'getBestScore', 'saveBestScore', 'loadBestScores', 'refreshBestScoreDisplay', 'triggerLevelComplete', 'goToNextLevel', 'endGame', 'triggerJump']) vm.runInContext(extract(name), c);

const assets = vm.runInContext('[straussBackdrop, ...Object.values(straussPropImages)]', c);
const props = vm.runInContext('straussPropImages', c);
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);

async function main() {
  const webpNames = ['file-box', 'microscope', 'test-clipboard', 'glassware', 'mouse-cage', 'maze-card', 'white-bouquet', 'eeg-strip'];
  webpNames.forEach(name => imageSize(`assets/algernon/${name}.webp`));
  imageSize('assets/algernon/laboratory.jpg');
  imageSize('assets/cunxian-level16.png');

  const tags = [...html.matchAll(/<script\b[^>]*src=["']([^"']+)["'][^>]*>/g)];
  const names = tags.map(match => match[1].split('?')[0]);
  const ordered = ['opera-stage.js', 'heroic-stage.js', 'strauss-stage.js', 'illustrated-obstacles.js', 'script.js'];
  ordered.forEach(name => assert.equal(names.filter(value => value === name).length, 1, name));
  ordered.slice(1).forEach((name, index) => assert.ok(names.indexOf(ordered[index]) < names.indexOf(name), `${ordered[index]} before ${name}`));
  tags.filter(match => ordered.includes(match[1].split('?')[0])).forEach(tag => assert.doesNotMatch(tag[0], /\basync\b/));
  assert.equal([...html.matchAll(/<button\b[^>]*id="startLevel16Button"/g)].length, 1);
  assert.equal(c.LEVELS[16].id, 16);
  assert.match(c.LEVELS[16].heroAsset, /cunxian-level16\.png/);

  c.state.level = 12; c.resetGame();
  assert.equal(c.player.width, 210); assert.equal(c.player.height, 112);
  c.state.level = 16; c.resetGame();
  assert.equal(c.player.width, 186); assert.equal(c.player.height, 244); assert.equal(c.player.y, 366);
  c.state.running = true; c.triggerJump();
  assert.equal(c.player.vy, -540);
  assert.match(extract('updateGame'), /player\.vy \+= 1550 \* delta/);

  const catalog = c.obstacleCatalog();
  assert.equal(catalog.length, 8);
  assert.deepEqual(Array.from(catalog, item => item.type).sort(), webpNames.map(name => `strauss-${name}`).sort());
  const air = catalog.filter(item => item.lane === 'air');
  assert.equal(air.length, 4);
  for (const item of air) {
    assert.ok(366 - item.y - item.height >= 152, `${item.type}: standing clearance`);
    assert.ok(366 - 540 ** 2 / (2 * 1550) - item.y - item.height >= 57, `${item.type}: single-jump margin`);
  }

  for (const phase of [0, Math.PI / 2, Math.PI * 1.5]) {
    c.obstacles = catalog.map((item, index) => ({ ...item, x: 500 + index * 170, phase }));
    draws.length = 0; c.drawObstacles();
    assert.equal(draws.length, 8);
    c.obstacles.forEach((obstacle, index) => {
      const draw = draws[index];
      const image = props[obstacle.type];
      const scale = Math.min(obstacle.width / image.naturalWidth, obstacle.height / image.naturalHeight);
      assert.equal(draw.image, image);
      close(draw.width, image.naturalWidth * scale); close(draw.height, image.naturalHeight * scale);
      close(draw.x, obstacle.x + (obstacle.width - draw.width) / 2);
      close(draw.y, obstacle.y + obstacle.height - draw.height);
      const hit = c.getObstacleHitbox(obstacle);
      close(hit.x, draw.x + draw.width * 0.13); close(hit.y, draw.y + draw.height * 0.08);
      close(hit.width, draw.width * 0.74); close(hit.height, draw.height * 0.84);
    });
    assert.equal(stack.length, 0); assert.deepEqual(transform, [0, 0]);
  }

  for (const speed of [374, 554, 894]) {
    c.state.speed = speed;
    const gap = Math.max(920, speed * 1.8);
    for (const item of catalog) for (const delta of [-1, 0, 1]) {
      c.obstacles = [{ ...item, x: 1400 - item.width - gap - delta }];
      c.spawnObstacle();
      assert.equal(c.obstacles.length, delta < 0 ? 1 : 2, `speed=${speed}, delta=${delta}`);
      if (delta >= 0) assert.equal(c.obstacles[1].x, 1400);
    }
  }

  assert.equal(c.straussAssetsReady(), true);
  for (const image of assets) for (const field of ['complete', 'naturalWidth']) {
    const original = image[field]; image[field] = field === 'complete' ? false : 0;
    assert.equal(c.straussAssetsReady(), false);
    if (image !== assets[0]) {
      c.obstacles = []; c.spawnObstacle(); assert.equal(c.obstacles.length, 0);
      const item = catalog.find(entry => props[entry.type] === image);
      c.obstacles = [{ ...item, x: 500, phase: 0 }]; draws.length = 0;
      c.drawObstacles(); assert.equal(draws.length, 0);
      assert.deepEqual({ ...c.getObstacleHitbox(c.obstacles[0]) }, { x: 500, y: item.y, width: 0, height: 0 });
    }
    image[field] = original;
  }

  for (const ready of [true, false]) for (const elapsed of [0, 10, 120, 10000]) for (const speed of [374, 554, 894]) {
    assets[0].complete = ready;
    c.state.elapsed = elapsed; c.state.speed = speed;
    const before = numericChecks;
    c.drawStraussStage(elapsed * 1000);
    assert.ok(numericChecks > before + 30);
    assert.equal(stack.length, 0);
  }
  assets[0].complete = true;

  c.state.level = 16; c.resetGame(); c.state.running = true; c.state.spawnTimer = 10;
  c.obstacles = [{ ...catalog[0], x: c.player.x - catalog[0].width - 1, phase: 0, passed: false }];
  c.updateGame(0);
  assert.equal(c.state.obstacleCount, 1); assert.equal(c.obstacles[0].passed, true);

  const binding = script.match(/startLevel15Button\.addEventListener\('click',[^]*?nextLevelButton\.addEventListener\('click', goToNextLevel\);/);
  assert.ok(binding);
  c.backToMenuButton = node(); c.showLevelSelect = () => {};
  vm.runInContext(binding[0], c);
  c.state.bestScores = { 12: 123, 15: 1500 };
  await c.startLevel16Button.handlers.click();
  assert.equal(c.state.level, 16); assert.equal(c.state.running, true);

  c.state.level = 15; c.state.score = 1600; c.triggerLevelComplete();
  assert.equal(c.nextLevelButton.hidden, false); assert.equal(c.allLevelsCompleteText.hidden, true);
  c.nextLevelButton.handlers.click();
  assert.equal(c.state.level, 16); assert.equal(c.state.running, true);
  c.state.score = 2000; c.triggerLevelComplete();
  assert.equal(c.state.completedLevels[16], true);
  assert.equal(c.nextLevelButton.hidden, true); assert.equal(c.allLevelsCompleteText.hidden, false);
  c.goToNextLevel(); assert.equal(c.state.level, 16); assert.equal(c.state.running, false);
  c.replayLevelButton.handlers.click();
  assert.equal(c.state.level, 16); assert.equal(c.state.running, true); assert.equal(c.state.score, 2000);

  c.state.score = 2100; c.endGame();
  c.obstacles.push({}); c.particles.push({});
  await c.restartButton.handlers.click();
  assert.equal(c.state.level, 16); assert.equal(c.state.running, true);
  assert.equal(c.state.levelComplete, false); assert.equal(c.state.gameOver, false);
  assert.equal(c.state.score, 0); assert.equal(c.obstacles.length, 0); assert.equal(c.particles.length, 0);
  assert.equal(c.player.y, 366); assert.equal(c.player.vy, 0);
  c.saveBestScore(16, 100);
  assert.equal(c.getBestScore(16), 2100); assert.equal(c.getBestScore(15), 1600); assert.equal(c.getBestScore(12), 123);
  assert.deepEqual(JSON.parse(storage.get('cunxian-best-scores')), { 12: 123, 15: 1600, 16: 2100 });
  assert.equal(c.loadBestScores()[16], 2100);

  console.log('PASS: strauss — real WebP/JPEG/PNG sizes; 8 props/4 air clearance and jump margin; world draw/hitbox; 3-speed spacing; missing-asset guards; finite background; counting; L16 selection/navigation/reset/completion/restart/score isolation; index order.');
}

main().catch(error => { console.error(error); process.exitCode = 1; });
