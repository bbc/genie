const Assets = {
    backgroundMusic: undefined,
    buttonClick: undefined,
};

const SOUND_FADE_PERIOD = 1000;

const setButtonClickSound = (game, audioKey) => {
    Assets.buttonClick = game.add.audio(audioKey);
};

const setupScreenMusic = (game, themeScreenConfig) => {
    stopCurrentMusic();

    if (!themeScreenConfig || !themeScreenConfig.hasOwnProperty("music")) {
        Assets.backgroundMusic = undefined;
        return;
    }

    const audioKey = themeScreenConfig.music;
    setBackgroundMusic(game, audioKey);

    if (Assets.backgroundMusic.usingAudioTag) {
        Assets.backgroundMusic.mute = game.sound.mute;
    }
};

const setBackgroundMusic = (game, audioKey) => {
    if (Assets.backgroundMusic) {
        Assets.backgroundMusic = game.add.audio(audioKey);
        Assets.backgroundMusic.fadeIn(SOUND_FADE_PERIOD, true);
    } else {
        Assets.backgroundMusic = game.add.audio(audioKey);
        Assets.backgroundMusic.loopFull();
    }
};

const stopCurrentMusic = () => {
    if (Assets.backgroundMusic) {
        Assets.backgroundMusic.stop();
    }
};

export { Assets, setButtonClickSound, setupScreenMusic, SOUND_FADE_PERIOD };
