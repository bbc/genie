export let gmi = {};

export const setGmi = settingsConfig => {
    gmi = window.getGMI({ settingsConfig });
};
