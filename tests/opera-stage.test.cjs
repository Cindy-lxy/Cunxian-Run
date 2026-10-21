const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const root = path.join(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const props = fs.readFileSync(path.join(root, 'opera-stage.js'), 'utf8');
function extract(name) {
  const start = script.indexOf(`function ${name}(`);
  assert.ok(start >= 0, name);
  const end = script.indexOf('\nfunction ', start + 1);
  return script.slice(start, end < 0 ? undefined : end);
}
const shapes = { drum: [385, 420], spear: [103, 420], trunk: [420, 357], cymbal: [420, 270], gong: [406, 420], mask: [321, 420], lantern: [237, 420], flag: [388, 420] };
class TestImage {
  set src(value) {
    const name = path.basename(value).split('.')[0];
    [this.naturalWidth, this.naturalHeight] = shapes[name];
    this.complete = true;
  }
}
const draws = [];
let transform = [0, 0];
const stack = [];
const ctx = new Proxy({
  save() { stack.push([...transform]); },
  restore() { transform = stack.pop(); },
  translate(x, y) { transform[0] += x; transform[1] += y; },
  drawImage(image, x, y, width, height) { draws.push({ x: transform[0] + x, y: transform[1] + y, width, height }); },
  createLinearGradient() { return { addColorStop() {} }; },
  createRadialGradient() { return { addColorStop() {} }; },
}, {
  get(target, key) {
    return key in target ? target[key] : (...args) => {
      for (const value of args) if (typeof value === 'number') assert.ok(Number.isFinite(value), key);
    };
  },
});
const context = vm.createContext({
  Image: TestImage, ctx, console,
  stage: { floorY: 610, height: 720, width: 1280, ceilingY: 72 },
  state: { level: 14, elapsed: 0, speed: 376, lastSpawnLane: 'ground' },
  obstacles: [], isFlappyLevel: () => false,
  straussObstacleCatalog: () => [], straussPropBounds: () => null,
  straussPropHitbox: () => ({ x: 0, y: 0, width: 0, height: 0 }),
  loadIllustratedLevel() {}, isIllustratedReady: () => false,
  drawIllustratedObstacle: () => false, illustratedHitbox: () => null,
});
vm.runInContext(props, context);
for (const name of ['obstacleCatalog', 'spawnObstacle', 'drawObstacles', 'getObstacleHitbox']) vm.runInContext(extract(name), context);
const catalog = context.obstacleCatalog();
assert.equal(catalog.length, 8);
assert.equal(catalog.filter((o) => o.lane === 'air').length, 4);
const standingTop = 610 - 244;
const singleJumpTop = standingTop - (540 ** 2) / (2 * 1550);
for (const item of catalog.filter((o) => o.lane === 'air')) {
  assert.ok(standingTop - item.y - item.height >= 138);
  assert.ok(singleJumpTop - item.y - item.height >= 43);
}
for (const item of catalog) {
  const obstacle = { ...item, x: 500, phase: 0 };
  context.obstacles = [obstacle];
  draws.length = 0;
  context.drawObstacles();
  assert.equal(draws.length, 1);
  const drawn = draws[0];
  assert.ok(drawn.x >= obstacle.x && drawn.x < obstacle.x + obstacle.width);
  assert.ok(drawn.y >= obstacle.y && drawn.y < obstacle.y + obstacle.height);
  const hit = context.getObstacleHitbox(obstacle);
  assert.ok(hit.x >= drawn.x && hit.y >= drawn.y);
  assert.ok(hit.x + hit.width <= drawn.x + drawn.width);
  assert.ok(hit.y + hit.height <= drawn.y + drawn.height);
}
for (const speed of [376, 556, 896]) {
  context.state.speed = speed;
  const gap = Math.max(920, speed * 1.8);
  context.obstacles = [{ ...catalog[0], x: 1400 - catalog[0].width - gap + 1 }];
  context.spawnObstacle();
  assert.equal(context.obstacles.length, 1);
  context.obstacles[0].x -= 2;
  context.spawnObstacle();
  assert.equal(context.obstacles.length, 2);
}
context.obstacles = [];
vm.runInContext("operaPropImages['opera-gong'].complete = false", context);
context.spawnObstacle();
assert.equal(context.obstacles.length, 0);
vm.runInContext("operaPropImages['opera-gong'].complete = true", context);
for (const elapsed of [0, 10, 120]) {
  context.state.elapsed = elapsed;
  context.drawOperaStage(elapsed * 1000);
}
console.log('PASS: 8 sprites; visible/collision alignment; 4 air obstacles >=138px clearance; single-jump margin >=43px; 3 speeds spacing; missing-image guard; finite background geometry.');
