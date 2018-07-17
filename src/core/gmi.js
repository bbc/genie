import fp from "../../lib/lodash/fp/fp.js";
import * as VisibleLayer from "../../src/core/visible-layer.js";

export let gmi = {};
let gameInstance;
let gameContext;

const dedupeGlobalSettings = customSettings => {
    return customSettings.filter(customSettings => {
        return !(customSettings.key === "audio" || customSettings.key === "motion");
    });
};

const addExtraGlobalSettings = (customSettingsObject, settingsConfig) => {
    const extraGlobalSettings = dedupeGlobalSettings(customSettingsObject.settings);
    return settingsConfig.pages[0].settings.concat(extraGlobalSettings);
};

const getDefaultGlobals = () => {
    return {
        pages: [
            {
                title: "Global Settings",
                settings: [
                    {
                        key: "audio",
                        type: "toggle",
                        title: "Audio",
                        description: "Turn off/on sound and music",
                    },
                    {
                        key: "motion",
                        type: "toggle",
                        title: "Motion FX",
                        description: "Turn off/on motion effects",
                    },
                ],
            },
        ],
    };
};

const getStatsParams = actionKey => {
    const defaultParams = {
        action_name: actionKey,
        game_template: "genie",
        game_screen: VisibleLayer.get(gameInstance, gameContext),
        game_level_name: null,
    };
    let customParams = {};

    if (actionKey === "heartbeat") {
        customParams = {
            action_name: "timer",
            action_type: "heartbeat",
        };
    } else if (actionKey === "game_loaded") {
        customParams = { action_type: true };
    }
    return fp.merge(defaultParams, customParams);
};

export const sendStats = (actionKey, additionalParams) => {
    const params = fp.merge(getStatsParams(actionKey), additionalParams);
    gmi.sendStatsEvent(params.action_name, params.action_type, params);
};

export const startHeartbeat = (game, context) => {
    gameInstance = game;
    gameContext = context;

    const beatPeriodSec = 15;
    const intervalPeriodMilliSec = beatPeriodSec * 1000;

    setInterval(function beatingHeart() {
        sendStats("heartbeat", { heartbeat_period: beatPeriodSec });
    }, intervalPeriodMilliSec);
};

export const setGmi = (customSettings, windowObj) => {
    const settingsConfig = getDefaultGlobals();

    if (customSettings && customSettings.pages) {
        customSettings.pages.forEach(customSettingsObject => {
            if (customSettingsObject.title === "Global Settings") {
                settingsConfig.pages[0].settings = addExtraGlobalSettings(customSettingsObject, settingsConfig);
            } else {
                settingsConfig.pages = settingsConfig.pages.concat([customSettingsObject]);
            }
        });
    }

    gmi = windowObj.getGMI({ settingsConfig });
};
