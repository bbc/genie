/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const style = {
    color: "#FFF",
    backgroundColor: "#000",
    fontSize: "12px",
    fontFamily: "Arial",
    strokeThickness: 1,
    resolution: 2,
    padding: {
        left: 4,
        right: 4,
        top: 1,
        bottom: 4,
    },
};

const updateCoordsFn = (coords, handle) => rect => {
    coords.text = `${rect.x}, ${rect.y}, ${rect.width}, ${rect.height}`;
    coords.x = rect.x - rect.width / 2;
    coords.y = rect.y - rect.height / 2;

    handle.x = rect.x - 5 + rect.width / 2;
    handle.y = rect.y - 5 + rect.height / 2;
};

export const createElements = scene => {
    const rect = scene.add
        .rectangle(0, 0, 100, 100, 0x000000, 0x000000)
        .setStrokeStyle(1, 0x000000)
        .setInteractive({ draggable: true, useHandCursor: true });

    const handle = scene.add
        .rectangle(45, 45, 10, 10, 0x000000)
        .setInteractive({ draggable: true, useHandCursor: true });

    const coords = scene.add.text(0, 0, " ", style);
    const legend = scene.add.text(0, 100, "CURSOR KEYS: MOVE\n+CTRL: SIZE\n+SHIFT: FASTER", style).setOrigin(0.5, 0);

    const updateCoords = updateCoordsFn(coords, handle);

    const toggleUi = () => {
        const visible = !rect.visible;
        [rect, coords, legend, handle].forEach(o => (o.visible = visible));
        return visible;
    };

    toggleUi();

    return { rect, coords, legend, handle, updateCoords, toggleUi };
};
