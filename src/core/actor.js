const Create = (x, y, asset) => {
    return Object.freeze({
        x: 0,
        y: 0,
        asset,
    });
};

const Draw = (createSprite, addToBackground) => {
    return actor => {
        const sprite = createSprite(actor.x, actor.y, actor.asset);
        addToBackground(sprite);
        return sprite;
    };
};

export { Create, Draw };
