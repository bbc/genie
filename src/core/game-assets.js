const GameAssets = {
    sounds: {},
};

function initGameAssets(game) {
    GameAssets.sounds.buttonClick = game.add.audio("shared/button-click");
}

export { GameAssets, initGameAssets };
