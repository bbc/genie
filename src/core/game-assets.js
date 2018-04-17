const GameAssets = {
    sounds: {},
};

function initGameAssets(game) {
    GameAssets.sounds.buttonClick = game.add.audio("shared/button-click");
    GameAssets.sounds.backgroundMusic = game.add.audio("shared/background-music");
}

export { GameAssets, initGameAssets };
