const operaPropImages = Object.fromEntries(
  ['drum', 'spear', 'trunk', 'cymbal', 'gong', 'mask', 'lantern', 'flag'].map((name) => {
    const image = new Image();
    image.src = `assets/opera/${name}.png?v=20261021`;
    return [`opera-${name}`, image];
  }),
);

function operaPropBounds(obstacle) {
  const image = operaPropImages[obstacle.type];
  if (!image || !image.complete || !image.naturalWidth) return null;
  const scale = Math.min(obstacle.width / image.naturalWidth, obstacle.height / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  return { x: (obstacle.width - width) / 2, y: obstacle.height - height, width, height };
}

function drawOperaProp(obstacle) {
  const bounds = operaPropBounds(obstacle);
  if (!bounds) return;
  ctx.drawImage(operaPropImages[obstacle.type], bounds.x, bounds.y, bounds.width, bounds.height);
}

function operaPropHitbox(obstacle) {
  const bounds = operaPropBounds(obstacle);
  if (!bounds) return { x: obstacle.x, y: obstacle.y, width: 0, height: 0 };
  const insetX = bounds.width * 0.13;
  const insetY = bounds.height * 0.08;
  return {
    x: obstacle.x + bounds.x + insetX,
    y: obstacle.y + bounds.y + insetY,
    width: bounds.width - insetX * 2,
    height: bounds.height - insetY * 2,
  };
}

function drawOperaStage(time) {
  const width = stage.width;
  const floor = stage.floorY;
  const wall = ctx.createLinearGradient(0, 0, 0, floor);
  wall.addColorStop(0, '#a0cbbb');
  wall.addColorStop(0.5, '#e8ecce');
  wall.addColorStop(1, '#f7e7c3');
  ctx.fillStyle = wall;
  ctx.fillRect(0, 0, width, stage.height);
  ctx.save();
  const drift = ((state.elapsed * state.speed) * 0.07) % 430;
  for (let index = -1; index < 5; index++) {
    const x = index * 430 - drift;
    ctx.fillStyle = '#c6d6ba';
    ctx.fillRect(x + 26, 155, 360, floor - 155);
    ctx.strokeStyle = '#8cae96';
    ctx.lineWidth = 5;
    ctx.strokeRect(x + 36, 165, 340, floor - 177);
    for (let col = 0; col < 6; col++) {
      const left = x + 46 + col * 54;
      ctx.fillStyle = col % 2 ? '#dce6c7' : '#e7ebd0';
      ctx.fillRect(left, 188, 43, 330);
      ctx.strokeStyle = '#a5b99a';
      ctx.lineWidth = 2;
      for (let y = 210; y < 510; y += 56) {
        ctx.beginPath();
        ctx.moveTo(left, y + 20);
        ctx.lineTo(left + 21, y);
        ctx.lineTo(left + 43, y + 20);
        ctx.lineTo(left + 21, y + 40);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }
  const glow = ctx.createRadialGradient(width * 0.5, 310, 20, width * 0.5, 310, 620);
  glow.addColorStop(0, 'rgba(255,252,222,0.7)');
  glow.addColorStop(1, 'rgba(255,252,222,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, floor);
  ctx.restore();

  for (let i = 0; i < 36; i++) {
    const x = i * 37;
    const length = 100 + 42 * Math.sin(i * 0.2);
    const sway = Math.sin(time * 0.0008 + i * 0.21) * 3;
    ctx.strokeStyle = 'rgba(84,150,126,0.36)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, 56);
    ctx.lineTo(x + sway, length);
    ctx.stroke();
    for (let y = 68; y < length; y += 12) {
      ctx.fillStyle = y % 24 ? '#95c9ad' : '#e1efd1';
      ctx.beginPath();
      ctx.arc(x + sway * (y / length), y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = '#377f72';
  ctx.fillRect(0, 0, width, 48);
  for (let x = 0; x < width; x += 160) {
    ctx.fillStyle = x % 320 ? '#599b87' : '#438b7b';
    ctx.beginPath();
    ctx.moveTo(x, 45);
    ctx.quadraticCurveTo(x + 80, 99, x + 160, 45);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#dfc586';
    ctx.lineWidth = 4;
    ctx.stroke();
  }
  ctx.fillStyle = '#e5cc93';
  ctx.fillRect(0, 45, width, 4);

  const pillarDrift = ((state.elapsed * state.speed) * 0.12) % 740;
  for (let i = -1; i < 3; i++) {
    const x = i * 740 - pillarDrift + 600;
    const pillar = ctx.createLinearGradient(x, 0, x + 42, 0);
    pillar.addColorStop(0, '#b77f60');
    pillar.addColorStop(0.45, '#ddb787');
    pillar.addColorStop(1, '#b88464');
    ctx.fillStyle = pillar;
    ctx.fillRect(x, 100, 42, floor - 100);
    ctx.fillStyle = '#e8cea0';
    ctx.fillRect(x - 6, 104, 54, 14);
    ctx.fillRect(x - 6, floor - 18, 54, 18);
  }

  const paper = ctx.createLinearGradient(0, floor, 0, stage.height);
  paper.addColorStop(0, '#d3ad79');
  paper.addColorStop(1, '#b38b63');
  ctx.fillStyle = paper;
  ctx.fillRect(0, floor, width, stage.height - floor);
  ctx.fillStyle = '#f8e1ad';
  ctx.fillRect(0, floor, width, 7);
  ctx.strokeStyle = 'rgba(126,91,61,0.28)';
  ctx.lineWidth = 2;
  for (let y = floor + 28; y < stage.height; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  const plankDrift = (state.elapsed * state.speed) % 180;
  for (let x = -180; x < width + 180; x += 180) {
    ctx.beginPath();
    ctx.moveTo(x - plankDrift, floor + 8);
    ctx.lineTo(x - plankDrift - 50, stage.height);
    ctx.stroke();
  }
}
