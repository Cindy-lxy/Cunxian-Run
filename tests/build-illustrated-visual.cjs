const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
for (const [name, levels] of [['1-4', [1, 2, 3, 4]], ['5-8', [5, 6, 7, 8]], ['9-13', [9, 10, 11, 12, 13]], ['3-4', [3, 4]], ['12-13', [12, 13]]]) {
  const setup = `<base href="../"><script>window.requestAnimationFrame=()=>0;window.fetch=()=>Promise.reject(new Error('offline visual fixture'));</script>`;
  const gallery = `<script>
  const reviewLevels=${JSON.stringify(levels)};
  document.querySelector('.page-shell').style.display='none';
  document.body.style.padding='12px';
  document.body.style.background='#233044';
  reviewLevels.forEach(loadIllustratedLevel);
  let reviewed=false;
  function renderReview(){
    if(reviewed)return;
    if(!reviewLevels.every(level=>heroSpriteFrames[level]&&illustratedLevelTypes[level].every(isIllustratedReady)))return;
    reviewed=true;
    clearInterval(reviewTimer);
    for(const level of reviewLevels){
      state.level=level;resetGame();state.elapsed=0;state.running=false;
      let items;
      if(level===12){spawnPipePair();obstacles.forEach(o=>o.x=650);}
      else{items=obstacleCatalog();items.forEach((o,index)=>obstacles.push({...o,x:355+index*126,y:o.lane==='air'?Math.min(o.y,220-o.height):o.y,phase:0,useIllustration:true}));}
      drawFrame(0);
      const title=document.createElement('h2');title.textContent=LEVELS[level].badge;title.style.color='#ffe5ad';title.style.fontSize='18px';document.body.append(title);
      const image=document.createElement('canvas');image.width=1280;image.height=720;image.style.width='min(100%,560px)';image.style.display='block';image.getContext('2d').drawImage(canvas,0,0);document.body.append(image);
    }
  }
  const reviewTimer=setInterval(renderReview,120);
  window.addEventListener('load',renderReview);
  </script>`;
  const html = source.replace('<head>', `<head>${setup}`).replace('</body>', `${gallery}</body>`);
  fs.writeFileSync(path.join(__dirname, `illustrated-visual-${name}.html`), html);
}
console.log('Visual fixtures ready');
