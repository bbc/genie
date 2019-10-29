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

    stopCurrentMusic(scene);
    Assets.backgroundMusic = startMusic(scene, themeScreenConfig.music);

    if (Assets.backgroundMusic && Assets.backgroundMusic.usingAudioTag) {
        Assets.backgroundMusic.mute = scene.sound.mute;
    }
};

const isAlreadyPlaying = audioKey => {
    return audioKey && Assets.backgroundMusic && audioKey === Assets.backgroundMusic.key;
};

const startMusic = (scene, audioKey) => {
    if (!audioKey) return;

    let music = scene.sound.add(audioKey);

    music.play(undefined, { loop: true });

    return music;
};

const stopCurrentMusic = scene => {
    if (Assets.backgroundMusic) {
        scene.tweens.add({
            targets: Assets.backgroundMusic,
            volume: 0,
            duration: 500,
        });
    }
};

export { Assets, setButtonClickSound, setupScreenMusic };
