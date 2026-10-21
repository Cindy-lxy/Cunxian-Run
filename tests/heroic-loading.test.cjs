const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
function extract(name) {
  const match = script.match(new RegExp(`^(?:async )?function ${name}\\([^]*?^}`, 'm'));
  assert.ok(match, name);
  return match[0];
}
function node() {
  const classes = new Set(['overlay-visible']);
  return {
    disabled: false, hidden: false, textContent: '',
    classList: { add: (x) => classes.add(x), remove: (x) => classes.delete(x), contains: (x) => classes.has(x) },
  };
}
class FakeClock {
  constructor() { this.now = 0; this.next = 1; this.timers = new Map(); }
  setTimeout(fn, delay = 0) {
    const id = this.next++;
    this.timers.set(id, { at: this.now + delay, fn });
    return id;
  }
  clearTimeout(id) { this.timers.delete(id); }
  async advance(ms) {
    const target = this.now + ms;
    for (;;) {
      let selected;
      for (const [id, timer] of this.timers) {
        if (timer.at <= target && (!selected || timer.at < selected.timer.at)) selected = { id, timer };
      }
      if (!selected) break;
      this.now = selected.timer.at;
      this.timers.delete(selected.id);
      selected.timer.fn();
      await Promise.resolve();
    }
    this.now = target;
    await Promise.resolve();
  }
}

async function main() {
  const clock = new FakeClock();
  const images = [];
  class TestImage {
    constructor() {
      this.complete = true;
      this.naturalWidth = 100;
      this.naturalHeight = 100;
      this.retryCount = 0;
      images.push(this);
    }
    set src(value) { this._src = value; }
    get src() { return this._src; }
  }
  const starts = [];
  const c = vm.createContext({
    Image: TestImage, console,
    setTimeout: clock.setTimeout.bind(clock), clearTimeout: clock.clearTimeout.bind(clock),
    performance: { now: () => clock.now },
    stage: { floorY: 610, height: 720 },
    state: { level: 14, running: false, levelComplete: false },
    player: {}, obstacles: [], particles: [],
    scoreNode: node(), finalScoreText: node(), levelCompleteTitle: node(), levelCompleteText: node(),
    levelCompleteFinalText: node(), nextLevelButton: node(), allLevelsCompleteText: node(),
    startLevel15Button: node(), startLevel16Button: node(), startOverlay: node(), gameOverOverlay: node(), levelCompleteOverlay: node(),
    heroEyebrowNode: node(), heroSubtitleNode: node(), levelBadgeNode: node(),
    document: { querySelector: () => null }, canvas: {},
    LEVELS: { 12: { heroAsset: 'level12.png' }, 14: { heroAsset: 'level14.png' }, 15: { heroAsset: 'level15.png' }, 16: { heroAsset: 'level16.png' } },
    heroSpriteFrames: { 12: {}, 14: {}, 15: {}, 16: {} }, heroSprites: { 12: new TestImage(), 14: new TestImage(), 15: new TestImage(), 16: new TestImage() },
    prepareHeroSprite(level) { c.heroSpriteFrames[level] = {}; },
    isFlappyLevel: () => false,
    updateLevelTexts() { starts.push(c.state.level); },
    updateMobileGameLayout() {}, syncBackgroundMusic() {}, requestGameFullscreen() {},
    applyTheme() {}, refreshCompletionStamps() {}, exitGameFullscreen() {},
    hitHot: async () => null, setHotBadge() {},
    loadIllustratedLevel() {}, isIllustratedReady: () => false,
    drawIllustratedObstacle: () => false, illustratedHitbox: () => null,
  });
  vm.runInContext(fs.readFileSync(path.join(root, 'heroic-stage.js'), 'utf8'), c);
  vm.runInContext(fs.readFileSync(path.join(root, 'strauss-stage.js'), 'utf8'), c);
  vm.runInContext(extract('showLevelSelect'), c);
  vm.runInContext(extract('resetGame'), c);
  vm.runInContext(extract('startGame'), c);
  const heroic = vm.runInContext('[heroicBackdrop, ...Object.values(heroicPropImages)]', c);
  const strauss = vm.runInContext('[straussBackdrop, ...Object.values(straussPropImages)]', c);
  for (const image of [...heroic, ...strauss]) {
    const original = image.retryLoad;
    image.retryLoad = () => { image.retryCount += 1; original(); };
  }

  // 1. 单个素材延迟 12 秒：不能沿用旧的 8 秒失败，ready 后自动开局。
  heroic[0].complete = false; heroic[0].naturalWidth = 0;
  const delayed = c.startGame(15);
  await clock.advance(12000);
  assert.equal(c.state.running, false);
  heroic[0].complete = true; heroic[0].naturalWidth = 100;
  await clock.advance(100);
  await delayed;
  assert.equal(c.state.level, 15); assert.equal(c.state.running, true);
  assert.doesNotMatch(c.startLevel15Button.textContent, /加载较慢/);

  // 2. 第 16 关同样允许素材延迟 12 秒，并使用自己的进度按钮。
  c.state.running = false;
  strauss[0].complete = false; strauss[0].naturalWidth = 0;
  const delayed16 = c.startGame(16);
  await clock.advance(12000);
  assert.equal(c.state.running, false);
  assert.equal(c.startLevel16Button.disabled, true);
  assert.equal(c.startLevel15Button.disabled, false);
  strauss[0].complete = true; strauss[0].naturalWidth = 100;
  await clock.advance(100);
  await delayed16;
  assert.equal(c.state.level, 16); assert.equal(c.state.running, true);
  assert.doesNotMatch(c.startLevel16Button.textContent, /加载较慢/);

  // 3. 真实缺失满 60 秒：按钮恢复可点，提示重试，不开局也不刷新页面。
  c.state.running = false; c.state.level = 14;
  heroic[1].complete = true; heroic[1].naturalWidth = 0;
  const timedOut = c.startGame(15);
  await clock.advance(60000);
  await timedOut;
  assert.equal(c.state.level, 14); assert.equal(c.state.running, false);
  assert.equal(c.startLevel15Button.disabled, false);
  assert.equal(c.startLevel15Button.textContent, '加载较慢，点此继续重试');

  // 3. 再点只 retry 失败图；素材恢复后正常开局。
  const retryBefore = heroic.map((image) => image.retryCount);
  const retried = c.startGame(15);
  assert.equal(heroic[1].retryCount, retryBefore[1] + 1);
  heroic.forEach((image, index) => { if (index !== 1) assert.equal(image.retryCount, retryBefore[index]); });
  heroic[1].complete = true; heroic[1].naturalWidth = 100;
  await clock.advance(100);
  await retried;
  assert.equal(c.state.level, 15); assert.equal(c.state.running, true);

  // 4. 返回选关会取消旧 15 关请求并恢复按钮；随后切关时旧请求不能抢关。
  c.state.running = false; c.state.level = 15;
  heroic[2].complete = false; heroic[2].naturalWidth = 0;
  const old15 = c.startGame(15);
  await clock.advance(1000);
  assert.equal(c.startLevel15Button.disabled, true);
  c.showLevelSelect();
  assert.equal(c.startLevel15Button.disabled, false);
  assert.equal(c.startLevel15Button.textContent, '进入第十五关');
  await c.startGame(14);
  assert.equal(c.state.level, 14); assert.equal(c.state.running, true);
  heroic[2].complete = true; heroic[2].naturalWidth = 100;
  await clock.advance(100);
  await old15;
  assert.equal(c.state.level, 14);

  // 5. 同关重复请求：前一个失效，仅最后一次能够启动。
  c.state.running = false; starts.length = 0;
  heroic[3].complete = false; heroic[3].naturalWidth = 0;
  const first = c.startGame(15);
  const second = c.startGame(15);
  heroic[3].complete = true; heroic[3].naturalWidth = 100;
  await clock.advance(100);
  await Promise.all([first, second]);
  assert.deepEqual(starts, [15]);
  assert.equal(c.state.level, 15); assert.equal(c.state.running, true);

  // 6. 两个 special 关卡各自管理按钮/素材；后选关取消前请求，旧请求不能反抢。
  c.state.running = false; starts.length = 0;
  heroic[4].complete = false; heroic[4].naturalWidth = 0;
  const pending15 = c.startGame(15);
  await clock.advance(1000);
  assert.equal(c.startLevel15Button.disabled, true);
  assert.equal(c.startLevel16Button.disabled, false);
  const heroicRetries = heroic.map(image => image.retryCount);
  strauss[4].complete = false; strauss[4].naturalWidth = 0;
  const pending16 = c.startGame(16);
  assert.equal(c.startLevel15Button.disabled, false);
  assert.equal(c.startLevel15Button.textContent, '进入第十五关');
  assert.equal(c.startLevel16Button.disabled, true);
  assert.deepEqual(heroic.map(image => image.retryCount), heroicRetries, '16 关不得重试 15 关素材');
  heroic[4].complete = true; heroic[4].naturalWidth = 100;
  await clock.advance(100);
  await pending15;
  assert.equal(c.state.running, false);
  strauss[4].complete = true; strauss[4].naturalWidth = 100;
  await clock.advance(100);
  await pending16;
  assert.deepEqual(starts, [16]);
  assert.equal(c.state.level, 16); assert.equal(c.state.running, true);

  console.log('PASS: special loading — L15/L16 12s readiness; 60s timeout/retry; failed-image-only retry; menu/level cancellation; latest request wins; two special levels keep buttons/assets isolated.');
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
