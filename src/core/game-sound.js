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

const setButtonClickSound = (game, audioKey) => {
    Assets.buttonClick = game.add.audio(audioKey);
};

const setupScreenMusic = (game, themeScreenConfig = {}) => {
    if (isAlreadyPlaying(themeScreenConfig.music)) return;

    stopCurrentMusic(game);
    Assets.backgroundMusic = startMusic(game, themeScreenConfig.music);

    if (Assets.backgroundMusic && Assets.backgroundMusic.usingAudioTag) {
        Assets.backgroundMusic.mute = game.sound.mute;
    }
};

const isAlreadyPlaying = audioKey => {
    return audioKey && Assets.backgroundMusic && audioKey === Assets.backgroundMusic.name;
};

const startMusic = (game, audioKey) => {
    if (!audioKey) return;

    let music = game.add.audio(audioKey);

    if (fadingMusic) {
        fadeIn(music);
    } else {
        music.loopFull();
    }

    return music;
};

const fadeIn = music => {
    if (music.isDecoded) {
        music.fadeIn(SOUND_FADE_PERIOD, true);
    } else {
        music.onDecoded.add(() => music.loopFull());
    }
};

const stopCurrentMusic = game => {
    if (!Assets.backgroundMusic) {
        if (fadingMusic) {
            fadingMusic.fadeTween.pendingDelete = false;
            fadingMusic.fadeTween.start();
        }
        return;
    }

    if (fadingMusic) {
        fadingMusic.stop();
        game.sound.remove(fadingMusic);
    }

    fadingMusic = Assets.backgroundMusic;

    if (!fadingMusic.isPlaying) {
        fadingMusic.stop();
        game.sound.remove(fadingMusic);
        fadingMusic = undefined;
        return;
    }

    fadingMusic.onFadeComplete.addOnce(() => {
        game.sound.remove(fadingMusic);
        fadingMusic = undefined;
    });
    fadingMusic.fadeOut(SOUND_FADE_PERIOD / 2);
};

export { Assets, setButtonClickSound, setupScreenMusic, SOUND_FADE_PERIOD };
