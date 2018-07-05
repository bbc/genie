const assignCustomValues = button => {
    const config = button.game.cache.getJSON("config");
    const overrides = config.theme["button-overrides"][button.key];

    Object.keys(overrides).forEach(key => {
        button[key] = overrides[key];
    });
};

export const applyButtonOverrides = buttons => {
    buttons.forEach(button => {
        if (button.positionOverride) {
            assignCustomValues(button);
        }
    });
};
