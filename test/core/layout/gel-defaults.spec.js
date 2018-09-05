/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import * as sinon from "sinon";
import * as howToPlay from "../../../src/components/overlays/how-to-play.js";
import * as gel from "../../../src/core/layout/gel-defaults.js";
import * as pause from "../../../src/components/overlays/pause.js";
import { settings, settingsChannel } from "../../../src/core/settings.js";
import * as gmiModule from "../../../src/core/gmi/gmi.js";
import * as signal from "../../../src/core/signal-bus.js";

describe("Layout - Gel Defaults", () => {
    const sandbox = sinon.createSandbox();
    let mockGame;
    let mockGmi;

    beforeEach(() => {
        mockGame = {
            sound: {
                mute: false,
            },
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

        mockGmi = { exit: sandbox.stub(), setAudio: sandbox.spy() };
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
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click", { action_type: "exit" }));
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
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click", { action_type: "home" }));
        });
    });

    describe("Pause Home Callback", () => {
        beforeEach(() => {
            gel.config.pauseHome.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click", { action_type: "home" }));
        });
    });

    describe("Back Callback", () => {
        beforeEach(() => {
            gel.config.back.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click", { action_type: "back" }));
        });
    });

    describe("How To Play Back Callback", () => {
        beforeEach(() => {
            gel.config.howToPlayBack.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click", { action_type: "back" }));
        });
    });

    describe("Audio Callback", () => {
        let publishSpy;

        beforeEach(() => {
            publishSpy = sandbox.spy(signal.bus, "publish");
            gel.config.audio.action({ game: mockGame });
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click", { action_type: "audio" }));
        });

        it("sets audio on the GMI", () => {
            sandbox.assert.calledOnce(mockGmi.setAudio.withArgs(false));
        });

        it("mutes the game audio", () => {
            sandbox.assert.calledOnce(
                publishSpy.withArgs({
                    channel: settingsChannel,
                    name: "audio",
                    data: false,
                }),
            );
        });

        it("unmutes the game audio", () => {
            mockGame.sound.mute = true;
            gel.config.audio.action({ game: mockGame });

            sandbox.assert.calledOnce(
                publishSpy.withArgs({
                    channel: settingsChannel,
                    name: "audio",
                    data: true,
                }),
            );
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
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click", { action_type: "settings" }));
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
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click", { action_type: "pause" }));
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
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click", { action_type: "pause" }));
        });
    });

    describe("Replay Button Callback", () => {
        beforeEach(() => {
            gel.config.replay.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click", { action_type: "playagain" }));
        });
    });

    describe("Pause Replay Button Callback", () => {
        beforeEach(() => {
            gel.config.pauseReplay.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click", { action_type: "playagain" }));
        });
    });

    describe("Play Button Callback", () => {
        beforeEach(() => {
            gel.config.play.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click", { action_type: "play" }));
        });
    });

    describe("Pause Play Button Callback", () => {
        beforeEach(() => {
            gel.config.pausePlay.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click", { action_type: "play" }));
        });
    });

    describe("Achievements Button Callback", () => {
        beforeEach(() => {
            gel.config.achievements.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click", { action_type: "achievements" }));
        });
    });

    describe("Restart Button Callback", () => {
        beforeEach(() => {
            gel.config.restart.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click", { action_type: "playagain" }));
        });

        it("sends a replay stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("replay"));
        });
    });

    describe("Continue Game Button Callback", () => {
        beforeEach(() => {
            gel.config.continueGame.action();
        });

        it("sends a click stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click", { action_type: "continue" }));
        });

        it("sends a game_level continue stat to the GMI", () => {
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("continue"));
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
            sandbox.assert.calledOnce(gmiModule.sendStats.withArgs("click", { action_type: "how-to-play" }));
        });
    });
});
