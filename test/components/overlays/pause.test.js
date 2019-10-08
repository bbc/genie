/**
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { Pause } from "../../../src/components/overlays/pause";

describe("Pause Overlay", () => {
    let pauseScreen;
    let mockData;

    beforeEach(() => {
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
        pauseScreen.setData(mockData);
        pauseScreen.addLayout = jest.fn();
        pauseScreen.scene = { key: "pause" };
        pauseScreen.add = {
            image: jest.fn(),
        };
    });

    afterEach(() => jest.clearAllMocks());

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
    });
});
