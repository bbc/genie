/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import * as OverlayLayout from "../../../src/components/overlays/overlay-layout.js";
import * as Pause from "../../../src/components/overlays/pause";
import * as GameSound from "../../../src/core/game-sound";
import * as signal from "../../../src/core/signal-bus.js";

describe("Pause Overlay", () => {
    let mockGame;
    let mockScreen;
    let mockGelButtons;
    let mockLayoutDestroy;
    let mockBackground;
    let mockOverlayLayout;

    const pauseCreate = Pause.create(false);

    beforeEach(() => {
        jest.spyOn(signal.bus, "subscribe");
        jest.spyOn(signal.bus, "publish");
        mockBackground = { destroy: jest.fn() };
        mockOverlayLayout = {
            addBackground: jest.fn().mockImplementation(() => mockBackground),
            disableExistingButtons: jest.fn(),
            moveGelButtonsToTop: jest.fn(),
        };
        jest.spyOn(OverlayLayout, "create").mockImplementation(() => mockOverlayLayout);

        mockGelButtons = { destroy: jest.fn() };
        jest.spyOn(document, "getElementById").mockImplementation(() => ({ focus: () => {} }));
        mockScreen = {
            scene: {
                addToBackground: jest.fn().mockImplementation(() => mockLayoutDestroy),
                addLayout: jest.fn().mockImplementation(() => mockGelButtons),
                removeLast: jest.fn(),
            },
            context: { popupScreens: [] },
            next: jest.fn(),
            navigation: {
                restart: jest.fn(),
                home: jest.fn(),
            },
            overlayClosed: {
                dispatch: jest.fn(),
            },
        };

        mockGame = {
            add: { image: jest.fn().mockImplementation((x, y, imageName) => imageName) },
            state: { current: "pauseScreen", states: { pauseScreen: mockScreen } },
            sound: { pauseAll: jest.fn() },
            paused: false,
            canvas: { focus: jest.fn() },
        };

        GameSound.Assets.backgroundMusic = {
            pause: jest.fn(),
            resume: jest.fn(),
        };
    });

    afterEach(() => jest.clearAllMocks());

    describe("Pause Functionality", () => {
        test("adds pause to the popup screens", () => {
            pauseCreate({ game: mockGame });
            expect(mockScreen.context.popupScreens).toEqual(["pause"]);
        });

        test("pauses the game", () => {
            pauseCreate({ game: mockGame });
            expect(mockGame.paused).toBe(true);
        });

        test("pauses the background music if there is music to pause", () => {
            pauseCreate({ game: mockGame });
            expect(GameSound.Assets.backgroundMusic.pause).toHaveBeenCalledTimes(1);
        });

        test("does not pause the background music if there is no music to pause", () => {
            GameSound.Assets.backgroundMusic = undefined;
            expect(() => pauseCreate({ game: mockGame })).not.toThrow();
        });
    });

    describe("Create method", () => {
        test("adds the screen to the current screens", () => {
            pauseCreate({ game: mockGame });
            expect(mockGame.state.states[mockGame.state.current]).toEqual(mockScreen);
        });

        test("creates a new overlay layout manager", () => {
            pauseCreate({ game: mockGame });
            expect(OverlayLayout.create).toHaveBeenCalledWith(mockGame.state.states[mockGame.state.current]);
        });

        test("adds a background image and passes it to the overlay manager", () => {
            pauseCreate({ game: mockGame });
            expect(mockGame.add.image).toHaveBeenCalledWith(0, 0, "pause.pauseBackground");
            expect(mockOverlayLayout.addBackground).toHaveBeenCalledWith("pause.pauseBackground");
        });

        test("adds GEL buttons", () => {
            pauseCreate({ game: mockGame });
            const expectedAddLayoutCall = ["pauseReplay", "pauseHome", "audio", "settings", "pausePlay", "howToPlay"];
            expect(mockScreen.scene.addLayout).toHaveBeenCalledWith(expectedAddLayoutCall);
        });

        test("adds GEL buttons without a replay button if requested", () => {
            Pause.create(true, { game: mockGame });
            const expectedAddLayoutCall = ["pauseHome", "audio", "settings", "pausePlay", "howToPlay"];
            expect(mockScreen.scene.addLayout).toHaveBeenCalledWith(expectedAddLayoutCall);
        });
    });

    describe("Signals", () => {
        test("adds custom signal subscriptions to certain GEL buttons", () => {
            pauseCreate({ game: mockGame });
            expect(signal.bus.subscribe).toHaveBeenCalledTimes(3);
            expect(signal.bus.subscribe.mock.calls[0][0].channel).toEqual("pause-gel-buttons");
            expect(signal.bus.subscribe.mock.calls[0][0].name).toEqual("play");
            expect(signal.bus.subscribe.mock.calls[1][0].channel).toEqual("pause-gel-buttons");
            expect(signal.bus.subscribe.mock.calls[1][0].name).toEqual("home");
            expect(signal.bus.subscribe.mock.calls[2][0].channel).toEqual("pause-gel-buttons");
            expect(signal.bus.subscribe.mock.calls[2][0].name).toEqual("replay");
        });

        test("adds custom signal subscriptions to certain GEL buttons, when the replay button is not present", () => {
            Pause.create(true, { game: mockGame });
            expect(signal.bus.subscribe).toHaveBeenCalledTimes(2);
            expect(signal.bus.subscribe.mock.calls[0][0].channel).toEqual("pause-gel-buttons");
            expect(signal.bus.subscribe.mock.calls[0][0].name).toEqual("play");
            expect(signal.bus.subscribe.mock.calls[1][0].channel).toEqual("pause-gel-buttons");
            expect(signal.bus.subscribe.mock.calls[1][0].name).toEqual("home");
        });

        test("destroys the pause screen when the play button is clicked", () => {
            pauseCreate({ game: mockGame });
            const clickPlayButton = signal.bus.subscribe.mock.calls[0][0].callback;
            clickPlayButton();

            expect(mockGame.paused).toBe(false);
            expect(mockGelButtons.destroy).toHaveBeenCalledTimes(1);
            expect(mockBackground.destroy).toHaveBeenCalledTimes(1);
            expect(GameSound.Assets.backgroundMusic.resume).toHaveBeenCalledTimes(1);
        });

        test("removes subscribed-to channel for this overlay on destroy", () => {
            jest.spyOn(signal.bus, "removeChannel");
            pauseCreate({ game: mockGame });
            const destroy = signal.bus.subscribe.mock.calls[0][0].callback;
            destroy();
            expect(signal.bus.removeChannel).toHaveBeenCalledWith("pause-gel-buttons");
        });

        test("destroys the pause screen when the replay button is clicked", () => {
            pauseCreate({ game: mockGame });
            const cickReplayButton = signal.bus.subscribe.mock.calls[2][0].callback;
            cickReplayButton();
            expect(mockGame.paused).toBe(false);
            expect(mockGelButtons.destroy).toHaveBeenCalledTimes(1);
            expect(mockBackground.destroy).toHaveBeenCalledTimes(1);
            expect(GameSound.Assets.backgroundMusic.resume).toHaveBeenCalledTimes(1);
        });

        test("restarts the game when the replay button is clicked", () => {
            mockScreen.transientData = {
                characterSelected: 1,
            };
            pauseCreate({ game: mockGame });
            const cickReplayButton = signal.bus.subscribe.mock.calls[2][0].callback;
            cickReplayButton();
            const actualRestartArgs = mockScreen.navigation.restart.mock.calls[0][0];
            const expectedRestartArgs = { characterSelected: 1 };
            expect(actualRestartArgs).toEqual(expectedRestartArgs);
        });

        test("destroys the pause screen when the home button is clicked", () => {
            pauseCreate({ game: mockGame });
            const clickHomeButton = signal.bus.subscribe.mock.calls[1][0].callback;
            clickHomeButton();
            expect(mockGame.paused).toBe(false);
            expect(mockGelButtons.destroy).toHaveBeenCalledTimes(1);
            expect(mockBackground.destroy).toHaveBeenCalledTimes(1);
            expect(GameSound.Assets.backgroundMusic.resume).toHaveBeenCalledTimes(1);
        });

        test("navigates home when the home button is clicked", () => {
            pauseCreate({ game: mockGame });
            const clickHomeButton = signal.bus.subscribe.mock.calls[1][0].callback;
            clickHomeButton();
            expect(mockScreen.navigation.home).toHaveBeenCalledTimes(1);
        });

        test("dispatches a signal to close the overlay without firing a page stat on destroy", () => {
            pauseCreate({ game: mockGame });
            const destroy = signal.bus.subscribe.mock.calls[0][0].callback;
            destroy();
            expect(signal.bus.publish).toHaveBeenCalledWith({
                channel: "overlays",
                name: "overlay-closed",
                data: { firePageStat: false },
            });
        });

        test("sets background music pause position to zero if it exists and has overrun the duration (See CGPROD-1167)", () => {
            pauseCreate({ game: mockGame });
            const destroy = signal.bus.subscribe.mock.calls[0][0].callback;

            GameSound.Assets.backgroundMusic.duration = 5;
            GameSound.Assets.backgroundMusic.pausedPosition = 10000;

            destroy();

            expect(GameSound.Assets.backgroundMusic.pausedPosition).toEqual(0);
        });

        test("does not sets background music pause position if it does not exist", () => {
            GameSound.Assets.backgroundMusic = undefined;
            pauseCreate({ game: mockGame });
            const destroy = signal.bus.subscribe.mock.calls[0][0].callback;
            expect(() => destroy()).not.toThrow();
        });
    });
});
