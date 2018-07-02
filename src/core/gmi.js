export let gmi = {};

export const setGmi = settingsConfig => {
    if (!gmi) {
        gmi = window.getGMI({ settingsConfig });
    }
};
