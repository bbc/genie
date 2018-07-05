const GameAssets = {
    sounds: {},
};

function initGameAssets(game) {
    GameAssets.sounds.buttonClick = game.add.audio("loadscreen.buttonClick");
    GameAssets.sounds.backgroundMusic = game.add.audio("loadscreen.backgroundMusic");
}

export { GameAssets, initGameAssets };
