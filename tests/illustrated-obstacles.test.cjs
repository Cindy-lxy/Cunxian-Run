const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const illustrated = fs.readFileSync(path.join(root, 'illustrated-obstacles.js'), 'utf8');

function extract(name) {
  const match = script.match(new RegExp(`^(?:async )?function ${name}\\([^]*?^}`, 'm'));
  assert.ok(match, `missing real script function ${name}`);
  return match[0];
}

const expected = {
  1: ['prop-trunk', 'footlight', 'mic-stand', 'balcony-rail', 'spotlight-rig', 'floating-note', 'ghost-float'],
  2: ['book-stack', 'magazine-pile', 'envelope-bundle', 'bookshelf-ledge', 'floating-letter', 'open-book'],
  3: ['bamboo-cluster', 'stone-rock', 'sword-stand', 'flying-dagger', 'dart-wheel', 'bamboo-crossbar'],
  4: ['yellow-rose-bouquet', 'pizza-box', 'roulette-wheel', 'chip-stack', 'pistol', 'rose-garland'],
  5: ['plaid-sofa', 'cushion-stack', 'flower-pot', 'retro-tv', 'desk-lamp', 'star-garland'],
  6: ['film-reel', 'projector', 'coffee-cup', 'vintage-camera', 'newspaper-stack', 'film-strip'],
  7: ['oscar-statue', 'walk-star', 'red-rope', 'clapperboard', 'hollywood-camera', 'gold-film-strip'],
  8: ['old-suitcase', 'vintage-clock', 'dock-crate', 'reverse-hourglass', 'steam-cloud', 'hummingbird'],
  9: ['sandcastle', 'shell-pile', 'beach-umbrella', 'bak-kut-teh-pot', 'surfboard', 'sea-wave', 'cocktail-glass'],
  10: ['taihu-rock', 'lotus-vat', 'red-screen', 'falling-petals', 'palace-lantern', 'poetry-scroll'],
  11: ['wooden-easel', 'paint-bucket', 'art-stool', 'framed-canvas', 'paint-tube', 'floating-brush', 'palette-plate'],
  12: ['pipe-top', 'pipe-bottom'],
  13: ['sicily-anchor', 'sicily-buoy', 'sicily-seaweed', 'sicily-hook', 'sicily-net', 'sicily-fish-school'],
};

const images = [];
class TestImage {
  constructor() {
    this.complete = false;
    this.naturalWidth = 0;
    this.naturalHeight = 0;
    this.assignments = [];
    images.push(this);
  }
  set src(value) { this._src = value; this.assignments.push(value); }
  get src() { return this._src; }
}
const timers = [];
const draws = [];
let transform = [0, 0];
const stack = [];
const ctx = {
  save() { stack.push([...transform]); },
  restore() { transform = stack.pop(); },
  translate(x, y) { transform[0] += x; transform[1] += y; },
  drawImage(...args) {
    const image = args[0];
    const destination = args.length === 5 ? args.slice(1) : args.slice(5);
    const [x, y, width, height] = destination;
    draws.push({ image, x: transform[0] + x, y: transform[1] + y, width, height, argc: args.length });
  },
};
const math = Object.create(Math);
math.random = () => 0.75;
const c = vm.createContext({
  Image: TestImage,
  ctx,
  console,
  Math: math,
  setTimeout(fn, delay) { timers.push({ fn, delay }); return timers.length; },
  stage: { floorY: 610, height: 720, width: 1280, ceilingY: 72 },
  state: { level: 1, elapsed: 0, speed: 360, lastSpawnLane: 'ground' },
  obstacles: [],
  isFlappyLevel() { return c.state.level === 12; },
  operaPropBounds: () => ({}),
  heroicPropBounds: () => ({}),
  straussPropBounds: () => ({}),
  operaPropHitbox: () => ({ x: 1, y: 1, width: 1, height: 1 }),
  heroicPropHitbox: () => ({ x: 2, y: 2, width: 2, height: 2 }),
  straussPropHitbox: () => ({ x: 3, y: 3, width: 3, height: 3 }),
});
vm.runInContext(illustrated, c, { filename: 'illustrated-obstacles.js' });
for (const name of ['obstacleCatalog', 'spawnObstacle', 'spawnPipePair', 'getObstacleHitbox']) {
  vm.runInContext(extract(name), c, { filename: 'script.js' });
}

// The asset catalog is an independent, exact contract with each real gameplay catalog.
for (let level = 1; level <= 13; level += 1) {
  c.state.level = level;
  c.state.elapsed = 0;
  let catalogTypes;
  if (level === 12) {
    c.obstacles = [];
    c.spawnPipePair();
    catalogTypes = c.obstacles.map(item => item.type);
  } else {
    catalogTypes = vm.runInContext('obstacleCatalog().map(item => item.type)', c);
  }
  const assetTypes = vm.runInContext(`illustratedLevelTypes[${level}]`, c);
  assert.deepEqual(Array.from(catalogTypes), expected[level], `level ${level} gameplay catalog`);
  assert.deepEqual(Array.from(assetTypes), expected[level], `level ${level} illustrated catalog`);
}
assert.equal(vm.runInContext('illustratedLevelTypes[14]', c), undefined);
assert.equal(vm.runInContext('illustratedLevelTypes[15]', c), undefined);
assert.equal(vm.runInContext('illustratedLevelTypes[16]', c), undefined);

// Final asset inventory check: every catalog filename exists and is a decodable, non-zero WebP.
function webpSize(filename) {
  const data = fs.readFileSync(filename);
  assert.equal(data.toString('ascii', 0, 4), 'RIFF', filename);
  assert.equal(data.toString('ascii', 8, 12), 'WEBP', filename);
  for (let offset = 12; offset + 8 <= data.length;) {
    const type = data.toString('ascii', offset, offset + 4);
    const length = data.readUInt32LE(offset + 4);
    const payload = offset + 8;
    assert.ok(payload + length <= data.length, `${filename}: truncated ${type}`);
    if (type === 'VP8X') {
      return [data.readUIntLE(payload + 4, 3) + 1, data.readUIntLE(payload + 7, 3) + 1];
    }
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
const requiredFiles = new Set(Object.values(expected).flat().map(type => type.startsWith('pipe-') ? 'piano-pillar' : type));
for (const name of requiredFiles) {
  const filename = path.join(root, 'assets', 'illustrated', `${name}.webp`);
  assert.ok(fs.existsSync(filename), `missing illustrated asset ${name}.webp`);
  const [width, height] = webpSize(filename);
  assert.ok(width > 0 && height > 0, `${name}.webp has invalid ${width}x${height}`);
}

// Loading is lazy, cached by filename, and level 12 shares one piano image.
vm.runInContext('loadIllustratedLevel(3)', c);
assert.equal(images.length, expected[3].length);
assert.ok(images.every(image => /assets\/illustrated\/.+\.webp\?v=/.test(image.src)));
vm.runInContext('loadIllustratedLevel(3)', c);
assert.equal(images.length, expected[3].length, 'same level must not allocate again');
vm.runInContext('loadIllustratedLevel(4)', c);
assert.equal(images.length, expected[3].length + expected[4].length);
vm.runInContext('loadIllustratedLevel(12)', c);
assert.equal(images.length, expected[3].length + expected[4].length + 1, 'both pipes share piano-pillar');
assert.equal(vm.runInContext("illustratedFilename('pipe-top')" , c), 'piano-pillar');
assert.equal(vm.runInContext("illustratedFilename('pipe-bottom')", c), 'piano-pillar');

const retryImage = images[0];
for (let attempt = 1; attempt <= 5; attempt += 1) {
  retryImage.onerror();
  while (timers.length) timers.shift().fn();
  assert.equal(retryImage.assignments.length, Math.min(attempt + 1, 4), `retry attempt ${attempt}`);
}
assert.deepEqual(retryImage.assignments.slice(1).map(src => src.match(/retry=(\d+)/)[1]), ['1', '2', '3']);

function ready(type, width = 200, height = 100) {
  const image = vm.runInContext(`illustratedImages.get(illustratedFilename(${JSON.stringify(type)}))`, c);
  assert.ok(image, `image loaded for ${type}`);
  image.complete = true;
  image.naturalWidth = width;
  image.naturalHeight = height;
  return image;
}

// Spawn never waits. Readiness is snapshotted, so an existing fallback cannot switch style halfway.
c.state.level = 3;
c.state.lastSpawnLane = 'ground';
c.obstacles = [];
const realCatalog = c.obstacleCatalog;
c.obstacleCatalog = () => [{ type: 'flying-dagger', lane: 'air', width: 116, height: 44, y: 200 }];
c.spawnObstacle();
assert.equal(c.obstacles.length, 1);
assert.equal(c.obstacles[0].useIllustration, false);
const oldObstacle = c.obstacles[0];
ready('flying-dagger', 232, 88);
assert.equal(vm.runInContext('drawIllustratedObstacle(obstacles[0])', c), false, 'existing fallback stays fallback');
c.spawnObstacle();
assert.equal(c.obstacles.length, 2);
assert.equal(c.obstacles[1].useIllustration, true, 'later spawn uses ready illustration');
c.obstacleCatalog = realCatalog;

// Ground/air rendering uses world coordinates; visible bounds and collision bounds agree.
function checkDraw(obstacle, imageWidth, imageHeight) {
  ready(obstacle.type, imageWidth, imageHeight);
  draws.length = 0;
  c.obstacles = [obstacle];
  assert.equal(vm.runInContext('drawIllustratedObstacle(obstacles[0])', c), true);
  assert.equal(draws.length, 1);
  assert.equal(stack.length, 0);
  assert.deepEqual(transform, [0, 0]);
  const draw = draws[0];
  const hit = c.getObstacleHitbox(obstacle);
  assert.equal(draw.argc, 5);
  assert.ok(hit.x >= draw.x && hit.y >= draw.y);
  assert.ok(hit.x + hit.width <= draw.x + draw.width);
  assert.ok(hit.y + hit.height <= draw.y + draw.height);
  return { draw, hit };
}
const ground = checkDraw({ type: 'sword-stand', lane: 'ground', x: 500, y: 454, width: 72, height: 156, phase: 0, useIllustration: true }, 100, 300);
assert.equal(ground.draw.y + ground.draw.height, 610, 'ground art lands on floor');
const airBase = { type: 'flying-dagger', lane: 'air', x: 620, y: 176, width: 116, height: 44, useIllustration: true };
const airZero = checkDraw({ ...airBase, phase: 0 }, 232, 88).draw;
const airPeak = checkDraw({ ...airBase, phase: Math.PI / 2 }, 232, 88).draw;
assert.equal(airPeak.y - airZero.y, 5, 'air art follows phase bob');

// Every air catalog item is clamped at spawn; bob may add at most 5px.
for (let level = 1; level <= 13; level += 1) {
  if (level === 12) continue;
  c.state.level = level;
  for (const item of c.obstacleCatalog().filter(entry => entry.lane === 'air')) {
    c.obstacles = [];
    c.obstacleCatalog = () => [item];
    c.state.lastSpawnLane = 'ground';
    c.spawnObstacle();
    assert.equal(c.obstacles.length, 1, `${level}/${item.type} spawned`);
    assert.ok(c.obstacles[0].y + c.obstacles[0].height <= 220, `${level}/${item.type} base bottom`);
    assert.ok(c.obstacles[0].y + c.obstacles[0].height + 5 <= 225, `${level}/${item.type} bob bottom`);
  }
  c.obstacleCatalog = realCatalog;
}

// Real pipe spawn preserves the original 220 gap and original collision boxes.
c.state.level = 12;
ready('pipe-top', 240, 960);
c.obstacles = [];
c.spawnPipePair();
assert.equal(c.obstacles.length, 2);
const [top, bottom] = c.obstacles;
assert.equal(bottom.y - (top.y + top.height), 220);
for (const pipe of c.obstacles) {
  const box = c.getObstacleHitbox(pipe);
  assert.deepEqual({ ...box }, { x: pipe.x + 6, y: pipe.y, width: pipe.width - 12, height: pipe.height });
}

// 9-slice destinations stay in each pipe rectangle for every integer stage height and never enter the gap.
for (const type of ['pipe-top', 'pipe-bottom']) for (let height = 1; height <= c.stage.height; height += 1) {
  const y = type === 'pipe-top' ? 0 : c.stage.height - height;
  const pipe = { type, lane: type === 'pipe-top' ? 'ceiling' : 'ground', x: 900, y, width: 108, height, phase: 0, useIllustration: true };
  draws.length = 0;
  c.obstacles = [pipe];
  assert.equal(vm.runInContext('drawIllustratedObstacle(obstacles[0])', c), true);
  assert.ok(draws.length >= 2);
  for (const draw of draws) {
    assert.equal(draw.argc, 9);
    assert.ok(draw.x >= pipe.x && draw.x + draw.width <= pipe.x + pipe.width);
    assert.ok(draw.y >= pipe.y - 1e-9 && draw.y + draw.height <= pipe.y + pipe.height + 1e-9, `${type} h=${height}`);
  }
}

// Levels 14-16 are deliberately absent: no illustrated asset can become ready or draw.
for (const level of [14, 15, 16]) {
  const before = images.length;
  vm.runInContext(`loadIllustratedLevel(${level})`, c);
  assert.equal(images.length, before);
  const type = level === 14 ? 'opera-drum' : level === 15 ? 'heroic-crate' : 'strauss-file-box';
  c.obstacles = [{ type, lane: 'ground', x: 10, y: 10, width: 20, height: 20, phase: 0, useIllustration: true }];
  draws.length = 0;
  assert.equal(vm.runInContext('drawIllustratedObstacle(obstacles[0])', c), false);
  assert.equal(draws.length, 0);
}

console.log('PASS: illustrated obstacles — exact L1-13 catalogs; shared piano/cache/retry cap; spawn readiness snapshot; world draw/hitbox; ground/air limits; pipe gap/9-slice/box; L14-16 excluded.');
