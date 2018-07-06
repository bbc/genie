import { assert } from "chai";
import * as sinon from "sinon";

import { gmi, setGmi } from "../../src/core/gmi.js";

describe("GMI", () => {
    let sandbox;
    let defaultSettings;
    let fakeWindow;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
        defaultSettings = {
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
        fakeWindow = { getGMI: sandbox.stub().returns("gmi object") };
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("instantiates GMI with the default settings", () => {
        setGmi({}, fakeWindow);
        const actualSettings = fakeWindow.getGMI.getCall(0).args[0];

        assert.deepEqual(actualSettings, { settingsConfig: defaultSettings });
    });

    it("instantiates GMI with custom settings if given", () => {
        const customSettings = {
            pages: [
                {
                    title: "Custom Settings",
                    settings: [
                        {
                            key: "colourblind",
                            type: "toggle",
                            title: "Colourblind mode",
                            description: "Turn off/on colour palatte with increased constrast",
                        },
                    ],
                },
            ],
        };

        setGmi(customSettings, fakeWindow);
        const actualSettings = fakeWindow.getGMI.getCall(0).args[0];
        defaultSettings.pages.push(customSettings.pages[0]);
        assert.deepEqual(actualSettings, { settingsConfig: defaultSettings });
    });

    it("instantiates GMI with extra global settings if given (without overriding the existing ones)", () => {
        const customSettings = {
            pages: [
                {
                    title: "Global Settings",
                    settings: [
                        {
                            key: "audio",
                            type: "toggle",
                            title: "Audio",
                            description: "Turn off/on sound and music override (bad)",
                        },
                        {
                            key: "subtitles",
                            type: "toggle",
                            title: "Subtitles",
                            description: "Turn off/on subtitles",
                        },
                    ],
                },
                {
                    title: "Custom Settings",
                    settings: [
                        {
                            key: "colourblind",
                            type: "toggle",
                            title: "Colourblind mode",
                            description: "Turn off/on colour palatte with increased constrast",
                        },
                    ],
                },
            ],
        };

        setGmi(customSettings, fakeWindow);
        const actualSettings = fakeWindow.getGMI.getCall(0).args[0];
        defaultSettings.pages[0].settings.push(customSettings.pages[0].settings[1]);
        defaultSettings.pages.push(customSettings.pages[1]);
        assert.deepEqual(actualSettings, { settingsConfig: defaultSettings });
    });

    it("returns the GMI instance", () => {
        setGmi(defaultSettings, fakeWindow);
        assert.equal(gmi, "gmi object");
    });
});
