var _this = this;

/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
var Assets = {
  backgroundMusic: undefined,
  buttonClick: undefined
};
var fadeDuration = 1000;

var setButtonClickSound = function setButtonClickSound(scene, audioKey) {
  Assets.buttonClick = scene.sound.add(audioKey);
};

var setupScreenMusic = function setupScreenMusic(scene) {
  if (isAlreadyPlaying(scene.context.theme.music) || scene.context.theme.isOverlay) return;
  stopCurrentAndStartNextMusic(scene);
};

var isAlreadyPlaying = function isAlreadyPlaying(audioKey) {
  return audioKey && Assets.backgroundMusic && audioKey === Assets.backgroundMusic.key;
};

var onFadeComplete = function onFadeComplete(scene) {
  Assets.backgroundMusic.destroy();
  startNextMusic(scene);
};

var startNextMusic = function startNextMusic(scene) {
  Assets.backgroundMusic = startMusic(scene, scene.context.theme.music);
};

var startMusic = function startMusic(scene, audioKey) {
  if (!audioKey) return;
  var music = scene.sound.add(audioKey);
  music.play(undefined, {
    loop: true
  });
  music.volume = 0;
  scene.tweens.add({
    targets: music,
    volume: 1,
    duration: fadeDuration
  });
  return music;
};

var stopCurrentAndStartNextMusic = function stopCurrentAndStartNextMusic(scene) {
  if (Assets.backgroundMusic) {
    scene.tweens.add({
      targets: Assets.backgroundMusic,
      volume: 0,
      duration: fadeDuration / 2,
      onComplete: onFadeComplete.bind(_this, scene)
    });
  } else {
    startNextMusic(scene);
  }
};

export { Assets, setButtonClickSound, setupScreenMusic };