function loadHeroicImage(filename) {
  const image = new Image();
  let retries = 0;
  let timer;
  const url = `assets/heroic/${filename}?v=20261021-l15fix1`;
  image.retryLoad = () => {
    clearTimeout(timer);
    retries += 1;
    image.src = `${url}&retry=${retries}`;
  };
  image.onerror = () => {
    if (retries >= 4) return;
    timer = setTimeout(image.retryLoad, (retries + 1) * 1000);
  };
  image.src = url;
  return image;
}

const heroicBackdrop = loadHeroicImage('harbour.jpg');
const heroicPropImages = Object.fromEntries(
  ['crate', 'briefcase', 'barrel', 'barrier', 'beacon', 'cash', 'sign', 'reel'].map((name) =>
    [`heroic-${name}`, loadHeroicImage(`${name}.png`)]),
);

function heroicAssetsReady() {
  return [heroicBackdrop, ...Object.values(heroicPropImages)].every((image) => image.complete && image.naturalWidth > 0);
}

function heroicObstacleCatalog() {
  return [
    { type: 'heroic-crate', lane: 'ground', width: 112, height: 108, y: stage.floorY - 108 },
    { type: 'heroic-briefcase', lane: 'ground', width: 112, height: 105, y: stage.floorY - 105 },
    { type: 'heroic-barrel', lane: 'ground', width: 84, height: 124, y: stage.floorY - 124 },
    { type: 'heroic-barrier', lane: 'ground', width: 140, height: 98, y: stage.floorY - 98 },
    { type: 'heroic-beacon', lane: 'air', width: 116, height: 74, y: 128 },
    { type: 'heroic-cash', lane: 'air', width: 100, height: 74, y: 134 },
    { type: 'heroic-sign', lane: 'air', width: 126, height: 94, y: 120 },
    { type: 'heroic-reel', lane: 'air', width: 104, height: 82, y: 126 },
  ];
}

function heroicPropBounds(obstacle) {
  const image = heroicPropImages[obstacle.type];
  if (!image || !image.complete || !image.naturalWidth) return null;
  const scale = Math.min(obstacle.width / image.naturalWidth, obstacle.height / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  return { x: (obstacle.width - width) / 2, y: obstacle.height - height, width, height };
}

function drawHeroicProp(obstacle) {
  const bounds = heroicPropBounds(obstacle);
  if (!bounds) return;
  ctx.drawImage(heroicPropImages[obstacle.type], bounds.x, bounds.y, bounds.width, bounds.height);
}

function heroicPropHitbox(obstacle) {
  const bounds = heroicPropBounds(obstacle);
  if (!bounds) return { x: obstacle.x, y: obstacle.y, width: 0, height: 0 };
  return {
    x: obstacle.x + bounds.x + bounds.width * 0.13,
    y: obstacle.y + bounds.y + bounds.height * 0.08,
    width: bounds.width * 0.74,
    height: bounds.height * 0.84,
  };
}

function drawHeroicStage(time) {
  ctx.save();
  const width = stage.width;
  const height = stage.height;
  ctx.fillStyle = '#728c95';
  ctx.fillRect(0, 0, width, height);
  if (heroicBackdrop.complete && heroicBackdrop.naturalWidth) {
    const scale = Math.max(width / heroicBackdrop.naturalWidth, height / heroicBackdrop.naturalHeight) * 1.045;
    const imageWidth = heroicBackdrop.naturalWidth * scale;
    const imageHeight = heroicBackdrop.naturalHeight * scale;
    const drift = Math.sin(state.elapsed * 0.025) * 18;
    ctx.drawImage(heroicBackdrop, (width - imageWidth) / 2 + drift, (height - imageHeight) / 2, imageWidth, imageHeight);
  }
  const glow = ctx.createLinearGradient(0, 0, 0, 260);
  glow.addColorStop(0, 'rgba(17,38,48,0.30)');
  glow.addColorStop(1, 'rgba(17,38,48,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, 260);
  const road = ctx.createLinearGradient(0, stage.floorY - 26, 0, height);
  road.addColorStop(0, 'rgba(74,93,100,0)');
  road.addColorStop(0.2, 'rgba(57,76,85,0.90)');
  road.addColorStop(1, '#263e4c');
  ctx.fillStyle = road;
  ctx.fillRect(0, stage.floorY - 26, width, height - stage.floorY + 26);
  ctx.fillStyle = '#d9c69a';
  ctx.fillRect(0, stage.floorY + 4, width, 3);
  const offset = (state.elapsed * state.speed) % 240;
  for (let x = -240; x < width + 240; x += 240) {
    ctx.fillStyle = 'rgba(236,205,135,0.58)';
    ctx.fillRect(x - offset, stage.floorY + 56, 108, 5);
    ctx.fillStyle = 'rgba(122,186,196,0.15)';
    ctx.fillRect(x - offset + 20, stage.floorY + 80, 142, 2);
  }
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'rgba(210,229,232,0.17)';
  ctx.beginPath();
  for (let index = 0; index < 38; index += 1) {
    const x = ((index * 137 - state.elapsed * 35) % width + width) % width;
    const y = (index * 91 + state.elapsed * 180) % stage.floorY;
    ctx.moveTo(x, y);
    ctx.lineTo(x - 3, y + 10);
  }
  ctx.stroke();
  ctx.restore();
}
