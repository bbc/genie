/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";

let firstClick = true;

const getCustomValues = actionKey => {
    const customValues = {
        heartbeat: {
            action_name: "timer",
            action_type: "heartbeat",
        },
        game_loaded: {
            action_name: "game_loaded",
            action_type: true,
        },
        replay: {
            action_name: "game_level",
            action_type: "playagain",
        },
        continue: {
            action_name: "game_level",
            action_type: "continue",
        },
        game_complete: {
            action_name: "game_level",
            action_type: "complete",
        },
    };
    return customValues[actionKey];
};

const getSettingsString = settings => {
    return Object.keys(settings)
        .map(key => {
            return key === "gameData" ? getSettingsString(settings[key]) : key + "-" + settings[key];
        })
        .join("-");
};

export const getValues = (actionKey, settings, visibleLayer) => {
    if (actionKey === "click") {
        actionKey = firstClick ? "game_first_click" : "game_click";
        if (firstClick) {
            firstClick = false;
        }
    }

    const defaultValues = {
        action_name: actionKey,
        game_template: "genie",
        game_screen: visibleLayer,
        game_level_name: null,
        settings_status: getSettingsString(settings),
    };

    return fp.merge(defaultValues, getCustomValues(actionKey, firstClick));
};
