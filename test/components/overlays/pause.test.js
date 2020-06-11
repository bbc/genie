/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Pause } from "../../../src/components/overlays/pause";

describe("Pause Overlay", () => {
    let pauseScreen;
    let mockBoundResumeAllFunction;
    let mockData;

    beforeEach(() => {
        mockBoundResumeAllFunction = {
            some: "mock",
        };
        mockData = {
            parentScreens: [{ scene: { key: "level-select" } }],
            navigation: {
                "level-select": { routes: { restart: "home" } },
                pause: { routes: { select: "level-select" } },
            },
            config: {
                theme: {
                    pause: {},
                    game: {},
                },
            },
        };

        pauseScreen = new Pause();
        pauseScreen.sound = {
            pauseAll: jest.fn(),
            resumeAll: {
                bind: () => mockBoundResumeAllFunction,
            },
        };
        pauseScreen.events = { once: jest.fn() };
        pauseScreen.setData(mockData);
        pauseScreen.setLayout = jest.fn();
        pauseScreen.scene = { key: "pause" };
        pauseScreen.add = {
            image: jest.fn(),
        };
    });

    afterEach(() => jest.clearAllMocks());

    describe("preload method", () => {
        test("pauses all sounds", () => {
            pauseScreen.preload();
            expect(pauseScreen.sound.pauseAll).toHaveBeenCalled();
        });

        test("adds a callback to resume all sounds on shutdown", () => {
            pauseScreen.preload();
            expect(pauseScreen.events.once).toHaveBeenCalledWith("shutdown", mockBoundResumeAllFunction);
        });
    });

    describe("create method", () => {
        test("adds correct gel layout buttons when replay button should be shown", () => {
            mockData.config.theme.game.achievements = true;
            pauseScreen.create();
            expect(pauseScreen.setLayout).toHaveBeenCalledWith([
                "home",
                "audio",
                "settings",
                "pausePlay",
                "howToPlay",
                "achievements",
                "levelSelect",
                "pauseReplay",
            ]);
        });

        test("adds correct gel layout buttons when achievement  button should be shown", () => {
            mockData.navigation["pause"] = { routes: {} };
            pauseScreen.create();
            expect(pauseScreen.setLayout).toHaveBeenCalledWith([
                "home",
                "audio",
                "settings",
                "pausePlay",
                "howToPlay",
                "pauseReplay",
            ]);
        });

        test("adds correct gel layout buttons when select button should be shown", () => {
            mockData.navigation["level-select"] = { routes: {} };
            pauseScreen.create();
            expect(pauseScreen.setLayout).toHaveBeenCalledWith([
                "home",
                "audio",
                "settings",
                "pausePlay",
                "howToPlay",
                "levelSelect",
            ]);
        });

        test("adds correct gel layout buttons when select and replay button should be shown", () => {
            pauseScreen.create();
            expect(pauseScreen.setLayout).toHaveBeenCalledWith([
                "home",
                "audio",
                "settings",
                "pausePlay",
                "howToPlay",
                "levelSelect",
                "pauseReplay",
            ]);
        });

        test("adds correct gel layout buttons when replay button should be hidden", () => {
            mockData.navigation["level-select"] = { routes: {} };
            mockData.navigation["pause"] = { routes: {} };
            pauseScreen.create();
            expect(pauseScreen.setLayout).toHaveBeenCalledWith(["home", "audio", "settings", "pausePlay", "howToPlay"]);
        });
    });
});
