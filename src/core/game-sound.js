const Assets = {
    backgroundMusic: undefined,
    buttonClick: undefined,
};

const setButtonClickSound = (game, audioKey) => {
    Assets.buttonClick = game.add.audio(audioKey);
};

const setupScreenMusic = (game, themeScreenConfig) => {
    if (Assets.backgroundMusic) {
        Assets.backgroundMusic.stop();
    }

    if (!themeScreenConfig || !themeScreenConfig.hasOwnProperty("music")) {
        return;
    }

    const audioKey = themeScreenConfig.music;
    Assets.backgroundMusic = game.add.audio(audioKey);

    Assets.backgroundMusic.loopFull();

    if (Assets.backgroundMusic.usingAudioTag) {
        Assets.backgroundMusic.mute = game.sound.mute;
    }
};

export { Assets, setButtonClickSound, setupScreenMusic };
