/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const assignCustomValues = (scale, button) => {
    const config = button.game.cache.getJSON("config");
    const overrides = config.theme["button-overrides"][button.key];

    Object.keys(overrides).forEach(key => {
        button[key] = scale * overrides[key];
    });
};

export const applyButtonOverrides = (scale, buttons) => {
    buttons.forEach(button => {
        if (button.positionOverride) {
            assignCustomValues(scale, button);
        }
    });
};
