function loadStraussImage(filename) {
  const image = new Image();
  let retries = 0;
  let timer;
  const url = `assets/algernon/${filename}?v=20261021-l16`;
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

const straussBackdrop = loadStraussImage('laboratory.jpg');
const straussPropImages = Object.fromEntries(
  ['file-box', 'microscope', 'test-clipboard', 'glassware', 'mouse-cage', 'maze-card', 'white-bouquet', 'eeg-strip'].map((name) =>
    [`strauss-${name}`, loadStraussImage(`${name}.webp`)]),
);

function straussAssetsReady() {
  return [straussBackdrop, ...Object.values(straussPropImages)].every((image) => image.complete && image.naturalWidth > 0);
}

function straussObstacleCatalog() {
  return [
    { type: 'strauss-file-box', lane: 'ground', width: 110, height: 105, y: stage.floorY - 105 },
    { type: 'strauss-microscope', lane: 'ground', width: 88, height: 126, y: stage.floorY - 126 },
    { type: 'strauss-test-clipboard', lane: 'ground', width: 112, height: 108, y: stage.floorY - 108 },
    { type: 'strauss-glassware', lane: 'ground', width: 124, height: 108, y: stage.floorY - 108 },
    { type: 'strauss-mouse-cage', lane: 'air', width: 128, height: 92, y: 116 },
    { type: 'strauss-maze-card', lane: 'air', width: 116, height: 84, y: 126 },
    { type: 'strauss-white-bouquet', lane: 'air', width: 106, height: 102, y: 112 },
    { type: 'strauss-eeg-strip', lane: 'air', width: 138, height: 76, y: 132 },
  ];
}

function straussPropBounds(obstacle) {
  const image = straussPropImages[obstacle.type];
  if (!image || !image.complete || !image.naturalWidth) return null;
  const scale = Math.min(obstacle.width / image.naturalWidth, obstacle.height / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  return { x: (obstacle.width - width) / 2, y: obstacle.height - height, width, height };
}

function drawStraussProp(obstacle) {
  const bounds = straussPropBounds(obstacle);
  if (!bounds) return;
  ctx.drawImage(straussPropImages[obstacle.type], bounds.x, bounds.y, bounds.width, bounds.height);
}

function straussPropHitbox(obstacle) {
  const bounds = straussPropBounds(obstacle);
  if (!bounds) return { x: obstacle.x, y: obstacle.y, width: 0, height: 0 };
  return {
    x: obstacle.x + bounds.x + bounds.width * 0.13,
    y: obstacle.y + bounds.y + bounds.height * 0.08,
    width: bounds.width * 0.74,
    height: bounds.height * 0.84,
  };
}

function drawStraussStage() {
  ctx.save();
  ctx.fillStyle = '#dce5dc';
  ctx.fillRect(0, 0, stage.width, stage.height);
  if (straussBackdrop.complete && straussBackdrop.naturalWidth) {
    const scale = Math.max(stage.width / straussBackdrop.naturalWidth, stage.height / straussBackdrop.naturalHeight) * 1.035;
    const width = straussBackdrop.naturalWidth * scale;
    const height = straussBackdrop.naturalHeight * scale;
    const drift = Math.sin(state.elapsed * 0.018) * 12;
    ctx.drawImage(straussBackdrop, (stage.width - width) / 2 + drift, (stage.height - height) / 2, width, height);
  }
  const light = ctx.createLinearGradient(0, 0, 0, stage.floorY);
  light.addColorStop(0, 'rgba(255,250,222,0.22)');
  light.addColorStop(0.7, 'rgba(220,239,229,0.05)');
  light.addColorStop(1, 'rgba(80,115,110,0.12)');
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, stage.width, stage.floorY);
  const floor = ctx.createLinearGradient(0, stage.floorY - 20, 0, stage.height);
  floor.addColorStop(0, 'rgba(202,216,208,0)');
  floor.addColorStop(0.22, 'rgba(169,191,184,0.95)');
  floor.addColorStop(1, '#718f8c');
  ctx.fillStyle = floor;
  ctx.fillRect(0, stage.floorY - 20, stage.width, stage.height - stage.floorY + 20);
  ctx.fillStyle = '#f4ddaa';
  ctx.fillRect(0, stage.floorY + 4, stage.width, 3);
  const offset = (state.elapsed * state.speed) % 220;
  ctx.strokeStyle = 'rgba(243,253,247,0.22)';
  ctx.lineWidth = 2;
  for (let x = -220; x < stage.width + 220; x += 220) {
    ctx.beginPath();
    ctx.moveTo(x - offset, stage.floorY + 52);
    ctx.lineTo(x - offset + 130, stage.floorY + 52);
    ctx.stroke();
  }
  ctx.restore();
}
