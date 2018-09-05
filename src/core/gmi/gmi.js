/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import * as StatsValues from "./stats-values.js";
import * as VisibleLayer from "../visible-layer.js";

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

const startHeartbeat = () => {
    const beatPeriodSec = 15;
    const intervalPeriodMilliSec = beatPeriodSec * 1000;

    // eslint-disable-next-line local-rules/disallow-timers
    setInterval(function beatingHeart() {
        sendStats("heartbeat", { heartbeat_period: beatPeriodSec });
    }, intervalPeriodMilliSec);
};

export const sendStats = (actionKey, additionalParams) => {
    const visibleLayer = VisibleLayer.get(gameInstance, gameContext);
    const statsValues = StatsValues.getValues(actionKey, gmi.getAllSettings(), visibleLayer);
    const params = fp.merge(statsValues, additionalParams);
    gmi.sendStatsEvent(params.action_name, params.action_type, params);
};

export const startStatsTracking = (game, context) => {
    gameInstance = game;
    gameContext = context;
    startHeartbeat();
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
