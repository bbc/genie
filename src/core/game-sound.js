/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const Assets = {
    backgroundMusic: undefined,
    buttonClick: undefined,
};

const fadeDuration = 1000;

const setButtonClickSound = (scene, audioKey) => {
    Assets.buttonClick = scene.sound.add(audioKey);
};

const setupScreenMusic = scene => {
    if (isAlreadyPlaying(scene.context.theme.music) || scene.context.theme.isOverlay) return;
    stopCurrentAndStartNextMusic(scene);
};

const isAlreadyPlaying = audioKey => {
    return audioKey && Assets.backgroundMusic && audioKey === Assets.backgroundMusic.key;
};

const onFadeComplete = scene => {
    Assets.backgroundMusic.destroy();
    startNextMusic(scene);
};

const startNextMusic = scene => {
    Assets.backgroundMusic = startMusic(scene, scene.context.theme.music);
};

const startMusic = (scene, audioKey) => {
    if (!audioKey) return;

    let music = scene.sound.add(audioKey);

    music.play(undefined, { loop: true });
    music.volume = 0;

    scene.tweens.add({
        targets: music,
        volume: 1,
        duration: fadeDuration,
    });

    return music;
};

const stopCurrentAndStartNextMusic = scene => {
    if (Assets.backgroundMusic) {
        scene.tweens.add({
            targets: Assets.backgroundMusic,
            volume: 0,
            duration: fadeDuration / 2,
            onComplete: onFadeComplete.bind(this, scene),
        });
    } else {
        startNextMusic(scene);
    }
};

export { Assets, setButtonClickSound, setupScreenMusic };
