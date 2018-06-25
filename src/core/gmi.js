export let gmi;

export const setGmi = newGmi => {
    if (gmi) {
        throw "Gmi has already been set once";
    }
    gmi = newGmi;
};
