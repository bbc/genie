/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as signal from "../core/signal-bus.js";
import { gmi } from "./gmi/gmi.js";
import fp from "../../lib/lodash/fp/fp.js";

export const settingsChannel = "genie-settings";

let game;

export const create = () => {
    const setButtonInteractivity = (game, setting) => {
        const screen = game.state.states[game.state.current];
        const buttons = screen.scene.getLayouts()[0].buttons;

        fp.map(button => {
            button.inputEnabled = setting;
        }, buttons);
    }

    signal.bus.subscribe({
        channel: settingsChannel,
        name: "settings-closed",
        callback: (args) => {
            setButtonInteractivity(args.game, true);
        }
    });

    const onSettingChanged = (key, value) => {
        signal.bus.publish({
            channel: settingsChannel,
            name: key,
            data: value,
        });
    };

    const onSettingsClosed = () => {
        signal.bus.publish({
            channel: settingsChannel,
            name: "settings-closed",
            data: { game }
        });
    };

    return {
        show: game => {
            // get current buttons
            setButtonInteractivity(game, false);

            return gmi.showSettings(onSettingChanged, onSettingsClosed);
        },
        getAllSettings: () => gmi.getAllSettings(),
    };
};

export const setGame = newGame => game = newGame;

// Singleton used by games
export const settings = create();
