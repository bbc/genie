import { assert } from "chai";
import * as sinon from "sinon";
import * as howToPlay from "../../../src/components/overlays/how-to-play.js";
import * as gel from "../../../src/core/layout/gel-defaults";
import * as pause from "../../../src/components/overlays/pause.js";
import { settings } from "../../../src/core/settings.js";
import * as gmiModule from "../../../src/core/gmi.js";

describe("Layout - Gel Defaults", () => {
    const sandbox = sinon.createSandbox();
    let mockGame;
    let mockGmi;

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

        mockGmi = { exit: sandbox.stub() };
        sandbox.stub(gmiModule, "setGmi").returns(mockGmi);
        sandbox.replace(gmiModule, "gmi", mockGmi);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("Exit Button Callback", () => {
        it("exits the game using the GMI", () => {
            assert.strictEqual(gel.config.exit.action, gmiModule.exit);
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
            pause.create = sandbox.spy();
            gel.config.pause.action({ game: mockGame });
            sandbox.assert.calledOnce(pause.create.withArgs(false, { game: mockGame }));
        });
    });

    describe("PauseNoReplay Button Callback", () => {
        it("creates a pause screen with replay button hidden", () => {
            pause.create = sandbox.spy();
            gel.config.pauseNoReplay.action({ game: mockGame });
            sandbox.assert.calledOnce(pause.create.withArgs(true, { game: mockGame }));
        });
    });

    describe("HowToPlay Button Callback", () => {
        it("creates a how to play screen", () => {
            assert.strictEqual(gel.config.howToPlay.action, howToPlay.create);
        });
    });
});
