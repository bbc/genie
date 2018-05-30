const Create = (x, y, asset) => {
    return Object.freeze({ x, y, asset });
};

const Draw = (game, scene) => {
    return scenery => {
        const sprite = game.add.sprite(scenery.x, scenery.y, scenery.asset);
        sprite.visible = false;
        scene.addToBackground(sprite);
        return sprite;
    };
};

export { Create, Draw };
