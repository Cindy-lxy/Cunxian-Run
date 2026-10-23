/* global state, backgroundMusic, syncBackgroundMusic, showLevelSelect */
const mobilePauseButton = document.getElementById('pauseButton');
const mobilePausePanel = document.getElementById('pausePanel');
const mobileResumeButton = document.getElementById('resumeGameButton');
const mobileExitButton = document.getElementById('exitGameButton');

if (mobilePauseButton && mobilePausePanel && mobileResumeButton && mobileExitButton) {
  const pauseGame = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!state.running) return;
    state.running = false;
    state.paused = true;
    mobilePausePanel.hidden = false;
    try { backgroundMusic.pause(); } catch {}
  };

  mobilePauseButton.addEventListener('pointerup', pauseGame);
  mobilePauseButton.addEventListener('click', pauseGame);

  const resumeGame = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!state.paused) return;
    state.paused = false;
    state.running = true;
    mobilePausePanel.hidden = true;
    syncBackgroundMusic();
  };

  mobileResumeButton.addEventListener('pointerup', resumeGame);
  mobileResumeButton.addEventListener('click', resumeGame);

  mobileExitButton.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    state.paused = false;
    mobilePausePanel.hidden = true;
    showLevelSelect();
  });
}
