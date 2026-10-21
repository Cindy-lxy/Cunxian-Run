const illustratedLevelTypes = {
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
const illustratedImages = new Map();

function illustratedFilename(type) {
  return type.startsWith('pipe-') ? 'piano-pillar' : type;
}

function loadIllustratedLevel(level) {
  for (const type of illustratedLevelTypes[level] || []) {
    const key = illustratedFilename(type);
    if (illustratedImages.has(key)) continue;
    const image = new Image();
    let retries = 0;
    const url = `assets/illustrated/${key}.webp?v=20261021-art1`;
    image.onerror = () => {
      if (retries >= 3) return;
      retries += 1;
      setTimeout(() => { image.src = `${url}&retry=${retries}`; }, retries * 1200);
    };
    illustratedImages.set(key, image);
    image.src = url;
  }
}

function isIllustratedReady(type) {
  const image = illustratedImages.get(illustratedFilename(type));
  return Boolean(image && image.complete && image.naturalWidth > 0);
}

function illustratedBounds(obstacle) {
  const image = illustratedImages.get(illustratedFilename(obstacle.type));
  if (!obstacle.useIllustration || !isIllustratedReady(obstacle.type)) return null;
  if (obstacle.type.startsWith('pipe-')) return { x: 0, y: 0, width: obstacle.width, height: obstacle.height };
  const scale = Math.min(obstacle.width / image.naturalWidth, obstacle.height / image.naturalHeight);
  const width = image.naturalWidth * scale;
  const height = image.naturalHeight * scale;
  const bob = obstacle.lane === 'air' ? Math.sin(obstacle.phase || 0) * 5 : 0;
  return {
    x: (obstacle.width - width) / 2,
    y: (obstacle.lane === 'ground' ? obstacle.height - height : (obstacle.height - height) / 2) + bob,
    width,
    height,
  };
}

function illustratedHitbox(obstacle) {
  const bounds = illustratedBounds(obstacle);
  if (!bounds) return null;
  return {
    x: obstacle.x + bounds.x + bounds.width * 0.13,
    y: obstacle.y + bounds.y + bounds.height * 0.08,
    width: bounds.width * 0.74,
    height: bounds.height * 0.84,
  };
}

function drawIllustratedObstacle(obstacle) {
  const bounds = illustratedBounds(obstacle);
  if (!bounds) return false;
  const image = illustratedImages.get(illustratedFilename(obstacle.type));
  ctx.save();
  ctx.translate(obstacle.x, obstacle.y);
  if (obstacle.type.startsWith('pipe-')) {
    const sw = image.naturalWidth;
    const sh = image.naturalHeight;
    const sourceCap = Math.min(sh / 8, 60);
    const cap = Math.min(24, obstacle.height / 3);
    const tileHeight = (sh - sourceCap * 2) * obstacle.width / sw;
    ctx.drawImage(image, 0, 0, sw, sourceCap, 0, 0, obstacle.width, cap);
    for (let y = cap; y < obstacle.height - cap; y += tileHeight) {
      const height = Math.min(tileHeight, obstacle.height - cap - y);
      ctx.drawImage(image, 0, sourceCap, sw, height * sw / obstacle.width, 0, y, obstacle.width, height);
    }
    ctx.drawImage(image, 0, sh - sourceCap, sw, sourceCap, 0, obstacle.height - cap, obstacle.width, cap);
  } else {
    ctx.drawImage(image, bounds.x, bounds.y, bounds.width, bounds.height);
  }
  ctx.restore();
  return true;
}
