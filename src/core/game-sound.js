const Assets = {
    backgroundMusic: undefined,
    buttonClick: undefined,
};

const SOUND_FADE_PERIOD = 1000;
let fadingMusic;

const setButtonClickSound = (game, audioKey) => {
    Assets.buttonClick = game.add.audio(audioKey);
};

const setupScreenMusic = (game, themeScreenConfig) => {
    let audioKey;

    if (themeScreenConfig) {
        audioKey = themeScreenConfig.music;
    }

    if (Assets.backgroundMusic && audioKey && audioKey === Assets.backgroundMusic.name) {
        return;
    }

    stopCurrentMusic(game);

    if (!audioKey) {
        Assets.backgroundMusic = undefined;
        return;
    }

    Assets.backgroundMusic = startMusic(game, audioKey);

    if (Assets.backgroundMusic.usingAudioTag) {
        Assets.backgroundMusic.mute = game.sound.mute;
    }
};

const startMusic = (game, audioKey) => {
    const music = game.add.audio(audioKey);

    if (fadingMusic) {
        music.fadeIn(SOUND_FADE_PERIOD, true);
    } else {
        music.loopFull();
    }
    return music;
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
    fadingMusic.onFadeComplete.addOnce(() => {
        game.sound.remove(fadingMusic);
    });
    fadingMusic.fadeOut(SOUND_FADE_PERIOD / 2);
};

export { Assets, setButtonClickSound, setupScreenMusic, SOUND_FADE_PERIOD };
