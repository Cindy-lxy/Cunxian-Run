const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const scoreNode = document.getElementById('score');
const bestScoreNode = document.getElementById('bestScore');
const startOverlay = document.getElementById('startOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalScoreText = document.getElementById('finalScoreText');
const startLevel1Button = document.getElementById('startLevel1Button');
const startLevel2Button = document.getElementById('startLevel2Button');
const startLevel3Button = document.getElementById('startLevel3Button');
const startLevel4Button = document.getElementById('startLevel4Button');
const startLevel5Button = document.getElementById('startLevel5Button');
const startLevel6Button = document.getElementById('startLevel6Button');
const startLevel7Button = document.getElementById('startLevel7Button');
const startLevel8Button = document.getElementById('startLevel8Button');
const startLevel9Button = document.getElementById('startLevel9Button');
const startLevel10Button = document.getElementById('startLevel10Button');
const startLevel11Button = document.getElementById('startLevel11Button');
const startLevel12Button = document.getElementById('startLevel12Button');
const startLevel13Button = document.getElementById('startLevel13Button');
const restartButton = document.getElementById('restartButton');
const backToMenuButton = document.getElementById('backToMenuButton');
const jumpButton = document.getElementById('jumpButton');
const orientationTip = document.getElementById('orientationTip');
const dismissOrientationTipButton = document.getElementById('dismissOrientationTipButton');
const pageShell = document.querySelector('.page-shell');
const heroPanel = document.querySelector('.hero-panel');
const gameStage = document.querySelector('.game-stage');
const heroEyebrowNode = document.getElementById('heroEyebrow');
const heroSubtitleNode = document.getElementById('heroSubtitle');
const levelBadgeNode = document.getElementById('levelBadge');
const levelCompleteOverlay = document.getElementById('levelCompleteOverlay');
const levelCompleteTitle = document.getElementById('levelCompleteTitle');
const levelCompleteText = document.getElementById('levelCompleteText');
const levelCompleteFinalText = document.getElementById('levelCompleteFinalText');
const replayLevelButton = document.getElementById('replayLevelButton');
const nextLevelButton = document.getElementById('nextLevelButton');
const backToLevelSelectButton = document.getElementById('backToLevelSelectButton');
const allLevelsCompleteText = document.getElementById('allLevelsCompleteText');
const muteToggleButton = document.getElementById('muteToggleButton');

// 所有关卡的通关分数线（防止不同逻辑处遗漏）
const CLEAR_SCORE = 1500;

const LEVELS = {
  1: {
    id: 1,
    eyebrow: 'Broadway Runner · Level 1',
    subtitle: '像小恐龙快跑一样一路冲刺，但每按一次跳跃键都会补一段向上的跃力，整体轨迹会形成更自然的连续抛物线。第一关改成了 0528 音乐剧灵感的百老汇舞台：幕布、灯光、阳台、乐符、道具箱和飘来飘去的小鬼都会变成背景或障碍物。',
    badge: '第一关 · 0528 百老汇舞台',
    endText: '百老汇舞台暂时落幕。',
    heroAsset: 'assets/cunxian-chibi.png?v=20260910-originals',
  },
  2: {
    id: 2,
    eyebrow: 'Fan Letters Runner · Level 2',
    subtitle: '第二关变成粉丝来信音乐剧的图书馆舞台：高书架、杂志、小说、粉丝来信、信封和阅读灯会从四周涌来。主角换成新的来信主题形象，但整体仍保持同一套Q版音乐剧风格。',
    badge: '第二关 · 粉丝来信图书馆',
    endText: '粉丝来信的书页慢慢合上了。',
    heroAsset: 'assets/cunxian-level2.png?v=20260910-originals',
  },
  3: {
    id: 3,
    eyebrow: 'Wuxia Duel Runner · Level 3',
    subtitle: '第三关进入武侠竹林决斗场：青竹、飞镖暗器、寒光长剑和山石会从林间袭来，整体是偏青绿与墨色的决斗氛围。背景里会看到远山与竹影深处，让武侠感更完整。',
    badge: '第三关 · 武侠竹林决斗',
    endText: '竹影与刀光一起静了下来。',
    heroAsset: 'assets/cunxian-level3.png?v=20260910-originals',
  },
  4: {
    id: 4,
    eyebrow: 'Santa Lucia Runner · Level 4',
    subtitle: '第四关来到桑塔露琪亚意大利小赌场：暖红天幕、金色灯牌、轮盘赌、黄玫瑰、披萨和手枪元素会一起出现，整体是热烈又危险的意式赌场舞台感。',
    badge: '第四关 · 桑塔露琪亚小赌场',
    endText: '桑塔露琪亚的筹码声慢慢停下来了。',
    heroAsset: 'assets/cunxian-level4.png?v=20260910-originals',
  },
  5: {
    id: 5,
    eyebrow: 'Bonnie Home Runner · Level 5',
    subtitle: '第五关来到“邦尼帮你的小家”：格纹沙发、花墙、星星灯串、木质小屋内景、书桌、老电视和地图贴纸会把舞台变成温馨家庭小屋，整体是偏米色、暖黄和绿色的治愈氛围。',
    badge: '第五关 · 邦尼帮你的小家',
    endText: '小家的灯光慢慢安静下来了。',
    heroAsset: 'assets/cunxian-level5.png?v=20260910-originals',
  },
  6: {
    id: 6,
    eyebrow: 'Shanghai Runner · Level 6',
    subtitle: '第六关来到“三风一树”音乐剧背景下的老上海滩：石库门、外滩洋楼、霓虹招牌和民国街景会铺开成抗战时期的申城舞台。电影胶片、放映机、复古相机、咖啡杯和旧报纸会不断出现，整体是深棕、暗红和米黄色的复古氛围。',
    badge: '第六关 · 三风一树上海滩',
    endText: '申城夜色里的霓虹慢慢暗了下来。',
    heroAsset: 'assets/cunxian-level6.png?v=20260910-originals',
  },
  7: {
    id: 7,
    eyebrow: 'Double Crisis Hollywood Runner · Level 7',
    subtitle: '第七关来到“双重危机”的好莱坞舞台：山丘上的 Hollywood 字牌、星光大道、红毯、聚光灯、奥斯卡小金人、电影胶卷和摄影机会一起铺开。地面障碍和空中障碍更容易成组出现，像一场金红黑配色的华丽危机。',
    badge: '第七关 · 双重危机好莱坞舞台',
    endText: '好莱坞的闪光灯终于暂时暗了下来。',
    heroAsset: 'assets/cunxian-level7.png?v=20260910-originals',
  },
  8: {
    id: 8,
    eyebrow: 'Benjamin Button Runner · Level 8',
    subtitle: '第八关来到“本杰明·巴顿奇事”的复古时间舞台：褪色暖棕色调、老式时钟、倒流沙漏、蒸汽船码头、新奥尔良南方建筑、旧行李箱、胶片边框和蜂鸟会一起出现，像在时间逆流里奔跑。',
    badge: '第八关 · 本杰明·巴顿奇事',
    endText: '倒流的时钟轻轻停在码头雾气里。',
    heroAsset: 'assets/cunxian-level8.png?v=20260910-originals',
  },
  9: {
    id: 9,
    eyebrow: 'Summer Island Runner · Level 9',
    subtitle: '第九关来到“去你的夏天”海岛舞台：蔚蓝大海、金色沙滩、椰子树、热带花、海草、肉骨茶、海浪、贝壳、冲浪板和灿烂阳光会铺开成明亮清爽的夏日画卷。整体是清新明快的蓝、绿、橙、黄配色，让你在海风中一路疾驰。',
    badge: '第九关 · 去你的夏天海岛',
    endText: '海边的晚霞慢慢铺满了沙滩。',
    heroAsset: 'assets/cunxian-level9.png?v=20260910-originals',
  },
  10: {
    id: 10,
    eyebrow: 'Baoyu Dream Runner · Level 10',
    subtitle: '第十关来到“宝玉”的红楼梦舞台：大观园、粉墙黛瓦、桃花落英、红灯笼、曲折游廊、假山太湖石和荷花池铺开成古典柔美的梦境。整体以胭脂红、粉、绿与金色为主，像在诗词和落花里奔跑。',
    badge: '第十关 · 宝玉红楼梦',
    endText: '花影深处，怡红院的灯笼轻轻亮起。',
    heroAsset: 'assets/cunxian-level10.png?v=20260910-originals',
  },
  11: {
    id: 11,
    eyebrow: 'Xinji Road Art Studio · Level 11',
    subtitle: '第十一关来到上海辛吉路的画材店：暖黄灯光下的展示架、成排的颜料瓶、画笔筒、调色盘、素描板和未完成的画布铺开成一条温柔的艺术街。障碍变成画架、颜料桶、画框和素描凳，一路穿过散落的画材奔跑。',
    badge: '第十一关 · 辛吉路画材店',
    endText: '画笔和颜料在暖灯下安静地睡着了。',
    heroAsset: 'assets/cunxian-level11.png?v=20260910-originals',
  },
  12: {
    id: 12,
    eyebrow: 'Fatal Melody · Level 12',
    subtitle: '第十二关变成飞行玩法：「致命旋律」音乐会舞台，卷发小人在聚光灯下滑翔，点击/空格轻拍气流上升，松开缓慢下坠。障碍是黑白琴键做成的一对对立柱，中间留出通道穿过。背景有音乐厅、五线谱与飘浮的音符，配色黑白 + 金色。',
    badge: '第十二关 · 致命旋律',
    endText: '聚光灯下的乐章缓缓落幕。',
    heroAsset: 'assets/cunxian-level12.png?v=20260910-originals',
  },
  13: {
    id: 13,
    eyebrow: 'Sicily Mermaid Runner · Level 13',
    subtitle: '第十三关来到「西西里的人鱼传说」的地中海海边小镇：地中海蓝色海岸、白墙橙顶的小镇建筑、渔船和海风会一路后退。锚、鱼钩、浮标、渔网、鱼群和海草都会变成障碍物——记住，所有物品都是障碍，一定要躲开舞台上的海边陷阱，跑出最高分。',
    badge: '第十三关 · 西西里的人鱼传说',
    endText: '西西里海风里的人鱼传说暂时收进了浪花。',
    heroAsset: 'assets/cunxian-level13.png?v=20260910-originals',
  },
};

const heroSprites = {};
const heroSpriteFrames = {
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
  7: null,
  8: null,
  9: null,
  10: null,
  11: null,
  12: null,
  13: null,
};

const stage = {
  width: 1280,
  height: 720,
  floorY: 610,
  ceilingY: 72,
};

function isFlappyLevel() {
  return state.level === 12;
}

const oscarStatueImage = new Image();
oscarStatueImage.src = 'assets/oscar-statue.png';

// 关卡 → 背景音乐映射；menu 表示主界面。没列出的关卡当前保持静音。
// 音频已去除前后静音；?v 用于强制浏览器刷新缓存
const LEVEL_MUSIC = {
  menu: 'assets/0528.m4a?v=trim2',
  1: 'assets/0528.m4a?v=trim2',
  2: 'assets/level2-letters.m4a?v=trim2',
};
const MENU_MUSIC_VOLUME = 0.12;
const backgroundMusic = new Audio();
backgroundMusic.loop = true; // 循环播放，前后无缝衔接
backgroundMusic.preload = 'none';
backgroundMusic.volume = MENU_MUSIC_VOLUME;
backgroundMusic.playsInline = true;

const state = {
  running: false,
  gameOver: false,
  score: 0,
  bestScores: loadBestScores(),
  completedLevels: {},
  audioMuted: loadAudioMuted(),
  audioUnlocked: false,
  elapsed: 0,
  speed: 360,
  spawnTimer: 0,
  obstacleCount: 0,
  lastSpawnLane: 'ground',
  level: 1,
  levelComplete: false,
  immersiveMobile: false,
  orientationTipDismissed: false,
};

function loadAudioMuted() {
  try {
    return localStorage.getItem('cunxian-audio-muted') === '1';
  } catch (e) {
    return false;
  }
}

function saveAudioMuted() {
  try {
    localStorage.setItem('cunxian-audio-muted', state.audioMuted ? '1' : '0');
  } catch (e) {
    // ignore quota errors
  }
}

function loadCompletedLevels() {
  return {};
}

function saveCompletedLevels() {
  // 通关状态仅保留在当前页面会话中，刷新/重新进入网页后重置
}

function reloadCompletedLevelsFromStorage() {
  // no-op：不再从 localStorage 恢复旧的通关状态
}

function isLevelCompleted(level) {
  return Boolean(state.completedLevels[level]);
}

function markLevelCompleted(level) {
  if (!isLevelCompleted(level)) {
    state.completedLevels[level] = true;
    saveCompletedLevels();
  }
  refreshCompletionStamps();
}


function loadBestScores() {
  try {
    const raw = localStorage.getItem('cunxian-best-scores');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch (e) {
    // ignore malformed data
  }
  // 迁移历史遗留的单一最高分（旧版本行为）到第 1 关
  const legacy = Number(localStorage.getItem('cunxian-best-score') || 0);
  return legacy > 0 ? { 1: legacy } : {};
}

function getBestScore(level) {
  return Number(state.bestScores[level] || 0);
}

function saveBestScore(level, score) {
  const current = getBestScore(level);
  if (score > current) {
    state.bestScores[level] = score;
    try {
      localStorage.setItem('cunxian-best-scores', JSON.stringify(state.bestScores));
    } catch (e) {
      // ignore quota errors
    }
  }
}

function refreshBestScoreDisplay() {
  bestScoreNode.textContent = String(getBestScore(state.level));
}

bestScoreNode.textContent = String(getBestScore(state.level));
backgroundMusic.muted = state.audioMuted;

function getCurrentTrackSrc() {
  // 主菜单以 body dataset 判定，进入关卡以 state.level 判定
  if (document.body.dataset.level === 'menu') {
    return LEVEL_MUSIC.menu || '';
  }
  return LEVEL_MUSIC[state.level] || '';
}

function shouldPlayBackgroundMusic() {
  return !state.audioMuted && Boolean(getCurrentTrackSrc());
}

async function syncBackgroundMusic() {
  backgroundMusic.volume = MENU_MUSIC_VOLUME;
  backgroundMusic.muted = state.audioMuted;
  backgroundMusic.loop = true; // 每次都强制单曲循环，避免被外部意外改动
  const targetSrc = getCurrentTrackSrc();
  if (!targetSrc || state.audioMuted || !state.audioUnlocked) {
    backgroundMusic.pause();
    return;
  }
  // 切换关卡时如果曲目变了，重新指向新文件；用 endsWith 避免 http://host/ 前缀影响判断
  const needSwitch = !backgroundMusic.src || !backgroundMusic.src.endsWith(targetSrc);
  if (needSwitch) {
    try { backgroundMusic.pause(); } catch (e) { /* ignore */ }
    backgroundMusic.src = targetSrc;
    try { backgroundMusic.load(); } catch (e) { /* ignore */ }
  }
  try {
    await backgroundMusic.play();
  } catch (e) {
    // 浏览器要求先交互 或 切换 src 竞态：监听一次 canplay 后重试
    const retry = () => {
      backgroundMusic.removeEventListener('canplay', retry);
      backgroundMusic.play().catch(() => {});
    };
    backgroundMusic.addEventListener('canplay', retry);
  }
}

function updateMuteButton() {
  if (!muteToggleButton) {
    return;
  }
  const muted = state.audioMuted;
  muteToggleButton.classList.toggle('is-muted', muted);
  muteToggleButton.textContent = muted ? '🔇 已静音' : '🔊 音乐开';
  muteToggleButton.setAttribute('aria-pressed', String(muted));
  muteToggleButton.setAttribute('aria-label', muted ? '开启背景音乐' : '关闭背景音乐');
  muteToggleButton.title = muted ? '点击开启背景音乐' : '点击关闭背景音乐';
}

function setAudioMuted(muted) {
  state.audioMuted = Boolean(muted);
  saveAudioMuted();
  updateMuteButton();
  syncBackgroundMusic();
}

function ensureCompletionStamps() {
  for (let i = 1; i <= 13; i += 1) {
    const card = document.querySelector(`.level-preview-card-${i}`);
    if (!card) continue;
    let stamp = card.querySelector('.completion-stamp');
    if (!stamp) {
      stamp = document.createElement('span');
      stamp.className = 'completion-stamp';
      stamp.textContent = '已通关';
      stamp.title = '已通关';
      stamp.hidden = true;
      card.appendChild(stamp);
    }
  }
}

function refreshCompletionStamps() {
  reloadCompletedLevelsFromStorage();
  ensureCompletionStamps();
  for (let i = 1; i <= 13; i += 1) {
    const card = document.querySelector(`.level-preview-card-${i}`);
    const stamp = card?.querySelector('.completion-stamp');
    if (!card || !stamp) continue;
    const completed = isLevelCompleted(i);
    card.classList.toggle('is-completed', completed);
    stamp.hidden = !completed;
  }
}

function bindAudioUnlockGestures() {
  const tryResume = () => {
    state.audioUnlocked = true;
    syncBackgroundMusic();
  };
  window.addEventListener('pointerdown', tryResume, { passive: true });
  window.addEventListener('keydown', tryResume);
}

const player = {
  x: 136,
  y: 366,
  width: 186,
  height: 244,
  vy: 0,
  bob: 0,
  blink: 0,
  runCycle: 0,
  impact: 0,
};

const particles = [];
const obstacles = [];
const stars = Array.from({ length: 46 }, (_, index) => ({
  x: (index * 173) % stage.width,
  y: 40 + ((index * 67) % 190),
  radius: 1.2 + (index % 3) * 0.9,
  twinkle: Math.random() * Math.PI * 2,
}));
const notes = Array.from({ length: 10 }, (_, index) => ({
  x: 90 + index * 140,
  y: 90 + (index % 4) * 70,
  size: 18 + (index % 3) * 10,
  drift: 0.14 + (index % 5) * 0.04,
}));
const floatingLetters = Array.from({ length: 12 }, (_, index) => ({
  x: 80 + index * 110,
  y: 90 + (index % 4) * 64,
  width: 38 + (index % 3) * 12,
  drift: 0.08 + index * 0.01,
  phase: Math.random() * Math.PI * 2,
}));
const buildingWindows = Array.from({ length: 7 }, (_, index) => ({
  x: 240 + index * 128,
  y: 192 + (index % 3) * 92,
  width: 88,
  height: 120,
  glow: 0.4 + (index % 4) * 0.14,
}));
const ambientGhosts = Array.from({ length: 6 }, (_, index) => ({
  x: 150 + index * 200,
  y: 150 + (index % 3) * 78,
  size: 28 + (index % 3) * 12,
  drift: 0.05 + index * 0.01,
  phase: Math.random() * Math.PI * 2,
  alpha: 0.18 + (index % 3) * 0.07,
}));

function prepareHeroSprite(levelKey, image) {
  const spriteCanvas = document.createElement('canvas');
  spriteCanvas.width = image.naturalWidth;
  spriteCanvas.height = image.naturalHeight;

  const spriteContext = spriteCanvas.getContext('2d');
  spriteContext.drawImage(image, 0, 0);

  const imageData = spriteContext.getImageData(0, 0, spriteCanvas.width, spriteCanvas.height);
  const { data, width, height } = imageData;
  const visited = new Uint8Array(width * height);
  const queue = [];

  function isNeutralBackground(pixelIndex) {
    const r = data[pixelIndex];
    const g = data[pixelIndex + 1];
    const b = data[pixelIndex + 2];
    const a = data[pixelIndex + 3];
    if (a < 180) {
      return true;
    }
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const brightness = (r + g + b) / 3;
    return max - min < 18 && brightness > 45 && brightness < 245;
  }

  function visit(x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) {
      return;
    }
    const offset = y * width + x;
    if (visited[offset]) {
      return;
    }
    const pixelIndex = offset * 4;
    if (!isNeutralBackground(pixelIndex)) {
      return;
    }
    visited[offset] = 1;
    queue.push(offset);
  }

  for (let x = 0; x < width; x += 1) {
    visit(x, 0);
    visit(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    visit(0, y);
    visit(width - 1, y);
  }

  while (queue.length) {
    const offset = queue.shift();
    const pixelIndex = offset * 4;
    const x = offset % width;
    const y = Math.floor(offset / width);

    data[pixelIndex + 3] = 0;

    visit(x + 1, y);
    visit(x - 1, y);
    visit(x, y + 1);
    visit(x, y - 1);
  }

  spriteContext.putImageData(imageData, 0, 0);

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3];
      if (alpha > 24) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  if (maxX === -1 || maxY === -1) {
    heroSpriteFrames[levelKey] = spriteCanvas;
    return;
  }

  const padding = 24;
  const cropWidth = maxX - minX + 1;
  const cropHeight = maxY - minY + 1;
  const trimmedCanvas = document.createElement('canvas');
  trimmedCanvas.width = cropWidth + padding * 2;
  trimmedCanvas.height = cropHeight + padding * 2;
  const trimmedContext = trimmedCanvas.getContext('2d');
  trimmedContext.drawImage(
    spriteCanvas,
    minX,
    minY,
    cropWidth,
    cropHeight,
    padding,
    padding,
    cropWidth,
    cropHeight,
  );

  heroSpriteFrames[levelKey] = trimmedCanvas;
}

Object.values(LEVELS).forEach((level) => {
  const image = new Image();
  heroSprites[level.id] = image;
  image.addEventListener('load', () => prepareHeroSprite(level.id, image));
  image.src = level.heroAsset;
  if (image.complete && image.naturalWidth > 0) {
    prepareHeroSprite(level.id, image);
  }
});

function getLevelConfig() {
  return LEVELS[state.level];
}

function applyTheme(mode) {
  document.body.dataset.level = String(mode);
}

function isMobileViewport() {
  return window.matchMedia('(max-width: 980px)').matches || window.matchMedia('(pointer: coarse)').matches;
}

async function requestGameFullscreen() {
  if (!isMobileViewport()) {
    return;
  }

  const target = gameStage;
  if (document.fullscreenElement || !target) {
    return;
  }

  try {
    if (target.requestFullscreen) {
      await target.requestFullscreen({ navigationUI: 'hide' });
    } else if (target.webkitRequestFullscreen) {
      target.webkitRequestFullscreen();
    }
  } catch (error) {
    // Ignore fullscreen failures on mobile browsers that do not support it.
  }
}

async function exitGameFullscreen() {
  try {
    if (document.fullscreenElement && document.exitFullscreen) {
      await document.exitFullscreen();
    }
  } catch (error) {
    // Ignore exit fullscreen failures.
  }
}

function updateMobileGameLayout() {
  const mobile = isMobileViewport();
  const shouldImmerse = mobile && state.immersiveMobile;
  document.body.classList.toggle('is-mobile-playing', shouldImmerse);
  document.body.classList.toggle('is-mobile-device', mobile);
  const shouldShowOrientationTip = shouldImmerse && window.innerHeight > window.innerWidth && !state.orientationTipDismissed;
  orientationTip.classList.toggle('orientation-tip-visible', shouldShowOrientationTip);
}

function updateLevelTexts() {
  const level = getLevelConfig();
  heroEyebrowNode.textContent = level.eyebrow;
  // heroSubtitleNode 现在展示的是全局游戏介绍，不再随关卡切换
  levelBadgeNode.textContent = level.badge;
  applyTheme(level.id);
  refreshBestScoreDisplay();
}

function showLevelSelect() {
  state.running = false;
  state.gameOver = false;
  state.levelComplete = false;
  state.immersiveMobile = false;
  state.orientationTipDismissed = false;
  startOverlay.classList.add('overlay-visible');
  gameOverOverlay.classList.remove('overlay-visible');
  levelCompleteOverlay.classList.remove('overlay-visible');
  heroEyebrowNode.textContent = 'Curtain Selection · Free Play';
  // heroSubtitleNode 保持 HTML 中的全局游戏介绍，不在选关时覆盖
  levelBadgeNode.textContent = '自由选关 · 十二主题舞台';
  applyTheme('menu');
  refreshCompletionStamps();
  updateMobileGameLayout();
  syncBackgroundMusic();
  exitGameFullscreen();
}

function resetGame() {
  state.running = false;
  state.gameOver = false;
  state.levelComplete = false;
  state.score = 0;
  state.elapsed = 0;
  state.speed = 360;
  state.spawnTimer = 1.35;
  state.obstacleCount = 0;
  state.lastSpawnLane = 'ground';

  player.y = stage.floorY - player.height;
  player.vy = 0;
  player.bob = 0;
  player.blink = 0;
  player.runCycle = 0;
  player.impact = 0;

  if (isFlappyLevel()) {
    // 第 12 关：飞行姿态，横向扁平体型，居中悬浮
    player.width = 210;
    player.height = 112;
    player.y = stage.height / 2 - player.height / 2;
    player.vy = 0;
  } else {
    player.width = 186;
    player.height = 244;
    player.y = stage.floorY - player.height;
  }

  obstacles.length = 0;
  particles.length = 0;

  scoreNode.textContent = '0';
  finalScoreText.textContent = '你拿到了 0 分。';
  levelCompleteTitle.textContent = '恭喜通关！';
  levelCompleteText.textContent = '你已完成当前关卡，最终分数为 0 分。';
  levelCompleteFinalText.textContent = '最终分数：0';
  levelCompleteFinalText.hidden = false;
  nextLevelButton.hidden = false;
  allLevelsCompleteText.hidden = true;
}

function startGame(level = state.level) {
  // 防御：每次开局都清理通关状态，避免从选关页/通关页返回后无法再次触发通关
  state.levelComplete = false;
  state.level = level;
  updateLevelTexts();
  resetGame();
  state.running = true;
  state.immersiveMobile = true;
  state.orientationTipDismissed = false;
  state.audioUnlocked = true;
  startOverlay.classList.remove('overlay-visible');
  gameOverOverlay.classList.remove('overlay-visible');
  levelCompleteOverlay.classList.remove('overlay-visible');
  updateMobileGameLayout();
  syncBackgroundMusic();
  requestGameFullscreen();
  // 滚动到游戏画布，避免停在页面顶部
  const stage = document.querySelector('.game-stage') || canvas;
  if (stage && typeof stage.scrollIntoView === 'function') {
    stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  // 每次开始一局都计一次热度（含选关首次进入 + 死亡后重玩 + 通关后再玩一次）
  hitHot(level).then((v) => {
    if (v != null) setHotBadge(level, v);
  });
}

function triggerLevelComplete() {
  const level = getLevelConfig();
  const nextLevel = LEVELS[state.level + 1];

  state.running = false;
  state.gameOver = false;
  state.levelComplete = true;
  markLevelCompleted(state.level);
  saveBestScore(state.level, state.score);
  refreshBestScoreDisplay();

  levelCompleteTitle.textContent = '恭喜通关！';
  levelCompleteText.textContent = `你已完成 ${level.badge}，当前分数 ${state.score} 分。点击「继续闯关」还能继续无限刷分。`;
  levelCompleteFinalText.textContent = `当前分数：${state.score}`;
  nextLevelButton.hidden = !nextLevel;
  allLevelsCompleteText.hidden = Boolean(nextLevel);
  levelCompleteOverlay.classList.add('overlay-visible');
  updateMobileGameLayout();
  fireConfetti();
}

function goToNextLevel() {
  const nextLevel = LEVELS[state.level + 1];
  if (!nextLevel) {
    return;
  }
  levelCompleteOverlay.classList.remove('overlay-visible');
  startGame(nextLevel.id);
}

function endGame() {
  state.running = false;
  state.gameOver = true;
  saveBestScore(state.level, state.score);
  refreshBestScoreDisplay();
  finalScoreText.textContent = `你在${getLevelConfig().badge}拿到了 ${state.score} 分，${getLevelConfig().endText}`;
  gameOverOverlay.classList.add('overlay-visible');
}

updateLevelTexts();

function triggerJump() {
  if (!state.running) {
    return;
  }

  if (isFlappyLevel()) {
    // 飞行模式：每次点击给一个较小的上升冲量，然后靠小重力慢慢滑落
    player.vy = -360;
    for (let index = 0; index < 4; index += 1) {
      particles.push({
        x: player.x + 40 + Math.random() * 60,
        y: player.y + player.height,
        vx: -80 - Math.random() * 60,
        vy: 20 + Math.random() * 40,
        life: 0.4 + Math.random() * 0.25,
        size: 3 + Math.random() * 5,
        hue: Math.random() > 0.5 ? '#f5d97a' : '#ffffff',
      });
    }
    return;
  }

  const isGrounded = player.y + player.height >= stage.floorY - 2;
  const jumpImpulse = isGrounded ? 540 : 455;
  player.vy = Math.max(player.vy - jumpImpulse, -760);

  for (let index = 0; index < 8; index += 1) {
    particles.push({
      x: player.x + 26 + Math.random() * 60,
      y: player.y + player.height - 8,
      vx: -60 - Math.random() * 90,
      vy: -30 - Math.random() * 80,
      life: 0.45 + Math.random() * 0.25,
      size: 4 + Math.random() * 8,
      hue: Math.random() > 0.5 ? '#ffd36e' : '#ff8f5d',
    });
  }
}

function obstacleCatalog() {
  const airLift = Math.min(72, Math.floor(state.elapsed / 14) * 14);

  if (state.level === 13) {
    return [
      {
        type: 'sicily-anchor',
        lane: 'ground',
        width: 108,
        height: 148,
        y: stage.floorY - 148,
        color: '#c7d2df',
        accent: '#f3f7ff',
      },
      {
        type: 'sicily-buoy',
        lane: 'ground',
        width: 92,
        height: 118,
        y: stage.floorY - 118,
        color: '#ff6b5a',
        accent: '#fff0b8',
      },
      {
        type: 'sicily-seaweed',
        lane: 'ground',
        width: 118,
        height: 156,
        y: stage.floorY - 156,
        color: '#2f8d63',
        accent: '#a6f5c6',
      },
      {
        type: 'sicily-hook',
        lane: 'air',
        width: 86,
        height: 142,
        y: 142 + Math.random() * 36,
        color: '#d9e2ec',
        accent: '#ffd36e',
      },
      {
        type: 'sicily-net',
        lane: 'air',
        width: 176,
        height: 106,
        y: 238 - airLift,
        color: 'rgba(255, 255, 255, 0.78)',
        accent: 'rgba(122, 217, 255, 0.7)',
      },
      {
        type: 'sicily-fish-school',
        lane: 'air',
        width: 168,
        height: 78,
        y: 160 + Math.random() * 44,
        color: '#4fe0ff',
        accent: '#ffffff',
      },
    ];
  }

  if (state.level === 11) {
    return [
      {
        type: 'wooden-easel',
        lane: 'ground',
        width: 108,
        height: 152,
        y: stage.floorY - 152,
        color: '#c68a4a',
        accent: '#7a4a24',
      },
      {
        type: 'paint-bucket',
        lane: 'ground',
        width: 96,
        height: 96,
        y: stage.floorY - 96,
        color: '#e07a4a',
        accent: '#f3d97a',
      },
      {
        type: 'art-stool',
        lane: 'ground',
        width: 104,
        height: 88,
        y: stage.floorY - 88,
        color: '#d9a35a',
        accent: '#8a5326',
      },
      {
        type: 'framed-canvas',
        lane: 'ground',
        width: 118,
        height: 124,
        y: stage.floorY - 124,
        color: '#f6e7c6',
        accent: '#b17743',
      },
      {
        type: 'paint-tube',
        lane: 'air',
        width: 136,
        height: 60,
        y: 172 + Math.random() * 30,
        color: '#f0c24c',
        accent: '#d94a4a',
      },
      {
        type: 'floating-brush',
        lane: 'air',
        width: 148,
        height: 40,
        y: 156 + Math.random() * 34,
        color: '#c07a3a',
        accent: '#f4d78f',
      },
      {
        type: 'palette-plate',
        lane: 'air',
        width: 120,
        height: 68,
        y: 200 - airLift,
        color: '#f5e2b3',
        accent: '#c96f4a',
      },
    ];
  }

  if (state.level === 10) {
    return [
      {
        type: 'taihu-rock',
        lane: 'ground',
        width: 112,
        height: 126,
        y: stage.floorY - 126,
        color: '#8c8b76',
        accent: '#d9d2b8',
      },
      {
        type: 'lotus-vat',
        lane: 'ground',
        width: 124,
        height: 104,
        y: stage.floorY - 104,
        color: '#5b8f73',
        accent: '#f4a6bb',
      },
      {
        type: 'red-screen',
        lane: 'ground',
        width: 104,
        height: 142,
        y: stage.floorY - 142,
        color: '#9b2f45',
        accent: '#f1c96a',
      },
      {
        type: 'falling-petals',
        lane: 'air',
        width: 150,
        height: 82,
        y: 150 + Math.random() * 44,
        color: '#ff9fba',
        accent: '#fff0f5',
      },
      {
        type: 'palace-lantern',
        lane: 'air',
        width: 88,
        height: 118,
        y: 132 + Math.random() * 36,
        color: '#c63d4d',
        accent: '#ffd36e',
      },
      {
        type: 'poetry-scroll',
        lane: 'air',
        width: 142,
        height: 74,
        y: 220 - airLift,
        color: '#f7e6c8',
        accent: '#9b2f45',
      },
    ];
  }

  if (state.level === 9) {
    return [
      {
        type: 'sandcastle',
        lane: 'ground',
        width: 126,
        height: 108,
        y: stage.floorY - 108,
        color: '#e7bf70',
        accent: '#fff0b8',
      },
      {
        type: 'shell-pile',
        lane: 'ground',
        width: 106,
        height: 74,
        y: stage.floorY - 74,
        color: '#ffd7a8',
        accent: '#ff8f7a',
      },
      {
        type: 'beach-umbrella',
        lane: 'ground',
        width: 132,
        height: 132,
        y: stage.floorY - 132,
        color: '#ff7b45',
        accent: '#ffe66d',
      },
      {
        type: 'bak-kut-teh-pot',
        lane: 'ground',
        width: 124,
        height: 96,
        y: stage.floorY - 96,
        color: '#7b4b31',
        accent: '#f4d19a',
      },
      {
        type: 'surfboard',
        lane: 'air',
        width: 162,
        height: 62,
        y: 176 + Math.random() * 40,
        color: '#35c6d1',
        accent: '#ffb347',
      },
      {
        type: 'sea-wave',
        lane: 'air',
        width: 174,
        height: 86,
        y: 238 - airLift,
        color: '#3fd2e6',
        accent: '#ffffff',
      },
      {
        type: 'cocktail-glass',
        lane: 'air',
        width: 90,
        height: 110,
        y: 150 + Math.random() * 38,
        color: '#ff9f45',
        accent: '#7bdc6f',
      },
    ];
  }

  if (state.level === 8) {
    return [
      {
        type: 'old-suitcase',
        lane: 'ground',
        width: 128,
        height: 88,
        y: stage.floorY - 88,
        color: '#7b4b2d',
        accent: '#d9b574',
      },
      {
        type: 'vintage-clock',
        lane: 'ground',
        width: 96,
        height: 132,
        y: stage.floorY - 132,
        color: '#8b5a34',
        accent: '#f2d49b',
      },
      {
        type: 'dock-crate',
        lane: 'ground',
        width: 116,
        height: 82,
        y: stage.floorY - 82,
        color: '#6a4b32',
        accent: '#c9a46b',
      },
      {
        type: 'reverse-hourglass',
        lane: 'air',
        width: 86,
        height: 118,
        y: 142 + Math.random() * 32,
        color: '#4e3322',
        accent: '#e7c47f',
      },
      {
        type: 'steam-cloud',
        lane: 'air',
        width: 168,
        height: 72,
        y: 196 + Math.random() * 32,
        color: 'rgba(232, 214, 184, 0.74)',
        accent: 'rgba(255, 242, 212, 0.62)',
      },
      {
        type: 'hummingbird',
        lane: 'air',
        width: 112,
        height: 74,
        y: 130 + Math.random() * 44,
        color: '#5c6f53',
        accent: '#e7c47f',
      },
    ];
  }

  if (state.level === 7) {
    return [
      {
        type: 'oscar-statue',
        lane: 'ground',
        width: 82,
        height: 142,
        y: stage.floorY - 142,
        color: '#f4c75d',
        accent: '#fff0a6',
      },
      {
        type: 'walk-star',
        lane: 'ground',
        width: 118,
        height: 76,
        y: stage.floorY - 76,
        color: '#d93b43',
        accent: '#ffd36e',
      },
      {
        type: 'red-rope',
        lane: 'ground',
        width: 166,
        height: 92,
        y: stage.floorY - 92,
        color: '#b7192f',
        accent: '#f6c968',
      },
      {
        type: 'clapperboard',
        lane: 'air',
        width: 116,
        height: 86,
        y: 150 + Math.random() * 34,
        color: '#191923',
        accent: '#f7f0d5',
      },
      {
        type: 'hollywood-camera',
        lane: 'air',
        width: 136,
        height: 96,
        y: 164 + Math.random() * 32,
        color: '#20212b',
        accent: '#ffd36e',
      },
      {
        type: 'gold-film-strip',
        lane: 'air',
        width: 190,
        height: 58,
        y: 248 - airLift,
        color: '#2a1b1c',
        accent: '#ffd36e',
      },
    ];
  }

  if (state.level === 6) {
    return [
      {
        type: 'film-reel',
        lane: 'ground',
        width: 104,
        height: 104,
        y: stage.floorY - 104,
        color: '#4a403b',
        accent: '#d4b276',
      },
      {
        type: 'projector',
        lane: 'ground',
        width: 144,
        height: 108,
        y: stage.floorY - 108,
        color: '#63534c',
        accent: '#b7a088',
      },
      {
        type: 'coffee-cup',
        lane: 'ground',
        width: 92,
        height: 94,
        y: stage.floorY - 94,
        color: '#d2c3a8',
        accent: '#7f4d3a',
      },
      {
        type: 'vintage-camera',
        lane: 'air',
        width: 112,
        height: 92,
        y: 154 + Math.random() * 30,
        color: '#4f3c34',
        accent: '#d0bd92',
      },
      {
        type: 'newspaper-stack',
        lane: 'air',
        width: 128,
        height: 78,
        y: 170 + Math.random() * 24,
        color: '#ddd2bf',
        accent: '#927464',
      },
      {
        type: 'film-strip',
        lane: 'air',
        width: 188,
        height: 56,
        y: 248 - airLift,
        color: '#43342f',
        accent: '#e2c58a',
      },
    ];
  }

  if (state.level === 5) {
    return [
      {
        type: 'plaid-sofa',
        lane: 'ground',
        width: 154,
        height: 96,
        y: stage.floorY - 96,
        color: '#c6ae8a',
        accent: '#7f6e52',
      },
      {
        type: 'cushion-stack',
        lane: 'ground',
        width: 118,
        height: 72,
        y: stage.floorY - 72,
        color: '#e2cc9c',
        accent: '#a9845c',
      },
      {
        type: 'flower-pot',
        lane: 'ground',
        width: 90,
        height: 118,
        y: stage.floorY - 118,
        color: '#d86b4e',
        accent: '#a8c883',
      },
      {
        type: 'retro-tv',
        lane: 'air',
        width: 118,
        height: 92,
        y: 150 + Math.random() * 28,
        color: '#8c7457',
        accent: '#d9e8b2',
      },
      {
        type: 'desk-lamp',
        lane: 'air',
        width: 100,
        height: 96,
        y: 164 + Math.random() * 28,
        color: '#e2cf89',
        accent: '#856b55',
      },
      {
        type: 'star-garland',
        lane: 'air',
        width: 194,
        height: 56,
        y: 248 - airLift,
        color: '#f2dd9c',
        accent: '#fff5c2',
      },
    ];
  }

  if (state.level === 4) {
    return [
      {
        type: 'yellow-rose-bouquet',
        lane: 'ground',
        width: 126,
        height: 136,
        y: stage.floorY - 136,
        color: '#f0cc55',
        accent: '#ffeaa0',
      },
      {
        type: 'pizza-box',
        lane: 'ground',
        width: 132,
        height: 78,
        y: stage.floorY - 78,
        color: '#d6844b',
        accent: '#ffe0a6',
      },
      {
        type: 'roulette-wheel',
        lane: 'ground',
        width: 112,
        height: 112,
        y: stage.floorY - 112,
        color: '#b94538',
        accent: '#f0d782',
      },
      {
        type: 'chip-stack',
        lane: 'air',
        width: 92,
        height: 88,
        y: 156 + Math.random() * 28,
        color: '#c54d3d',
        accent: '#f7d98d',
      },
      {
        type: 'pistol',
        lane: 'air',
        width: 132,
        height: 52,
        y: 184 + Math.random() * 26,
        color: '#52464a',
        accent: '#c7b29f',
      },
      {
        type: 'rose-garland',
        lane: 'air',
        width: 186,
        height: 56,
        y: 248 - airLift,
        color: '#d3a22a',
        accent: '#ffeaa8',
      },
    ];
  }

  if (state.level === 3) {
    return [
      {
        type: 'bamboo-cluster',
        lane: 'ground',
        width: 112,
        height: 170,
        y: stage.floorY - 170,
        color: '#5a8d62',
        accent: '#d9f1bc',
      },
      {
        type: 'stone-rock',
        lane: 'ground',
        width: 118,
        height: 70,
        y: stage.floorY - 70,
        color: '#7a7b73',
        accent: '#bfc1b5',
      },
      {
        type: 'sword-stand',
        lane: 'ground',
        width: 72,
        height: 156,
        y: stage.floorY - 156,
        color: '#d6dfdf',
        accent: '#8ba18e',
      },
      {
        type: 'flying-dagger',
        lane: 'air',
        width: 116,
        height: 44,
        y: 176 + Math.random() * 34,
        color: '#d4e0dd',
        accent: '#567268',
      },
      {
        type: 'dart-wheel',
        lane: 'air',
        width: 92,
        height: 92,
        y: 140 + Math.random() * 34,
        color: '#d8e4e1',
        accent: '#456258',
      },
      {
        type: 'bamboo-crossbar',
        lane: 'air',
        width: 180,
        height: 54,
        y: 248 - airLift,
        color: '#5e8550',
        accent: '#d7e7b3',
      },
    ];
  }

  if (state.level === 2) {
    return [
      {
        type: 'book-stack',
        lane: 'ground',
        width: 126,
        height: 82,
        y: stage.floorY - 82,
        color: '#7e4b33',
        accent: '#ffd082',
      },
      {
        type: 'magazine-pile',
        lane: 'ground',
        width: 144,
        height: 58,
        y: stage.floorY - 58,
        color: '#8f5a43',
        accent: '#ffe7be',
      },
      {
        type: 'envelope-bundle',
        lane: 'ground',
        width: 118,
        height: 76,
        y: stage.floorY - 76,
        color: '#f0d4ad',
        accent: '#bf7b4f',
      },
      {
        type: 'bookshelf-ledge',
        lane: 'air',
        width: 186,
        height: 68,
        y: 264 - airLift,
        color: '#8a5637',
        accent: '#f4cca0',
      },
      {
        type: 'floating-letter',
        lane: 'air',
        width: 104,
        height: 90,
        y: 144 + Math.random() * 22,
        color: '#fff5e8',
        accent: '#d99268',
      },
      {
        type: 'open-book',
        lane: 'air',
        width: 116,
        height: 92,
        y: 174 + Math.random() * 22,
        color: '#ffe4b5',
        accent: '#b16c45',
      },
    ];
  }

  return [
    {
      type: 'prop-trunk',
      lane: 'ground',
      width: 122,
      height: 74,
      y: stage.floorY - 74,
      color: '#7d4631',
      accent: '#ffc671',
    },
    {
      type: 'footlight',
      lane: 'ground',
      width: 134,
      height: 48,
      y: stage.floorY - 48,
      color: '#8f2f26',
      accent: '#ffe6a7',
    },
    {
      type: 'mic-stand',
      lane: 'ground',
      width: 64,
      height: 150,
      y: stage.floorY - 150,
      color: '#232733',
      accent: '#ffbe5d',
    },
    {
      type: 'balcony-rail',
      lane: 'air',
      width: 176,
      height: 62,
      y: 276 - airLift,
      color: '#3d4852',
      accent: '#ffd36e',
    },
    {
      type: 'spotlight-rig',
      lane: 'air',
      width: 116,
      height: 92,
      y: 176 - airLift,
      color: '#596776',
      accent: '#b7ffe6',
    },
    {
      type: 'floating-note',
      lane: 'air',
      width: 84,
      height: 104,
      y: 132 + Math.random() * 30,
      color: '#78d7bf',
      accent: '#e7fffa',
    },
    {
      type: 'ghost-float',
      lane: 'air',
      width: 92,
      height: 112,
      y: 152 + Math.random() * 34,
      color: 'rgba(248, 246, 255, 0.92)',
      accent: 'rgba(205, 171, 255, 0.38)',
    },
  ];
}

function spawnObstacle() {
  if (isFlappyLevel()) {
    spawnPipePair();
    return;
  }
  const options = obstacleCatalog();
  const shouldPreferAir = state.lastSpawnLane === 'ground' ? Math.random() > 0.48 : Math.random() > 0.72;
  const primaryLane = shouldPreferAir ? 'air' : 'ground';
  const primaryPool = options.filter((item) => item.lane === primaryLane);
  const chosen = primaryPool[Math.floor(Math.random() * primaryPool.length)];

  obstacles.push({
    ...chosen,
    x: stage.width + 120,
    passed: false,
    phase: Math.random() * Math.PI * 2,
    sway: 8 + Math.random() * 10,
  });

  state.lastSpawnLane = primaryLane;

  // 第 1-11 关（跑酷）彻底禁用上下组合障碍，避免上下衔接过近导致无法通过
  // 只依靠障碍生成节奏 + 单个障碍的地/空随机分布提供难度
  const canCreateCombo = false;
  if (canCreateCombo) {
    const secondaryLane = primaryLane === 'ground' ? 'air' : 'ground';
    const secondaryPool = options.filter((item) => item.lane === secondaryLane);
    const secondary = secondaryPool[Math.floor(Math.random() * secondaryPool.length)];
    obstacles.push({
      ...secondary,
      x: stage.width + (state.level === 7 ? 720 : 800) + Math.random() * 200,
      passed: false,
      phase: Math.random() * Math.PI * 2,
      sway: 6 + Math.random() * 10,
    });
    state.lastSpawnLane = secondaryLane;
  }
}

function spawnPipePair() {
  const pipeWidth = 108;
  const gapHeight = 220; // 通道高度
  const minCenter = stage.ceilingY + 30 + gapHeight / 2;
  const maxCenter = stage.floorY - 30 - gapHeight / 2;
  const gapCenter = minCenter + Math.random() * (maxCenter - minCenter);
  const topEnd = Math.max(0, gapCenter - gapHeight / 2);
  const bottomStart = Math.min(stage.height, gapCenter + gapHeight / 2);
  const x = stage.width + 40;

  obstacles.push({
    type: 'pipe-top',
    lane: 'ceiling',
    x,
    y: 0,
    width: pipeWidth,
    height: topEnd,
    color: '#f7f2e6',
    accent: '#c69b3a',
    passed: false,
    phase: 0,
    countable: true,
    countValue: 2,
  });
  obstacles.push({
    type: 'pipe-bottom',
    lane: 'ground',
    x,
    y: bottomStart,
    width: pipeWidth,
    height: stage.height - bottomStart,
    color: '#f7f2e6',
    accent: '#c69b3a',
    passed: false,
    phase: 0,
    countable: false,
  });
}

function updateGame(delta) {
  if (!state.running) {
    return;
  }
  // 横屏提示仍在显示时冻结游戏时钟，等玩家点「我知道了」再开始
  if (orientationTip && orientationTip.classList.contains('orientation-tip-visible')) {
    return;
  }

  state.elapsed += delta;
  const baseSpeed = 340 + Math.min(180, state.elapsed * 8.5) + (state.level === 2 ? 28 : 0) + (state.level === 3 ? 44 : 0) + (state.level === 4 ? 34 : 0) + (state.level === 5 ? 24 : 0) + (state.level === 6 ? 32 : 0) + (state.level === 7 ? 42 : 0) + (state.level === 8 ? 30 : 0) + (state.level === 9 ? 34 : 0) + (state.level === 10 ? 36 : 0) + (state.level === 11 ? 32 : 0) + (state.level === 13 ? 34 : 0);
  // 通关后随分数持续加速，1500 分为通关基线，每多 1 分速度 +0.32，最多再加 340（约 2500+ 分后趋于饱和）
  const overClearBoost = state.levelComplete
    ? Math.min(340, Math.max(0, state.score - CLEAR_SCORE) * 0.32)
    : 0;
  if (isFlappyLevel()) {
    // Flappy 关：整体速度更慢，方便滑翔
    state.speed = 280 + Math.min(140, state.elapsed * 3.6) + overClearBoost * 0.6;
  } else {
    state.speed = baseSpeed + overClearBoost;
  }
  state.score = Math.floor(state.elapsed * 14 + state.obstacleCount * 18);
  scoreNode.textContent = String(state.score);

  if (state.score >= CLEAR_SCORE && !state.levelComplete) {
    triggerLevelComplete();
    return;
  }

  if (isFlappyLevel()) {
    // Flappy 模式：小重力自由下坠，撞顶/撞底都直接结束
    player.vy += 1050 * delta;
    if (player.vy > 620) player.vy = 620;
    player.y += player.vy * delta;
    player.runCycle += delta * 6;
    player.bob += delta * 6;
    player.blink += delta;
    player.impact = Math.max(0, player.impact - delta * 2.2);

    if (player.y <= stage.ceilingY - 10) {
      player.y = stage.ceilingY - 10;
      player.impact = 1;
      endGame();
      return;
    }
    if (player.y + player.height >= stage.floorY) {
      player.y = stage.floorY - player.height;
      player.impact = 1;
      endGame();
      return;
    }
  } else {
    player.vy += 1550 * delta;
    player.y += player.vy * delta;
    player.runCycle += delta * (player.y + player.height >= stage.floorY - 2 ? 13 : 8);
    player.bob += delta * 8;
    player.blink += delta;
    player.impact = Math.max(0, player.impact - delta * 2.2);

    if (player.y <= stage.ceilingY) {
      player.y = stage.ceilingY;
      player.vy = Math.max(player.vy, 80);
    }

    if (player.y + player.height >= stage.floorY) {
      player.y = stage.floorY - player.height;
      if (player.vy > 260) {
        for (let index = 0; index < 6; index += 1) {
          particles.push({
            x: player.x + 28 + Math.random() * 74,
            y: stage.floorY - 10,
            vx: -40 - Math.random() * 60,
            vy: -20 - Math.random() * 60,
            life: 0.35 + Math.random() * 0.2,
            size: 4 + Math.random() * 8,
            hue: '#dba563',
          });
        }
      }
      player.vy = 0;
    }
  }

  state.spawnTimer -= delta;
  if (state.spawnTimer <= 0) {
    spawnObstacle();
    if (isFlappyLevel()) {
      // Flappy 模式：每对管道稳定间距，随分数轻微收紧
      const tighten = Math.min(0.3, state.score / 2000);
      state.spawnTimer = 1.55 - tighten;
    } else {
      const difficulty = Math.min(1, state.score / 680);
      // 通关后障碍物间隔进一步收紧（幅度较小，主要靠速度增加难度）
      const overClearTighten = state.levelComplete
        ? Math.min(0.4, Math.max(0, state.score - CLEAR_SCORE) / 2500)
        : 0;
      const minGap = Math.max(1.05, 1.5 - difficulty * 0.34 - overClearTighten * 0.24);
      const maxGap = Math.max(minGap + 0.4, 2.25 - difficulty * 0.5 - overClearTighten * 0.34);
      state.spawnTimer = minGap + Math.random() * (maxGap - minGap);
    }
  }

  const playerHitbox = isFlappyLevel()
    ? {
        x: player.x + 16,
        y: player.y + 22,
        width: player.width - 40,
        height: player.height - 40,
      }
    : {
        x: player.x + 52,
        y: player.y + 26,
        width: player.width - 98,
        height: player.height - 48,
      };

  for (let index = obstacles.length - 1; index >= 0; index -= 1) {
    const obstacle = obstacles[index];
    obstacle.x -= state.speed * delta;
    obstacle.phase += delta * 2.2;

    if (!obstacle.passed && obstacle.x + obstacle.width < player.x) {
      obstacle.passed = true;
      if (obstacle.countable !== false) {
        state.obstacleCount += obstacle.countValue || 1;
      }
    }

    const obstacleHitbox = getObstacleHitbox(obstacle);
    if (rectsOverlap(playerHitbox, obstacleHitbox)) {
      player.impact = 1;
      endGame();
      return;
    }

    if (obstacle.x + obstacle.width < -160) {
      obstacles.splice(index, 1);
    }
  }

  for (let index = particles.length - 1; index >= 0; index -= 1) {
    const particle = particles[index];
    particle.life -= delta;
    particle.x += particle.vx * delta;
    particle.y += particle.vy * delta;
    particle.vy += 180 * delta;
    if (particle.life <= 0) {
      particles.splice(index, 1);
    }
  }
}

function getObstacleHitbox(obstacle) {
  if (obstacle.type === 'pipe-top' || obstacle.type === 'pipe-bottom') {
    return { x: obstacle.x + 6, y: obstacle.y, width: obstacle.width - 12, height: obstacle.height };
  }
  if (obstacle.type === 'mic-stand') {
    return { x: obstacle.x + 18, y: obstacle.y + 10, width: obstacle.width - 36, height: obstacle.height - 8 };
  }
  if (obstacle.type === 'floating-note') {
    return { x: obstacle.x + 14, y: obstacle.y + 10, width: obstacle.width - 28, height: obstacle.height - 20 };
  }
  if (obstacle.type === 'ghost-float') {
    return { x: obstacle.x + 18, y: obstacle.y + 14, width: obstacle.width - 36, height: obstacle.height - 18 };
  }
  if (obstacle.type === 'balcony-rail') {
    return { x: obstacle.x + 10, y: obstacle.y + 6, width: obstacle.width - 20, height: obstacle.height - 6 };
  }
  if (obstacle.type === 'spotlight-rig') {
    return { x: obstacle.x + 8, y: obstacle.y + 14, width: obstacle.width - 16, height: obstacle.height - 18 };
  }
  if (obstacle.type === 'book-stack') {
    return { x: obstacle.x + 10, y: obstacle.y + 10, width: obstacle.width - 20, height: obstacle.height - 12 };
  }
  if (obstacle.type === 'magazine-pile') {
    return { x: obstacle.x + 10, y: obstacle.y + 6, width: obstacle.width - 20, height: obstacle.height - 8 };
  }
  if (obstacle.type === 'envelope-bundle') {
    return { x: obstacle.x + 8, y: obstacle.y + 10, width: obstacle.width - 16, height: obstacle.height - 14 };
  }
  if (obstacle.type === 'bookshelf-ledge') {
    return { x: obstacle.x + 10, y: obstacle.y + 8, width: obstacle.width - 20, height: obstacle.height - 8 };
  }
  if (obstacle.type === 'floating-letter') {
    return { x: obstacle.x + 10, y: obstacle.y + 12, width: obstacle.width - 20, height: obstacle.height - 22 };
  }
  if (obstacle.type === 'open-book') {
    return { x: obstacle.x + 10, y: obstacle.y + 16, width: obstacle.width - 20, height: obstacle.height - 24 };
  }
  if (obstacle.type === 'bamboo-cluster') {
    return { x: obstacle.x + 16, y: obstacle.y + 8, width: obstacle.width - 32, height: obstacle.height - 10 };
  }
  if (obstacle.type === 'stone-rock') {
    return { x: obstacle.x + 8, y: obstacle.y + 12, width: obstacle.width - 16, height: obstacle.height - 14 };
  }
  if (obstacle.type === 'sword-stand') {
    return { x: obstacle.x + 22, y: obstacle.y + 4, width: obstacle.width - 44, height: obstacle.height - 8 };
  }
  if (obstacle.type === 'flying-dagger') {
    return { x: obstacle.x + 10, y: obstacle.y + 10, width: obstacle.width - 20, height: obstacle.height - 18 };
  }
  if (obstacle.type === 'dart-wheel') {
    return { x: obstacle.x + 10, y: obstacle.y + 10, width: obstacle.width - 20, height: obstacle.height - 20 };
  }
  if (obstacle.type === 'bamboo-crossbar') {
    return { x: obstacle.x + 10, y: obstacle.y + 8, width: obstacle.width - 20, height: obstacle.height - 10 };
  }
  if (obstacle.type === 'yellow-rose-bouquet') {
    return { x: obstacle.x + 18, y: obstacle.y + 10, width: obstacle.width - 36, height: obstacle.height - 18 };
  }
  if (obstacle.type === 'pizza-box') {
    return { x: obstacle.x + 8, y: obstacle.y + 12, width: obstacle.width - 16, height: obstacle.height - 14 };
  }
  if (obstacle.type === 'roulette-wheel') {
    return { x: obstacle.x + 12, y: obstacle.y + 12, width: obstacle.width - 24, height: obstacle.height - 24 };
  }
  if (obstacle.type === 'chip-stack') {
    return { x: obstacle.x + 12, y: obstacle.y + 10, width: obstacle.width - 24, height: obstacle.height - 14 };
  }
  if (obstacle.type === 'pistol') {
    return { x: obstacle.x + 10, y: obstacle.y + 10, width: obstacle.width - 20, height: obstacle.height - 18 };
  }
  if (obstacle.type === 'rose-garland') {
    return { x: obstacle.x + 10, y: obstacle.y + 10, width: obstacle.width - 20, height: obstacle.height - 14 };
  }
  if (obstacle.type === 'plaid-sofa') {
    return { x: obstacle.x + 12, y: obstacle.y + 12, width: obstacle.width - 24, height: obstacle.height - 16 };
  }
  if (obstacle.type === 'cushion-stack') {
    return { x: obstacle.x + 10, y: obstacle.y + 8, width: obstacle.width - 20, height: obstacle.height - 10 };
  }
  if (obstacle.type === 'flower-pot') {
    return { x: obstacle.x + 10, y: obstacle.y + 10, width: obstacle.width - 20, height: obstacle.height - 14 };
  }
  if (obstacle.type === 'retro-tv') {
    return { x: obstacle.x + 8, y: obstacle.y + 8, width: obstacle.width - 16, height: obstacle.height - 12 };
  }
  if (obstacle.type === 'desk-lamp') {
    return { x: obstacle.x + 10, y: obstacle.y + 8, width: obstacle.width - 20, height: obstacle.height - 10 };
  }
  if (obstacle.type === 'star-garland') {
    return { x: obstacle.x + 12, y: obstacle.y + 8, width: obstacle.width - 24, height: obstacle.height - 10 };
  }
  if (obstacle.type === 'film-reel') {
    return { x: obstacle.x + 10, y: obstacle.y + 10, width: obstacle.width - 20, height: obstacle.height - 20 };
  }
  if (obstacle.type === 'projector') {
    return { x: obstacle.x + 8, y: obstacle.y + 12, width: obstacle.width - 16, height: obstacle.height - 16 };
  }
  if (obstacle.type === 'coffee-cup') {
    return { x: obstacle.x + 12, y: obstacle.y + 8, width: obstacle.width - 24, height: obstacle.height - 12 };
  }
  if (obstacle.type === 'vintage-camera') {
    return { x: obstacle.x + 8, y: obstacle.y + 10, width: obstacle.width - 16, height: obstacle.height - 16 };
  }
  if (obstacle.type === 'newspaper-stack') {
    return { x: obstacle.x + 8, y: obstacle.y + 10, width: obstacle.width - 16, height: obstacle.height - 14 };
  }
  if (obstacle.type === 'film-strip') {
    return { x: obstacle.x + 12, y: obstacle.y + 8, width: obstacle.width - 24, height: obstacle.height - 10 };
  }
  if (obstacle.type === 'oscar-statue') {
    return { x: obstacle.x + 16, y: obstacle.y + 8, width: obstacle.width - 32, height: obstacle.height - 14 };
  }
  if (obstacle.type === 'walk-star') {
    return { x: obstacle.x + 12, y: obstacle.y + 12, width: obstacle.width - 24, height: obstacle.height - 18 };
  }
  if (obstacle.type === 'red-rope') {
    return { x: obstacle.x + 10, y: obstacle.y + 12, width: obstacle.width - 20, height: obstacle.height - 16 };
  }
  if (obstacle.type === 'clapperboard') {
    return { x: obstacle.x + 10, y: obstacle.y + 8, width: obstacle.width - 20, height: obstacle.height - 14 };
  }
  if (obstacle.type === 'hollywood-camera') {
    return { x: obstacle.x + 8, y: obstacle.y + 10, width: obstacle.width - 16, height: obstacle.height - 16 };
  }
  if (obstacle.type === 'gold-film-strip') {
    return { x: obstacle.x + 12, y: obstacle.y + 8, width: obstacle.width - 24, height: obstacle.height - 10 };
  }
  if (obstacle.type === 'old-suitcase') {
    return { x: obstacle.x + 10, y: obstacle.y + 12, width: obstacle.width - 20, height: obstacle.height - 14 };
  }
  if (obstacle.type === 'vintage-clock') {
    return { x: obstacle.x + 12, y: obstacle.y + 8, width: obstacle.width - 24, height: obstacle.height - 12 };
  }
  if (obstacle.type === 'dock-crate') {
    return { x: obstacle.x + 8, y: obstacle.y + 8, width: obstacle.width - 16, height: obstacle.height - 12 };
  }
  if (obstacle.type === 'reverse-hourglass') {
    return { x: obstacle.x + 12, y: obstacle.y + 8, width: obstacle.width - 24, height: obstacle.height - 14 };
  }
  if (obstacle.type === 'steam-cloud') {
    return { x: obstacle.x + 16, y: obstacle.y + 14, width: obstacle.width - 32, height: obstacle.height - 26 };
  }
  if (obstacle.type === 'hummingbird') {
    return { x: obstacle.x + 12, y: obstacle.y + 12, width: obstacle.width - 24, height: obstacle.height - 22 };
  }
  if (obstacle.type === 'sandcastle') {
    return { x: obstacle.x + 10, y: obstacle.y + 12, width: obstacle.width - 20, height: obstacle.height - 14 };
  }
  if (obstacle.type === 'shell-pile') {
    return { x: obstacle.x + 8, y: obstacle.y + 14, width: obstacle.width - 16, height: obstacle.height - 18 };
  }
  if (obstacle.type === 'beach-umbrella') {
    return { x: obstacle.x + 12, y: obstacle.y + 8, width: obstacle.width - 24, height: obstacle.height - 14 };
  }
  if (obstacle.type === 'bak-kut-teh-pot') {
    return { x: obstacle.x + 10, y: obstacle.y + 12, width: obstacle.width - 20, height: obstacle.height - 18 };
  }
  if (obstacle.type === 'surfboard') {
    return { x: obstacle.x + 10, y: obstacle.y + 8, width: obstacle.width - 20, height: obstacle.height - 12 };
  }
  if (obstacle.type === 'sea-wave') {
    return { x: obstacle.x + 8, y: obstacle.y + 18, width: obstacle.width - 16, height: obstacle.height - 28 };
  }
  if (obstacle.type === 'cocktail-glass') {
    return { x: obstacle.x + 14, y: obstacle.y + 8, width: obstacle.width - 28, height: obstacle.height - 16 };
  }
  if (obstacle.type === 'taihu-rock') {
    return { x: obstacle.x + 12, y: obstacle.y + 10, width: obstacle.width - 24, height: obstacle.height - 16 };
  }
  if (obstacle.type === 'lotus-vat') {
    return { x: obstacle.x + 10, y: obstacle.y + 12, width: obstacle.width - 20, height: obstacle.height - 16 };
  }
  if (obstacle.type === 'red-screen') {
    return { x: obstacle.x + 10, y: obstacle.y + 6, width: obstacle.width - 20, height: obstacle.height - 12 };
  }
  if (obstacle.type === 'falling-petals') {
    return { x: obstacle.x + 14, y: obstacle.y + 12, width: obstacle.width - 28, height: obstacle.height - 22 };
  }
  if (obstacle.type === 'palace-lantern') {
    return { x: obstacle.x + 12, y: obstacle.y + 8, width: obstacle.width - 24, height: obstacle.height - 16 };
  }
  if (obstacle.type === 'poetry-scroll') {
    return { x: obstacle.x + 10, y: obstacle.y + 8, width: obstacle.width - 20, height: obstacle.height - 14 };
  }
  if (obstacle.type === 'wooden-easel') {
    return { x: obstacle.x + 22, y: obstacle.y + 6, width: obstacle.width - 44, height: obstacle.height - 10 };
  }
  if (obstacle.type === 'paint-bucket') {
    return { x: obstacle.x + 8, y: obstacle.y + 10, width: obstacle.width - 16, height: obstacle.height - 14 };
  }
  if (obstacle.type === 'art-stool') {
    return { x: obstacle.x + 10, y: obstacle.y + 6, width: obstacle.width - 20, height: obstacle.height - 10 };
  }
  if (obstacle.type === 'framed-canvas') {
    return { x: obstacle.x + 8, y: obstacle.y + 8, width: obstacle.width - 16, height: obstacle.height - 14 };
  }
  if (obstacle.type === 'paint-tube') {
    return { x: obstacle.x + 12, y: obstacle.y + 8, width: obstacle.width - 24, height: obstacle.height - 16 };
  }
  if (obstacle.type === 'floating-brush') {
    return { x: obstacle.x + 10, y: obstacle.y + 6, width: obstacle.width - 20, height: obstacle.height - 12 };
  }
  if (obstacle.type === 'palette-plate') {
    return { x: obstacle.x + 12, y: obstacle.y + 8, width: obstacle.width - 24, height: obstacle.height - 16 };
  }
  if (obstacle.type === 'sicily-anchor') {
    return { x: obstacle.x + 18, y: obstacle.y + 10, width: obstacle.width - 36, height: obstacle.height - 16 };
  }
  if (obstacle.type === 'sicily-buoy') {
    return { x: obstacle.x + 14, y: obstacle.y + 14, width: obstacle.width - 28, height: obstacle.height - 22 };
  }
  if (obstacle.type === 'sicily-seaweed') {
    return { x: obstacle.x + 10, y: obstacle.y + 10, width: obstacle.width - 20, height: obstacle.height - 18 };
  }
  if (obstacle.type === 'sicily-hook') {
    return { x: obstacle.x + 28, y: obstacle.y + 6, width: obstacle.width - 56, height: obstacle.height - 10 };
  }
  if (obstacle.type === 'sicily-net') {
    return { x: obstacle.x + 14, y: obstacle.y + 18, width: obstacle.width - 28, height: obstacle.height - 34 };
  }
  if (obstacle.type === 'sicily-fish-school') {
    return { x: obstacle.x + 12, y: obstacle.y + 14, width: obstacle.width - 24, height: obstacle.height - 26 };
  }
  return { x: obstacle.x + 8, y: obstacle.y + 6, width: obstacle.width - 16, height: obstacle.height - 10 };
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function drawBackground(time) {
  if (state.level === 13) {
    const sky = ctx.createLinearGradient(0, 0, 0, stage.height);
    sky.addColorStop(0, '#89e7ff');
    sky.addColorStop(0.48, '#2aa9e6');
    sky.addColorStop(1, '#0b3d5e');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, stage.width, stage.height);

    drawSicilySunAndClouds(time);
    drawSicilySea(time);
    drawSicilyTown(time);
    drawSicilyBoats(time);
    drawSicilyWaves(time);
    drawSicilyFloor(time);
    return;
  }

  if (state.level === 12) {
    const bg = ctx.createLinearGradient(0, 0, 0, stage.height);
    bg.addColorStop(0, '#0a0a12');
    bg.addColorStop(0.5, '#1a1e2e');
    bg.addColorStop(1, '#05050a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, stage.width, stage.height);

    drawConcertSpotlights(time);
    drawConcertStaffLines(time);
    drawConcertFloatingNotes(time);
    drawConcertKeyboardStrip();
    return;
  }

  if (state.level === 11) {
    const sky = ctx.createLinearGradient(0, 0, 0, stage.height);
    sky.addColorStop(0, '#fbe0a8');
    sky.addColorStop(0.5, '#f2c176');
    sky.addColorStop(1, '#7a4a24');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, stage.width, stage.height);

    drawXinjiBackWall(time);
    drawXinjiPaintShelves(time);
    drawXinjiSignboards(time);
    drawXinjiHangingLamps(time);
    drawXinjiFloor();
    return;
  }

  if (state.level === 10) {
    const sky = ctx.createLinearGradient(0, 0, 0, stage.height);
    sky.addColorStop(0, '#f6c1cb');
    sky.addColorStop(0.48, '#d9798e');
    sky.addColorStop(1, '#6b2636');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, stage.width, stage.height);

    drawHonglouBackdrop(time);
    drawHonglouGarden(time);
    drawHonglouPetals(time);
    drawHonglouFloor();
    return;
  }

  if (state.level === 9) {
    const sky = ctx.createLinearGradient(0, 0, 0, stage.height);
    sky.addColorStop(0, '#76ddff');
    sky.addColorStop(0.48, '#42bfe8');
    sky.addColorStop(1, '#f9c56e');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, stage.width, stage.height);

    drawIslandBackdrop(time);
    drawIslandSunAndClouds(time);
    drawIslandPalms(time);
    drawIslandFloor();
    return;
  }

  if (state.level === 8) {
    const sky = ctx.createLinearGradient(0, 0, 0, stage.height);
    sky.addColorStop(0, '#9b7448');
    sky.addColorStop(0.5, '#5a3d26');
    sky.addColorStop(1, '#21140b');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, stage.width, stage.height);

    drawBenjaminBackdrop(time);
    drawBenjaminTimeMotifs(time);
    drawBenjaminSteamAndBirds(time);
    drawPaperPlanes(time);
    drawBenjaminFloor();
    return;
  }

  if (state.level === 7) {
    const sky = ctx.createLinearGradient(0, 0, 0, stage.height);
    sky.addColorStop(0, '#221020');
    sky.addColorStop(0.42, '#5d1422');
    sky.addColorStop(1, '#080509');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, stage.width, stage.height);

    drawHollywoodBackdrop(time);
    drawHollywoodSpotlights(time);
    drawHollywoodSparkles(time);
    drawHollywoodFloor();
    return;
  }

  if (state.level === 6) {
    const sky = ctx.createLinearGradient(0, 0, 0, stage.height);
    sky.addColorStop(0, '#64342f');
    sky.addColorStop(0.5, '#31191c');
    sky.addColorStop(1, '#110a0d');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, stage.width, stage.height);

    drawShanghaiBackdrop(time);
    drawShanghaiLights(time);
    drawNewsprintDrift(time);
    drawShanghaiStreetFloor();
    return;
  }

  if (state.level === 5) {
    const sky = ctx.createLinearGradient(0, 0, 0, stage.height);
    sky.addColorStop(0, '#8b7953');
    sky.addColorStop(0.5, '#5a482f');
    sky.addColorStop(1, '#1f1710');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, stage.width, stage.height);

    drawCozyHomeBackdrop(time);
    drawWarmStarLights(time);
    drawWallpaperFlowers(time);
    drawCozyHomeFloor();
    return;
  }

  if (state.level === 4) {
    const sky = ctx.createLinearGradient(0, 0, 0, stage.height);
    sky.addColorStop(0, '#783529');
    sky.addColorStop(0.48, '#421716');
    sky.addColorStop(1, '#16090b');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, stage.width, stage.height);

    drawSantaLuciaBackdrop(time);
    drawCasinoLights(time);
    drawRoseDrift(time);
    drawCasinoFloor();
    return;
  }

  if (state.level === 3) {
    const sky = ctx.createLinearGradient(0, 0, 0, stage.height);
    sky.addColorStop(0, '#355443');
    sky.addColorStop(0.48, '#1b2d23');
    sky.addColorStop(1, '#09120d');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, stage.width, stage.height);

    drawInkMountains(time);
    drawBambooBackdrop(time);
    drawMistBands(time);
    drawFallingLeaves(time);
    drawBambooFloor();
    return;
  }

  if (state.level === 2) {
    const sky = ctx.createLinearGradient(0, 0, 0, stage.height);
    sky.addColorStop(0, '#8b4d37');
    sky.addColorStop(0.48, '#5a3026');
    sky.addColorStop(1, '#241312');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, stage.width, stage.height);

    drawLibraryBackdrop(time);
    drawReadingLights(time);
    drawLetterDecorations(time);
    drawLibraryFloor();
    return;
  }

  const sky = ctx.createLinearGradient(0, 0, 0, stage.height);
  sky.addColorStop(0, '#5b2531');
  sky.addColorStop(0.52, '#2b1521');
  sky.addColorStop(1, '#120a12');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, stage.width, stage.height);

  stars.forEach((star) => {
    const pulse = 0.45 + Math.sin(time * 0.0013 + star.twinkle) * 0.35;
    ctx.fillStyle = `rgba(255, 223, 188, ${pulse})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  drawBroadwayBackdrop(time);
  drawAmbientGhosts(time);
  drawCurtains(time);
  drawStageLights(time);
  drawMusicNotes(time);
  drawFloor();
}

function drawBroadwayBackdrop(time) {
  const baseX = -((state.elapsed * state.speed * 0.12) % 180);

  ctx.save();
  ctx.translate(baseX, 0);
  for (let index = -1; index < 8; index += 1) {
    const blockX = index * 180 + 120;
    ctx.fillStyle = '#16222d';
    ctx.fillRect(blockX, 152, 160, 430);

    ctx.fillStyle = '#213040';
    ctx.fillRect(blockX + 18, 132, 124, 54);

    ctx.fillStyle = '#16222d';
    ctx.fillRect(blockX + 22, 186, 116, 10);

    ctx.fillStyle = '#5d302a';
    ctx.fillRect(blockX + 26, 220, 108, 292);

    ctx.fillStyle = '#1b1d1f';
    ctx.fillRect(blockX + 4, 500, 152, 92);
  }
  ctx.restore();

  buildingWindows.forEach((windowUnit, index) => {
    const wobble = Math.sin(time * 0.0012 + index) * 4;
    const glow = 0.22 + Math.sin(time * 0.0015 + index) * 0.08;
    const x = windowUnit.x - ((state.elapsed * state.speed * 0.12) % 180);
    const wrappedX = x < -120 ? x + 1440 : x;

    const warm = ctx.createLinearGradient(0, windowUnit.y, 0, windowUnit.y + windowUnit.height);
    warm.addColorStop(0, `rgba(255, 214, 134, ${0.78 + glow})`);
    warm.addColorStop(1, `rgba(255, 155, 86, ${0.48 + glow})`);
    ctx.fillStyle = warm;
    ctx.fillRect(wrappedX, windowUnit.y + wobble, windowUnit.width, windowUnit.height);

    ctx.strokeStyle = 'rgba(70, 42, 34, 0.95)';
    ctx.lineWidth = 5;
    ctx.strokeRect(wrappedX, windowUnit.y + wobble, windowUnit.width, windowUnit.height);

    ctx.beginPath();
    ctx.moveTo(wrappedX + windowUnit.width / 2, windowUnit.y + wobble);
    ctx.lineTo(wrappedX + windowUnit.width / 2, windowUnit.y + wobble + windowUnit.height);
    ctx.moveTo(wrappedX, windowUnit.y + wobble + windowUnit.height / 2);
    ctx.lineTo(wrappedX + windowUnit.width, windowUnit.y + wobble + windowUnit.height / 2);
    ctx.stroke();

    ctx.fillStyle = 'rgba(25, 24, 28, 0.72)';
    ctx.beginPath();
    ctx.arc(wrappedX + 28, windowUnit.y + 56 + wobble, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(wrappedX + 18, windowUnit.y + 80 + wobble, 18, 32);

    ctx.beginPath();
    ctx.arc(wrappedX + 74, windowUnit.y + 42 + wobble, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(wrappedX + 66, windowUnit.y + 60 + wobble, 15, 28);
    ctx.beginPath();
    ctx.moveTo(wrappedX + 74, windowUnit.y + 72 + wobble);
    ctx.lineTo(wrappedX + 96, windowUnit.y + 98 + wobble);
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'rgba(25, 24, 28, 0.72)';
    ctx.stroke();
  });

  ctx.save();
  ctx.globalAlpha = 0.82;
  drawStreetSigns();
  ctx.restore();
}

function drawStreetSigns() {
  ctx.save();
  ctx.translate(120, 460);
  ctx.fillStyle = '#14212d';
  ctx.fillRect(0, -40, 14, 210);
  ctx.beginPath();
  ctx.arc(7, -52, 18, 0, Math.PI * 2);
  ctx.fill();

  drawSignPlate(0, -10, 'E 47 ST', -0.56);
  drawSignPlate(18, 88, 'BROADWAY', 0.24);
  ctx.restore();
}

function drawSignPlate(x, y, text, rotation) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.fillStyle = '#394f5b';
  roundRect(ctx, 0, 0, 132, 34, 8, true, false);
  ctx.fillStyle = '#f0efe8';
  ctx.font = '700 18px sans-serif';
  ctx.fillText(text, 12, 22);
  ctx.restore();
}

function drawCurtains(time) {
  const sway = Math.sin(time * 0.0015) * 10;

  const left = ctx.createLinearGradient(0, 0, 140, 0);
  left.addColorStop(0, '#42070f');
  left.addColorStop(1, '#9b1129');
  ctx.fillStyle = left;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(170 + sway, 0);
  ctx.quadraticCurveTo(95, 240, 132 + sway, stage.height);
  ctx.lineTo(0, stage.height);
  ctx.closePath();
  ctx.fill();

  const right = ctx.createLinearGradient(stage.width - 140, 0, stage.width, 0);
  right.addColorStop(0, '#981127');
  right.addColorStop(1, '#42070f');
  ctx.fillStyle = right;
  ctx.beginPath();
  ctx.moveTo(stage.width, 0);
  ctx.lineTo(stage.width - 170 - sway, 0);
  ctx.quadraticCurveTo(stage.width - 98, 240, stage.width - 134 - sway, stage.height);
  ctx.lineTo(stage.width, stage.height);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 212, 110, 0.12)';
  ctx.fillRect(0, 0, stage.width, 38);
}

function drawStageLights(time) {
  const beams = [
    { x: 250, color: '255, 213, 122', spread: 170, phase: 0 },
    { x: 510, color: '115, 255, 218', spread: 220, phase: 1.8 },
    { x: 790, color: '255, 156, 110', spread: 200, phase: 2.8 },
    { x: 1030, color: '255, 239, 181', spread: 150, phase: 4.6 },
  ];

  beams.forEach((beam) => {
    const offset = Math.sin(time * 0.0008 + beam.phase) * 44;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const gradient = ctx.createLinearGradient(beam.x + offset, 38, beam.x - beam.spread + offset, 440);
    gradient.addColorStop(0, `rgba(${beam.color}, 0.3)`);
    gradient.addColorStop(1, `rgba(${beam.color}, 0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(beam.x + offset, 38);
    ctx.lineTo(beam.x - 44 + offset, 38);
    ctx.lineTo(beam.x - beam.spread + offset, 452);
    ctx.lineTo(beam.x + beam.spread * 0.48 + offset, 452);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
}

function drawAmbientGhosts(time) {
  ambientGhosts.forEach((ghost, index) => {
    const driftX = (ghost.x - state.elapsed * state.speed * ghost.drift) % (stage.width + 180);
    const x = driftX < -90 ? driftX + stage.width + 180 : driftX;
    const y = ghost.y + Math.sin(time * 0.0014 + ghost.phase) * (14 + index * 1.5);
    drawGhostShape(x, y, ghost.size, ghost.alpha, '#fff7f0', '#5f3b50', true);
  });
}

function drawMusicNotes(time) {
  ctx.save();
  ctx.fillStyle = 'rgba(255, 191, 120, 0.24)';
  ctx.shadowColor = 'rgba(255, 152, 80, 0.18)';
  ctx.shadowBlur = 10;
  notes.forEach((note, index) => {
    const driftY = Math.sin(time * 0.001 * (1 + note.drift) + index) * 16;
    const driftX = ((state.elapsed * state.speed * 0.05 + index * 40) % (stage.width + 140)) - 60;
    const x = (note.x + driftX) % (stage.width + 120);
    drawNote(x, note.y + driftY, note.size, index % 2 === 0);
  });
  ctx.restore();
}

function drawFloor() {
  const floor = ctx.createLinearGradient(0, stage.floorY - 30, 0, stage.height);
  floor.addColorStop(0, '#7d3f2d');
  floor.addColorStop(0.38, '#5b281e');
  floor.addColorStop(1, '#2b120f');
  ctx.fillStyle = floor;
  ctx.fillRect(0, stage.floorY, stage.width, stage.height - stage.floorY);

  ctx.fillStyle = '#ffd083';
  ctx.fillRect(0, stage.floorY - 8, stage.width, 6);

  ctx.strokeStyle = 'rgba(255, 216, 168, 0.1)';
  ctx.lineWidth = 2;
  for (let index = 0; index < stage.width; index += 90) {
    ctx.beginPath();
    ctx.moveTo(index, stage.floorY + 16);
    ctx.lineTo(index + 40, stage.height);
    ctx.stroke();
  }
}

function drawLibraryBackdrop(time) {
  const drift = -((state.elapsed * state.speed * 0.08) % 210);
  ctx.save();
  ctx.translate(drift, 0);
  for (let index = -1; index < 8; index += 1) {
    const x = index * 210 + 90;
    const shelf = ctx.createLinearGradient(x, 120, x, 560);
    shelf.addColorStop(0, '#5e3427');
    shelf.addColorStop(1, '#311915');
    ctx.fillStyle = shelf;
    roundRect(ctx, x, 116, 176, 430, 12, true, false);

    ctx.fillStyle = '#8f5c42';
    [168, 264, 360, 456].forEach((y) => {
      ctx.fillRect(x + 10, y, 156, 12);
    });

    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 7; col += 1) {
        const bookX = x + 16 + col * 22;
        const bookY = 132 + row * 96;
        const hues = ['#f1c27d', '#cc8b65', '#b86b52', '#f8e1b0', '#d9a66d'];
        ctx.fillStyle = hues[(row + col) % hues.length];
        roundRect(ctx, bookX, bookY, 16, 56 + (col % 3) * 8, 4, true, false);
      }
    }
  }
  ctx.restore();

  ctx.fillStyle = 'rgba(255, 243, 216, 0.12)';
  ctx.fillRect(0, 84, stage.width, 24);

  for (let ladder = 0; ladder < 3; ladder += 1) {
    const x = 200 + ladder * 320 - ((state.elapsed * state.speed * 0.08) % 210);
    const wrapped = x < -60 ? x + 1470 : x;
    ctx.strokeStyle = 'rgba(255, 225, 184, 0.28)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(wrapped, 188);
    ctx.lineTo(wrapped - 24, 560);
    ctx.moveTo(wrapped + 34, 188);
    ctx.lineTo(wrapped + 10, 560);
    ctx.stroke();
  }
}

function drawReadingLights(time) {
  const lamps = [220, 520, 860, 1120];
  lamps.forEach((x, index) => {
    const sway = Math.sin(time * 0.001 + index) * 8;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const glow = ctx.createLinearGradient(x + sway, 52, x + sway, 420);
    glow.addColorStop(0, 'rgba(255, 233, 180, 0.34)');
    glow.addColorStop(1, 'rgba(255, 233, 180, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.moveTo(x + sway, 52);
    ctx.lineTo(x - 36 + sway, 52);
    ctx.lineTo(x - 150 + sway, 420);
    ctx.lineTo(x + 120 + sway, 420);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
}

function drawLetterDecorations(time) {
  floatingLetters.forEach((letter, index) => {
    const driftX = (letter.x - state.elapsed * state.speed * letter.drift) % (stage.width + 180);
    const x = driftX < -90 ? driftX + stage.width + 180 : driftX;
    const y = letter.y + Math.sin(time * 0.0016 + letter.phase) * (12 + index * 0.8);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(time * 0.0012 + letter.phase) * 0.08);
    ctx.fillStyle = 'rgba(255, 247, 233, 0.78)';
    roundRect(ctx, 0, 0, letter.width, letter.width * 0.76, 6, true, false);
    ctx.strokeStyle = 'rgba(201, 129, 92, 0.7)';
    ctx.lineWidth = 3;
    roundRect(ctx, 0, 0, letter.width, letter.width * 0.76, 6, false, true);
    ctx.beginPath();
    ctx.moveTo(6, 6);
    ctx.lineTo(letter.width / 2, letter.width * 0.34);
    ctx.lineTo(letter.width - 6, 6);
    ctx.stroke();
    ctx.restore();
  });
}

function drawLibraryFloor() {
  const floor = ctx.createLinearGradient(0, stage.floorY - 24, 0, stage.height);
  floor.addColorStop(0, '#915339');
  floor.addColorStop(0.42, '#643626');
  floor.addColorStop(1, '#2d1711');
  ctx.fillStyle = floor;
  ctx.fillRect(0, stage.floorY, stage.width, stage.height - stage.floorY);

  ctx.fillStyle = '#ffd6a1';
  ctx.fillRect(0, stage.floorY - 8, stage.width, 6);

  ctx.strokeStyle = 'rgba(255, 225, 184, 0.12)';
  ctx.lineWidth = 2;
  for (let index = 0; index < stage.width; index += 96) {
    ctx.beginPath();
    ctx.moveTo(index, stage.floorY + 12);
    ctx.lineTo(index + 42, stage.height);
    ctx.stroke();
  }
}

function drawBambooBackdrop(time) {
  const drift = -((state.elapsed * state.speed * 0.07) % 160);
  ctx.save();
  ctx.translate(drift, 0);
  for (let index = -1; index < 10; index += 1) {
    const x = index * 150 + 60;
    const tall = 360 + (index % 3) * 80;
    const stalk = ctx.createLinearGradient(x, 80, x + 30, stage.floorY);
    stalk.addColorStop(0, '#90bc73');
    stalk.addColorStop(1, '#436847');
    ctx.fillStyle = stalk;
    roundRect(ctx, x, stage.floorY - tall, 26, tall, 10, true, false);
    ctx.fillStyle = 'rgba(220, 244, 182, 0.34)';
    [0.2, 0.42, 0.64, 0.82].forEach((rate) => {
      ctx.fillRect(x, stage.floorY - tall + tall * rate, 26, 5);
    });
    ctx.strokeStyle = '#33523a';
    ctx.lineWidth = 3;
    roundRect(ctx, x, stage.floorY - tall, 26, tall, 10, false, true);
  }
  ctx.restore();

  ctx.fillStyle = 'rgba(12, 18, 15, 0.22)';
  ctx.beginPath();
  ctx.moveTo(0, 460);
  ctx.lineTo(180, 300);
  ctx.lineTo(340, 430);
  ctx.lineTo(560, 250);
  ctx.lineTo(780, 420);
  ctx.lineTo(980, 280);
  ctx.lineTo(1180, 410);
  ctx.lineTo(1280, 340);
  ctx.lineTo(1280, stage.height);
  ctx.lineTo(0, stage.height);
  ctx.closePath();
  ctx.fill();
}

function drawInkMountains(time) {
  const drift = -((state.elapsed * state.speed * 0.03) % 320);
  ctx.save();
  ctx.translate(drift, 0);

  const far = ctx.createLinearGradient(0, 140, 0, 520);
  far.addColorStop(0, 'rgba(39, 57, 46, 0.14)');
  far.addColorStop(1, 'rgba(10, 18, 14, 0.32)');
  ctx.fillStyle = far;
  ctx.beginPath();
  ctx.moveTo(-40, 430);
  ctx.lineTo(120, 270);
  ctx.lineTo(280, 398);
  ctx.lineTo(450, 238);
  ctx.lineTo(640, 410);
  ctx.lineTo(850, 250);
  ctx.lineTo(1040, 400);
  ctx.lineTo(1240, 286);
  ctx.lineTo(1460, 430);
  ctx.lineTo(1460, stage.height);
  ctx.lineTo(-40, stage.height);
  ctx.closePath();
  ctx.fill();

  const near = ctx.createLinearGradient(0, 220, 0, 560);
  near.addColorStop(0, 'rgba(18, 28, 22, 0.18)');
  near.addColorStop(1, 'rgba(7, 12, 10, 0.42)');
  ctx.fillStyle = near;
  ctx.beginPath();
  ctx.moveTo(-40, 490);
  ctx.lineTo(160, 340);
  ctx.lineTo(340, 452);
  ctx.lineTo(520, 302);
  ctx.lineTo(730, 470);
  ctx.lineTo(930, 332);
  ctx.lineTo(1110, 460);
  ctx.lineTo(1320, 348);
  ctx.lineTo(1460, 468);
  ctx.lineTo(1460, stage.height);
  ctx.lineTo(-40, stage.height);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawSectGate(time) {
  const gateX = 930 - ((state.elapsed * state.speed * 0.035) % 440);
  const x = gateX < -260 ? gateX + 1560 : gateX;
  const y = 274 + Math.sin(time * 0.0009) * 4;

  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = 0.82;
  ctx.fillStyle = 'rgba(31, 24, 20, 0.72)';
  ctx.fillRect(0, 120, 22, 212);
  ctx.fillRect(204, 120, 22, 212);
  ctx.fillRect(20, 112, 186, 20);
  ctx.fillStyle = 'rgba(65, 43, 32, 0.8)';
  ctx.beginPath();
  ctx.moveTo(-8, 122);
  ctx.lineTo(113, 42);
  ctx.lineTo(232, 122);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#5a3429';
  roundRect(ctx, 56, 136, 114, 48, 10, true, false);
  ctx.strokeStyle = '#d3c38d';
  ctx.lineWidth = 3;
  roundRect(ctx, 56, 136, 114, 48, 10, false, true);
  ctx.fillStyle = '#efe2b0';
  ctx.font = '700 24px sans-serif';
  ctx.fillText('青竹门', 77, 168);
  ctx.restore();
}

function drawMistBands(time) {
  [200, 320, 430].forEach((y, index) => {
    const drift = Math.sin(time * 0.0007 + index) * 24;
    const mist = ctx.createLinearGradient(0, y, stage.width, y + 40);
    mist.addColorStop(0, 'rgba(221, 241, 218, 0.03)');
    mist.addColorStop(0.5, 'rgba(221, 241, 218, 0.13)');
    mist.addColorStop(1, 'rgba(221, 241, 218, 0.03)');
    ctx.fillStyle = mist;
    ctx.fillRect(-20 + drift, y, stage.width + 40, 42);
  });
}

function drawFallingLeaves(time) {
  for (let index = 0; index < 14; index += 1) {
    const x = ((index * 110) + state.elapsed * state.speed * 0.22) % (stage.width + 80) - 40;
    const y = 80 + (index % 6) * 54 + Math.sin(time * 0.0014 + index) * 18;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(time * 0.0012 + index) * 0.5);
    ctx.fillStyle = index % 2 === 0 ? 'rgba(194, 225, 142, 0.38)' : 'rgba(132, 183, 108, 0.32)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 4, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawBambooFloor() {
  const floor = ctx.createLinearGradient(0, stage.floorY - 24, 0, stage.height);
  floor.addColorStop(0, '#3f5d42');
  floor.addColorStop(0.42, '#263d2d');
  floor.addColorStop(1, '#101b14');
  ctx.fillStyle = floor;
  ctx.fillRect(0, stage.floorY, stage.width, stage.height - stage.floorY);

  ctx.fillStyle = '#cfe9ae';
  ctx.fillRect(0, stage.floorY - 8, stage.width, 6);

  ctx.strokeStyle = 'rgba(215, 240, 183, 0.1)';
  ctx.lineWidth = 2;
  for (let index = 0; index < stage.width; index += 88) {
    ctx.beginPath();
    ctx.moveTo(index, stage.floorY + 12);
    ctx.lineTo(index + 36, stage.height);
    ctx.stroke();
  }
}

function drawHonglouBackdrop(time) {
  ctx.save();
  const wallY = 230;
  ctx.fillStyle = 'rgba(255, 235, 221, 0.78)';
  ctx.fillRect(0, wallY, stage.width, 170);
  ctx.fillStyle = 'rgba(46, 54, 50, 0.9)';
  for (let x = -80; x < stage.width + 100; x += 160) {
    ctx.beginPath();
    ctx.moveTo(x, wallY);
    ctx.quadraticCurveTo(x + 80, wallY - 44, x + 160, wallY);
    ctx.lineTo(x + 150, wallY + 18);
    ctx.quadraticCurveTo(x + 80, wallY - 16, x + 10, wallY + 18);
    ctx.closePath();
    ctx.fill();
  }

  const corridorDrift = -((state.elapsed * state.speed * 0.035) % 420);
  for (let index = 0; index < 6; index += 1) {
    const x = 90 + index * 210 + corridorDrift;
    drawHonglouPavilion(x, 250, index);
    drawHonglouPavilion(x + 1260, 250, index);
  }
  ctx.restore();
}

function drawHonglouPavilion(x, y, index) {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = 0.82;
  ctx.fillStyle = index % 2 === 0 ? 'rgba(154, 47, 69, 0.82)' : 'rgba(196, 84, 105, 0.8)';
  roundRect(ctx, 0, 62, 150, 118, 8, true, false);
  ctx.fillStyle = 'rgba(57, 68, 57, 0.9)';
  ctx.beginPath();
  ctx.moveTo(-20, 66);
  ctx.quadraticCurveTo(75, 10, 170, 66);
  ctx.lineTo(150, 84);
  ctx.quadraticCurveTo(75, 46, 0, 84);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(241, 201, 106, 0.72)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(18, 104);
  ctx.lineTo(132, 104);
  for (let rail = 0; rail < 6; rail += 1) {
    ctx.moveTo(24 + rail * 20, 104);
    ctx.lineTo(24 + rail * 20, 156);
  }
  ctx.stroke();
  ctx.fillStyle = '#d6424f';
  ctx.beginPath();
  ctx.ellipse(118, 110, 14, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffd36e';
  ctx.beginPath();
  ctx.moveTo(118, 88);
  ctx.lineTo(118, 130);
  ctx.stroke();
  ctx.restore();
}

function drawHonglouGarden(time) {
  ctx.save();
  const pond = ctx.createLinearGradient(0, 380, 0, 520);
  pond.addColorStop(0, 'rgba(91, 143, 115, 0.56)');
  pond.addColorStop(1, 'rgba(45, 93, 82, 0.72)');
  ctx.fillStyle = pond;
  ctx.fillRect(0, 380, stage.width, 122);
  ctx.strokeStyle = 'rgba(255, 236, 198, 0.25)';
  ctx.lineWidth = 3;
  for (let index = 0; index < 6; index += 1) {
    const y = 396 + index * 18;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.quadraticCurveTo(220, y - 18, 440, y);
    ctx.quadraticCurveTo(660, y + 18, 880, y);
    ctx.quadraticCurveTo(1080, y - 18, 1280, y);
    ctx.stroke();
  }
  for (let index = 0; index < 8; index += 1) {
    const x = 80 + index * 160 - ((state.elapsed * state.speed * 0.04) % 160);
    const y = 420 + (index % 3) * 22;
    ctx.fillStyle = '#6bbf8e';
    ctx.beginPath();
    ctx.ellipse(x, y, 34, 13, -0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f4a6bb';
    ctx.beginPath();
    ctx.arc(x + 16, y - 12, 7, 0, Math.PI * 2);
    ctx.arc(x + 5, y - 18, 7, 0, Math.PI * 2);
    ctx.arc(x - 6, y - 12, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawHonglouPetals(time) {
  ctx.save();
  for (let index = 0; index < 34; index += 1) {
    const x = (index * 58 + state.elapsed * state.speed * 0.06) % (stage.width + 80) - 40;
    const y = 48 + ((index * 37 + time * 0.03) % 310);
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(time * 0.001 + index) * 0.8);
    ctx.fillStyle = index % 3 === 0 ? 'rgba(255, 197, 209, 0.82)' : 'rgba(255, 152, 179, 0.72)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawHonglouFloor() {
  const path = ctx.createLinearGradient(0, stage.floorY - 34, 0, stage.height);
  path.addColorStop(0, '#d6a36a');
  path.addColorStop(1, '#8f4d4b');
  ctx.fillStyle = path;
  ctx.fillRect(0, stage.floorY - 36, stage.width, stage.height - stage.floorY + 36);
  ctx.strokeStyle = 'rgba(255, 229, 173, 0.34)';
  ctx.lineWidth = 4;
  for (let index = 0; index < 9; index += 1) {
    const y = stage.floorY - 24 + index * 18;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(stage.width, y);
    ctx.stroke();
  }
}

// ------- Level 11: Xinji Road Art Studio backdrop -------
function drawXinjiBackWall(time) {
  // 米黄后墙
  ctx.fillStyle = 'rgba(255, 235, 190, 0.55)';
  ctx.fillRect(0, 0, stage.width, stage.floorY - 30);
  // 墙上暖色渐晕
  const glow = ctx.createRadialGradient(stage.width * 0.5, 90, 60, stage.width * 0.5, 90, 520);
  glow.addColorStop(0, 'rgba(255, 236, 178, 0.6)');
  glow.addColorStop(1, 'rgba(255, 236, 178, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, stage.width, stage.floorY - 30);

  // 墙上挂着的几幅小画
  const drift = (state.elapsed * state.speed * 0.06) % 320;
  const paintings = [
    { x: 60, y: 110, w: 96, h: 128, tone: '#f0c24c' },
    { x: 240, y: 90, w: 118, h: 148, tone: '#c96f4a' },
    { x: 460, y: 130, w: 90, h: 118, tone: '#7fb37a' },
    { x: 640, y: 100, w: 108, h: 132, tone: '#a86bd9' },
    { x: 860, y: 120, w: 118, h: 142, tone: '#4a90d9' },
    { x: 1090, y: 96, w: 104, h: 130, tone: '#e07a4a' },
  ];
  paintings.forEach((p, i) => {
    const x = p.x - drift + i * 20;
    if (x + p.w < -40 || x > stage.width + 40) return;
    // 画框
    ctx.fillStyle = '#8a5326';
    ctx.fillRect(x, p.y, p.w, p.h);
    // 画布
    ctx.fillStyle = '#fdf5e3';
    ctx.fillRect(x + 6, p.y + 6, p.w - 12, p.h - 12);
    // 抽象笔触
    ctx.fillStyle = p.tone;
    ctx.fillRect(x + 12, p.y + 24, p.w - 24, 22);
    ctx.fillStyle = 'rgba(90, 55, 30, 0.35)';
    ctx.fillRect(x + 16, p.y + 60, p.w - 40, 10);
    ctx.fillStyle = p.tone;
    ctx.beginPath();
    ctx.arc(x + p.w / 2, p.y + p.h - 34, 14, 0, Math.PI * 2);
    ctx.fill();
    // 画框高光
    ctx.strokeStyle = 'rgba(255, 236, 200, 0.35)';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 2, p.y + 2, p.w - 4, p.h - 4);
  });
}

function drawXinjiPaintShelves(time) {
  // 后墙下部两条颜料瓶展示架
  const drift = (state.elapsed * state.speed * 0.09) % 220;
  const shelfYs = [260, 340];
  ctx.fillStyle = '#8a5326';
  shelfYs.forEach((sy) => {
    ctx.fillRect(0, sy + 46, stage.width, 6);
  });
  const colors = ['#d94a4a', '#f0c24c', '#7fb37a', '#4a90d9', '#a86bd9', '#e07a4a', '#f2c94c', '#5aa07a'];
  shelfYs.forEach((sy, row) => {
    for (let i = 0; i < 22; i += 1) {
      const x = i * 96 - drift + row * 32;
      if (x < -40 || x > stage.width + 20) continue;
      // 瓶身
      ctx.fillStyle = colors[(i + row * 3) % colors.length];
      roundRect(ctx, x, sy + 8, 34, 40, 4, true, false);
      // 瓶盖
      ctx.fillStyle = '#3a2a1a';
      ctx.fillRect(x + 6, sy, 22, 10);
      // 标签
      ctx.fillStyle = 'rgba(255, 246, 210, 0.85)';
      ctx.fillRect(x + 4, sy + 22, 26, 14);
    }
  });
}

function drawXinjiSignboards(time) {
  // 顶部一排像街边店铺的招牌
  const drift = (state.elapsed * state.speed * 0.05) % 380;
  const signs = [
    { x: 40, w: 220, tone: '#c96f4a' },
    { x: 320, w: 260, tone: '#7fb37a' },
    { x: 640, w: 240, tone: '#4a90d9' },
    { x: 940, w: 230, tone: '#a86bd9' },
    { x: 1230, w: 250, tone: '#e6a94a' },
  ];
  signs.forEach((s, i) => {
    const x = s.x - drift + i * 16;
    if (x + s.w < -40 || x > stage.width + 40) return;
    ctx.fillStyle = s.tone;
    roundRect(ctx, x, 22, s.w, 46, 6, true, false);
    // 招牌下垂的两根挂链
    ctx.strokeStyle = 'rgba(90, 55, 30, 0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 20, 22);
    ctx.lineTo(x + 30, 6);
    ctx.moveTo(x + s.w - 20, 22);
    ctx.lineTo(x + s.w - 30, 6);
    ctx.stroke();
    // 招牌上抽象文字（用几条色条模拟）
    ctx.fillStyle = 'rgba(255, 246, 210, 0.9)';
    ctx.fillRect(x + 16, 40, s.w - 32, 4);
    ctx.fillRect(x + 24, 50, s.w - 48, 4);
  });
}

function drawXinjiHangingLamps(time) {
  // 从顶端悬挂的暖黄吊灯
  const positions = [200, 460, 720, 980, 1240];
  positions.forEach((baseX) => {
    // 电线
    ctx.strokeStyle = 'rgba(60, 40, 22, 0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(baseX, 0);
    ctx.lineTo(baseX, 108);
    ctx.stroke();
    // 灯罩
    ctx.fillStyle = '#a86234';
    ctx.beginPath();
    ctx.moveTo(baseX - 30, 108);
    ctx.lineTo(baseX + 30, 108);
    ctx.lineTo(baseX + 22, 140);
    ctx.lineTo(baseX - 22, 140);
    ctx.closePath();
    ctx.fill();
    // 灯泡光晕
    const bulb = ctx.createRadialGradient(baseX, 156, 6, baseX, 156, 90);
    bulb.addColorStop(0, 'rgba(255, 236, 160, 0.95)');
    bulb.addColorStop(1, 'rgba(255, 236, 160, 0)');
    ctx.fillStyle = bulb;
    ctx.beginPath();
    ctx.arc(baseX, 156, 90, 0, Math.PI * 2);
    ctx.fill();
    // 灯泡本体
    ctx.fillStyle = '#fff2b0';
    ctx.beginPath();
    ctx.arc(baseX, 152, 8, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawXinjiFloor() {
  const path = ctx.createLinearGradient(0, stage.floorY - 36, 0, stage.height);
  path.addColorStop(0, '#d99a5b');
  path.addColorStop(1, '#7a4a24');
  ctx.fillStyle = path;
  ctx.fillRect(0, stage.floorY - 36, stage.width, stage.height - stage.floorY + 36);
  // 木地板缝
  const drift = (state.elapsed * state.speed * 0.6) % 160;
  ctx.strokeStyle = 'rgba(60, 32, 14, 0.5)';
  ctx.lineWidth = 2;
  for (let x = -drift; x < stage.width + 160; x += 160) {
    ctx.beginPath();
    ctx.moveTo(x, stage.floorY - 30);
    ctx.lineTo(x, stage.height);
    ctx.stroke();
  }
  // 木纹高光
  ctx.strokeStyle = 'rgba(255, 226, 170, 0.28)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i += 1) {
    const y = stage.floorY - 24 + i * 22;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(stage.width, y);
    ctx.stroke();
  }
}

// ------- Level 13: Sicily Mermaid seaside town -------
function drawSicilySunAndClouds(time) {
  // 太阳高光
  const sunX = stage.width * 0.78;
  const sunY = 120;
  const sun = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, 240);
  sun.addColorStop(0, 'rgba(255, 252, 210, 0.95)');
  sun.addColorStop(0.4, 'rgba(255, 234, 170, 0.48)');
  sun.addColorStop(1, 'rgba(255, 234, 170, 0)');
  ctx.fillStyle = sun;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 240, 0, Math.PI * 2);
  ctx.fill();

  // 云朵
  const drift = (state.elapsed * state.speed * 0.06) % 420;
  const clouds = [
    { x: 120, y: 110, s: 1.1 },
    { x: 460, y: 70, s: 0.9 },
    { x: 820, y: 130, s: 1.0 },
    { x: 1080, y: 90, s: 0.85 },
  ];
  clouds.forEach((c, idx) => {
    const x = c.x - drift + idx * 34;
    const wrappedX = x < -260 ? x + 1600 : x;
    ctx.save();
    ctx.translate(wrappedX, c.y);
    ctx.scale(c.s, c.s);
    ctx.globalAlpha = 0.65;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.78)';
    ctx.beginPath();
    ctx.arc(0, 18, 26, 0, Math.PI * 2);
    ctx.arc(30, 10, 32, 0, Math.PI * 2);
    ctx.arc(66, 20, 26, 0, Math.PI * 2);
    ctx.arc(96, 18, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // 海鸥剪影
  ctx.strokeStyle = 'rgba(20, 44, 66, 0.55)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 7; i += 1) {
    const x = (i * 210 + time * 0.02) % (stage.width + 80) - 40;
    const y = 58 + (i % 3) * 26;
    const wing = 16 + (i % 2) * 6;
    ctx.beginPath();
    ctx.moveTo(x - wing, y);
    ctx.quadraticCurveTo(x, y - 10, x + wing, y);
    ctx.stroke();
  }
}

function drawSicilyTown(time) {
  // 远处白墙橙顶的海边小镇
  const baseY = 220;
  const drift = (state.elapsed * state.speed * 0.08) % 360;
  for (let i = -1; i < 7; i += 1) {
    const x = i * 260 - drift;
    const blockX = x + 40;
    // 白墙主体
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    roundRect(ctx, blockX, baseY, 190, 120, 10, true, false);
    // 阴影面
    ctx.fillStyle = 'rgba(190, 220, 240, 0.28)';
    roundRect(ctx, blockX + 18, baseY + 12, 84, 98, 10, true, false);
    // 橙色屋顶
    ctx.fillStyle = '#f38c4a';
    ctx.beginPath();
    ctx.moveTo(blockX - 8, baseY);
    ctx.lineTo(blockX + 95, baseY - 58);
    ctx.lineTo(blockX + 198, baseY);
    ctx.closePath();
    ctx.fill();
    // 屋顶高光
    ctx.strokeStyle = 'rgba(255, 236, 180, 0.45)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(blockX + 14, baseY - 6);
    ctx.lineTo(blockX + 96, baseY - 52);
    ctx.lineTo(blockX + 176, baseY - 6);
    ctx.stroke();

    // 蓝色窗户
    ctx.fillStyle = 'rgba(40, 120, 180, 0.85)';
    for (let w = 0; w < 4; w += 1) {
      const wx = blockX + 26 + w * 38;
      const wy = baseY + 36 + (w % 2) * 18;
      roundRect(ctx, wx, wy, 22, 30, 6, true, false);
    }
    // 小门
    ctx.fillStyle = 'rgba(60, 80, 90, 0.55)';
    roundRect(ctx, blockX + 128, baseY + 72, 34, 48, 10, true, false);
  }

  // 岸边崖体/远山
  const cliff = ctx.createLinearGradient(0, baseY + 40, 0, baseY + 160);
  cliff.addColorStop(0, 'rgba(40, 120, 120, 0.35)');
  cliff.addColorStop(1, 'rgba(10, 55, 70, 0.55)');
  ctx.fillStyle = cliff;
  ctx.beginPath();
  ctx.moveTo(0, baseY + 140);
  ctx.lineTo(180, baseY + 80);
  ctx.lineTo(360, baseY + 120);
  ctx.lineTo(560, baseY + 70);
  ctx.lineTo(820, baseY + 130);
  ctx.lineTo(980, baseY + 90);
  ctx.lineTo(stage.width, baseY + 120);
  ctx.lineTo(stage.width, baseY + 200);
  ctx.lineTo(0, baseY + 200);
  ctx.closePath();
  ctx.fill();
}

function drawSicilySea(time) {
  const horizonY = 260;
  const sea = ctx.createLinearGradient(0, horizonY, 0, stage.floorY);
  sea.addColorStop(0, '#0f8fd1');
  sea.addColorStop(0.55, '#0a6fb2');
  sea.addColorStop(1, '#064a7b');
  ctx.fillStyle = sea;
  ctx.fillRect(0, horizonY, stage.width, stage.floorY - horizonY);

  // 近海渐亮
  const sheen = ctx.createLinearGradient(0, stage.floorY - 220, 0, stage.floorY);
  sheen.addColorStop(0, 'rgba(120, 235, 255, 0)');
  sheen.addColorStop(1, 'rgba(120, 235, 255, 0.22)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, stage.floorY - 220, stage.width, 220);
}

function drawSicilyBoats(time) {
  // 几只小渔船
  const horizonY = 260;
  const drift = (state.elapsed * state.speed * 0.1) % 520;
  const boats = [
    { x: 180, y: horizonY + 70, s: 0.9 },
    { x: 520, y: horizonY + 110, s: 1.05 },
    { x: 860, y: horizonY + 86, s: 0.85 },
    { x: 1140, y: horizonY + 126, s: 1.0 },
  ];
  boats.forEach((b, idx) => {
    const x = b.x - drift + idx * 30;
    const wrappedX = x < -220 ? x + 1600 : x;
    const bob = Math.sin(time * 0.0012 + idx) * 6;
    ctx.save();
    ctx.translate(wrappedX, b.y + bob);
    ctx.scale(b.s, b.s);
    // 船体
    ctx.fillStyle = 'rgba(255, 246, 210, 0.85)';
    ctx.beginPath();
    ctx.moveTo(-44, 0);
    ctx.quadraticCurveTo(0, 24, 44, 0);
    ctx.lineTo(34, 18);
    ctx.lineTo(-34, 18);
    ctx.closePath();
    ctx.fill();
    // 船舷
    ctx.strokeStyle = 'rgba(40, 70, 95, 0.35)';
    ctx.lineWidth = 3;
    ctx.stroke();
    // 桅杆
    ctx.strokeStyle = 'rgba(255, 246, 210, 0.65)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(6, -56);
    ctx.lineTo(6, 2);
    ctx.stroke();
    // 小帆
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.beginPath();
    ctx.moveTo(6, -50);
    ctx.lineTo(42, -18);
    ctx.lineTo(6, -18);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
}

function drawSicilyWaves(time) {
  // 海浪线条
  const horizonY = 260;
  const drift = (state.elapsed * state.speed * 0.3) % 140;
  ctx.strokeStyle = 'rgba(200, 250, 255, 0.22)';
  ctx.lineWidth = 2;
  for (let row = 0; row < 10; row += 1) {
    const y = horizonY + 26 + row * 26;
    const amp = 6 + row * 0.6;
    ctx.beginPath();
    for (let x = -drift; x < stage.width + 160; x += 32) {
      const off = Math.sin((x + row * 40) * 0.02 + time * 0.0012) * amp;
      if (x === -drift) ctx.moveTo(x, y + off);
      else ctx.lineTo(x, y + off);
    }
    ctx.stroke();
  }
}

function drawSicilyFloor(time) {
  // 前景：石头码头 / 岸边步道
  const floor = ctx.createLinearGradient(0, stage.floorY - 30, 0, stage.height);
  floor.addColorStop(0, '#f0d9b4');
  floor.addColorStop(1, '#b58a5a');
  ctx.fillStyle = floor;
  ctx.fillRect(0, stage.floorY - 30, stage.width, stage.height - stage.floorY + 30);

  // 石板缝
  const drift = (state.elapsed * state.speed * 0.55) % 220;
  ctx.strokeStyle = 'rgba(90, 60, 40, 0.28)';
  ctx.lineWidth = 2;
  for (let x = -drift; x < stage.width + 220; x += 220) {
    ctx.beginPath();
    ctx.moveTo(x, stage.floorY - 24);
    ctx.lineTo(x + 80, stage.height);
    ctx.stroke();
  }

  // 海水拍岸的白沫
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let x = 0; x <= stage.width; x += 36) {
    const off = Math.sin(x * 0.02 + time * 0.002) * 6;
    if (x === 0) ctx.moveTo(x, stage.floorY - 34 + off);
    else ctx.lineTo(x, stage.floorY - 34 + off);
  }
  ctx.stroke();
}

// ------- Level 12: Fatal Melody concert stage -------
function drawConcertSpotlights(time) {
  // 顶部两束交叉聚光灯
  const beams = [
    { x: 300, sway: Math.sin(time * 0.0006) * 60 },
    { x: 980, sway: Math.cos(time * 0.0007) * 60 },
  ];
  beams.forEach((b) => {
    ctx.save();
    ctx.globalAlpha = 0.55;
    const grd = ctx.createLinearGradient(b.x, 0, b.x + b.sway, stage.height);
    grd.addColorStop(0, 'rgba(255, 236, 178, 0.9)');
    grd.addColorStop(1, 'rgba(255, 236, 178, 0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.moveTo(b.x - 30, 0);
    ctx.lineTo(b.x + 30, 0);
    ctx.lineTo(b.x + 260 + b.sway, stage.height);
    ctx.lineTo(b.x - 260 + b.sway, stage.height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
  // 顶部一排小灯泡
  for (let i = 0; i < 12; i += 1) {
    const cx = 60 + i * 108;
    ctx.fillStyle = i % 2 === 0 ? '#f5d97a' : '#ffe6a8';
    ctx.beginPath();
    ctx.arc(cx, 20, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#c69b3a';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawConcertStaffLines(time) {
  // 后景漂浮的五线谱
  const drift = (state.elapsed * state.speed * 0.12) % 320;
  ctx.strokeStyle = 'rgba(245, 217, 122, 0.22)';
  ctx.lineWidth = 1.5;
  for (let group = 0; group < 3; group += 1) {
    const baseY = 130 + group * 180;
    for (let line = 0; line < 5; line += 1) {
      const y = baseY + line * 12;
      ctx.beginPath();
      for (let x = -drift; x < stage.width + 60; x += 20) {
        const off = Math.sin(x * 0.02 + time * 0.001 + group) * 2;
        ctx.moveTo(x, y + off);
        ctx.lineTo(x + 18, y + off);
      }
      ctx.stroke();
    }
  }
}

function drawConcertFloatingNotes(time) {
  const drift = (state.elapsed * state.speed * 0.24) % 260;
  const notes = [
    { x: 120, y: 140, kind: 'q' },
    { x: 340, y: 200, kind: 'e' },
    { x: 560, y: 160, kind: 'q' },
    { x: 780, y: 220, kind: 'e' },
    { x: 1000, y: 180, kind: 'q' },
    { x: 1220, y: 250, kind: 'e' },
    { x: 200, y: 320, kind: 'e' },
    { x: 620, y: 360, kind: 'q' },
    { x: 900, y: 420, kind: 'e' },
  ];
  ctx.fillStyle = 'rgba(245, 217, 122, 0.65)';
  ctx.strokeStyle = 'rgba(245, 217, 122, 0.65)';
  ctx.lineWidth = 2;
  notes.forEach((n, i) => {
    const x = n.x - drift + i * 22;
    const wrapped = ((x % (stage.width + 200)) + stage.width + 200) % (stage.width + 200) - 100;
    const y = n.y + Math.sin(time * 0.001 + i) * 6;
    // 符头
    ctx.beginPath();
    ctx.ellipse(wrapped, y, 8, 6, -0.4, 0, Math.PI * 2);
    ctx.fill();
    // 符干
    ctx.beginPath();
    ctx.moveTo(wrapped + 7, y - 2);
    ctx.lineTo(wrapped + 7, y - 30);
    ctx.stroke();
    // 八分音符旗子
    if (n.kind === 'e') {
      ctx.beginPath();
      ctx.moveTo(wrapped + 7, y - 30);
      ctx.quadraticCurveTo(wrapped + 22, y - 22, wrapped + 16, y - 12);
      ctx.stroke();
    }
  });
}

function drawConcertKeyboardStrip() {
  // 舞台底部装饰性琴键
  const stripY = stage.floorY - 6;
  const stripH = 40;
  ctx.fillStyle = '#f7f2e6';
  ctx.fillRect(0, stripY, stage.width, stripH);
  ctx.strokeStyle = '#12141a';
  ctx.lineWidth = 1;
  const keyW = 32;
  for (let i = 0; i <= stage.width / keyW; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * keyW, stripY);
    ctx.lineTo(i * keyW, stripY + stripH);
    ctx.stroke();
  }
  // 黑键
  ctx.fillStyle = '#12141a';
  for (let i = 0; i <= stage.width / keyW; i += 1) {
    const m = i % 7;
    if (m === 1 || m === 2 || m === 4 || m === 5 || m === 6) {
      ctx.fillRect(i * keyW - 8, stripY, 16, 24);
    }
  }
  // 上金边
  ctx.fillStyle = '#c69b3a';
  ctx.fillRect(0, stripY - 4, stage.width, 4);
  // 舞台底部深色地面
  ctx.fillStyle = '#08090c';
  ctx.fillRect(0, stripY + stripH, stage.width, stage.height - stripY - stripH);
}

// 第12关的钢琴键立柱
function drawPipeObstacle(obstacle, side) {
  // 主体：白琴键
  ctx.fillStyle = obstacle.color;
  roundRect(ctx, 0, 0, obstacle.width, obstacle.height, 4, true, false);
  // 竖向琴键分隔线
  ctx.strokeStyle = 'rgba(20, 20, 30, 0.55)';
  ctx.lineWidth = 1;
  const keyCount = 6;
  const keyW = obstacle.width / keyCount;
  for (let i = 1; i < keyCount; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * keyW, 6);
    ctx.lineTo(i * keyW, obstacle.height - 6);
    ctx.stroke();
  }
  // 黑键：贴在靠近 gap 的一端
  ctx.fillStyle = '#12141a';
  const blackKeyH = 76;
  const blackKeys = [0, 1, 3, 4, 5];
  blackKeys.forEach((idx) => {
    if (idx >= keyCount) return;
    const x = idx * keyW + keyW * 0.32;
    const w = keyW * 0.36;
    if (side === 'top') {
      ctx.fillRect(x, Math.max(6, obstacle.height - blackKeyH), w, Math.min(blackKeyH, obstacle.height - 12));
    } else {
      ctx.fillRect(x, 6, w, Math.min(blackKeyH, obstacle.height - 12));
    }
  });
  // 金色边框
  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 0, obstacle.width - 4, obstacle.height);
  // 靠 gap 一端的加粗金色 cap
  ctx.fillStyle = obstacle.accent;
  if (side === 'top') {
    ctx.fillRect(-8, obstacle.height - 14, obstacle.width + 16, 14);
    ctx.fillStyle = '#12141a';
    ctx.fillRect(-8, obstacle.height - 4, obstacle.width + 16, 4);
  } else {
    ctx.fillRect(-8, 0, obstacle.width + 16, 14);
    ctx.fillStyle = '#12141a';
    ctx.fillRect(-8, 12, obstacle.width + 16, 4);
  }
}

function drawIslandBackdrop(time) {
  ctx.save();
  const sea = ctx.createLinearGradient(0, 320, 0, 500);
  sea.addColorStop(0, '#35c2d1');
  sea.addColorStop(1, '#1e8ea6');
  ctx.fillStyle = sea;
  ctx.fillRect(0, 320, stage.width, 180);

  const waveDrift = (state.elapsed * state.speed * 0.05) % 240;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
  ctx.lineWidth = 3;
  for (let index = 0; index < 6; index += 1) {
    const y = 346 + index * 26;
    ctx.beginPath();
    for (let x = -80; x < stage.width + 80; x += 120) {
      const px = x + waveDrift + Math.sin(time * 0.001 + index) * 20;
      ctx.moveTo(px, y);
      ctx.quadraticCurveTo(px + 60, y - 8, px + 120, y);
    }
    ctx.stroke();
  }

  ctx.fillStyle = '#4cc882';
  [120, 580, 1040].forEach((baseX, index) => {
    const x = baseX - ((state.elapsed * state.speed * 0.02) % 400);
    ctx.beginPath();
    ctx.moveTo(x, 320);
    ctx.quadraticCurveTo(x + 100, 240, x + 200, 320);
    ctx.fill();
    ctx.fillStyle = '#3da56a';
    ctx.beginPath();
    ctx.moveTo(x + 40, 320);
    ctx.quadraticCurveTo(x + 100, 270, x + 160, 320);
    ctx.fill();
    ctx.fillStyle = '#4cc882';
  });
  ctx.restore();
}

function drawIslandSunAndClouds(time) {
  ctx.save();
  const sunX = stage.width - 140;
  const sunY = 110;
  const glow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 120);
  glow.addColorStop(0, 'rgba(255, 245, 180, 0.8)');
  glow.addColorStop(0.3, 'rgba(255, 210, 100, 0.4)');
  glow.addColorStop(1, 'rgba(255, 210, 100, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff4a6';
  ctx.beginPath();
  ctx.arc(sunX, sunY, 46, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.62)';
  for (let index = 0; index < 5; index += 1) {
    const x = (index * 320 - (state.elapsed * state.speed * 0.035) + 1600) % 1600 - 150;
    const y = 80 + (index * 43) % 100;
    ctx.beginPath();
    ctx.ellipse(x, y, 64, 24, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 30, y - 15, 48, 28, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawMazuTemple(time) {
  ctx.save();
  const drift = -((state.elapsed * state.speed * 0.025) % 520);
  const templeX = 720 + drift;
  [templeX, templeX + 1560].forEach((x) => {
    ctx.save();
    ctx.translate(x, 258 + Math.sin(time * 0.0006) * 2);
    ctx.globalAlpha = 0.78;
    ctx.fillStyle = 'rgba(190, 58, 45, 0.88)';
    roundRect(ctx, 0, 72, 210, 90, 8, true, false);
    ctx.fillStyle = 'rgba(255, 212, 97, 0.92)';
    ctx.beginPath();
    ctx.moveTo(-18, 76);
    ctx.quadraticCurveTo(105, 14, 228, 76);
    ctx.lineTo(198, 94);
    ctx.quadraticCurveTo(105, 50, 12, 94);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(126, 33, 31, 0.95)';
    ctx.beginPath();
    ctx.moveTo(26, 64);
    ctx.lineTo(105, 24);
    ctx.lineTo(184, 64);
    ctx.lineTo(166, 78);
    ctx.lineTo(105, 48);
    ctx.lineTo(44, 78);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffe8a0';
    ctx.font = '900 18px sans-serif';
    ctx.fillText('妈祖庙', 76, 118);
    ctx.fillStyle = 'rgba(93, 51, 36, 0.88)';
    roundRect(ctx, 86, 128, 38, 34, 6, true, false);
    ctx.fillStyle = 'rgba(255, 235, 150, 0.72)';
    [32, 152].forEach((pillarX) => roundRect(ctx, pillarX, 105, 18, 58, 6, true, false));
    ctx.restore();
  });
  ctx.restore();
}

function drawIslandPalms(time) {
  ctx.save();
  const palmDrift = -((state.elapsed * state.speed * 0.075) % 460);
  for (let index = 0; index < 4; index += 1) {
    const x = 320 + index * 460 + palmDrift;
    drawPalmTree(x, 480, index, time);
    drawPalmTree(x + 1840, 480, index, time);
  }
  ctx.restore();
}

function drawPalmTree(x, y, index, time) {
  ctx.save();
  ctx.translate(x, y);
  const sway = Math.sin(time * 0.0008 + index) * 0.06;
  ctx.rotate(sway);

  ctx.fillStyle = '#8b5e34';
  ctx.beginPath();
  ctx.moveTo(-12, 0);
  ctx.quadraticCurveTo(-18, -120, -32, -220);
  ctx.lineTo(2, -220);
  ctx.quadraticCurveTo(-8, -120, 12, 0);
  ctx.fill();

  ctx.translate(-22, -220);
  ctx.fillStyle = '#4cc85a';
  for (let leaf = 0; leaf < 6; leaf += 1) {
    ctx.save();
    ctx.rotate((leaf * Math.PI) / 3 + sway * 2);
    ctx.beginPath();
    ctx.ellipse(50, 0, 80, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#3da54d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(110, 0);
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

function drawIslandFloor() {
  const sand = ctx.createLinearGradient(0, stage.floorY - 24, 0, stage.height);
  sand.addColorStop(0, '#f9c56e');
  sand.addColorStop(1, '#d9a14c');
  ctx.fillStyle = sand;
  ctx.fillRect(0, stage.floorY - 30, stage.width, stage.height - stage.floorY + 30);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  for (let index = 0; index < 8; index += 1) {
    const x = index * 200 - ((state.elapsed * state.speed * 0.16) % 200);
    ctx.beginPath();
    ctx.moveTo(x, stage.floorY - 26);
    ctx.quadraticCurveTo(x + 100, stage.floorY - 36, x + 200, stage.floorY - 26);
    ctx.stroke();
  }

  for (let index = 0; index < 12; index += 1) {
    const x = (index * 167 + Math.sin(index) * 50) % (stage.width + 100) - 50;
    const y = stage.floorY + 20 + (index * 23) % 100;
    ctx.fillStyle = index % 2 === 0 ? '#ffede0' : '#ffd1b8';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  drawIslandSeagrassAndFlowers();
}

function drawIslandSeagrassAndFlowers() {
  ctx.save();
  const drift = (state.elapsed * state.speed * 0.12) % 180;
  for (let index = 0; index < 12; index += 1) {
    const x = index * 150 - drift;
    const baseY = stage.floorY + 24 + (index % 3) * 18;
    ctx.strokeStyle = index % 2 === 0 ? '#2ca765' : '#178c6d';
    ctx.lineWidth = 4;
    for (let blade = 0; blade < 4; blade += 1) {
      ctx.beginPath();
      const offset = blade * 8;
      ctx.moveTo(x + offset, baseY + 30);
      ctx.quadraticCurveTo(x - 8 + offset, baseY + 8, x + 4 + offset + Math.sin(index + blade) * 8, baseY - 18 - blade * 4);
      ctx.stroke();
    }
  }

  const flowerColors = ['#ff5f8f', '#ffcf4d', '#ff7b45', '#f7f7ff'];
  for (let index = 0; index < 10; index += 1) {
    const x = 56 + index * 134 - (drift * 0.55);
    const y = stage.floorY + 18 + (index % 4) * 22;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = flowerColors[index % flowerColors.length];
    for (let petal = 0; petal < 5; petal += 1) {
      ctx.save();
      ctx.rotate((petal * Math.PI * 2) / 5);
      ctx.beginPath();
      ctx.ellipse(0, -8, 7, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = '#ffe66d';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

function drawBenjaminBackdrop(time) {
  ctx.save();

  const water = ctx.createLinearGradient(0, 350, 0, 520);
  water.addColorStop(0, 'rgba(138, 113, 75, 0.42)');
  water.addColorStop(1, 'rgba(61, 42, 25, 0.68)');
  ctx.fillStyle = water;
  ctx.fillRect(0, 350, stage.width, 170);
  ctx.strokeStyle = 'rgba(236, 198, 130, 0.16)';
  ctx.lineWidth = 2;
  for (let index = 0; index < 9; index += 1) {
    const y = 372 + index * 16;
    const drift = ((state.elapsed * state.speed * 0.035) + index * 43) % 180;
    ctx.beginPath();
    ctx.moveTo(-60 + drift, y);
    ctx.quadraticCurveTo(90 + drift, y - 10, 240 + drift, y + 2);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(105, 70, 40, 0.74)';
  ctx.beginPath();
  ctx.moveTo(74, 300);
  ctx.lineTo(396, 300);
  ctx.quadraticCurveTo(342, 386, 128, 388);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(236, 198, 130, 0.72)';
  ctx.fillRect(128, 252, 180, 40);
  ctx.fillStyle = 'rgba(52, 34, 23, 0.78)';
  [156, 218, 280].forEach((x) => roundRect(ctx, x, 222, 28, 70, 8, true, false));
  ctx.fillStyle = 'rgba(232, 214, 184, 0.28)';
  for (let index = 0; index < 5; index += 1) {
    const x = 308 + index * 42 + Math.sin(time * 0.001 + index) * 8;
    ctx.beginPath();
    ctx.ellipse(x, 216 - index * 8, 30 + index * 4, 12, -0.12, 0, Math.PI * 2);
    ctx.fill();
  }

  const houseDrift = -((state.elapsed * state.speed * 0.035) % 320);
  for (let index = 0; index < 5; index += 1) {
    const x = 560 + index * 220 + houseDrift;
    drawSouthernHouse(x, 218, index);
    drawSouthernHouse(x + 1100, 218, index);
  }

  ctx.restore();
}

function drawSouthernHouse(x, y, index) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = index % 2 === 0 ? 'rgba(178, 130, 78, 0.74)' : 'rgba(148, 105, 67, 0.76)';
  roundRect(ctx, 0, 52, 150, 160, 6, true, false);
  ctx.fillStyle = 'rgba(63, 42, 28, 0.72)';
  ctx.beginPath();
  ctx.moveTo(-10, 52);
  ctx.lineTo(75, 0);
  ctx.lineTo(160, 52);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = 'rgba(236, 198, 130, 0.46)';
  ctx.lineWidth = 3;
  ctx.strokeRect(18, 84, 32, 46);
  ctx.strokeRect(96, 84, 32, 46);
  ctx.beginPath();
  ctx.moveTo(12, 144);
  ctx.lineTo(138, 144);
  for (let rail = 0; rail < 7; rail += 1) {
    ctx.moveTo(18 + rail * 18, 144);
    ctx.lineTo(18 + rail * 18, 184);
  }
  ctx.stroke();
  ctx.restore();
}

function drawBenjaminTimeMotifs(time) {
  ctx.save();
  ctx.globalAlpha = 0.72;
  const clockX = 1010 + Math.sin(time * 0.0005) * 12;
  ctx.translate(clockX, 152);
  ctx.strokeStyle = 'rgba(237, 203, 141, 0.66)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, 58, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = 'rgba(237, 203, 141, 0.6)';
  ctx.font = '700 14px serif';
  ['XII', 'III', 'VI', 'IX'].forEach((text, index) => {
    const pos = [[-12, -34], [32, 5], [-8, 44], [-46, 5]][index];
    ctx.fillText(text, pos[0], pos[1]);
  });
  ctx.strokeStyle = 'rgba(255, 236, 190, 0.78)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(-time * 0.0018) * 34, Math.sin(-time * 0.0018) * 34);
  ctx.moveTo(0, 0);
  ctx.lineTo(Math.cos(-time * 0.0008 + 1.7) * 24, Math.sin(-time * 0.0008 + 1.7) * 24);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.translate(56, 62);
  ctx.fillStyle = 'rgba(32, 22, 15, 0.32)';
  for (let index = 0; index < 9; index += 1) {
    const x = index * 138;
    ctx.fillRect(x, 0, 28, 16);
    ctx.fillRect(x, 560, 28, 16);
    ctx.fillRect(x + 54, 0, 28, 16);
    ctx.fillRect(x + 54, 560, 28, 16);
  }
  ctx.restore();
}

function drawBenjaminSteamAndBirds(time) {
  ctx.save();
  ctx.fillStyle = 'rgba(232, 214, 184, 0.17)';
  for (let index = 0; index < 7; index += 1) {
    const x = (index * 210 - (state.elapsed * state.speed * 0.045) + 1400) % 1500 - 120;
    const y = 180 + Math.sin(time * 0.0009 + index) * 22;
    ctx.beginPath();
    ctx.ellipse(x, y, 54, 18, 0.1, 0, Math.PI * 2);
    ctx.ellipse(x + 34, y + 16, 48, 16, -0.08, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let index = 0; index < 4; index += 1) {
    const x = 740 + index * 105 + Math.sin(time * 0.002 + index) * 18;
    const y = 86 + index * 22 + Math.cos(time * 0.002 + index) * 10;
    ctx.fillStyle = 'rgba(231, 196, 127, 0.78)';
    ctx.beginPath();
    ctx.ellipse(x, y, 12, 5, -0.4, 0, Math.PI * 2);
    ctx.ellipse(x + 18, y - 5, 18, 4, 0.25, 0, Math.PI * 2);
    ctx.ellipse(x - 18, y - 5, 18, 4, -0.25, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawPaperPlanes(time) {
  ctx.save();
  const planes = [
    { baseX: 120, baseY: 110, scale: 0.86, speed: 0.09, phase: 0.4 },
    { baseX: 430, baseY: 190, scale: 0.7, speed: 0.12, phase: 1.8 },
    { baseX: 760, baseY: 132, scale: 0.92, speed: 0.1, phase: 3.2 },
    { baseX: 1020, baseY: 242, scale: 0.62, speed: 0.14, phase: 4.6 },
    { baseX: 1180, baseY: 86, scale: 0.78, speed: 0.08, phase: 5.3 },
  ];

  planes.forEach((plane, index) => {
    const x = (plane.baseX + state.elapsed * state.speed * plane.speed + index * 90) % (stage.width + 220) - 120;
    const y = plane.baseY + Math.sin(time * 0.0012 + plane.phase) * 18;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.16 + Math.sin(time * 0.0009 + plane.phase) * 0.08);
    ctx.scale(plane.scale, plane.scale);
    ctx.fillStyle = 'rgba(255, 255, 248, 0.92)';
    ctx.strokeStyle = 'rgba(214, 197, 164, 0.62)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(76, -18);
    ctx.lineTo(46, 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(237, 230, 210, 0.88)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(76, -18);
    ctx.lineTo(30, 28);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(190, 172, 140, 0.6)';
    ctx.beginPath();
    ctx.moveTo(46, 12);
    ctx.lineTo(30, 28);
    ctx.stroke();
    ctx.restore();
  });
  ctx.restore();
}

function drawBenjaminFloor() {
  const planks = ctx.createLinearGradient(0, stage.floorY - 42, 0, stage.height);
  planks.addColorStop(0, '#ad7441');
  planks.addColorStop(1, '#5a351c');
  ctx.fillStyle = planks;
  ctx.fillRect(0, stage.floorY - 38, stage.width, stage.height - stage.floorY + 38);
  ctx.strokeStyle = 'rgba(43, 28, 17, 0.56)';
  ctx.lineWidth = 3;
  for (let index = 0; index < 9; index += 1) {
    const y = stage.floorY - 22 + index * 18;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(stage.width, y);
    ctx.stroke();
  }
  for (let index = 0; index < 12; index += 1) {
    const x = index * 132 - ((state.elapsed * state.speed * 0.18) % 132);
    ctx.strokeStyle = 'rgba(236, 198, 130, 0.18)';
    ctx.beginPath();
    ctx.moveTo(x, stage.floorY - 36);
    ctx.lineTo(x - 20, stage.height);
    ctx.stroke();
  }
}

function drawHollywoodBackdrop(time) {
  ctx.save();

  const hill = ctx.createLinearGradient(0, 140, 0, 360);
  hill.addColorStop(0, 'rgba(37, 28, 26, 0.45)');
  hill.addColorStop(1, 'rgba(9, 8, 10, 0.88)');
  ctx.fillStyle = hill;
  ctx.beginPath();
  ctx.moveTo(-80, 360);
  ctx.quadraticCurveTo(210, 185, 500, 300);
  ctx.quadraticCurveTo(790, 410, 1050, 215);
  ctx.quadraticCurveTo(1240, 130, 1390, 280);
  ctx.lineTo(1390, stage.height);
  ctx.lineTo(-80, stage.height);
  ctx.closePath();
  ctx.fill();

  ctx.save();
  ctx.translate(300, 184 + Math.sin(time * 0.0007) * 3);
  ctx.rotate(-0.08);
  ctx.fillStyle = 'rgba(255, 232, 150, 0.9)';
  ctx.strokeStyle = 'rgba(95, 45, 36, 0.8)';
  ctx.lineWidth = 3;
  ctx.font = '900 42px sans-serif';
  ctx.strokeText('HOLLYWOOD', 0, 0);
  ctx.fillText('HOLLYWOOD', 0, 0);
  ctx.restore();

  for (let index = 0; index < 6; index += 1) {
    const x = 150 + index * 210 - ((state.elapsed * state.speed * 0.045) % 210);
    ctx.fillStyle = 'rgba(255, 214, 118, 0.22)';
    ctx.beginPath();
    ctx.ellipse(x, 352, 42, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 247, 199, 0.7)';
    drawStarPath(ctx, x, 348, 18, 8, 5);
    ctx.fill();
  }

  ctx.fillStyle = 'rgba(255, 211, 110, 0.88)';
  [90, 1180].forEach((x) => {
    roundRect(ctx, x, 306, 36, 116, 8, true, false);
    ctx.beginPath();
    ctx.arc(x + 18, 286, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 248, 186, 0.9)';
    ctx.beginPath();
    ctx.arc(x + 18, 286, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 211, 110, 0.88)';
  });

  ctx.restore();
}

function drawHollywoodSpotlights(time) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const beams = [
    { x: 120, angle: -0.28, color: 'rgba(255, 226, 154, 0.13)' },
    { x: 1110, angle: 0.24, color: 'rgba(255, 245, 220, 0.11)' },
    { x: 620, angle: Math.sin(time * 0.0006) * 0.16, color: 'rgba(255, 196, 114, 0.1)' },
  ];
  beams.forEach((beam) => {
    ctx.save();
    ctx.translate(beam.x, 560);
    ctx.rotate(beam.angle + Math.sin(time * 0.0005 + beam.x) * 0.08);
    const light = ctx.createLinearGradient(0, 0, 0, -560);
    light.addColorStop(0, 'rgba(255,255,255,0)');
    light.addColorStop(0.4, beam.color);
    light.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = light;
    ctx.beginPath();
    ctx.moveTo(-26, 0);
    ctx.lineTo(82, -560);
    ctx.lineTo(210, -560);
    ctx.lineTo(26, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
  ctx.restore();
}

function drawHollywoodSparkles(time) {
  ctx.save();
  for (let index = 0; index < 24; index += 1) {
    const x = (index * 97 + Math.sin(time * 0.0005 + index) * 18) % stage.width;
    const y = 58 + (index * 41) % 260;
    const alpha = 0.28 + Math.sin(time * 0.003 + index) * 0.18;
    ctx.fillStyle = `rgba(255, 226, 138, ${alpha})`;
    drawStarPath(ctx, x, y, 6, 2.8, 5);
    ctx.fill();
  }
  ctx.restore();
}

function drawHollywoodFloor() {
  const carpet = ctx.createLinearGradient(0, stage.floorY - 28, 0, stage.height);
  carpet.addColorStop(0, '#b4122c');
  carpet.addColorStop(1, '#4c0b16');
  ctx.fillStyle = carpet;
  ctx.fillRect(0, stage.floorY - 34, stage.width, stage.height - stage.floorY + 34);

  ctx.strokeStyle = 'rgba(255, 216, 122, 0.55)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, stage.floorY - 30);
  ctx.lineTo(stage.width, stage.floorY - 30);
  ctx.stroke();

  for (let index = 0; index < 10; index += 1) {
    const x = index * 150 - ((state.elapsed * state.speed * 0.22) % 150);
    ctx.fillStyle = 'rgba(255, 206, 112, 0.2)';
    ctx.beginPath();
    ctx.ellipse(x + 70, stage.floorY + 54, 58, 18, -0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 236, 164, 0.55)';
    drawStarPath(ctx, x + 70, stage.floorY + 50, 22, 9, 5);
    ctx.fill();
  }
}

function drawStarPath(drawContext, x, y, outerRadius, innerRadius, points) {
  drawContext.beginPath();
  for (let index = 0; index < points * 2; index += 1) {
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const angle = -Math.PI / 2 + (index * Math.PI) / points;
    const px = x + Math.cos(angle) * radius;
    const py = y + Math.sin(angle) * radius;
    if (index === 0) {
      drawContext.moveTo(px, py);
    } else {
      drawContext.lineTo(px, py);
    }
  }
  drawContext.closePath();
}

function drawShanghaiBackdrop(time) {
  const drift = -((state.elapsed * state.speed * 0.055) % 320);
  ctx.save();
  ctx.translate(drift, 0);

  ctx.fillStyle = 'rgba(223, 194, 143, 0.08)';
  roundRect(ctx, 52, 122, 186, 320, 18, true, false);
  ctx.fillStyle = 'rgba(59, 37, 34, 0.72)';
  ctx.fillRect(74, 158, 18, 284);
  ctx.fillRect(198, 158, 18, 284);
  ctx.fillRect(92, 146, 106, 18);
  ctx.beginPath();
  ctx.moveTo(54, 146);
  ctx.lineTo(146, 90);
  ctx.lineTo(238, 146);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(223, 194, 143, 0.16)';
  [186, 254, 322].forEach((y) => {
    roundRect(ctx, 106, y, 28, 42, 8, true, false);
    roundRect(ctx, 158, y, 28, 42, 8, true, false);
  });

  const skyline = [
    { x: 312, w: 112, h: 320 },
    { x: 420, w: 94, h: 368 },
    { x: 520, w: 138, h: 332 },
    { x: 672, w: 104, h: 286 },
    { x: 804, w: 126, h: 350 },
    { x: 948, w: 94, h: 302 },
    { x: 1062, w: 126, h: 338 },
    { x: 1200, w: 92, h: 280 },
  ];
  skyline.forEach((building, index) => {
    const baseY = 492 - building.h;
    const shade = index % 2 === 0 ? 'rgba(79, 49, 44, 0.82)' : 'rgba(63, 35, 35, 0.84)';
    ctx.fillStyle = shade;
    roundRect(ctx, building.x, baseY, building.w, building.h, 10, true, false);
    ctx.fillStyle = 'rgba(226, 194, 136, 0.18)';
    for (let row = 0; row < 6; row += 1) {
      for (let col = 0; col < Math.max(2, Math.floor(building.w / 28)); col += 1) {
        const wx = building.x + 14 + col * 24;
        const wy = baseY + 18 + row * 42;
        roundRect(ctx, wx, wy, 12, 18, 4, true, false);
      }
    }
  });

  ctx.fillStyle = 'rgba(143, 61, 54, 0.88)';
  roundRect(ctx, 748, 148, 116, 50, 12, true, false);
  ctx.fillStyle = '#f3d598';
  ctx.font = '700 26px sans-serif';
  ctx.fillText('申城', 784, 182);
  ctx.restore();
}

function drawShanghaiLights(time) {
  const lamps = [136, 302, 474, 628, 790, 956, 1110];
  lamps.forEach((x, index) => {
    const y = 116 + (index % 2) * 18;
    const glow = 0.28 + Math.sin(time * 0.002 + index) * 0.12;
    ctx.fillStyle = `rgba(244, 213, 146, ${glow})`;
    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const beam = ctx.createLinearGradient(x, y + 18, x, 420);
    beam.addColorStop(0, `rgba(244, 213, 146, ${0.10 + glow * 0.2})`);
    beam.addColorStop(1, 'rgba(244, 213, 146, 0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(x - 12, y + 18);
    ctx.lineTo(x + 12, y + 18);
    ctx.lineTo(x + 96, 420);
    ctx.lineTo(x - 96, 420);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
}

function drawNewsprintDrift(time) {
  for (let index = 0; index < 12; index += 1) {
    const x = ((index * 126) + state.elapsed * state.speed * 0.16) % (stage.width + 120) - 60;
    const y = 124 + (index % 5) * 54 + Math.sin(time * 0.0013 + index) * 16;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(time * 0.001 + index) * 0.28);
    ctx.fillStyle = index % 2 === 0 ? 'rgba(238, 226, 200, 0.14)' : 'rgba(205, 180, 150, 0.1)';
    roundRect(ctx, -18, -12, 36, 24, 4, true, false);
    ctx.restore();
  }
}

function drawShanghaiStreetFloor() {
  const floor = ctx.createLinearGradient(0, stage.floorY - 22, 0, stage.height);
  floor.addColorStop(0, '#6d4c39');
  floor.addColorStop(0.46, '#3d271f');
  floor.addColorStop(1, '#190f0f');
  ctx.fillStyle = floor;
  ctx.fillRect(0, stage.floorY, stage.width, stage.height - stage.floorY);

  ctx.fillStyle = '#d5bb88';
  ctx.fillRect(0, stage.floorY - 8, stage.width, 6);
  ctx.strokeStyle = 'rgba(218, 193, 144, 0.12)';
  ctx.lineWidth = 2;
  for (let index = 0; index < stage.width; index += 88) {
    ctx.beginPath();
    ctx.moveTo(index, stage.floorY + 10);
    ctx.lineTo(index + 28, stage.height);
    ctx.stroke();
  }
}

function drawCozyHomeBackdrop(time) {
  const wood = ctx.createLinearGradient(0, 80, 0, 560);
  wood.addColorStop(0, 'rgba(191, 163, 109, 0.32)');
  wood.addColorStop(1, 'rgba(86, 66, 42, 0.18)');
  ctx.fillStyle = wood;
  roundRect(ctx, 48, 70, stage.width - 96, 470, 26, true, false);

  ctx.strokeStyle = 'rgba(106, 81, 50, 0.3)';
  ctx.lineWidth = 3;
  for (let x = 86; x < stage.width - 86; x += 94) {
    ctx.beginPath();
    ctx.moveTo(x, 88);
    ctx.lineTo(x, 534);
    ctx.stroke();
  }

  ctx.fillStyle = 'rgba(215, 195, 156, 0.16)';
  roundRect(ctx, 120, 120, 280, 214, 18, true, false);
  const flowers = [
    [170, 170], [246, 164], [324, 178], [198, 246], [284, 252], [352, 236],
  ];
  flowers.forEach(([x, y], index) => {
    ctx.fillStyle = index % 2 === 0 ? '#e4c584' : '#d29667';
    for (let petal = 0; petal < 5; petal += 1) {
      const angle = (Math.PI * 2 * petal) / 5;
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(angle) * 10, y + Math.sin(angle) * 10, 9, 6, angle, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#f7efca';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = '#b49b72';
  roundRect(ctx, 462, 152, 242, 150, 18, true, false);
  ctx.fillStyle = '#75837e';
  roundRect(ctx, 484, 174, 198, 106, 14, true, false);
  ctx.strokeStyle = '#d8d1ac';
  ctx.lineWidth = 3;
  ctx.strokeRect(498, 188, 170, 76);
  ctx.strokeStyle = '#f5edd0';
  ctx.beginPath();
  ctx.moveTo(534, 205);
  ctx.lineTo(590, 196);
  ctx.lineTo(642, 212);
  ctx.stroke();

  ctx.fillStyle = '#6a5a46';
  roundRect(ctx, 790, 250, 238, 20, 8, true, false);
  ctx.fillRect(806, 270, 18, 110);
  ctx.fillRect(994, 270, 18, 110);
  ctx.fillStyle = '#926f54';
  roundRect(ctx, 838, 190, 108, 72, 12, true, false);
  ctx.fillStyle = '#7f6548';
  roundRect(ctx, 864, 148, 54, 42, 8, true, false);
  ctx.fillStyle = '#6f7d69';
  ctx.beginPath();
  ctx.arc(876, 142, 18, 0, Math.PI * 2);
  ctx.arc(908, 132, 20, 0, Math.PI * 2);
  ctx.arc(930, 146, 16, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#cbb086';
  roundRect(ctx, 190, 390, 274, 112, 20, true, false);
  ctx.fillStyle = '#7a674b';
  roundRect(ctx, 214, 418, 228, 62, 18, true, false);
  ctx.strokeStyle = 'rgba(229, 213, 179, 0.42)';
  ctx.lineWidth = 3;
  for (let x = 220; x < 430; x += 24) {
    ctx.beginPath();
    ctx.moveTo(x, 420);
    ctx.lineTo(x + 50, 478);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 10, 478);
    ctx.lineTo(x + 62, 420);
    ctx.stroke();
  }

  ctx.fillStyle = '#847056';
  roundRect(ctx, 1032, 212, 112, 96, 16, true, false);
  ctx.fillStyle = '#b6c59a';
  roundRect(ctx, 1048, 228, 80, 58, 12, true, false);
  ctx.fillStyle = '#5d4d40';
  ctx.fillRect(1080, 306, 16, 48);
}

function drawWarmStarLights(time) {
  const anchors = [110, 250, 390, 530, 670, 810, 950, 1090, 1230];
  ctx.strokeStyle = 'rgba(240, 219, 167, 0.28)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(68, 116);
  anchors.forEach((x, index) => {
    ctx.quadraticCurveTo(x - 54, 132 + (index % 2) * 18, x, 120 + (index % 3) * 16);
  });
  ctx.stroke();

  anchors.forEach((x, index) => {
    const y = 136 + Math.sin(time * 0.0014 + index) * 8 + (index % 3) * 14;
    const glow = 0.38 + Math.sin(time * 0.0022 + index) * 0.16;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = `rgba(255, 239, 188, ${glow})`;
    ctx.beginPath();
    for (let point = 0; point < 5; point += 1) {
      const outer = -Math.PI / 2 + (point * Math.PI * 2) / 5;
      const inner = outer + Math.PI / 5;
      const ox = Math.cos(outer) * 14;
      const oy = Math.sin(outer) * 14;
      const ix = Math.cos(inner) * 6;
      const iy = Math.sin(inner) * 6;
      if (point === 0) {
        ctx.moveTo(ox, oy);
      } else {
        ctx.lineTo(ox, oy);
      }
      ctx.lineTo(ix, iy);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
}

function drawWallpaperFlowers(time) {
  const petals = [
    { x: 1110, y: 148, color: 'rgba(244, 229, 177, 0.18)' },
    { x: 1170, y: 192, color: 'rgba(212, 177, 132, 0.16)' },
    { x: 1020, y: 168, color: 'rgba(210, 229, 176, 0.14)' },
  ];
  petals.forEach((flower, index) => {
    ctx.save();
    ctx.translate(flower.x, flower.y + Math.sin(time * 0.0012 + index) * 3);
    ctx.fillStyle = flower.color;
    for (let petal = 0; petal < 6; petal += 1) {
      const angle = (Math.PI * 2 * petal) / 6;
      ctx.beginPath();
      ctx.ellipse(Math.cos(angle) * 18, Math.sin(angle) * 18, 14, 8, angle, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawCozyHomeFloor() {
  const floor = ctx.createLinearGradient(0, stage.floorY - 22, 0, stage.height);
  floor.addColorStop(0, '#7a6041');
  floor.addColorStop(0.46, '#4d3925');
  floor.addColorStop(1, '#1d140f');
  ctx.fillStyle = floor;
  ctx.fillRect(0, stage.floorY, stage.width, stage.height - stage.floorY);

  ctx.fillStyle = '#e8d6a2';
  ctx.fillRect(0, stage.floorY - 8, stage.width, 6);
  ctx.strokeStyle = 'rgba(236, 223, 182, 0.11)';
  ctx.lineWidth = 2;
  for (let index = 0; index < stage.width; index += 92) {
    ctx.beginPath();
    ctx.moveTo(index, stage.floorY + 12);
    ctx.lineTo(index + 34, stage.height);
    ctx.stroke();
  }
}

function drawSantaLuciaBackdrop(time) {
  const drift = -((state.elapsed * state.speed * 0.09) % 240);
  ctx.save();
  ctx.translate(drift, 0);
  for (let index = -1; index < 7; index += 1) {
    const x = index * 240 + 40;
    const facade = ctx.createLinearGradient(x, 140, x, 570);
    facade.addColorStop(0, '#c96b48');
    facade.addColorStop(1, '#6a2927');
    ctx.fillStyle = facade;
    roundRect(ctx, x, 166, 190, 360, 14, true, false);

    ctx.fillStyle = '#f0d49a';
    ctx.fillRect(x + 18, 148, 154, 20);
    ctx.fillStyle = '#7d201f';
    [220, 316, 412].forEach((rowY) => {
      for (let col = 0; col < 3; col += 1) {
        const winX = x + 24 + col * 52;
        roundRect(ctx, winX, rowY, 34, 58, 8, true, false);
        ctx.fillStyle = '#f6c780';
        ctx.fillRect(winX + 6, rowY + 8, 22, 42);
        ctx.fillStyle = '#7d201f';
      }
    });

    ctx.fillStyle = '#b58b3f';
    ctx.fillRect(x + 30, 286, 130, 12);
    ctx.fillStyle = '#5a1d1a';
    ctx.fillRect(x + 44, 298, 8, 28);
    ctx.fillRect(x + 138, 298, 8, 28);
  }
  ctx.restore();

  ctx.save();
  ctx.translate(1030, 164 + Math.sin(time * 0.001) * 6);
  ctx.fillStyle = '#f0d17c';
  ctx.beginPath();
  ctx.arc(0, 0, 48, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#7f291f';
  ctx.lineWidth = 8;
  for (let index = 0; index < 8; index += 1) {
    ctx.rotate(Math.PI / 4);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, 46);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCasinoLights(time) {
  const bulbs = [120, 240, 360, 520, 700, 860, 1020, 1160];
  bulbs.forEach((x, index) => {
    const pulse = 0.42 + Math.sin(time * 0.0022 + index) * 0.16;
    ctx.fillStyle = `rgba(255, 220, 141, ${pulse})`;
    ctx.beginPath();
    ctx.arc(x, 72, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const beam = ctx.createLinearGradient(x, 84, x, 430);
    beam.addColorStop(0, `rgba(255, 215, 126, ${0.12 + pulse * 0.2})`);
    beam.addColorStop(1, 'rgba(255, 215, 126, 0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(x - 20, 84);
    ctx.lineTo(x + 20, 84);
    ctx.lineTo(x + 128, 430);
    ctx.lineTo(x - 128, 430);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
}

function drawRoseDrift(time) {
  for (let index = 0; index < 18; index += 1) {
    const x = ((index * 96) + state.elapsed * state.speed * 0.18) % (stage.width + 90) - 45;
    const y = 96 + (index % 7) * 46 + Math.sin(time * 0.0015 + index) * 18;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(time * 0.0011 + index) * 0.55);
    ctx.fillStyle = index % 2 === 0 ? 'rgba(255, 217, 110, 0.38)' : 'rgba(225, 105, 93, 0.26)';
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.quadraticCurveTo(9, -8, 8, 2);
    ctx.quadraticCurveTo(2, 10, -8, 6);
    ctx.quadraticCurveTo(-9, -4, 0, -7);
    ctx.fill();
    ctx.restore();
  }
}

function drawCasinoFloor() {
  const floor = ctx.createLinearGradient(0, stage.floorY - 24, 0, stage.height);
  floor.addColorStop(0, '#7f2b23');
  floor.addColorStop(0.45, '#4a1718');
  floor.addColorStop(1, '#1a0a0d');
  ctx.fillStyle = floor;
  ctx.fillRect(0, stage.floorY, stage.width, stage.height - stage.floorY);

  ctx.fillStyle = '#f1d27d';
  ctx.fillRect(0, stage.floorY - 8, stage.width, 6);
  ctx.strokeStyle = 'rgba(244, 213, 136, 0.13)';
  ctx.lineWidth = 2;
  for (let index = 0; index < stage.width; index += 86) {
    ctx.beginPath();
    ctx.moveTo(index, stage.floorY + 12);
    ctx.lineTo(index + 36, stage.height);
    ctx.stroke();
  }
}

function drawObstacles() {
  obstacles.forEach((obstacle) => {
    ctx.save();
    const floatOffset = ['floating-note', 'floating-letter', 'chip-stack', 'sicily-net', 'sicily-fish-school'].includes(obstacle.type)
      ? 8
      : ['ghost-float', 'sicily-buoy', 'open-book', 'pistol', 'rose-garland', 'retro-tv', 'desk-lamp', 'star-garland', 'vintage-camera', 'newspaper-stack', 'film-strip', 'clapperboard', 'hollywood-camera', 'gold-film-strip', 'reverse-hourglass', 'steam-cloud', 'hummingbird', 'surfboard', 'sea-wave', 'cocktail-glass', 'falling-petals', 'palace-lantern', 'poetry-scroll'].includes(obstacle.type)
        ? 12
        : 0;
    ctx.translate(obstacle.x, obstacle.y + Math.sin(obstacle.phase) * floatOffset);

    switch (obstacle.type) {
      case 'prop-trunk':
        drawPropTrunk(obstacle);
        break;
      case 'footlight':
        drawFootlight(obstacle);
        break;
      case 'mic-stand':
        drawMicStand(obstacle);
        break;
      case 'balcony-rail':
        drawBalconyRail(obstacle);
        break;
      case 'spotlight-rig':
        drawSpotlightRig(obstacle);
        break;
      case 'floating-note':
        drawFloatingObstacle(obstacle);
        break;
      case 'ghost-float':
        drawGhostObstacle(obstacle);
        break;
      case 'book-stack':
        drawBookStack(obstacle);
        break;
      case 'magazine-pile':
        drawMagazinePile(obstacle);
        break;
      case 'envelope-bundle':
        drawEnvelopeBundle(obstacle);
        break;
      case 'bookshelf-ledge':
        drawBookshelfLedge(obstacle);
        break;
      case 'floating-letter':
        drawFloatingLetterObstacle(obstacle);
        break;
      case 'open-book':
        drawOpenBookObstacle(obstacle);
        break;
      case 'bamboo-cluster':
        drawBambooCluster(obstacle);
        break;
      case 'stone-rock':
        drawStoneRock(obstacle);
        break;
      case 'sword-stand':
        drawSwordStand(obstacle);
        break;
      case 'flying-dagger':
        drawFlyingDagger(obstacle);
        break;
      case 'dart-wheel':
        drawDartWheel(obstacle);
        break;
      case 'bamboo-crossbar':
        drawBambooCrossbar(obstacle);
        break;
      case 'yellow-rose-bouquet':
        drawYellowRoseBouquet(obstacle);
        break;
      case 'pizza-box':
        drawPizzaBox(obstacle);
        break;
      case 'roulette-wheel':
        drawRouletteWheelObstacle(obstacle);
        break;
      case 'chip-stack':
        drawChipStack(obstacle);
        break;
      case 'pistol':
        drawPistolObstacle(obstacle);
        break;
      case 'rose-garland':
        drawRoseGarland(obstacle);
        break;
      case 'plaid-sofa':
        drawPlaidSofaObstacle(obstacle);
        break;
      case 'cushion-stack':
        drawCushionStack(obstacle);
        break;
      case 'flower-pot':
        drawFlowerPotObstacle(obstacle);
        break;
      case 'retro-tv':
        drawRetroTvObstacle(obstacle);
        break;
      case 'desk-lamp':
        drawDeskLampObstacle(obstacle);
        break;
      case 'star-garland':
        drawStarGarlandObstacle(obstacle);
        break;
      case 'film-reel':
        drawFilmReelObstacle(obstacle);
        break;
      case 'projector':
        drawProjectorObstacle(obstacle);
        break;
      case 'coffee-cup':
        drawCoffeeCupObstacle(obstacle);
        break;
      case 'vintage-camera':
        drawVintageCameraObstacle(obstacle);
        break;
      case 'newspaper-stack':
        drawNewspaperStackObstacle(obstacle);
        break;
      case 'film-strip':
        drawFilmStripObstacle(obstacle);
        break;
      case 'oscar-statue':
        drawOscarStatueObstacle(obstacle);
        break;
      case 'walk-star':
        drawWalkStarObstacle(obstacle);
        break;
      case 'red-rope':
        drawRedRopeObstacle(obstacle);
        break;
      case 'clapperboard':
        drawClapperboardObstacle(obstacle);
        break;
      case 'hollywood-camera':
        drawHollywoodCameraObstacle(obstacle);
        break;
      case 'gold-film-strip':
        drawGoldFilmStripObstacle(obstacle);
        break;
      case 'old-suitcase':
        drawOldSuitcaseObstacle(obstacle);
        break;
      case 'vintage-clock':
        drawVintageClockObstacle(obstacle);
        break;
      case 'dock-crate':
        drawDockCrateObstacle(obstacle);
        break;
      case 'reverse-hourglass':
        drawReverseHourglassObstacle(obstacle);
        break;
      case 'steam-cloud':
        drawSteamCloudObstacle(obstacle);
        break;
      case 'hummingbird':
        drawHummingbirdObstacle(obstacle);
        break;
      case 'sandcastle':
        drawSandcastleObstacle(obstacle);
        break;
      case 'shell-pile':
        drawShellPileObstacle(obstacle);
        break;
      case 'beach-umbrella':
        drawBeachUmbrellaObstacle(obstacle);
        break;
      case 'bak-kut-teh-pot':
        drawBakKutTehObstacle(obstacle);
        break;
      case 'surfboard':
        drawSurfboardObstacle(obstacle);
        break;
      case 'sea-wave':
        drawSeaWaveObstacle(obstacle);
        break;
      case 'cocktail-glass':
        drawCocktailGlassObstacle(obstacle);
        break;
      case 'taihu-rock':
        drawTaihuRockObstacle(obstacle);
        break;
      case 'lotus-vat':
        drawLotusVatObstacle(obstacle);
        break;
      case 'red-screen':
        drawRedScreenObstacle(obstacle);
        break;
      case 'falling-petals':
        drawFallingPetalsObstacle(obstacle);
        break;
      case 'palace-lantern':
        drawPalaceLanternObstacle(obstacle);
        break;
      case 'poetry-scroll':
        drawPoetryScrollObstacle(obstacle);
        break;
      case 'wooden-easel':
        drawWoodenEaselObstacle(obstacle);
        break;
      case 'paint-bucket':
        drawPaintBucketObstacle(obstacle);
        break;
      case 'art-stool':
        drawArtStoolObstacle(obstacle);
        break;
      case 'framed-canvas':
        drawFramedCanvasObstacle(obstacle);
        break;
      case 'paint-tube':
        drawPaintTubeObstacle(obstacle);
        break;
      case 'floating-brush':
        drawFloatingBrushObstacle(obstacle);
        break;
      case 'palette-plate':
        drawPaletteplateObstacle(obstacle);
        break;
      case 'sicily-anchor':
        drawSicilyAnchorObstacle(obstacle);
        break;
      case 'sicily-buoy':
        drawSicilyBuoyObstacle(obstacle);
        break;
      case 'sicily-seaweed':
        drawSicilySeaweedObstacle(obstacle);
        break;
      case 'sicily-hook':
        drawSicilyHookObstacle(obstacle);
        break;
      case 'sicily-net':
        drawSicilyNetObstacle(obstacle);
        break;
      case 'sicily-fish-school':
        drawSicilyFishSchoolObstacle(obstacle);
        break;
      case 'pipe-top':
        drawPipeObstacle(obstacle, 'top');
        break;
      case 'pipe-bottom':
        drawPipeObstacle(obstacle, 'bottom');
        break;
      default:
        break;
    }
    ctx.restore();
  });
}

function drawTaihuRockObstacle(obstacle) {
  ctx.fillStyle = obstacle.color;
  ctx.beginPath();
  ctx.moveTo(22, 118);
  ctx.quadraticCurveTo(4, 70, 38, 42);
  ctx.quadraticCurveTo(50, 2, 84, 24);
  ctx.quadraticCurveTo(122, 44, 96, 82);
  ctx.quadraticCurveTo(116, 112, 70, 126);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  [42, 78].forEach((x, i) => {
    ctx.beginPath();
    ctx.ellipse(x, 58 + i * 24, 14, 9, -0.4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawLotusVatObstacle(obstacle) {
  ctx.fillStyle = '#3f6e63';
  roundRect(ctx, 12, 42, obstacle.width - 24, 56, 18, true, false);
  ctx.fillStyle = obstacle.color;
  ctx.beginPath();
  ctx.ellipse(obstacle.width / 2, 42, 48, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#7fc18c';
  ctx.beginPath();
  ctx.ellipse(45, 34, 24, 9, -0.2, 0, Math.PI * 2);
  ctx.ellipse(76, 36, 25, 10, 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = obstacle.accent;
  [58, 68, 78].forEach((x, i) => {
    ctx.beginPath();
    ctx.ellipse(x, 22 - i * 2, 9, 15, (i - 1) * 0.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.strokeStyle = '#f1c96a';
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 58, obstacle.width - 48, 22);
}

function drawRedScreenObstacle(obstacle) {
  ctx.fillStyle = '#5a2431';
  roundRect(ctx, 0, 0, obstacle.width, obstacle.height, 10, true, false);
  ctx.fillStyle = obstacle.color;
  roundRect(ctx, 10, 12, obstacle.width - 20, obstacle.height - 24, 8, true, false);
  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 4;
  ctx.strokeRect(18, 22, obstacle.width - 36, obstacle.height - 44);
  ctx.fillStyle = 'rgba(255, 215, 223, 0.72)';
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2, 34);
  ctx.quadraticCurveTo(obstacle.width / 2 + 22, obstacle.height / 2, obstacle.width / 2, obstacle.height - 34);
  ctx.quadraticCurveTo(obstacle.width / 2 - 22, obstacle.height / 2, obstacle.width / 2, 34);
  ctx.closePath();
  ctx.fill();
}

function drawFallingPetalsObstacle(obstacle) {
  for (let index = 0; index < 10; index += 1) {
    const x = 10 + index * 14;
    const y = 14 + (index % 4) * 16;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(obstacle.phase + index);
    ctx.fillStyle = index % 2 ? obstacle.color : obstacle.accent;
    ctx.beginPath();
    ctx.ellipse(0, 0, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function drawPalaceLanternObstacle(obstacle) {
  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2, 0);
  ctx.lineTo(obstacle.width / 2, 18);
  ctx.stroke();
  ctx.fillStyle = obstacle.color;
  ctx.beginPath();
  ctx.ellipse(obstacle.width / 2, 50, 30, 38, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = '#ffd36e';
  ctx.fillRect(18, 46, obstacle.width - 36, 8);
  ctx.strokeStyle = obstacle.accent;
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2, 88);
  ctx.lineTo(obstacle.width / 2, 118);
  ctx.stroke();
}

function drawPoetryScrollObstacle(obstacle) {
  ctx.fillStyle = obstacle.color;
  roundRect(ctx, 8, 12, obstacle.width - 16, obstacle.height - 24, 10, true, false);
  ctx.fillStyle = '#d8b783';
  ctx.beginPath();
  ctx.arc(14, obstacle.height / 2, 12, 0, Math.PI * 2);
  ctx.arc(obstacle.width - 14, obstacle.height / 2, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 2;
  for (let i = 0; i < 4; i += 1) {
    const y = 20 + i * 12;
    ctx.beginPath();
    ctx.moveTo(28, y);
    ctx.lineTo(obstacle.width - 28, y);
    ctx.stroke();
  }
  ctx.fillStyle = 'rgba(199, 76, 92, 0.55)';
  [36, 62, 90].forEach((x, i) => {
    ctx.beginPath();
    ctx.arc(x, 30 + (i % 2) * 22, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

// ------- Level 11: Xinji Road Art Studio obstacles -------
function drawWoodenEaselObstacle(obstacle) {
  // 三脚画架 + 顶部小画布
  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  // 左脚 / 右脚 / 中脚
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2 - 4, 14);
  ctx.lineTo(14, obstacle.height - 6);
  ctx.moveTo(obstacle.width / 2 + 4, 14);
  ctx.lineTo(obstacle.width - 14, obstacle.height - 6);
  ctx.moveTo(obstacle.width / 2, obstacle.height * 0.55);
  ctx.lineTo(obstacle.width / 2, obstacle.height - 4);
  ctx.stroke();
  // 横梁
  ctx.beginPath();
  ctx.moveTo(20, obstacle.height * 0.62);
  ctx.lineTo(obstacle.width - 20, obstacle.height * 0.62);
  ctx.stroke();
  // 画布
  ctx.fillStyle = '#faf1d7';
  roundRect(ctx, obstacle.width / 2 - 32, 12, 64, 74, 4, true, false);
  ctx.strokeStyle = obstacle.color;
  ctx.lineWidth = 3;
  ctx.strokeRect(obstacle.width / 2 - 32, 12, 64, 74);
  // 画布上的彩色笔触
  ctx.fillStyle = '#e6c25a';
  ctx.fillRect(obstacle.width / 2 - 24, 26, 36, 8);
  ctx.fillStyle = '#c96f4a';
  ctx.fillRect(obstacle.width / 2 - 20, 42, 30, 6);
  ctx.fillStyle = '#7fb37a';
  ctx.fillRect(obstacle.width / 2 - 16, 56, 22, 6);
}

function drawPaintBucketObstacle(obstacle) {
  // 圆柱形颜料桶
  ctx.fillStyle = obstacle.color;
  roundRect(ctx, 8, 14, obstacle.width - 16, obstacle.height - 20, 8, true, false);
  // 桶顶
  ctx.fillStyle = obstacle.accent;
  ctx.beginPath();
  ctx.ellipse(obstacle.width / 2, 14, (obstacle.width - 16) / 2, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  // 里面的颜料
  ctx.fillStyle = '#f2c94c';
  ctx.beginPath();
  ctx.ellipse(obstacle.width / 2, 14, (obstacle.width - 22) / 2, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  // 桶上贴的标签
  ctx.fillStyle = '#fdf5e3';
  roundRect(ctx, 20, obstacle.height / 2 - 6, obstacle.width - 40, 22, 4, true, false);
  // 标签上小色点
  ['#d94a4a', '#4a90d9', '#7fb37a', '#e6a94a'].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(28 + i * 14, obstacle.height / 2 + 5, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  // 提手
  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(14, 14);
  ctx.quadraticCurveTo(obstacle.width / 2, -8, obstacle.width - 14, 14);
  ctx.stroke();
}

function drawArtStoolObstacle(obstacle) {
  // 圆凳面
  ctx.fillStyle = obstacle.color;
  ctx.beginPath();
  ctx.ellipse(obstacle.width / 2, 22, (obstacle.width - 12) / 2, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 2;
  ctx.stroke();
  // 凳面纹理
  ctx.strokeStyle = 'rgba(122, 74, 36, 0.35)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.ellipse(obstacle.width / 2, 22, (obstacle.width - 12) / 2 - 4 - i * 4, 10 - i * 3, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  // 三条腿
  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(obstacle.width * 0.24, 30);
  ctx.lineTo(obstacle.width * 0.18, obstacle.height - 4);
  ctx.moveTo(obstacle.width * 0.76, 30);
  ctx.lineTo(obstacle.width * 0.82, obstacle.height - 4);
  ctx.moveTo(obstacle.width / 2, 32);
  ctx.lineTo(obstacle.width / 2, obstacle.height - 4);
  ctx.stroke();
  // 腿之间的横撑
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(obstacle.width * 0.22, obstacle.height - 22);
  ctx.lineTo(obstacle.width * 0.78, obstacle.height - 22);
  ctx.stroke();
}

function drawFramedCanvasObstacle(obstacle) {
  // 木质画框
  ctx.fillStyle = obstacle.accent;
  roundRect(ctx, 4, 4, obstacle.width - 8, obstacle.height - 8, 6, true, false);
  // 画布
  ctx.fillStyle = obstacle.color;
  ctx.fillRect(16, 16, obstacle.width - 32, obstacle.height - 32);
  // 一幅抽象画：山与太阳
  ctx.fillStyle = '#f0a15a';
  ctx.beginPath();
  ctx.arc(obstacle.width - 36, 36, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8bab6f';
  ctx.beginPath();
  ctx.moveTo(20, obstacle.height - 20);
  ctx.lineTo(obstacle.width / 2 - 8, 48);
  ctx.lineTo(obstacle.width - 32, obstacle.height - 20);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#5a7a52';
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2 - 4, 62);
  ctx.lineTo(obstacle.width / 2 + 20, obstacle.height - 20);
  ctx.lineTo(20, obstacle.height - 20);
  ctx.closePath();
  ctx.fill();
  // 木质高光
  ctx.strokeStyle = 'rgba(255, 236, 200, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(8, 8, obstacle.width - 16, obstacle.height - 16);
}

function drawPaintTubeObstacle(obstacle) {
  // 横向颜料管
  ctx.fillStyle = obstacle.color;
  roundRect(ctx, 20, 10, obstacle.width - 44, obstacle.height - 20, 14, true, false);
  // 尖头（右）
  ctx.fillStyle = '#3a2a1a';
  ctx.beginPath();
  ctx.moveTo(obstacle.width - 24, 12);
  ctx.lineTo(obstacle.width - 4, obstacle.height / 2);
  ctx.lineTo(obstacle.width - 24, obstacle.height - 12);
  ctx.closePath();
  ctx.fill();
  // 尾部封口（左）
  ctx.fillStyle = '#8a5326';
  roundRect(ctx, 8, 14, 16, obstacle.height - 28, 3, true, false);
  // 从尖头挤出的颜料
  ctx.fillStyle = obstacle.accent;
  ctx.beginPath();
  ctx.arc(obstacle.width - 2, obstacle.height / 2, 6, 0, Math.PI * 2);
  ctx.fill();
  // 标签
  ctx.fillStyle = '#fff7e0';
  ctx.fillRect(34, obstacle.height / 2 - 6, obstacle.width - 68, 12);
  // 标签色带
  ctx.fillStyle = obstacle.accent;
  ctx.fillRect(34, obstacle.height / 2 + 2, obstacle.width - 68, 4);
}

function drawFloatingBrushObstacle(obstacle) {
  // 一支横放画笔
  // 木杆
  ctx.fillStyle = obstacle.color;
  roundRect(ctx, 8, obstacle.height / 2 - 6, obstacle.width - 46, 12, 3, true, false);
  // 金属箍
  ctx.fillStyle = '#c9a24b';
  ctx.fillRect(obstacle.width - 60, obstacle.height / 2 - 8, 18, 16);
  // 笔毛
  ctx.fillStyle = obstacle.accent;
  ctx.beginPath();
  ctx.moveTo(obstacle.width - 42, obstacle.height / 2 - 8);
  ctx.lineTo(obstacle.width - 4, obstacle.height / 2 - 2);
  ctx.lineTo(obstacle.width - 4, obstacle.height / 2 + 2);
  ctx.lineTo(obstacle.width - 42, obstacle.height / 2 + 8);
  ctx.closePath();
  ctx.fill();
  // 笔毛尖端沾颜料
  ctx.fillStyle = '#d94a4a';
  ctx.beginPath();
  ctx.arc(obstacle.width - 4, obstacle.height / 2, 4, 0, Math.PI * 2);
  ctx.fill();
  // 木杆纹理高光
  ctx.strokeStyle = 'rgba(255, 240, 210, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(12, obstacle.height / 2 - 3);
  ctx.lineTo(obstacle.width - 46, obstacle.height / 2 - 3);
  ctx.stroke();
}

function drawPaletteplateObstacle(obstacle) {
  // 椭圆调色盘
  ctx.fillStyle = obstacle.color;
  ctx.beginPath();
  ctx.ellipse(obstacle.width / 2, obstacle.height / 2, obstacle.width / 2 - 6, obstacle.height / 2 - 8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 2;
  ctx.stroke();
  // 拇指孔
  ctx.fillStyle = 'rgba(70, 40, 24, 0.55)';
  ctx.beginPath();
  ctx.ellipse(24, obstacle.height / 2, 8, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  // 各色颜料
  const dabs = [
    { x: 42, y: 22, c: '#d94a4a' },
    { x: 60, y: 44, c: '#f0c24c' },
    { x: 82, y: 22, c: '#7fb37a' },
    { x: 96, y: 46, c: '#4a90d9' },
    { x: 62, y: 18, c: '#a86bd9' },
  ];
  dabs.forEach((d) => {
    if (d.x + 8 > obstacle.width - 6) return;
    ctx.fillStyle = d.c;
    ctx.beginPath();
    ctx.arc(d.x, d.y, 7, 0, Math.PI * 2);
    ctx.fill();
  });
}

// ------- Level 13 obstacles: Sicily fishing props -------
function drawSicilyAnchorObstacle(obstacle) {
  ctx.strokeStyle = obstacle.color;
  ctx.fillStyle = obstacle.color;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';

  // 主杆
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2, 18);
  ctx.lineTo(obstacle.width / 2, obstacle.height - 34);
  ctx.stroke();

  // 顶部圆环
  ctx.lineWidth = 8;
  ctx.strokeStyle = obstacle.accent;
  ctx.beginPath();
  ctx.arc(obstacle.width / 2, 20, 14, 0, Math.PI * 2);
  ctx.stroke();

  // 横杠
  ctx.strokeStyle = obstacle.color;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(24, 46);
  ctx.lineTo(obstacle.width - 24, 46);
  ctx.stroke();

  // 底部弧形 + 两侧爪
  ctx.strokeStyle = obstacle.color;
  ctx.lineWidth = 10;
  const baseY = obstacle.height - 34;
  ctx.beginPath();
  ctx.arc(obstacle.width / 2, baseY, 34, Math.PI * 0.15, Math.PI * 0.85);
  ctx.stroke();

  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2 - 34, baseY + 6);
  ctx.quadraticCurveTo(20, baseY + 26, 18, baseY + 54);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2 + 34, baseY + 6);
  ctx.quadraticCurveTo(obstacle.width - 20, baseY + 26, obstacle.width - 18, baseY + 54);
  ctx.stroke();

  // 金属高光
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2 - 10, 56);
  ctx.lineTo(obstacle.width / 2 - 10, obstacle.height - 60);
  ctx.stroke();
}

function drawSicilyBuoyObstacle(obstacle) {
  const cx = obstacle.width / 2;
  const cy = obstacle.height / 2 + 6;
  // 主体
  ctx.fillStyle = obstacle.color;
  ctx.beginPath();
  ctx.ellipse(cx, cy, obstacle.width / 2 - 10, obstacle.height / 2 - 18, 0, 0, Math.PI * 2);
  ctx.fill();
  // 白色条纹
  ctx.fillStyle = 'rgba(255,255,255,0.78)';
  roundRect(ctx, 18, cy - 10, obstacle.width - 36, 14, 7, true, false);
  // 顶帽
  ctx.fillStyle = '#24313a';
  roundRect(ctx, cx - 18, 12, 36, 18, 8, true, false);
  // 反光
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.beginPath();
  ctx.ellipse(cx - 16, cy - 16, 10, 18, -0.4, 0, Math.PI * 2);
  ctx.fill();
  // 轮廓
  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 3;
  ctx.stroke();
}

function drawSicilySeaweedObstacle(obstacle) {
  const baseY = obstacle.height - 10;
  ctx.strokeStyle = obstacle.color;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';

  const stalks = [
    { x: 28, sway: -18 },
    { x: 52, sway: 6 },
    { x: 76, sway: -6 },
    { x: 98, sway: 18 },
  ];
  stalks.forEach((s, idx) => {
    ctx.beginPath();
    ctx.moveTo(s.x, baseY);
    ctx.quadraticCurveTo(s.x + s.sway, baseY - 60, s.x + s.sway * 0.5, 24 + idx * 6);
    ctx.stroke();
  });

  // 叶片高光
  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(46, baseY - 12);
  ctx.quadraticCurveTo(40, baseY - 66, 58, 46);
  ctx.stroke();
}

function drawSicilyHookObstacle(obstacle) {
  ctx.strokeStyle = obstacle.color;
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  // 吊线
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2, 0);
  ctx.lineTo(obstacle.width / 2, 56);
  ctx.stroke();
  // 钩体
  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2, 56);
  ctx.quadraticCurveTo(obstacle.width / 2 + 26, 86, obstacle.width / 2, 116);
  ctx.quadraticCurveTo(obstacle.width / 2 - 26, 136, obstacle.width / 2 - 6, 150);
  ctx.stroke();
  // 尖端
  ctx.strokeStyle = obstacle.color;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2 - 8, 116);
  ctx.lineTo(obstacle.width / 2 - 24, 106);
  ctx.stroke();
}

function drawSicilyNetObstacle(obstacle) {
  // 渔网：半透明网面 + 网格
  ctx.fillStyle = obstacle.color;
  roundRect(ctx, 10, 14, obstacle.width - 20, obstacle.height - 28, 12, true, false);

  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 2;
  // 纵向网格
  for (let x = 24; x < obstacle.width - 18; x += 18) {
    ctx.beginPath();
    ctx.moveTo(x, 18);
    ctx.lineTo(x, obstacle.height - 18);
    ctx.stroke();
  }
  // 横向网格
  for (let y = 28; y < obstacle.height - 18; y += 16) {
    ctx.beginPath();
    ctx.moveTo(14, y);
    ctx.lineTo(obstacle.width - 14, y);
    ctx.stroke();
  }

  // 结点
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  for (let x = 24; x < obstacle.width - 18; x += 36) {
    for (let y = 28; y < obstacle.height - 18; y += 32) {
      ctx.beginPath();
      ctx.arc(x, y, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  // 外边绳
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 4;
  roundRect(ctx, 10, 14, obstacle.width - 20, obstacle.height - 28, 12, false, true);
}

function drawSicilyFishSchoolObstacle(obstacle) {
  // 鱼群：几条小鱼
  const fishes = [
    { x: 28, y: 30, s: 1.0 },
    { x: 68, y: 46, s: 0.9 },
    { x: 104, y: 28, s: 1.05 },
    { x: 132, y: 52, s: 0.85 },
  ];
  fishes.forEach((f, idx) => {
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.scale(f.s, f.s);
    ctx.fillStyle = idx % 2 === 0 ? obstacle.color : 'rgba(255,255,255,0.82)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    // 尾巴
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(-30, -10);
    ctx.lineTo(-30, 10);
    ctx.closePath();
    ctx.fill();
    // 眼睛
    ctx.fillStyle = 'rgba(10, 40, 60, 0.55)';
    ctx.beginPath();
    ctx.arc(8, -2, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  // 游动流线
  ctx.strokeStyle = 'rgba(255,255,255,0.28)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(18, obstacle.height - 22);
  ctx.quadraticCurveTo(64, obstacle.height - 42, 120, obstacle.height - 22);
  ctx.stroke();
}

function drawSandcastleObstacle(obstacle) {
  ctx.fillStyle = obstacle.color;
  roundRect(ctx, 12, 52, obstacle.width - 24, 52, 8, true, false);
  [22, 52, 82].forEach((x) => {
    roundRect(ctx, x, 24, 28, 78, 6, true, false);
    ctx.beginPath();
    ctx.moveTo(x, 24);
    ctx.lineTo(x + 14, 8);
    ctx.lineTo(x + 28, 24);
    ctx.closePath();
    ctx.fill();
  });
  ctx.fillStyle = obstacle.accent;
  ctx.beginPath();
  ctx.arc(obstacle.width / 2, 83, 13, Math.PI, 0);
  ctx.lineTo(obstacle.width / 2 + 13, 104);
  ctx.lineTo(obstacle.width / 2 - 13, 104);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(159, 105, 43, 0.28)';
  for (let index = 0; index < 8; index += 1) {
    ctx.beginPath();
    ctx.arc(20 + index * 13, 68 + (index % 2) * 18, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawShellPileObstacle(obstacle) {
  const shells = [
    { x: 24, y: 42, r: 20, c: obstacle.color },
    { x: 52, y: 32, r: 22, c: obstacle.accent },
    { x: 78, y: 48, r: 21, c: '#fff1d8' },
  ];
  shells.forEach((shell) => {
    ctx.fillStyle = shell.c;
    ctx.beginPath();
    ctx.ellipse(shell.x, shell.y, shell.r, shell.r * 0.72, 0, Math.PI, 0);
    ctx.lineTo(shell.x - shell.r, shell.y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(170, 97, 72, 0.55)';
    ctx.lineWidth = 2;
    for (let line = -2; line <= 2; line += 1) {
      ctx.beginPath();
      ctx.moveTo(shell.x, shell.y - shell.r * 0.6);
      ctx.lineTo(shell.x + line * shell.r * 0.34, shell.y + 4);
      ctx.stroke();
    }
  });
  ctx.fillStyle = '#f3b85a';
  roundRect(ctx, 8, 58, obstacle.width - 16, 12, 8, true, false);
}

function drawBeachUmbrellaObstacle(obstacle) {
  ctx.strokeStyle = '#8a5d34';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2, 46);
  ctx.lineTo(obstacle.width / 2 + 18, obstacle.height - 6);
  ctx.stroke();
  ctx.fillStyle = obstacle.color;
  ctx.beginPath();
  ctx.moveTo(8, 48);
  ctx.quadraticCurveTo(obstacle.width / 2, -8, obstacle.width - 8, 48);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = obstacle.accent;
  ctx.beginPath();
  ctx.moveTo(30, 42);
  ctx.quadraticCurveTo(obstacle.width / 2, 4, obstacle.width / 2, 48);
  ctx.lineTo(8, 48);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2, 0);
  ctx.lineTo(obstacle.width / 2, 50);
  ctx.moveTo(8, 48);
  ctx.quadraticCurveTo(obstacle.width / 2, -8, obstacle.width - 8, 48);
  ctx.stroke();
}

function drawBakKutTehObstacle(obstacle) {
  ctx.save();
  ctx.fillStyle = '#3a2418';
  roundRect(ctx, 12, 46, obstacle.width - 24, 38, 18, true, false);
  ctx.fillStyle = obstacle.color;
  roundRect(ctx, 18, 30, obstacle.width - 36, 48, 18, true, false);
  ctx.strokeStyle = '#2a1710';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = obstacle.accent;
  ctx.beginPath();
  ctx.ellipse(obstacle.width / 2, 36, 42, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8c4f35';
  [42, 62, 82].forEach((x, index) => {
    ctx.beginPath();
    ctx.ellipse(x, 34 + (index % 2) * 5, 14, 8, -0.18, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.72)';
  ctx.lineWidth = 3;
  [34, 62, 90].forEach((x, index) => {
    ctx.beginPath();
    ctx.moveTo(x, 18);
    ctx.quadraticCurveTo(x - 8, 4, x + 4, -8 - index * 3);
    ctx.stroke();
  });
  ctx.fillStyle = '#2f1a12';
  roundRect(ctx, 4, 48, 20, 14, 6, true, false);
  roundRect(ctx, obstacle.width - 24, 48, 20, 14, 6, true, false);
  ctx.fillStyle = '#f4d19a';
  ctx.font = '800 13px sans-serif';
  ctx.fillText('肉骨茶', obstacle.width / 2 - 20, 70);
  ctx.restore();
}

function drawSurfboardObstacle(obstacle) {
  ctx.save();
  ctx.translate(obstacle.width / 2, obstacle.height / 2);
  ctx.rotate(-0.18);
  ctx.fillStyle = obstacle.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, obstacle.width / 2 - 8, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = obstacle.accent;
  ctx.beginPath();
  ctx.ellipse(0, 0, 48, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSeaWaveObstacle(obstacle) {
  ctx.fillStyle = obstacle.color;
  ctx.beginPath();
  ctx.moveTo(0, obstacle.height);
  ctx.lineTo(0, 46);
  ctx.quadraticCurveTo(42, 2, 86, 38);
  ctx.quadraticCurveTo(118, 68, 168, 30);
  ctx.lineTo(obstacle.width, obstacle.height);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(20, 42);
  ctx.quadraticCurveTo(46, 16, 84, 38);
  ctx.quadraticCurveTo(112, 55, 148, 32);
  ctx.stroke();
}

function drawCocktailGlassObstacle(obstacle) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
  ctx.beginPath();
  ctx.moveTo(18, 10);
  ctx.lineTo(obstacle.width - 18, 10);
  ctx.lineTo(obstacle.width / 2 + 10, 58);
  ctx.lineTo(obstacle.width / 2 - 10, 58);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = obstacle.color;
  ctx.beginPath();
  ctx.moveTo(24, 18);
  ctx.lineTo(obstacle.width - 24, 18);
  ctx.lineTo(obstacle.width / 2 + 8, 52);
  ctx.lineTo(obstacle.width / 2 - 8, 52);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2, 58);
  ctx.lineTo(obstacle.width / 2, 96);
  ctx.moveTo(obstacle.width / 2 - 22, 100);
  ctx.lineTo(obstacle.width / 2 + 22, 100);
  ctx.stroke();
  ctx.fillStyle = obstacle.accent;
  ctx.beginPath();
  ctx.arc(obstacle.width - 18, 18, 10, 0, Math.PI * 2);
  ctx.fill();
}

function drawOldSuitcaseObstacle(obstacle) {
  ctx.fillStyle = obstacle.color;
  roundRect(ctx, 6, 22, obstacle.width - 12, obstacle.height - 24, 12, true, false);
  ctx.strokeStyle = '#3d2618';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(44, 22);
  ctx.quadraticCurveTo(obstacle.width / 2, -4, obstacle.width - 44, 22);
  ctx.stroke();
  ctx.fillStyle = 'rgba(238, 203, 137, 0.55)';
  ctx.fillRect(28, 28, 12, obstacle.height - 34);
  ctx.fillRect(obstacle.width - 40, 28, 12, obstacle.height - 34);
  ctx.fillStyle = '#3b2518';
  roundRect(ctx, obstacle.width / 2 - 16, 50, 32, 16, 4, true, false);
}

function drawVintageClockObstacle(obstacle) {
  ctx.fillStyle = obstacle.color;
  roundRect(ctx, 18, 12, obstacle.width - 36, obstacle.height - 16, 18, true, false);
  ctx.strokeStyle = '#3f2818';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = obstacle.accent;
  ctx.beginPath();
  ctx.arc(obstacle.width / 2, 50, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#4b3020';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.strokeStyle = '#27190f';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2, 50);
  ctx.lineTo(obstacle.width / 2 - 14, 38);
  ctx.moveTo(obstacle.width / 2, 50);
  ctx.lineTo(obstacle.width / 2 + 20, 56);
  ctx.stroke();
  ctx.fillStyle = 'rgba(238, 203, 137, 0.7)';
  ctx.beginPath();
  ctx.ellipse(obstacle.width / 2, 98, 18, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#4b3020';
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2, 78);
  ctx.lineTo(obstacle.width / 2, 116);
  ctx.stroke();
}

function drawDockCrateObstacle(obstacle) {
  ctx.fillStyle = obstacle.color;
  roundRect(ctx, 4, 8, obstacle.width - 8, obstacle.height - 12, 6, true, false);
  ctx.strokeStyle = '#3d2818';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(16, 18);
  ctx.lineTo(obstacle.width - 16, obstacle.height - 16);
  ctx.moveTo(obstacle.width - 16, 18);
  ctx.lineTo(16, obstacle.height - 16);
  ctx.moveTo(8, 34);
  ctx.lineTo(obstacle.width - 8, 34);
  ctx.stroke();
}

function drawReverseHourglassObstacle(obstacle) {
  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(20, 8);
  ctx.lineTo(obstacle.width - 20, 8);
  ctx.moveTo(20, obstacle.height - 8);
  ctx.lineTo(obstacle.width - 20, obstacle.height - 8);
  ctx.stroke();
  ctx.fillStyle = 'rgba(247, 221, 160, 0.28)';
  ctx.beginPath();
  ctx.moveTo(24, 14);
  ctx.quadraticCurveTo(obstacle.width / 2, obstacle.height / 2, obstacle.width - 24, 14);
  ctx.lineTo(24, obstacle.height - 14);
  ctx.quadraticCurveTo(obstacle.width / 2, obstacle.height / 2, obstacle.width - 24, obstacle.height - 14);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = obstacle.accent;
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2, 30);
  ctx.lineTo(obstacle.width / 2 - 18, 50);
  ctx.lineTo(obstacle.width / 2 + 18, 50);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2, 70);
  ctx.lineTo(obstacle.width / 2 - 22, 94);
  ctx.lineTo(obstacle.width / 2 + 22, 94);
  ctx.closePath();
  ctx.fill();
}

function drawSteamCloudObstacle(obstacle) {
  ctx.fillStyle = obstacle.color;
  [28, 58, 94, 126].forEach((x, index) => {
    ctx.beginPath();
    ctx.ellipse(x, 38 + Math.sin(obstacle.phase + index) * 4, 34, 22, 0, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = obstacle.accent;
  ctx.beginPath();
  ctx.ellipse(82, 26, 44, 18, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawHummingbirdObstacle(obstacle) {
  ctx.fillStyle = obstacle.color;
  ctx.beginPath();
  ctx.ellipse(58, 36, 28, 13, 0.08, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = obstacle.accent;
  ctx.beginPath();
  ctx.ellipse(34, 24, 28, 8, -0.45, 0, Math.PI * 2);
  ctx.ellipse(44, 48, 30, 8, 0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2b2116';
  ctx.beginPath();
  ctx.moveTo(84, 34);
  ctx.lineTo(112, 26);
  ctx.lineTo(88, 40);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#7c3b2f';
  ctx.beginPath();
  ctx.moveTo(28, 36);
  ctx.lineTo(6, 24);
  ctx.lineTo(14, 40);
  ctx.closePath();
  ctx.fill();
}

function drawOscarStatueObstacle(obstacle) {
  if (oscarStatueImage.complete && oscarStatueImage.naturalWidth > 0) {
    const iw = oscarStatueImage.naturalWidth;
    const ih = oscarStatueImage.naturalHeight;
    // 按 obstacle.height 撑满，横向按图片原始比例居中
    const drawH = obstacle.height;
    const drawW = drawH * (iw / ih);
    const drawX = (obstacle.width - drawW) / 2;
    ctx.drawImage(oscarStatueImage, drawX, 0, drawW, drawH);
    return;
  }
  ctx.fillStyle = obstacle.color;
  ctx.strokeStyle = '#6b4215';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(obstacle.width / 2, 22, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = obstacle.accent;
  roundRect(ctx, obstacle.width / 2 - 18, 40, 36, 58, 16, true, false);
  ctx.fillStyle = obstacle.color;
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2 - 24, 48);
  ctx.lineTo(obstacle.width / 2 - 52, 78);
  ctx.lineTo(obstacle.width / 2 - 36, 92);
  ctx.lineTo(obstacle.width / 2 - 16, 66);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2 + 24, 48);
  ctx.lineTo(obstacle.width / 2 + 52, 78);
  ctx.lineTo(obstacle.width / 2 + 36, 92);
  ctx.lineTo(obstacle.width / 2 + 16, 66);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#7b1c20';
  roundRect(ctx, 12, 104, obstacle.width - 24, 20, 6, true, false);
  ctx.fillStyle = '#3a1a16';
  roundRect(ctx, 5, 124, obstacle.width - 10, 18, 5, true, false);
}

function drawWalkStarObstacle(obstacle) {
  ctx.fillStyle = '#41242b';
  roundRect(ctx, 0, 22, obstacle.width, 48, 14, true, false);
  ctx.fillStyle = obstacle.color;
  drawStarPath(ctx, obstacle.width / 2, 40, 42, 18, 5);
  ctx.fill();
  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = obstacle.accent;
  ctx.font = '900 15px sans-serif';
  ctx.fillText('STAR', obstacle.width / 2 - 22, 46);
}

function drawRedRopeObstacle(obstacle) {
  ctx.strokeStyle = obstacle.color;
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(28, 32);
  ctx.bezierCurveTo(62, 72, 104, 72, 138, 32);
  ctx.stroke();
  ctx.fillStyle = obstacle.accent;
  [18, obstacle.width - 30].forEach((x) => {
    roundRect(ctx, x, 8, 20, 68, 8, true, false);
    ctx.beginPath();
    ctx.arc(x + 10, 8, 15, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = '#2a1013';
  roundRect(ctx, 4, 76, 42, 16, 7, true, false);
  roundRect(ctx, obstacle.width - 50, 76, 42, 16, 7, true, false);
}

function drawClapperboardObstacle(obstacle) {
  ctx.fillStyle = obstacle.color;
  roundRect(ctx, 6, 24, obstacle.width - 12, obstacle.height - 28, 10, true, false);
  ctx.fillStyle = obstacle.accent;
  ctx.fillRect(8, 20, obstacle.width - 16, 18);
  ctx.fillStyle = '#111118';
  for (let index = 0; index < 5; index += 1) {
    ctx.save();
    ctx.translate(12 + index * 23, 20);
    ctx.transform(1, 0, -0.35, 1, 0, 0);
    ctx.fillRect(0, 0, 13, 18);
    ctx.restore();
  }
  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(20, 54);
  ctx.lineTo(obstacle.width - 20, 54);
  ctx.moveTo(20, 68);
  ctx.lineTo(obstacle.width - 36, 68);
  ctx.stroke();
}

function drawHollywoodCameraObstacle(obstacle) {
  ctx.fillStyle = obstacle.color;
  roundRect(ctx, 26, 36, 70, 40, 10, true, false);
  ctx.fillStyle = obstacle.accent;
  ctx.beginPath();
  ctx.arc(44, 30, 18, 0, Math.PI * 2);
  ctx.arc(75, 28, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#101116';
  ctx.beginPath();
  ctx.moveTo(96, 46);
  ctx.lineTo(130, 32);
  ctx.lineTo(130, 78);
  ctx.lineTo(96, 64);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(48, 76);
  ctx.lineTo(26, 96);
  ctx.moveTo(74, 76);
  ctx.lineTo(96, 96);
  ctx.stroke();
}

function drawGoldFilmStripObstacle(obstacle) {
  ctx.fillStyle = obstacle.color;
  roundRect(ctx, 0, 10, obstacle.width, 40, 10, true, false);
  ctx.strokeStyle = obstacle.accent;
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = obstacle.accent;
  for (let index = 0; index < 8; index += 1) {
    ctx.fillRect(12 + index * 22, 16, 10, 10);
    ctx.fillRect(12 + index * 22, 34, 10, 10);
  }
  ctx.strokeStyle = 'rgba(255, 245, 188, 0.8)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(42, 14);
  ctx.quadraticCurveTo(78, 4, 118, 22);
  ctx.quadraticCurveTo(154, 38, 186, 18);
  ctx.stroke();
}

function drawPropTrunk(obstacle) {
  const body = ctx.createLinearGradient(0, 10, 0, obstacle.height);
  body.addColorStop(0, '#f0c48d');
  body.addColorStop(1, '#b36b42');
  ctx.fillStyle = body;
  roundRect(ctx, 0, 18, obstacle.width, obstacle.height - 18, 18, true, false);

  ctx.fillStyle = '#d87449';
  roundRect(ctx, 8, 0, obstacle.width - 16, 30, 12, true, false);

  ctx.strokeStyle = '#6c3524';
  ctx.lineWidth = 6;
  roundRect(ctx, 0, 18, obstacle.width, obstacle.height - 18, 18, false, true);
  roundRect(ctx, 8, 0, obstacle.width - 16, 30, 12, false, true);

  ctx.strokeStyle = '#fff0cb';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(20, 20);
  ctx.lineTo(obstacle.width - 20, 20);
  ctx.stroke();

  ctx.strokeStyle = '#8c4a32';
  ctx.lineWidth = 5;
  ctx.strokeRect(18, 30, obstacle.width - 36, obstacle.height - 40);
  ctx.beginPath();
  ctx.moveTo(obstacle.width * 0.5, 18);
  ctx.lineTo(obstacle.width * 0.5, obstacle.height - 10);
  ctx.stroke();
}

function drawFootlight(obstacle) {
  const body = ctx.createLinearGradient(0, 0, 0, obstacle.height);
  body.addColorStop(0, '#ffb562');
  body.addColorStop(1, '#a74624');
  ctx.fillStyle = body;
  roundRect(ctx, 0, 12, obstacle.width, obstacle.height - 12, 16, true, false);
  ctx.strokeStyle = '#6e2f1c';
  ctx.lineWidth = 5;
  roundRect(ctx, 0, 12, obstacle.width, obstacle.height - 12, 16, false, true);
  for (let bulb = 0; bulb < 4; bulb += 1) {
    ctx.fillStyle = bulb % 2 === 0 ? '#fff1b9' : '#ffd27a';
    ctx.beginPath();
    ctx.arc(24 + bulb * 28, 24, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#a85b1f';
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

function drawMicStand(obstacle) {
  ctx.strokeStyle = '#6c3526';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2, 6);
  ctx.lineTo(obstacle.width / 2, obstacle.height - 24);
  ctx.stroke();

  ctx.fillStyle = '#ffd17a';
  ctx.beginPath();
  ctx.arc(obstacle.width / 2, 14, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#8b4824';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.strokeStyle = '#8e5536';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2, obstacle.height - 24);
  ctx.lineTo(8, obstacle.height - 2);
  ctx.moveTo(obstacle.width / 2, obstacle.height - 24);
  ctx.lineTo(obstacle.width - 8, obstacle.height - 2);
  ctx.moveTo(obstacle.width / 2, obstacle.height - 24);
  ctx.lineTo(obstacle.width / 2, obstacle.height);
  ctx.stroke();
}

function drawBalconyRail(obstacle) {
  const rail = ctx.createLinearGradient(0, 0, 0, obstacle.height);
  rail.addColorStop(0, '#f0c180');
  rail.addColorStop(1, '#9b5938');
  ctx.fillStyle = rail;
  roundRect(ctx, 0, 0, obstacle.width, 22, 8, true, false);
  ctx.fillRect(10, 22, obstacle.width - 20, 12);
  for (let bar = 0; bar < 7; bar += 1) {
    ctx.fillRect(18 + bar * 22, 22, 8, obstacle.height - 22);
  }
  ctx.strokeStyle = '#6d3828';
  ctx.lineWidth = 5;
  roundRect(ctx, 0, 0, obstacle.width, 22, 8, false, true);
  ctx.strokeRect(10, 22, obstacle.width - 20, 12);
  ctx.beginPath();
  ctx.moveTo(6, 18);
  ctx.lineTo(obstacle.width - 6, 18);
  ctx.stroke();
}

function drawSpotlightRig(obstacle) {
  const shell = ctx.createLinearGradient(0, 0, 0, obstacle.height);
  shell.addColorStop(0, '#ffcf83');
  shell.addColorStop(1, '#b76a3c');
  ctx.fillStyle = shell;
  roundRect(ctx, 0, 12, obstacle.width, obstacle.height - 12, 20, true, false);
  ctx.strokeStyle = '#77432a';
  ctx.lineWidth = 6;
  roundRect(ctx, 0, 12, obstacle.width, obstacle.height - 12, 20, false, true);
  ctx.fillStyle = '#fff0b4';
  ctx.beginPath();
  ctx.arc(obstacle.width / 2, obstacle.height / 2 + 6, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#f8a65d';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(obstacle.width / 2, obstacle.height / 2 + 6, 34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#d98148';
  ctx.fillRect(8, 0, obstacle.width - 16, 16);
  ctx.strokeStyle = '#7f4324';
  ctx.strokeRect(8, 0, obstacle.width - 16, 16);
}

function drawFloatingObstacle(obstacle) {
  ctx.save();
  ctx.rotate(Math.sin(obstacle.phase) * 0.12);
  ctx.fillStyle = '#ffbf71';
  ctx.shadowColor = 'rgba(255, 171, 86, 0.24)';
  ctx.shadowBlur = 10;
  drawNote(40, 68, 48, true);
  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#7a4326';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(40, 94, 14, 0.2, Math.PI * 1.8);
  ctx.stroke();
  ctx.restore();
}

function drawGhostObstacle(obstacle) {
  drawGhostShape(obstacle.width * 0.5, obstacle.height * 0.1, obstacle.width * 0.45, 0.96, '#fff8f2', '#5f3b50');
}

function drawBookStack(obstacle) {
  const books = [
    { cover: '#a84e3e', pages: '#f9ebd1', label: '#f3cf86' },
    { cover: '#486e9b', pages: '#fff4df', label: '#d8e8f6' },
    { cover: '#c47c4d', pages: '#fff0d7', label: '#f3ddb1' },
    { cover: '#7e3f4f', pages: '#f8e8d4', label: '#f2c4b9' },
  ];
  books.forEach((book, index) => {
    const width = obstacle.width - index * 10;
    const x = index * 5;
    const y = obstacle.height - 19 - index * 17;
    const height = 18;

    ctx.fillStyle = book.cover;
    roundRect(ctx, x, y, width, height, 5, true, false);
    ctx.strokeStyle = '#6c3a28';
    ctx.lineWidth = 3;
    roundRect(ctx, x, y, width, height, 5, false, true);

    ctx.fillStyle = book.pages;
    roundRect(ctx, x + 7, y + 4, width - 14, height - 8, 3, true, false);
    ctx.fillStyle = book.cover;
    roundRect(ctx, x + 3, y + 2, 12, height - 4, 3, true, false);

    ctx.fillStyle = book.label;
    roundRect(ctx, x + 18, y + 5, Math.min(36, width * 0.28), 7, 3, true, false);
    ctx.fillStyle = 'rgba(104, 59, 40, 0.45)';
    ctx.fillRect(x + width - 18, y + 3, 3, height - 6);
    ctx.fillRect(x + width - 11, y + 3, 2, height - 6);
  });
}

function drawMagazinePile(obstacle) {
  const fills = [
    { cover: '#f1d7ad', stripe: '#b15e48', title: 'MAG' },
    { cover: '#d7b1a3', stripe: '#6b7f9a', title: 'ISSUE' },
    { cover: '#ead2bf', stripe: '#a86c46', title: 'NOVEL' },
  ];
  for (let index = 0; index < 3; index += 1) {
    const tilt = index % 2 === 0 ? -4 : 4;
    const item = fills[index % fills.length];
    ctx.save();
    ctx.translate(obstacle.width / 2 + tilt, obstacle.height - 14 - index * 16);
    ctx.rotate((tilt / 180) * Math.PI);
    ctx.fillStyle = item.cover;
    roundRect(ctx, -58, -10, 116, 20, 4, true, false);
    ctx.strokeStyle = '#87503b';
    ctx.lineWidth = 3;
    roundRect(ctx, -58, -10, 116, 20, 4, false, true);
    ctx.fillStyle = item.stripe;
    roundRect(ctx, -54, -6, 26, 12, 3, true, false);
    ctx.fillStyle = 'rgba(255,255,255,0.78)';
    ctx.fillRect(-22, -4, 62, 3);
    ctx.fillRect(-22, 1, 46, 2);
    ctx.fillStyle = '#5d3627';
    ctx.font = '700 7px sans-serif';
    ctx.fillText(item.title, -50, 2);
    ctx.restore();
  }
}

function drawEnvelopeBundle(obstacle) {
  ctx.fillStyle = '#fff3e0';
  roundRect(ctx, 6, 18, obstacle.width - 12, obstacle.height - 18, 10, true, false);
  ctx.strokeStyle = '#b7744e';
  ctx.lineWidth = 4;
  roundRect(ctx, 6, 18, obstacle.width - 12, obstacle.height - 18, 10, false, true);
  ctx.beginPath();
  ctx.moveTo(16, 30);
  ctx.lineTo(obstacle.width / 2, obstacle.height / 2 + 4);
  ctx.lineTo(obstacle.width - 16, 30);
  ctx.stroke();
  ctx.fillStyle = '#d98963';
  ctx.beginPath();
  ctx.arc(obstacle.width / 2, obstacle.height / 2 + 6, 10, 0, Math.PI * 2);
  ctx.fill();
}

function drawBookshelfLedge(obstacle) {
  ctx.fillStyle = '#6f402d';
  roundRect(ctx, 0, 0, obstacle.width, 22, 8, true, false);
  ctx.fillRect(14, 22, obstacle.width - 28, 16);
  ctx.strokeStyle = '#f1c998';
  ctx.lineWidth = 4;
  ctx.strokeRect(14, 22, obstacle.width - 28, 16);
  const books = [
    { cover: '#f0c27b', tag: '#f9e7bc' },
    { cover: '#cc8a61', tag: '#f2d6b6' },
    { cover: '#5f7f9f', tag: '#d8e5f0' },
    { cover: '#a55147', tag: '#f4c7bb' },
    { cover: '#e9d8b2', tag: '#fff3d1' },
    { cover: '#7a4a5a', tag: '#e8cad8' },
  ];
  for (let index = 0; index < 6; index += 1) {
    const book = books[index % books.length];
    const x = 22 + index * 26;
    const height = obstacle.height - 42 - (index % 2) * 6;
    ctx.fillStyle = book.cover;
    roundRect(ctx, x, 40, 18, height, 4, true, false);
    ctx.strokeStyle = '#6b402d';
    ctx.lineWidth = 2.5;
    roundRect(ctx, x, 40, 18, height, 4, false, true);
    ctx.fillStyle = book.tag;
    roundRect(ctx, x + 3, 46, 12, 9, 2, true, false);
    ctx.fillStyle = 'rgba(255,255,255,0.72)';
    ctx.fillRect(x + 5, 61, 8, 2);
    ctx.fillRect(x + 5, 67, 8, 2);
    ctx.fillStyle = 'rgba(99,57,39,0.35)';
    ctx.fillRect(x + 15, 44, 2, height - 8);
  }
}

function drawFloatingLetterObstacle(obstacle) {
  ctx.fillStyle = '#fff7ec';
  roundRect(ctx, 8, 12, obstacle.width - 16, obstacle.height - 24, 8, true, false);
  ctx.strokeStyle = '#c17d57';
  ctx.lineWidth = 4;
  roundRect(ctx, 8, 12, obstacle.width - 16, obstacle.height - 24, 8, false, true);
  ctx.beginPath();
  ctx.moveTo(16, 20);
  ctx.lineTo(obstacle.width / 2, obstacle.height / 2);
  ctx.lineTo(obstacle.width - 16, 20);
  ctx.stroke();
}

function drawOpenBookObstacle(obstacle) {
  ctx.fillStyle = '#fff0d5';
  ctx.beginPath();
  ctx.moveTo(8, obstacle.height - 18);
  ctx.quadraticCurveTo(obstacle.width * 0.28, 10, obstacle.width / 2, 34);
  ctx.quadraticCurveTo(obstacle.width * 0.72, 10, obstacle.width - 8, obstacle.height - 18);
  ctx.quadraticCurveTo(obstacle.width / 2, obstacle.height - 2, 8, obstacle.height - 18);
  ctx.fill();
  ctx.strokeStyle = '#b16c45';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2, 34);
  ctx.lineTo(obstacle.width / 2, obstacle.height - 8);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(177, 108, 69, 0.55)';
  ctx.lineWidth = 2;
  for (let index = 0; index < 4; index += 1) {
    const y = 46 + index * 10;
    ctx.beginPath();
    ctx.moveTo(22, y);
    ctx.lineTo(obstacle.width / 2 - 10, y - 3);
    ctx.moveTo(obstacle.width / 2 + 10, y - 3);
    ctx.lineTo(obstacle.width - 22, y);
    ctx.stroke();
  }

  ctx.fillStyle = '#cf8a5f';
  roundRect(ctx, obstacle.width / 2 - 14, 20, 28, 10, 4, true, false);
}

function drawBambooCluster(obstacle) {
  const stalks = [18, 48, 82, 112];
  stalks.forEach((x, index) => {
    const height = obstacle.height - 8 - (index % 2) * 10;
    const stalk = ctx.createLinearGradient(x, 0, x + 16, height);
    stalk.addColorStop(0, '#a6cf73');
    stalk.addColorStop(1, '#4e7a45');
    ctx.fillStyle = stalk;
    roundRect(ctx, x, obstacle.height - height, 14, height, 6, true, false);
    ctx.fillStyle = 'rgba(228, 247, 186, 0.35)';
    [0.18, 0.38, 0.58, 0.78].forEach((rate) => {
      ctx.fillRect(x, obstacle.height - height + height * rate, 14, 3);
    });
  });
}

function drawStoneRock(obstacle) {
  ctx.fillStyle = '#73807a';
  ctx.beginPath();
  ctx.moveTo(10, obstacle.height - 8);
  ctx.lineTo(24, 24);
  ctx.lineTo(obstacle.width * 0.46, 6);
  ctx.lineTo(obstacle.width - 22, 26);
  ctx.lineTo(obstacle.width - 8, obstacle.height - 10);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#42504b';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.strokeStyle = 'rgba(230, 236, 232, 0.28)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(30, 38);
  ctx.lineTo(54, 24);
  ctx.lineTo(80, 34);
  ctx.moveTo(64, 52);
  ctx.lineTo(94, 42);
  ctx.stroke();
}

function drawSwordStand(obstacle) {
  ctx.fillStyle = '#4d3427';
  roundRect(ctx, obstacle.width / 2 - 8, 16, 16, obstacle.height - 24, 6, true, false);
  ctx.fillRect(20, obstacle.height - 22, obstacle.width - 40, 12);
  ctx.strokeStyle = '#eadfb7';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2, 12);
  ctx.lineTo(obstacle.width / 2, obstacle.height - 44);
  ctx.stroke();
  ctx.strokeStyle = '#a88439';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2 - 24, 28);
  ctx.lineTo(obstacle.width / 2 + 24, 28);
  ctx.stroke();
  ctx.fillStyle = '#2d2320';
  roundRect(ctx, obstacle.width / 2 - 16, 32, 32, 12, 5, true, false);
}

function drawFlyingDagger(obstacle) {
  ctx.translate(obstacle.width / 2, obstacle.height / 2);
  ctx.rotate(-0.18);
  ctx.fillStyle = '#d8e2dc';
  ctx.beginPath();
  ctx.moveTo(-obstacle.width * 0.35, 0);
  ctx.lineTo(8, -16);
  ctx.lineTo(obstacle.width * 0.36, 0);
  ctx.lineTo(8, 16);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#7e8b85';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = '#5a4035';
  roundRect(ctx, -obstacle.width * 0.42, -8, 20, 16, 4, true, false);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawDartWheel(obstacle) {
  ctx.translate(obstacle.width / 2, obstacle.height / 2);
  ctx.rotate(state.elapsed * 5.4);
  ctx.fillStyle = '#95a39d';
  ctx.beginPath();
  ctx.arc(0, 0, obstacle.width * 0.22, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#41514b';
  ctx.lineWidth = 4;
  for (let index = 0; index < 4; index += 1) {
    ctx.rotate(Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(obstacle.width * 0.46, 0);
    ctx.lineTo(0, 10);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = '#dbe4de';
    ctx.fill();
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawBambooCrossbar(obstacle) {
  const stalk = ctx.createLinearGradient(0, 0, obstacle.width, obstacle.height);
  stalk.addColorStop(0, '#accd79');
  stalk.addColorStop(1, '#567d49');
  ctx.fillStyle = stalk;
  roundRect(ctx, 0, obstacle.height / 2 - 9, obstacle.width, 18, 8, true, false);
  ctx.fillStyle = 'rgba(231, 246, 190, 0.32)';
  [0.18, 0.42, 0.66, 0.88].forEach((rate) => {
    ctx.fillRect(obstacle.width * rate, obstacle.height / 2 - 9, 4, 18);
  });
  ctx.strokeStyle = '#35513a';
  ctx.lineWidth = 3;
  roundRect(ctx, 0, obstacle.height / 2 - 9, obstacle.width, 18, 8, false, true);
}

function drawFilmReelObstacle(obstacle) {
  ctx.translate(obstacle.width / 2, obstacle.height / 2);
  ctx.rotate(state.elapsed * 1.9);
  ctx.fillStyle = '#3f3835';
  ctx.beginPath();
  ctx.arc(0, 0, obstacle.width * 0.42, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#d0b179';
  ctx.beginPath();
  ctx.arc(0, 0, obstacle.width * 0.12, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 6; i += 1) {
    const angle = (Math.PI * 2 * i) / 6;
    ctx.beginPath();
    ctx.arc(Math.cos(angle) * obstacle.width * 0.22, Math.sin(angle) * obstacle.width * 0.22, obstacle.width * 0.07, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawProjectorObstacle(obstacle) {
  ctx.fillStyle = '#5f514a';
  roundRect(ctx, 18, 42, obstacle.width - 36, obstacle.height - 34, 10, true, false);
  ctx.fillStyle = '#3f3834';
  ctx.beginPath();
  ctx.arc(38, 28, 20, 0, Math.PI * 2);
  ctx.arc(72, 22, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#c9ae7a';
  ctx.beginPath();
  ctx.arc(38, 28, 8, 0, Math.PI * 2);
  ctx.arc(72, 22, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#282423';
  roundRect(ctx, obstacle.width - 42, 58, 22, 12, 4, true, false);
  ctx.fillStyle = '#3f3834';
  ctx.fillRect(30, obstacle.height - 8, 12, 8);
  ctx.fillRect(obstacle.width - 42, obstacle.height - 8, 12, 8);
}

function drawCoffeeCupObstacle(obstacle) {
  ctx.fillStyle = '#e5d7bf';
  roundRect(ctx, 18, 20, obstacle.width - 36, obstacle.height - 34, 12, true, false);
  ctx.strokeStyle = '#845541';
  ctx.lineWidth = 4;
  roundRect(ctx, 18, 20, obstacle.width - 36, obstacle.height - 34, 12, false, true);
  ctx.beginPath();
  ctx.arc(obstacle.width - 24, obstacle.height / 2, 14, -1.1, 1.1);
  ctx.stroke();
  ctx.fillStyle = '#724634';
  roundRect(ctx, 24, 28, obstacle.width - 48, 16, 8, true, false);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(34, 14);
  ctx.quadraticCurveTo(28, 4, 36, -6);
  ctx.moveTo(48, 10);
  ctx.quadraticCurveTo(46, -2, 56, -12);
  ctx.stroke();
}

function drawVintageCameraObstacle(obstacle) {
  ctx.fillStyle = '#473830';
  roundRect(ctx, 10, 22, obstacle.width - 20, obstacle.height - 30, 12, true, false);
  ctx.fillStyle = '#cdb386';
  ctx.beginPath();
  ctx.arc(obstacle.width / 2, obstacle.height / 2 + 2, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2a2524';
  ctx.beginPath();
  ctx.arc(obstacle.width / 2, obstacle.height / 2 + 2, 14, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#635048';
  roundRect(ctx, 22, 12, 26, 16, 6, true, false);
  roundRect(ctx, obstacle.width - 44, 14, 18, 10, 4, true, false);
  ctx.strokeStyle = '#e8d8b1';
  ctx.lineWidth = 3;
  ctx.strokeRect(18, 30, 26, 18);
}

function drawNewspaperStackObstacle(obstacle) {
  const sheets = [
    { x: 12, y: 30, w: obstacle.width - 34, h: 22, r: -0.08 },
    { x: 22, y: 12, w: obstacle.width - 34, h: 24, r: 0.06 },
    { x: 8, y: 46, w: obstacle.width - 26, h: 20, r: 0.04 },
  ];
  sheets.forEach((sheet) => {
    ctx.save();
    ctx.translate(sheet.x + sheet.w / 2, sheet.y + sheet.h / 2);
    ctx.rotate(sheet.r);
    ctx.fillStyle = '#e2d7c5';
    roundRect(ctx, -sheet.w / 2, -sheet.h / 2, sheet.w, sheet.h, 4, true, false);
    ctx.strokeStyle = '#927464';
    ctx.lineWidth = 2;
    roundRect(ctx, -sheet.w / 2, -sheet.h / 2, sheet.w, sheet.h, 4, false, true);
    ctx.strokeStyle = 'rgba(122, 90, 74, 0.45)';
    ctx.beginPath();
    ctx.moveTo(-sheet.w / 2 + 8, -4);
    ctx.lineTo(sheet.w / 2 - 8, -4);
    ctx.moveTo(-sheet.w / 2 + 8, 4);
    ctx.lineTo(sheet.w / 2 - 20, 4);
    ctx.stroke();
    ctx.restore();
  });
}

function drawFilmStripObstacle(obstacle) {
  ctx.fillStyle = '#3c2f2d';
  roundRect(ctx, 0, 10, obstacle.width, obstacle.height - 20, 8, true, false);
  ctx.fillStyle = '#dabb84';
  for (let x = 12; x < obstacle.width - 12; x += 28) {
    ctx.fillRect(x, 18, 8, 8);
    ctx.fillRect(x, obstacle.height - 26, 8, 8);
  }
  ctx.fillStyle = 'rgba(230, 214, 177, 0.22)';
  roundRect(ctx, 22, 18, obstacle.width - 44, obstacle.height - 36, 6, true, false);
}

function drawPlaidSofaObstacle(obstacle) {
  ctx.fillStyle = '#baa37b';
  roundRect(ctx, 8, 28, obstacle.width - 16, obstacle.height - 28, 20, true, false);
  ctx.fillStyle = '#7a6648';
  roundRect(ctx, 16, 8, obstacle.width - 32, 36, 16, true, false);
  ctx.strokeStyle = 'rgba(239, 226, 194, 0.4)';
  ctx.lineWidth = 3;
  for (let x = 22; x < obstacle.width - 18; x += 22) {
    ctx.beginPath();
    ctx.moveTo(x, 32);
    ctx.lineTo(x + 30, obstacle.height - 10);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + 10, obstacle.height - 12);
    ctx.lineTo(x + 38, 30);
    ctx.stroke();
  }
  ctx.fillStyle = '#6e5a40';
  ctx.fillRect(20, obstacle.height - 16, 12, 16);
  ctx.fillRect(obstacle.width - 32, obstacle.height - 16, 12, 16);
}

function drawCushionStack(obstacle) {
  const colors = ['#e8d4a8', '#caa26f', '#8ba171'];
  [0, 1, 2].forEach((index) => {
    const width = obstacle.width - 20 - index * 8;
    const x = (obstacle.width - width) / 2;
    const y = obstacle.height - 22 - index * 18;
    ctx.fillStyle = colors[index];
    roundRect(ctx, x, y, width, 20, 10, true, false);
    ctx.strokeStyle = 'rgba(96, 74, 53, 0.34)';
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, width, 20, 10, false, true);
  });
}

function drawFlowerPotObstacle(obstacle) {
  ctx.fillStyle = '#7ca170';
  ctx.beginPath();
  ctx.arc(obstacle.width / 2 - 12, 26, 16, 0, Math.PI * 2);
  ctx.arc(obstacle.width / 2 + 14, 22, 18, 0, Math.PI * 2);
  ctx.arc(obstacle.width / 2, 40, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#5d7d55';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2, 44);
  ctx.lineTo(obstacle.width / 2, 74);
  ctx.stroke();
  ctx.fillStyle = '#c87150';
  ctx.beginPath();
  ctx.moveTo(16, obstacle.height - 18);
  ctx.lineTo(obstacle.width - 16, obstacle.height - 18);
  ctx.lineTo(obstacle.width - 26, obstacle.height - 2);
  ctx.lineTo(26, obstacle.height - 2);
  ctx.closePath();
  ctx.fill();
}

function drawRetroTvObstacle(obstacle) {
  ctx.fillStyle = '#8a7458';
  roundRect(ctx, 8, 14, obstacle.width - 16, obstacle.height - 22, 14, true, false);
  ctx.fillStyle = '#dce5b1';
  roundRect(ctx, 18, 24, obstacle.width - 48, obstacle.height - 44, 10, true, false);
  ctx.strokeStyle = '#5d4b37';
  ctx.lineWidth = 4;
  roundRect(ctx, 8, 14, obstacle.width - 16, obstacle.height - 22, 14, false, true);
  ctx.beginPath();
  ctx.moveTo(34, 44);
  ctx.lineTo(66, 36);
  ctx.lineTo(92, 50);
  ctx.strokeStyle = 'rgba(126, 156, 112, 0.7)';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.strokeStyle = '#5d4b37';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(28, 14);
  ctx.lineTo(42, -4);
  ctx.moveTo(obstacle.width - 28, 14);
  ctx.lineTo(obstacle.width - 42, -4);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(obstacle.width - 20, obstacle.height / 2 - 6, 4, 0, Math.PI * 2);
  ctx.arc(obstacle.width - 20, obstacle.height / 2 + 14, 4, 0, Math.PI * 2);
  ctx.fillStyle = '#d9c48f';
  ctx.fill();
}

function drawDeskLampObstacle(obstacle) {
  ctx.fillStyle = '#e6d48e';
  ctx.beginPath();
  ctx.moveTo(22, 30);
  ctx.lineTo(58, 6);
  ctx.lineTo(82, 28);
  ctx.lineTo(48, 46);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#78624c';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(48, 44);
  ctx.lineTo(62, 74);
  ctx.lineTo(48, obstacle.height - 20);
  ctx.stroke();
  ctx.fillStyle = '#6f5d49';
  roundRect(ctx, 24, obstacle.height - 18, 52, 12, 6, true, false);
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = '#f5e8b0';
  ctx.beginPath();
  ctx.moveTo(44, 44);
  ctx.lineTo(92, 64);
  ctx.lineTo(86, obstacle.height - 2);
  ctx.lineTo(38, obstacle.height - 12);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawStarGarlandObstacle(obstacle) {
  ctx.strokeStyle = '#f0ddb1';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(8, 16);
  ctx.quadraticCurveTo(obstacle.width / 2, obstacle.height - 4, obstacle.width - 8, 16);
  ctx.stroke();
  [24, 62, 100, 138, 172].forEach((x, index) => {
    const y = 18 + (index % 2) * 12;
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = index % 2 === 0 ? '#f4e8b5' : '#e3cf8f';
    ctx.beginPath();
    for (let point = 0; point < 5; point += 1) {
      const outer = -Math.PI / 2 + (point * Math.PI * 2) / 5;
      const inner = outer + Math.PI / 5;
      const ox = Math.cos(outer) * 11;
      const oy = Math.sin(outer) * 11;
      const ix = Math.cos(inner) * 5;
      const iy = Math.sin(inner) * 5;
      if (point === 0) {
        ctx.moveTo(ox, oy);
      } else {
        ctx.lineTo(ox, oy);
      }
      ctx.lineTo(ix, iy);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });
}

function drawYellowRoseBouquet(obstacle) {
  const blossomX = obstacle.width * 0.64;
  const blossomY = 34;

  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  ctx.strokeStyle = '#f3ca43';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(18, obstacle.height - 10);
  ctx.quadraticCurveTo(42, obstacle.height - 40, 62, 94);
  ctx.quadraticCurveTo(78, 72, blossomX - 6, blossomY + 16);
  ctx.stroke();

  const leaves = [
    { x: 34, y: 92, w: 34, h: 16, angle: -0.58 },
    { x: 56, y: 112, w: 42, h: 18, angle: 0.16 },
    { x: 86, y: 100, w: 36, h: 16, angle: 0.42 },
  ];
  leaves.forEach((leaf) => {
    ctx.save();
    ctx.translate(leaf.x, leaf.y);
    ctx.rotate(leaf.angle);
    ctx.fillStyle = '#f3ca43';
    ctx.strokeStyle = '#121212';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-leaf.w / 2, 0);
    ctx.quadraticCurveTo(-leaf.w * 0.12, -leaf.h * 1.1, leaf.w / 2, 0);
    ctx.quadraticCurveTo(-leaf.w * 0.12, leaf.h * 1.1, -leaf.w / 2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-leaf.w / 2 + 4, 0);
    ctx.lineTo(leaf.w / 2 - 4, 0);
    ctx.moveTo(-leaf.w * 0.18, -leaf.h * 0.46);
    ctx.lineTo(-leaf.w * 0.02, -1);
    ctx.moveTo(leaf.w * 0.08, leaf.h * 0.42);
    ctx.lineTo(leaf.w * 0.24, 2);
    ctx.stroke();
    ctx.restore();
  });

  const petals = [
    { dx: -28, dy: 4, r: 22 },
    { dx: -14, dy: -18, r: 24 },
    { dx: 12, dy: -22, r: 23 },
    { dx: 32, dy: -4, r: 21 },
    { dx: 24, dy: 22, r: 22 },
    { dx: -4, dy: 28, r: 25 },
    { dx: -30, dy: 24, r: 18 },
  ];
  petals.forEach((petal) => {
    ctx.fillStyle = '#f3ca43';
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(blossomX + petal.dx, blossomY + petal.dy, petal.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  ctx.fillStyle = '#f3ca43';
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(blossomX, blossomY + 2, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(blossomX - 2, blossomY + 1, 18, 0.35, Math.PI * 1.78);
  ctx.arc(blossomX + 1, blossomY + 3, 12, 0.4, Math.PI * 1.78);
  ctx.arc(blossomX + 3, blossomY + 4, 7, 0.45, Math.PI * 1.9);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(blossomX - 24, blossomY + 6);
  ctx.quadraticCurveTo(blossomX - 10, blossomY - 12, blossomX + 8, blossomY - 8);
  ctx.moveTo(blossomX - 18, blossomY + 18);
  ctx.quadraticCurveTo(blossomX + 4, blossomY + 8, blossomX + 20, blossomY + 18);
  ctx.moveTo(blossomX - 10, blossomY + 30);
  ctx.quadraticCurveTo(blossomX + 10, blossomY + 18, blossomX + 26, blossomY + 28);
  ctx.stroke();

  ctx.restore();
}

function drawPizzaBox(obstacle) {
  ctx.fillStyle = '#d78f52';
  roundRect(ctx, 6, 16, obstacle.width - 12, obstacle.height - 18, 10, true, false);
  ctx.strokeStyle = '#7b4326';
  ctx.lineWidth = 4;
  roundRect(ctx, 6, 16, obstacle.width - 12, obstacle.height - 18, 10, false, true);
  ctx.fillStyle = '#f6dfb0';
  roundRect(ctx, 18, 0, obstacle.width - 36, 30, 8, true, false);
  ctx.fillStyle = '#f3c063';
  ctx.beginPath();
  ctx.moveTo(obstacle.width / 2, 26);
  ctx.arc(obstacle.width / 2, 44, 34, Math.PI * 1.1, Math.PI * 1.9);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#be3f31';
  [0, 1, 2].forEach((index) => {
    ctx.beginPath();
    ctx.arc(obstacle.width / 2 - 16 + index * 16, 42 + (index % 2) * 5, 5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawRouletteWheelObstacle(obstacle) {
  ctx.translate(obstacle.width / 2, obstacle.height / 2);
  ctx.rotate(state.elapsed * 2.4);
  ctx.fillStyle = '#e8c56f';
  ctx.beginPath();
  ctx.arc(0, 0, obstacle.width * 0.46, 0, Math.PI * 2);
  ctx.fill();
  for (let index = 0; index < 12; index += 1) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, obstacle.width * 0.38, (index / 12) * Math.PI * 2, ((index + 1) / 12) * Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = index % 2 === 0 ? '#7e1719' : '#121315';
    ctx.fill();
  }
  ctx.fillStyle = '#f4e8bb';
  ctx.beginPath();
  ctx.arc(0, 0, obstacle.width * 0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawChipStack(obstacle) {
  const chips = ['#bb3f34', '#222733', '#d2b158'];
  for (let index = 0; index < 5; index += 1) {
    const y = obstacle.height - 16 - index * 14;
    ctx.fillStyle = chips[index % chips.length];
    roundRect(ctx, 16, y, obstacle.width - 32, 12, 6, true, false);
    ctx.fillStyle = 'rgba(255,255,255,0.68)';
    ctx.fillRect(24, y + 3, 10, 6);
    ctx.fillRect(obstacle.width - 34, y + 3, 10, 6);
  }
}

function drawPistolObstacle(obstacle) {
  ctx.translate(obstacle.width / 2, obstacle.height / 2);
  ctx.rotate(-0.08);
  ctx.fillStyle = '#575055';
  roundRect(ctx, -obstacle.width * 0.36, -12, obstacle.width * 0.58, 24, 8, true, false);
  ctx.fillRect(obstacle.width * 0.04, -16, obstacle.width * 0.2, 10);
  ctx.fillStyle = '#8b5a3c';
  ctx.beginPath();
  ctx.moveTo(-18, 6);
  ctx.lineTo(-2, 6);
  ctx.lineTo(14, 38);
  ctx.lineTo(-10, 40);
  ctx.closePath();
  ctx.fill();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function drawRoseGarland(obstacle) {
  ctx.strokeStyle = '#b89139';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(6, 18);
  ctx.quadraticCurveTo(obstacle.width / 2, obstacle.height - 6, obstacle.width - 6, 18);
  ctx.stroke();
  [24, 58, 92, 126, 160].forEach((x, index) => {
    ctx.fillStyle = index % 2 === 0 ? '#f2cc51' : '#db5e4e';
    ctx.beginPath();
    ctx.arc(x, 24 + (index % 2) * 8, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5f7f48';
    ctx.beginPath();
    ctx.ellipse(x - 8, 34 + (index % 2) * 8, 8, 4, -0.5, 0, Math.PI * 2);
    ctx.ellipse(x + 8, 34 + (index % 2) * 8, 8, 4, 0.5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawGhostShape(x, y, size, alpha, fillColor = '#fff8f2', eyeColor = '#5f3b50', soft = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;
  ctx.shadowColor = soft ? 'rgba(255, 170, 116, 0.26)' : 'rgba(255, 170, 116, 0.18)';
  ctx.shadowBlur = soft ? 18 : 10;
  ctx.fillStyle = fillColor;
  ctx.beginPath();
  ctx.moveTo(-size * 0.7, size * 0.62);
  ctx.quadraticCurveTo(-size * 0.9, size * 0.06, -size * 0.4, -size * 0.56);
  ctx.arc(0, -size * 0.34, size * 0.54, Math.PI * 0.92, Math.PI * 0.08, true);
  ctx.quadraticCurveTo(size * 0.9, size * 0.06, size * 0.72, size * 0.62);
  ctx.quadraticCurveTo(size * 0.5, size * 0.44, size * 0.28, size * 0.72);
  ctx.quadraticCurveTo(0, size * 0.48, -size * 0.2, size * 0.8);
  ctx.quadraticCurveTo(-size * 0.46, size * 0.52, -size * 0.7, size * 0.62);
  ctx.closePath();
  ctx.fill();

  ctx.shadowBlur = 0;
  ctx.strokeStyle = '#c8815d';
  ctx.lineWidth = Math.max(2, size * 0.08);
  ctx.stroke();

  ctx.fillStyle = eyeColor;
  ctx.beginPath();
  ctx.ellipse(-size * 0.22, -size * 0.16, size * 0.1, size * 0.16, -0.1, 0, Math.PI * 2);
  ctx.ellipse(size * 0.18, -size * 0.16, size * 0.1, size * 0.16, 0.1, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#d79078';
  ctx.lineWidth = Math.max(1.5, size * 0.04);
  ctx.beginPath();
  ctx.arc(-size * 0.05, size * 0.08, size * 0.18, 0.25, Math.PI - 0.25);
  ctx.stroke();
  ctx.restore();
}

function drawPlayer() {
  const flappy = isFlappyLevel();
  const grounded = !flappy && player.y + player.height >= stage.floorY - 2;
  const bobOffset = (grounded ? Math.sin(player.bob) * 3 : 0) - player.impact * 10;
  const rotation = flappy
    ? Math.max(-0.35, Math.min(0.55, player.vy / 720))
    : ((grounded ? Math.sin(player.runCycle) * 0.03 : 0) + Math.max(-0.28, Math.min(0.18, player.vy / 1200)));
  const stretchY = grounded ? 1 + Math.abs(Math.sin(player.runCycle)) * 0.02 : 1 + Math.max(0, -player.vy / 4600);
  const stretchX = 1 - (stretchY - 1) * 0.55;
  const altitude = stage.floorY - (player.y + player.height);

  if (!flappy) {
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.beginPath();
    ctx.ellipse(player.x + player.width / 2, stage.floorY + 8, Math.max(44, 88 - altitude * 0.12), Math.max(10, 18 - altitude * 0.02), 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const currentHeroFrame = heroSpriteFrames[state.level];
  if (currentHeroFrame) {
    const scale = Math.min(player.width / currentHeroFrame.width, player.height / currentHeroFrame.height);
    const renderWidth = currentHeroFrame.width * scale;
    const renderHeight = currentHeroFrame.height * scale;
    const renderX = -renderWidth / 2;
    const renderY = player.height / 2 - renderHeight;

    ctx.save();
    ctx.translate(player.x + player.width / 2, player.y + player.height / 2 + bobOffset);
    ctx.rotate(rotation);
    ctx.scale(stretchX, stretchY);
    ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
    ctx.shadowBlur = 18;
    ctx.drawImage(currentHeroFrame, renderX, renderY, renderWidth, renderHeight);
    ctx.restore();
    return;
  }

  drawFallbackPlayer(player.x, player.y + bobOffset, rotation);
}

function drawFallbackPlayer(x, y, rotation) {
  ctx.save();
  ctx.translate(x + player.width / 2, y + player.height / 2);
  ctx.rotate(rotation);
  ctx.translate(-player.width / 2, -player.height / 2);

  ctx.fillStyle = '#0f1319';
  ctx.beginPath();
  ctx.arc(player.width * 0.48, 42, 36, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f8d6b5';
  ctx.beginPath();
  ctx.arc(player.width * 0.5, 54, 34, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#da5f45';
  roundRect(ctx, 42, 84, 74, 82, 26, true, false);

  ctx.strokeStyle = '#f3ddc6';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(56, 90);
  ctx.lineTo(54, 162);
  ctx.moveTo(100, 90);
  ctx.lineTo(104, 162);
  ctx.stroke();

  ctx.strokeStyle = '#7b4b29';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(70, 160);
  ctx.lineTo(58, 212);
  ctx.moveTo(96, 160);
  ctx.lineTo(108, 210);
  ctx.stroke();

  ctx.fillStyle = '#f4f1ea';
  ctx.beginPath();
  ctx.ellipse(52, 214, 15, 8, -0.12, 0, Math.PI * 2);
  ctx.ellipse(112, 212, 15, 8, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawParticles() {
  particles.forEach((particle) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, particle.life * 1.4);
    ctx.fillStyle = particle.hue;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawNote(x, y, size, mirrored = false) {
  ctx.save();
  ctx.translate(x, y);
  if (mirrored) {
    ctx.scale(-1, 1);
  }
  ctx.beginPath();
  ctx.arc(0, size * 0.54, size * 0.38, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(-size * 0.1, -size * 1.3, size * 0.18, size * 1.58);
  ctx.beginPath();
  ctx.moveTo(size * 0.06, -size * 1.28);
  ctx.quadraticCurveTo(size * 0.92, -size * 1.05, size * 0.86, -size * 0.36);
  ctx.lineTo(size * 0.66, -size * 0.3);
  ctx.quadraticCurveTo(size * 0.66, -size * 0.82, size * 0.06, -size * 0.92);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function roundRect(context, x, y, width, height, radius, fill, stroke) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
  if (fill) context.fill();
  if (stroke) context.stroke();
}

let previousTime = performance.now();

function loop(currentTime) {
  const delta = Math.min(0.032, (currentTime - previousTime) / 1000);
  previousTime = currentTime;

  updateGame(delta);
  drawFrame(currentTime);
  requestAnimationFrame(loop);
}

function drawFrame(time) {
  ctx.clearRect(0, 0, stage.width, stage.height);
  drawBackground(time);
  drawObstacles();
  drawPlayer();
  drawParticles();
}

function handleAction(event) {
  if (event.type === 'keydown') {
    const validKeys = ['ArrowUp', 'w', 'W', ' ', 'Spacebar'];
    if (!validKeys.includes(event.key)) {
      if (event.key === 'Enter' && state.gameOver) {
        startGame();
      }
      return;
    }
    event.preventDefault();
  } else if (event.cancelable) {
    event.preventDefault();
  }

  if (startOverlay.classList.contains('overlay-visible') || levelCompleteOverlay.classList.contains('overlay-visible')) {
    return;
  }

  // 横屏提示仍在显示时，忽略跳跃操作，让玩家先点「我知道了」
  if (orientationTip && orientationTip.classList.contains('orientation-tip-visible')) {
    return;
  }

  if (state.gameOver) {
    startGame();
  } else {
    triggerJump();
  }
}

startLevel1Button.addEventListener('click', () => startGame(1));
startLevel2Button.addEventListener('click', () => startGame(2));
startLevel3Button.addEventListener('click', () => startGame(3));
startLevel4Button.addEventListener('click', () => startGame(4));
startLevel5Button.addEventListener('click', () => startGame(5));
startLevel6Button.addEventListener('click', () => startGame(6));
startLevel7Button.addEventListener('click', () => startGame(7));
startLevel8Button.addEventListener('click', () => startGame(8));
startLevel9Button.addEventListener('click', () => startGame(9));
startLevel10Button.addEventListener('click', () => startGame(10));
startLevel11Button.addEventListener('click', () => startGame(11));
startLevel12Button.addEventListener('click', () => startGame(12));
startLevel13Button.addEventListener('click', () => startGame(13));
restartButton.addEventListener('click', () => startGame());
backToMenuButton.addEventListener('click', showLevelSelect);
replayLevelButton.addEventListener('click', () => {
  // 「继续闯关」：关闭通关弹层，保留当前分数继续跑，state.levelComplete=true 阻止再次触发
  levelCompleteOverlay.classList.remove('overlay-visible');
  state.running = true;
  state.gameOver = false;
  // levelComplete 保持 true，避免同一关反复弹通关层
  updateMobileGameLayout();
});
nextLevelButton.addEventListener('click', goToNextLevel);
backToLevelSelectButton.addEventListener('click', showLevelSelect);
jumpButton.addEventListener('click', handleAction);
dismissOrientationTipButton.addEventListener('click', () => {
  state.orientationTipDismissed = true;
  updateMobileGameLayout();
});
window.addEventListener('keydown', handleAction);
window.addEventListener('resize', updateMobileGameLayout);
window.addEventListener('orientationchange', updateMobileGameLayout);
document.addEventListener('fullscreenchange', updateMobileGameLayout);
canvas.addEventListener('pointerdown', handleAction);
if (muteToggleButton) {
  muteToggleButton.addEventListener('click', () => {
    state.audioUnlocked = true;
    setAudioMuted(!state.audioMuted);
  });
}

updateMuteButton();
bindAudioUnlockGestures();
showLevelSelect();
updateMobileGameLayout();
drawFrame(0);
requestAnimationFrame(loop);


// ============================================================
// 彩带动画（canvas-confetti）
// ============================================================
function fireConfetti() {
  if (typeof window === 'undefined' || typeof window.confetti !== 'function') {
    return;
  }
  const confetti = window.confetti;
  // 中央大礼花
  confetti({
    particleCount: 160,
    spread: 100,
    startVelocity: 55,
    origin: { x: 0.5, y: 0.55 },
    colors: ['#f5d97a', '#ff8bd6', '#7ad9ff', '#b2ffb2', '#ffb27a', '#e05b8b'],
  });
  // 侧边持续喷射
  const duration = 2200;
  const end = Date.now() + duration;
  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      startVelocity: 45,
      origin: { x: 0, y: 0.75 },
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      startVelocity: 45,
      origin: { x: 1, y: 0.75 },
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

// ============================================================
// 关卡热度（公网点击量统计，abacus.jasoncameron.dev 免费计数）
// ============================================================
const HOT_NAMESPACE = 'cunxian-run-1ad186f8';
const HOT_ENDPOINT = 'https://abacus.jasoncameron.dev';

function formatHotCount(v) {
  if (typeof v !== 'number' || !isFinite(v) || v < 0) return '--';
  if (v >= 10000) return (v / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  return String(v);
}

function setHotBadge(level, value) {
  const badge = document.querySelector(`.level-preview-card-${level} .hot-badge`);
  if (badge) {
    badge.textContent = `🔥 ${formatHotCount(value)}`;
  }
}

async function fetchHot(level) {
  try {
    const r = await fetch(`${HOT_ENDPOINT}/get/${HOT_NAMESPACE}/level-${level}`, { cache: 'no-store' });
    if (r.ok) {
      const j = await r.json();
      return typeof j.value === 'number' ? j.value : 0;
    }
    // 计数器不存在，创建初始值 0
    const c = await fetch(`${HOT_ENDPOINT}/create/${HOT_NAMESPACE}/level-${level}?value=0`, { cache: 'no-store' });
    if (c.ok) return 0;
  } catch (e) {
    /* 网络失败静默 */
  }
  return null;
}

async function hitHot(level) {
  try {
    const r = await fetch(`${HOT_ENDPOINT}/hit/${HOT_NAMESPACE}/level-${level}`, { cache: 'no-store' });
    if (r.ok) {
      const j = await r.json();
      return typeof j.value === 'number' ? j.value : null;
    }
    // 首次 hit 若失败，先创建再 hit
    await fetch(`${HOT_ENDPOINT}/create/${HOT_NAMESPACE}/level-${level}?value=0`, { cache: 'no-store' });
    const r2 = await fetch(`${HOT_ENDPOINT}/hit/${HOT_NAMESPACE}/level-${level}`, { cache: 'no-store' });
    if (r2.ok) {
      const j = await r2.json();
      return typeof j.value === 'number' ? j.value : null;
    }
  } catch (e) {
    /* 网络失败静默 */
  }
  return null;
}

function ensureHotBadges() {
  for (let i = 1; i <= 13; i++) {
    const card = document.querySelector(`.level-preview-card-${i}`);
    if (!card) continue;
    let badge = card.querySelector('.hot-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'hot-badge';
      badge.textContent = '🔥 --';
      badge.title = '公网累计点击热度';
      card.appendChild(badge);
    }
  }
}

async function refreshAllHotCounts() {
  ensureHotBadges();
  await Promise.all(
    Array.from({ length: 13 }, (_, idx) => {
      const level = idx + 1;
      return fetchHot(level).then((v) => {
        if (v != null) setHotBadge(level, v);
      });
    })
  );
}

function bindHotHitCounters() {
  const buttons = [
    startLevel1Button, startLevel2Button, startLevel3Button, startLevel4Button,
    startLevel5Button, startLevel6Button, startLevel7Button, startLevel8Button,
    startLevel9Button, startLevel10Button, startLevel11Button, startLevel12Button,
    startLevel13Button,
  ];
  buttons.forEach((btn, idx) => {
    if (!btn) return;
    const level = idx + 1;
    btn.addEventListener('click', () => {
      hitHot(level).then((v) => {
        if (v != null) setHotBadge(level, v);
      });
    });
  });
}

ensureHotBadges();
ensureCompletionStamps();
refreshCompletionStamps();
refreshAllHotCounts();
