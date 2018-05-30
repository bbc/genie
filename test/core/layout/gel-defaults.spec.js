import { assert } from "chai";
import * as sinon from "sinon";

import * as settings from "../../../src/core/settings.js";
import * as pause from "../../../src/components/overlays/pause.js";
import * as howToPlay from "../../../src/components/overlays/how-to-play.js";
import * as gel from "../../../src/core/layout/gel-defaults";

describe("Layout - Gel Defaults", () => {
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
        it("throws an error if the GMI has not been initialised", () => {
            assert.throw(gel.config.exit.action, "gmi has not been initialised in gel-defaults");
        });

        it("exits the game using the GMI", () => {
            const gmiSpy = sandbox.spy();
            gel.setGmi({ exit: gmiSpy });
            gel.config.exit.action();
            sandbox.assert.calledOnce(gmiSpy);
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
            settings.show = sandbox.spy();
            gel.config.settings.action({ game: mockGame });
            sandbox.assert.calledOnce(settings.show);
        });
    });

    describe("Pause Button Callback", () => {
        it("creates a pause screen", () => {
            sandbox.stub(pause, "create");
            gel.config.pause.action({ game: mockGame });
            sandbox.assert.calledOnce(pause.create);
        });
    });

    describe("PauseNoReplay Button Callback", () => {
        it("creates a pause screen", () => {
            sandbox.stub(pause, "create");
            gel.config.pauseNoReplay.action({ game: mockGame });
            sandbox.assert.calledOnce(pause.create.withArgs({ game: mockGame }, true));
        });
    });

    describe("HowToPlay Button Callback", () => {
        it("creates a how to play screen", () => {
            sandbox.stub(howToPlay, "create");
            gel.config.howToPlay.action({ game: mockGame });
            sandbox.assert.calledOnce(howToPlay.create);
        });
    });
});
