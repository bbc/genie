import fp from "../../lib/lodash/fp/fp.js";
import * as VisibleLayer from "../../src/core/visible-layer.js";

export let gmi = {};

let gameInstance;
let gameContext;

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

export const setGmi = (settingsConfig, windowObj) => {
    gmi = windowObj.getGMI({ settingsConfig });
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
