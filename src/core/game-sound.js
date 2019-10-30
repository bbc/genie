/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const Assets = {
    backgroundMusic: undefined,
    buttonClick: undefined,
};

const setButtonClickSound = (scene, audioKey) => {
    Assets.buttonClick = scene.sound.add(audioKey);
};

const setupScreenMusic = (scene, themeScreenConfig = {}) => {
    if (isAlreadyPlaying(themeScreenConfig.music) || themeScreenConfig.isOverlay) return;
    stopCurrentAndStartNextMusic(scene, themeScreenConfig);
};

const isAlreadyPlaying = audioKey => {
    return audioKey && Assets.backgroundMusic && audioKey === Assets.backgroundMusic.key;
};

const onFadeComplete = (scene, themeScreenConfig) => {
    Assets.backgroundMusic.destroy();
    startNextMusic(scene, themeScreenConfig);
};

const startNextMusic = (scene, themeScreenConfig) => {
    Assets.backgroundMusic = startMusic(scene, themeScreenConfig.music);
};

const startMusic = (scene, audioKey) => {
    if (!audioKey) return;

    let music = scene.sound.add(audioKey);

    music.play(undefined, { loop: true });

    return music;
};

const stopCurrentAndStartNextMusic = (scene, themeScreenConfig) => {
    if (Assets.backgroundMusic) {
        scene.tweens.add({
            targets: Assets.backgroundMusic,
            volume: 0,
            duration: 500,
            onComplete: onFadeComplete.bind(this, scene, themeScreenConfig),
        });
    } else {
        startNextMusic(scene, themeScreenConfig);
    }
};

export { Assets, setButtonClickSound, setupScreenMusic };
