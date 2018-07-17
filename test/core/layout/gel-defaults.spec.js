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
        sandbox.stub(gmiModule, "sendStats");
        sandbox.replace(gmiModule, "gmi", mockGmi);

        sandbox.stub(pause, "create");
        sandbox.stub(settings, "show");
        sandbox.stub(howToPlay, "create");
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe("Exit Button Callback", () => {
        beforeEach(() => {
            gel.config.exit.action();
        });

        it("exits the game using the GMI", () => {
            sandbox.assert.calledOnce(mockGmi.exit);
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click"));
        });
    });

    describe("Home Button Callback", () => {
        beforeEach(() => {
            gel.config.home.action({ game: mockGame });
        });

        it("navigates to the home screen", () => {
            const homeNavigationSpy = mockGame.state.states["current-screen"].navigation.home;
            sandbox.assert.calledOnce(homeNavigationSpy);
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click"));
        });
    });

    describe("Pause Home Callback", () => {
        beforeEach(() => {
            gel.config.pauseHome.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click"));
        });
    });

    describe("Back Callback", () => {
        beforeEach(() => {
            gel.config.back.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click"));
        });
    });

    describe("How To Play Back Callback", () => {
        beforeEach(() => {
            gel.config.howToPlayBack.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click"));
        });
    });

    describe("Audio Off Callback", () => {
        beforeEach(() => {
            gel.config.audioOff.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click"));
        });
    });

    describe("Audio On Callback", () => {
        beforeEach(() => {
            gel.config.audioOn.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click"));
        });
    });

    describe("Settings Button Callback", () => {
        beforeEach(() => {
            gel.config.settings.action();
        });

        it("shows the settings", () => {
            sandbox.assert.calledOnce(settings.show);
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click"));
        });
    });

    describe("Pause Button Callback", () => {
        beforeEach(() => {
            gel.config.pause.action({ game: mockGame });
        });

        it("creates a pause screen", () => {
            sandbox.assert.calledOnce(pause.create.withArgs(false, { game: mockGame }));
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click"));
        });
    });

    describe("Pause No Replay Button Callback", () => {
        beforeEach(() => {
            gel.config.pauseNoReplay.action({ game: mockGame });
        });

        it("creates a pause screen with replay button hidden", () => {
            sandbox.assert.calledOnce(pause.create.withArgs(true, { game: mockGame }));
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click"));
        });
    });

    describe("Previous Button Callback", () => {
        beforeEach(() => {
            gel.config.previous.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click"));
        });
    });

    describe("How To Play Previous Button Callback", () => {
        beforeEach(() => {
            gel.config.howToPlayPrevious.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click"));
        });
    });

    describe("Replay Button Callback", () => {
        beforeEach(() => {
            gel.config.replay.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click"));
        });
    });

    describe("Pause Replay Button Callback", () => {
        beforeEach(() => {
            gel.config.pauseReplay.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click"));
        });
    });

    describe("Play Button Callback", () => {
        beforeEach(() => {
            gel.config.play.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click"));
        });
    });

    describe("Pause Play Button Callback", () => {
        beforeEach(() => {
            gel.config.pausePlay.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click"));
        });
    });

    describe("Next Button Callback", () => {
        beforeEach(() => {
            gel.config.next.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click"));
        });
    });

    describe("How To Play Next Button Callback", () => {
        beforeEach(() => {
            gel.config.howToPlayNext.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click"));
        });
    });

    describe("Achievements Button Callback", () => {
        beforeEach(() => {
            gel.config.achievements.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click"));
        });
    });

    describe("Restart Button Callback", () => {
        beforeEach(() => {
            gel.config.restart.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click"));
        });
    });

    describe("Continue Button Callback", () => {
        beforeEach(() => {
            gel.config.continue.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click"));
        });
    });

    describe("How To Play Button Callback", () => {
        beforeEach(() => {
            gel.config.howToPlay.action({ game: mockGame });
        });

        it("creates a how to play screen", () => {
            sandbox.assert.calledOnce(howToPlay.create.withArgs({ game: mockGame }));
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click"));
        });
    });
});
