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
    if (isAlreadyPlaying(scene.config.music) || scene._data.addedBy) return;
    stopCurrentAndStartNextMusic(scene);
};

const isAlreadyPlaying = audioKey => {
    return audioKey && Assets.backgroundMusic && audioKey === Assets.backgroundMusic.key;
};

const startNextMusic = scene => {
    Assets.backgroundMusic?.destroy();
    Assets.backgroundMusic = startMusic(scene, scene.config.music);
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

const fadeMusic = scene => {
    scene.tweens.add({
        targets: Assets.backgroundMusic,
        volume: 0,
        duration: fadeDuration / 2,
        onComplete: startNextMusic.bind(this, scene),
    });
};

const stopCurrentAndStartNextMusic = scene => {
    if (!Assets.backgroundMusic || scene.scene.key === "home") {
        startNextMusic(scene);
    } else {
        fadeMusic(scene);
    }
};

export { Assets, setButtonClickSound, setupScreenMusic };
