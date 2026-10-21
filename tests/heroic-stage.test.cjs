const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
// Top-level functions end at a column-zero brace; do not count braces in strings/comments.
function extract(name) {
  const match = script.match(new RegExp(`^(?:async )?function ${name}\\([^]*?^}`, 'm'));
  assert.ok(match, name);
  return match[0];
}
function imageSize(filename) {
  const b = fs.readFileSync(path.join(root, filename));
  if (filename.endsWith('.png')) {
    assert.ok(b.length >= 33);
    assert.equal(b.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(b.readUInt32BE(8), 13);
    assert.equal(b.toString('ascii', 12, 16), 'IHDR');
    const size = [b.readUInt32BE(16), b.readUInt32BE(20)];
    assert.ok(size.every(n => n > 0));
    return size;
  }
  assert.equal(b.readUInt16BE(0), 0xffd8);
  // Walk JPEG segments, never invent a fallback size.
  for (let p = 2; p < b.length;) {
    assert.equal(b[p++], 0xff);
    while (b[p] === 0xff) p++;
    const marker = b[p++];
    assert.notEqual(marker, 0xda, 'SOF must precede scan data');
    const length = b.readUInt16BE(p);
    assert.ok(length >= 2 && p + length <= b.length);
    if ([0xc0, 0xc1, 0xc2].includes(marker)) {
      const size = [b.readUInt16BE(p + 5), b.readUInt16BE(p + 3)];
      assert.ok(size.every(n => n > 0));
      return size;
    }
    p += length;
  }
  assert.fail('JPEG has no supported SOF');
}
class TestImage {
  set src(value) {
    [this.naturalWidth, this.naturalHeight] = imageSize(value.split('?')[0]);
    this.complete = true;
  }
}
const draws = [];
let transform = [0, 0];
const stack = [];
let numericChecks = 0;
function finite(args) {
  for (const n of args) if (typeof n === 'number') {
    assert.ok(Number.isFinite(n), `Non-finite canvas argument: ${n}`);
    numericChecks++;
  }
}
const methods = {
  save() { stack.push([...transform]); },
  restore() { assert.ok(stack.length); transform = stack.pop(); },
  translate(x, y) { transform[0] += x; transform[1] += y; },
  drawImage(image, x, y, width, height) {
    const rect = { x: x + transform[0], y: y + transform[1], width, height };
    finite(Object.values(rect));
    draws.push({ image, ...rect });
  },
  createLinearGradient() { return { addColorStop(...args) { finite(args); } }; },
};
// Validate EVERY method (including drawImage/gradients/path) and numeric assignment.
const ctx = new Proxy(methods, {
  get(target, key) {
    if (key in target && typeof target[key] !== 'function') return target[key];
    return (...args) => {
      finite(args);
      if (key in target) return target[key](...args);
      assert.ok(['fillRect', 'beginPath', 'moveTo', 'lineTo', 'stroke'].includes(key), `Unexpected canvas operation: ${key}`);
    };
  },
  set(target, key, value) { finite([value]); target[key] = value; return true; },
});
function node() {
  const classes = new Set();
  const handlers = {};
  return { hidden: false, textContent: '', handlers,
    addEventListener(event, fn) { handlers[event] = fn; },
    classList: { add: c => classes.add(c), remove: c => classes.delete(c), contains: c => classes.has(c) } };
}
const storage = new Map();
let clock = 0;
const c = vm.createContext({ Image: TestImage, ctx, console,
  stage: { floorY: 610, height: 720, width: 1280, ceilingY: 72 },
  state: { level: 15, elapsed: 0, speed: 376, lastSpawnLane: 'ground', bestScores: {}, completedLevels: {} },
  player: { x: 136, width: 186, height: 244 }, obstacles: [], particles: [],
  localStorage: { getItem: k => storage.get(k) || null, setItem: (k, v) => storage.set(k, v) },
  performance: { now: () => clock },
  setTimeout: (fn, ms) => { clock += ms; fn(); }, clearTimeout() {},
  document: { querySelector: () => null }, canvas: {},
  heroSpriteFrames: { 15: {}, 16: {} }, heroSprites: { 15: new TestImage(), 16: new TestImage() },
  prepareHeroSprite(level) { this.heroSpriteFrames[level] = {}; },
  straussBackdrop: { complete: true, naturalWidth: 1, retryLoad() {} },
  straussPropImages: {}, straussAssetsReady: () => true,
  straussObstacleCatalog: () => [], straussPropBounds: () => null,
  straussPropHitbox: () => ({ x: 0, y: 0, width: 0, height: 0 }),
  drawStraussProp() {},
  hitHot: async () => null, setHotBadge() {},
  loadIllustratedLevel() {}, isIllustratedReady: () => false,
  drawIllustratedObstacle: () => false, illustratedHitbox: () => null,
});
for (const name of ['scoreNode', 'bestScoreNode', 'finalScoreText', 'levelCompleteTitle', 'levelCompleteText', 'levelCompleteFinalText', 'nextLevelButton', 'allLevelsCompleteText', 'levelCompleteOverlay', 'startOverlay', 'gameOverOverlay', 'startLevel15Button', 'startLevel16Button', 'restartButton', 'replayLevelButton']) c[name] = node();
for (const name of ['updateLevelTexts', 'updateMobileGameLayout', 'syncBackgroundMusic', 'requestGameFullscreen', 'refreshCompletionStamps', 'fireConfetti']) c[name] = () => {};
vm.runInContext(fs.readFileSync(path.join(root, 'heroic-stage.js'), 'utf8'), c);
const levels = script.match(/const LEVELS = (\{[^]*?^\});/m);
assert.ok(levels);
vm.runInContext(`globalThis.LEVELS = ${levels[1]};`, c);
for (const name of ['isFlappyLevel', 'obstacleCatalog', 'spawnObstacle', 'drawObstacles', 'getObstacleHitbox', 'resetGame', 'startGame', 'getLevelConfig', 'isLevelCompleted', 'markLevelCompleted', 'saveCompletedLevels', 'getBestScore', 'saveBestScore', 'loadBestScores', 'refreshBestScoreDisplay', 'triggerLevelComplete', 'goToNextLevel', 'endGame', 'triggerJump']) vm.runInContext(extract(name), c);
const assets = vm.runInContext('[heroicBackdrop, ...Object.values(heroicPropImages)]', c);
const props = vm.runInContext('heroicPropImages', c);
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} != ${b}`);

async function main() {
  const tags = [...html.matchAll(/<script\b[^>]*src=["']([^"']+)["'][^>]*>/g)];
  const names = tags.map(m => m[1].split('?')[0]);
  for (const name of ['opera-stage.js', 'heroic-stage.js', 'strauss-stage.js', 'illustrated-obstacles.js', 'script.js']) assert.equal(names.filter(n => n === name).length, 1);
  assert.ok(names.indexOf('opera-stage.js') < names.indexOf('heroic-stage.js'));
  assert.ok(names.indexOf('heroic-stage.js') < names.indexOf('strauss-stage.js'));
  assert.ok(names.indexOf('strauss-stage.js') < names.indexOf('illustrated-obstacles.js'));
  assert.ok(names.indexOf('illustrated-obstacles.js') < names.indexOf('script.js'));
  for (const tag of tags.filter(m => ['heroic-stage.js', 'strauss-stage.js', 'script.js'].includes(m[1].split('?')[0]))) assert.doesNotMatch(tag[0], /\basync\b/);
  assert.equal([...html.matchAll(/<button\b[^>]*id="startLevel15Button"/g)].length, 1);
  assert.equal([...html.matchAll(/<button\b[^>]*id="startLevel16Button"/g)].length, 1);
  assert.equal(c.LEVELS[15].id, 15);
  assert.equal(c.LEVELS[16].id, 16);
  imageSize(c.LEVELS[15].heroAsset.split('?')[0]);

  c.state.level = 12; c.resetGame();
  assert.equal(c.player.width, 210); assert.equal(c.player.height, 112);
  c.state.level = 15; c.resetGame();
  assert.equal(c.player.width, 186); assert.equal(c.player.height, 244); assert.equal(c.player.y, 366);
  c.state.running = true; c.triggerJump();
  assert.equal(c.player.vy, -540);
  assert.match(extract('updateGame'), /player\.vy \+= 1550 \* delta/);
  const catalog = c.obstacleCatalog();
  assert.equal(catalog.length, 8);
  assert.deepEqual(Array.from(catalog, o => o.type).sort(), ['crate', 'briefcase', 'barrel', 'barrier', 'beacon', 'cash', 'sign', 'reel'].map(n => `heroic-${n}`).sort());
  const air = catalog.filter(o => o.lane === 'air');
  assert.equal(air.length, 4);
  for (const o of air) {
    assert.ok(366 - o.y - o.height >= 152, o.type);
    assert.ok(366 - 540 ** 2 / (2 * 1550) - o.y - o.height >= 57, o.type);
  }
  for (const phase of [0, Math.PI / 2, Math.PI * 1.5]) {
    c.obstacles = catalog.map((o, i) => ({ ...o, x: 500 + i * 170, phase }));
    draws.length = 0; c.drawObstacles();
    assert.equal(draws.length, 8);
    c.obstacles.forEach((o, i) => {
      const d = draws[i]; const image = props[o.type];
      const scale = Math.min(o.width / image.naturalWidth, o.height / image.naturalHeight);
      assert.equal(d.image, image);
      close(d.width, image.naturalWidth * scale); close(d.height, image.naturalHeight * scale);
      close(d.x, o.x + (o.width - d.width) / 2); close(d.y, o.y + o.height - d.height);
      const h = c.getObstacleHitbox(o);
      close(h.x, d.x + d.width * 0.13); close(h.y, d.y + d.height * 0.08);
      close(h.width, d.width * 0.74); close(h.height, d.height * 0.84);
    });
    assert.equal(stack.length, 0); assert.deepEqual(transform, [0, 0]);
  }
  for (const speed of [376, 556, 896]) {
    c.state.speed = speed;
    const gap = Math.max(920, speed * 1.8);
    for (const item of catalog) for (const delta of [-1, 0, 1]) {
      c.obstacles = [{ ...item, x: 1400 - item.width - gap - delta }];
      c.spawnObstacle();
      assert.equal(c.obstacles.length, delta < 0 ? 1 : 2, `speed=${speed}, gap delta=${delta}`);
      if (delta >= 0) assert.equal(c.obstacles[1].x, 1400);
    }
  }
  assert.equal(c.heroicAssetsReady(), true);
  for (const image of assets) for (const field of ['complete', 'naturalWidth']) {
    const original = image[field]; image[field] = field === 'complete' ? false : 0;
    assert.equal(c.heroicAssetsReady(), false);
    if (image !== assets[0]) {
      c.obstacles = []; c.spawnObstacle(); assert.equal(c.obstacles.length, 0);
      const item = catalog.find(o => props[o.type] === image);
      c.obstacles = [{ ...item, x: 500, phase: 1 }]; draws.length = 0;
      c.drawObstacles(); assert.equal(draws.length, 0);
      const hit = c.getObstacleHitbox(c.obstacles[0]); assert.equal(hit.width, 0); assert.equal(hit.height, 0);
    }
    c.state.running = false; c.state.level = 14;
    c.startGame.retryHeroic = false;
    await c.startGame(15);
    if (field === 'complete') {
      assert.equal(c.state.running, false); assert.equal(c.state.level, 14);
      assert.match(c.startLevel15Button.textContent, /加载较慢，点此继续重试/);
    } else {
      // A completed-but-broken image is retried immediately and our image mock loads it synchronously.
      assert.equal(c.state.running, true); assert.equal(c.state.level, 15);
    }
    image[field] = original;
    assert.equal(c.heroicAssetsReady(), true);
    c.state.level = 15;
  }
  c.heroSpriteFrames[15] = null;
  c.state.running = false;
  await c.startGame(15); assert.equal(c.state.running, false);
  c.heroSpriteFrames[15] = {};
  for (const ready of [true, false]) for (const elapsed of [0, 10, 120, 10000]) for (const speed of [376, 556, 896]) {
    assets[0].complete = ready;
    c.state.elapsed = elapsed; c.state.speed = speed;
    const before = numericChecks;
    c.drawHeroicStage(elapsed * 1000);
    assert.ok(numericChecks > before + 100);
    assert.equal(stack.length, 0);
  }
  assets[0].complete = true;

  const binding = script.match(/startLevel15Button\.addEventListener\('click',[^]*?nextLevelButton\.addEventListener\('click', goToNextLevel\);/);
  assert.ok(binding); // Execute real button handlers, not replacements of game logic.
  c.backToMenuButton = node(); c.showLevelSelect = () => {};
  vm.runInContext(binding[0], c);
  c.state.bestScores = { 12: 123, 14: 1400 };
  await c.startLevel15Button.handlers.click();
  assert.equal(c.state.level, 15); assert.equal(c.state.running, true);
  c.state.level = 14; c.state.score = 1500; c.triggerLevelComplete();
  assert.equal(c.nextLevelButton.hidden, false);
  c.nextLevelButton.handlers.click();
  assert.equal(c.state.level, 15); assert.equal(c.state.running, true);
  c.state.score = 2000; c.triggerLevelComplete();
  assert.equal(c.state.levelComplete, true); assert.equal(c.state.running, false);
  assert.equal(c.state.completedLevels[15], true);
  assert.equal(c.nextLevelButton.hidden, false); assert.equal(c.allLevelsCompleteText.hidden, true);
  c.replayLevelButton.handlers.click();
  assert.equal(c.state.running, true); assert.equal(c.state.levelComplete, true); assert.equal(c.state.score, 2000);
  c.state.score = 2100; c.endGame();
  assert.equal(c.state.gameOver, true); assert.equal(c.state.running, false);
  c.obstacles.push({}); c.particles.push({});
  await c.restartButton.handlers.click();
  assert.equal(c.state.level, 15); assert.equal(c.state.running, true);
  assert.equal(c.state.levelComplete, false); assert.equal(c.state.gameOver, false);
  assert.equal(c.state.score, 0); assert.equal(c.obstacles.length, 0); assert.equal(c.particles.length, 0);
  assert.equal(c.player.y, 366); assert.equal(c.player.vy, 0);
  c.saveBestScore(15, 100);
  assert.equal(c.getBestScore(15), 2100); assert.equal(c.getBestScore(14), 1500); assert.equal(c.getBestScore(12), 123);
  assert.equal(c.bestScoreNode.textContent, '2100');
  assert.deepEqual(JSON.parse(storage.get('cunxian-best-scores')), { 12: 123, 14: 1500, 15: 2100 });
  assert.equal(c.loadBestScores()[15], 2100);
  console.log('PASS: heroic — real PNG IHDR; 8 props/4 air >=152px, jump >=57px; transformed draw/hitbox; 376/556/896 spacing boundaries; asset/start guards; finite background; index/LEVELS/navigation; 12->15 reset; completion/restart; isolated best scores.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
