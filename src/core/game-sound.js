const Assets = {
    backgroundMusic: undefined,
    buttonClick: undefined,
};

const setButtonClick = (game, audioKey) => {
    Assets.buttonClick = game.add.audio(audioKey);
};

const setBackgroundMusic = (game, audioKey) => {
    if (Assets.backgroundMusic) {
        Assets.backgroundMusic.stop();
    }

    Assets.backgroundMusic = game.add.audio(audioKey);
    Assets.backgroundMusic.loopFull();
    if (Assets.backgroundMusic.usingAudioTag) {
        Assets.backgroundMusic.mute = this.game.sound.mute;
    }
    return Assets.backgroundMusic;
};

export { Assets, setBackgroundMusic, setButtonClick };
