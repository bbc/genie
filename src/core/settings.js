let gmi;
let closeCallback;

export const initGmi = newGmi => (gmi = newGmi);
export const setCloseCallback = callback => (closeCallback = callback);

const defaults = {
    audio: value => gmi.setAudio(value),
    motion: value => gmi.setMotion(value),
    subtitles: value => gmi.setSubtitles(value),
};

let keyMap = Object.assign({}, defaults);

const onSettingChanged = (key, value) => keyMap[key](value);

const onSettingsClosed = () => {
    if (!closeCallback) {
        throw "settings closed callback has not been set via 'setCloseCallback' in settings.js";
    }
};

const throwIfNoGmi = () => {
    if (!gmi) {
        throw "gmi has not been initialised in settings.js";
    }
};

export const show = () => {
    throwIfNoGmi();
    gmi.showSettings(onSettingChanged, onSettingsClosed);
};

export const add = (key, callback) => {
    if (keyMap[key]) {
        throw `settings callback for "${key}" has already been set`;
    } else {
        keyMap[key] = callback;
    }
};
