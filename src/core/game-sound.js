/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const Assets = {
    backgroundMusic: undefined,
    buttonClick: undefined,
};

const SOUND_FADE_PERIOD = 1000;
let fadingMusic;

const setButtonClickSound = (scene, audioKey) => {
    Assets.buttonClick = scene.sound.add(audioKey);
};

const setupScreenMusic = (scene, themeScreenConfig = {}) => {
    if (isAlreadyPlaying(themeScreenConfig.music)) return;

    stopCurrentMusic(scene);
    Assets.backgroundMusic = startMusic(scene, themeScreenConfig.music);

    if (Assets.backgroundMusic && Assets.backgroundMusic.usingAudioTag) {
        Assets.backgroundMusic.mute = scene.sound.mute;
    }
};

const isAlreadyPlaying = audioKey => {
    return audioKey && Assets.backgroundMusic && audioKey === Assets.backgroundMusic.name;
};

// Phaser music loop crashes on iOS 9.
// Use this function to loop sounds instead of the Phaser standard way.
const loopMusicStart = (music, fade) => {
    if (fade) {
        fadeIn(music);
    } else {
        music.play();
    }
    music.onStop.addOnce(() => loopMusicStart(music));
};

const loopMusicStop = music => {
    music.onStop.removeAll();
    music.stop();
};

const startMusic = (scene, audioKey) => {
    if (!audioKey) return;

    let music = scene.sound.add(audioKey);

    loopMusicStart(music, !!fadingMusic);

    return music;
};

const fadeIn = music => {
    if (music.isDecoded) {
        music.fadeIn(SOUND_FADE_PERIOD);
    } else {
        music.onDecoded.add(() => loopMusicStart(music));
    }
};

const stopCurrentMusic = scene => {
    if (!Assets.backgroundMusic) {
        if (fadingMusic) {
            fadingMusic.fadeTween.pendingDelete = false;
            fadingMusic.fadeTween.start();
        }
        return;
    }

    if (fadingMusic) {
        loopMusicStop(fadingMusic);
        scene.sound.remove(fadingMusic);
    }

    fadingMusic = Assets.backgroundMusic;

    if (!fadingMusic.isPlaying) {
        loopMusicStop(fadingMusic);
        scene.sound.remove(fadingMusic);
        fadingMusic = undefined;
        return;
    }

    fadingMusic.onFadeComplete.addOnce(() => {
        scene.sound.remove(fadingMusic);
        fadingMusic = undefined;
    });
    fadingMusic.fadeOut(SOUND_FADE_PERIOD / 2);
};

export { Assets, setButtonClickSound, setupScreenMusic, SOUND_FADE_PERIOD };
