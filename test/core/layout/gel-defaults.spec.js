import { assert } from "chai";
import * as sinon from "sinon";
import * as howToPlay from "../../../src/components/overlays/how-to-play.js";
import * as gel from "../../../src/core/layout/gel-defaults";
import { settings } from "../../../src/core/settings.js";

describe.only("Layout - Gel Defaults", () => {
    const sandbox = sinon.sandbox.create();
    let mockGame;

    beforeEach(() => {
        mockGame = {
            state: {
                current: "current-screen",
                states: {
                    "current-screen": {
                        navigation: {
                            home: sandbox.spy(),
                        },
                    },
                },
            },
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("Exit Button Callback", () => {
        it("exits the game using the GMI", () => {
            assert.strictEqual(gel.config.exit.action, settings.exit);
        });
    });

    describe("Home Button Callback", () => {
        it("navigates to the home screen", () => {
            const homeNavigationSpy = mockGame.state.states["current-screen"].navigation.home;
            gel.config.home.action({ game: mockGame });
            sandbox.assert.calledOnce(homeNavigationSpy);
        });
    });

    describe("Settings Button Callback", () => {
        it("shows the settings", () => {
            assert.strictEqual(gel.config.settings.action, settings.show);
        });
    });

    describe("Pause Button Callback", () => {
        it("creates a pause screen", () => {
            assert.strictEqual(gel.config.settings.action, pause.create(false));
        });
    });

    describe("PauseNoReplay Button Callback", () => {
        it("creates a pause screen with replay button hidden", () => {
            assert.strictEqual(gel.config.settings.action, pause.create(true));
        });
    });

    describe("HowToPlay Button Callback", () => {
        it("creates a how to play screen", () => {
            assert.strictEqual(gel.config.howToPlay.action, howToPlay.create);
        });
    });
});
