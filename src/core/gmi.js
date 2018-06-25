export let gmi;

export const setGmi = settingsConfig => {
    if (gmi) {
        throw "Gmi has already been set once";
    }

    gmi = window.getGMI({ settingsConfig });
};
