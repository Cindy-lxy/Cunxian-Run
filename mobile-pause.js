const mobilePauseButton = document.getElementById('pauseButton');
const mobilePausePanel = document.getElementById('pausePanel');
const mobileResumeButton = document.getElementById('resumeGameButton');
const mobileExitButton = document.getElementById('exitGameButton');

if (mobilePauseButton && mobilePausePanel && mobileResumeButton && mobileExitButton) {
  mobilePauseButton.addEventListener('click', () => {
    if (!state.running) return;
    state.running = false;
    state.paused = true;
    mobilePausePanel.hidden = false;
    try { backgroundMusic.pause(); } catch (error) {}
  });

  mobileResumeButton.addEventListener('click', () => {
    if (!state.paused) return;
    state.paused = false;
    state.running = true;
    mobilePausePanel.hidden = true;
    syncBackgroundMusic();
  });

  mobileExitButton.addEventListener('click', () => {
    state.paused = false;
    mobilePausePanel.hidden = true;
    showLevelSelect();
  });
}
