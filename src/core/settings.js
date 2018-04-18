import fp from "../lib/lodash/fp/fp.js";

export const create = () => {
    let gmi;
    let closeCallback;

    const defaults = {
        audio: value => gmi.setAudio(value),
        motion: value => gmi.setMotion(value),
        subtitles: value => gmi.setSubtitles(value),
    };

    let keyMap = Object.assign({}, defaults);

    const dispatchSetting = ([key, value]) => {
        console.log("------------------");
        console.log(keyMap.toString());
        console.log(key);

        keyMap[key](value);
    };
    const onSettingChanged = fp.flow(fp.toPairs, fp.map(dispatchSetting));

    const checkCloseCallback = () => {
        if (!closeCallback) {
            throw "settings closed callback has not been set via 'setCloseCallback' in settings.js";
        }
    };

    const checkGmi = () => {
        if (!gmi) {
            throw "gmi has not been initialised in settings.js";
        }
    };

    const onSettingsClosed = fp.flow(checkCloseCallback, () => {
        closeCallback();
    });

    const add = (key, callback) => {
        if (keyMap[key]) {
            throw `settings callback for "${key}" has already been set`;
        } else {
            keyMap[key] = callback;
        }
    };

    const setGmi = newGmi => (gmi = newGmi);
    const setCloseCallback = callback => (closeCallback = callback);

    const callGmi = () => gmi.showSettings(onSettingChanged, onSettingsClosed);

    const show = fp.flow(checkGmi, callGmi);

    return {
        add,
        setGmi,
        setCloseCallback,
        show,
    };
};

// Singleton used by games
export const settings = create();
