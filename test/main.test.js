/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { Home } from "../src/components/home";
import { Results } from "../src/components/results";
import { Select } from "../src/components/select";
import { GameTest } from "../src/components/test-screens/game";
import { Pause } from "../src/components/overlays/pause";
import { settingsChannel } from "../src/core/settings";
import * as event from "../src/core/event-bus";
import { startup } from "../src/core/startup";
import "../src/main";

jest.mock("../src/core/event-bus");
jest.mock("../src/core/startup.js");

describe("Main", () => {
    test("subscribes to the setting changed event", () => {
        const eventSubscribeCall = event.bus.subscribe.mock.calls[0][0];
        expect(eventSubscribeCall.channel).toBe(settingsChannel);
        expect(eventSubscribeCall.name).toBe("custom1");
        expect(eventSubscribeCall.callback).toEqual(expect.any(Function));
    });

    test("logs an example console log when a setting has been changed", () => {
        jest.spyOn(console, "log").mockImplementation(() => {});
        require("../src/main");
        event.bus.subscribe.mock.calls[0][0].callback("difficult");
        expect(console.log).toHaveBeenCalledWith("Custom 1 setting changed to difficult"); // eslint-disable-line no-console
    });

    test("makes a call to startup with the correct screen config", () => {
        const expectedScreenConfig = {
            home: {
                scene: Home,
                routes: {
                    next: "character-select",
                },
            },
            "character-select": {
                scene: Select,
                routes: {
                    next: "level-select",
                    home: "home",
                },
            },
            "level-select": {
                scene: Select,
                routes: {
                    next: "game",
                    home: "home",
                },
            },
            game: {
                scene: GameTest,
                settings: {
                    physics: {
                        default: "arcade",
                        arcade: {},
                    },
                },
                routes: {
                    next: "results",
                    home: "home",
                    restart: "game",
                },
            },
            results: {
                scene: Results,
                routes: {
                    next: "home",
                    game: "game",
                    restart: "game",
                    home: "home",
                },
            },
            "how-to-play": {
                scene: Select,
                routes: {
                    home: "home",
                },
            },
            pause: {
                scene: Pause,
                routes: {
                    home: "home",
                },
            },
        };
        const actualScreenConfig = startup.mock.calls[0][0];
        expect(actualScreenConfig).toStrictEqual(expectedScreenConfig);
    });

    test("makes a call to startup with the correct settings config", () => {
        const expectedSettingsConfig = {
            pages: [
                {
                    title: "Custom Settings",
                    settings: [
                        {
                            key: "custom1",
                            type: "toggle",
                            title: "Custom setting",
                            description: "Description of custom setting",
                        },
                    ],
                },
            ],
        };
        const actualSettingsConfig = startup.mock.calls[0][1];
        expect(actualSettingsConfig).toStrictEqual(expectedSettingsConfig);
    });
});
