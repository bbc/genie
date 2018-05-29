const Create = (x, y, asset) => {
    return Object.freeze({
        x: x,
        y: y,
        asset: asset,
    });
};

const Draw = (game, addToBackground) => {
    return scenery => {
        const sprite = game.add.sprite(scenery.x, scenery.y, scenery.asset);
        sprite.visible = false;
        addToBackground(sprite);
        return sprite;
    };
};

export { Create, Draw };
