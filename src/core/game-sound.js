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

const startMusic = (game, audioKey) => {
    if (!audioKey) return;

    let music = game.add.audio(audioKey);

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

const stopCurrentMusic = game => {
    if (!Assets.backgroundMusic) {
        if (fadingMusic) {
            fadingMusic.fadeTween.pendingDelete = false;
            fadingMusic.fadeTween.start();
        }
        return;
    }

    if (fadingMusic) {
        loopMusicStop(fadingMusic);
        game.sound.remove(fadingMusic);
    }

    fadingMusic = Assets.backgroundMusic;

    if (!fadingMusic.isPlaying) {
        loopMusicStop(fadingMusic);
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
