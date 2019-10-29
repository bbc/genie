/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import * as layoutHarness from "../../../src/core/qa/layout-harness.js";
import { Pause } from "../../../src/components/overlays/pause";

describe("Pause Overlay", () => {
    let pauseScreen;
    let mockBoundResumeAllFunction;
    let mockData;

    beforeEach(() => {
        layoutHarness.createTestHarnessDisplay = jest.fn();
        mockBoundResumeAllFunction = {
            some: "mock",
        };
        mockData = {
            config: {
                theme: {
                    pause: {
                        showReplayButton: true,
                    },
                    "pause-noreplay": {
                        showReplayButton: false,
                    },
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
        pauseScreen.addLayout = jest.fn();
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

        test("adds a callback to resume all sounds onscreenexit", () => {
            pauseScreen.preload();
            expect(pauseScreen.events.once).toHaveBeenCalledWith("onscreenexit", mockBoundResumeAllFunction);
        });
    });

    describe("create method", () => {
        test("adds a background image", () => {
            pauseScreen.create();
            expect(pauseScreen.add.image).toHaveBeenCalledWith(0, 0, `${pauseScreen.scene.key}.pauseBackground`);
        });

        test("adds a title image", () => {
            pauseScreen.create();
            expect(pauseScreen.add.image).toHaveBeenCalledWith(0, -170, `${pauseScreen.scene.key}.title`);
        });

        test("adds correct gel layout buttons when replay button should be shown", () => {
            pauseScreen.create();
            expect(pauseScreen.addLayout).toHaveBeenCalledWith([
                "home",
                "audio",
                "settings",
                "pausePlay",
                "howToPlay",
                "pauseReplay",
            ]);
        });

        test("adds correct gel layout buttons when replay button should be hidden", () => {
            pauseScreen.scene.key = "pause-noreplay";
            pauseScreen.create();
            expect(pauseScreen.addLayout).toHaveBeenCalledWith(["home", "audio", "settings", "pausePlay", "howToPlay"]);
        });

        test("creates a layout harness with correct params", () => {
            pauseScreen.create();
            expect(layoutHarness.createTestHarnessDisplay).toHaveBeenCalledWith(pauseScreen);
        });
    });
});
