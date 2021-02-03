const nullToUndefined = val => val === null? undefined : val;

export const createBackground = {
    string: (scene, config) => {
        const background = scene.add.image(0, 0, `${scene.assetPrefix}.${config}`);
        const safeArea = scene.layout.getSafeArea({}, false);
        background.setScale(safeArea.width / background.width, safeArea.height / background.height);
        return background;
    },
    null: () => ({}),
    object: (scene, config) => {
        const { width, height, x, y } = scene.layout.getSafeArea({}, false);
        return scene.add.rexNinePatch({
            x: width / 2 + x,
            y: height / 2 + y,
            width,
            height,
            key: `${scene.assetPrefix}.${config.key}`,
            columns: config.columns.map(nullToUndefined),
            rows: config.rows.map(nullToUndefined),
        });
    },
};

export const resizeBackground = {
    Image: (background, scene) => {
        const safeArea = scene.layout.getSafeArea({}, false);
        background.setScale(safeArea.width / background.width, safeArea.height / background.height);
    },
    Object: () => {},
    NinePatch: (background, scene) => {
        const { width, height, x, y } = scene.layout.getSafeArea({}, false);

        console.log([width, height, x, y])

        background.x = width / 2 + x;
        background.y = height / 2 + y;
        background.resize(width, height);
    },
};
