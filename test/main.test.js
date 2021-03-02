/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { settingsChannel } from "../src/core/settings";
import { eventBus } from "../src/core/event-bus";
import { startup } from "../src/core/startup";
import "../src/main";

jest.mock("../src/core/event-bus");
jest.mock("../src/core/startup");

describe("Main", () => {
    test("subscribes to the setting changed event", () => {
        const eventSubscribeCall = eventBus.subscribe.mock.calls[0][0];
        expect(eventSubscribeCall.channel).toBe(settingsChannel);
        expect(eventSubscribeCall.name).toBe("custom1");
        expect(eventSubscribeCall.callback).toEqual(expect.any(Function));
    });

    test("logs an example console log when a setting has been changed", () => {
        jest.spyOn(console, "log").mockImplementation(() => {});
        require("../src/main");
        eventBus.subscribe.mock.calls[0][0].callback("difficult");
        expect(console.log).toHaveBeenCalledWith("Custom 1 setting changed to difficult"); // eslint-disable-line no-console
    });

    test("makes a call to startup with the correct screens", () => {
        const expectedScreens = [
            "home",
            "shop-menu",
            "shop-list",
            "shop-confirm",
            "narrative",
            "character-select",
            "level-select",
            "game",
            "results",
            "how-to-play",
            "pause",
        ];
        const config = startup.mock.calls[0][0];

        expect(Object.keys(config.screens)).toStrictEqual(expectedScreens);
    });

    test("makes a call to startup with the correct settings config", () => {
        const expectedSettings = {
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
        const config = startup.mock.calls[0][0];
        expect(config.settings).toStrictEqual(expectedSettings);
    });
});
