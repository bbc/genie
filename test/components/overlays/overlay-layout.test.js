/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createMockGmi } from "../../mock/gmi";

import * as OverlayLayout from "../../../src/components/overlays/overlay-layout";

describe("Overlay Layout", () => {
    let mockLayouts;
    let mockScreen;
    let mockGmi;

    beforeEach(() => {
        mockLayouts = [
            {
                buttons: {
                    audio: {
                        input: { enabled: true },
                        update: jest.fn(),
                        name: "audio",
                    },
                    settings: {
                        input: { enabled: false },
                        update: jest.fn(),
                        name: "audio",
                    },
                },
            },
        ];

        mockScreen = {
            context: { popupScreens: ["pause", "how-to-play"] },
            scene: {
                getLayouts: jest.fn().mockImplementation(() => mockLayouts),
                addToBackground: jest.fn(),
            },
            visibleLayer: "how-to-play",
        };

        mockGmi = { setStatsScreen: jest.fn() };
        createMockGmi(mockGmi);
    });

    afterEach(() => jest.clearAllMocks());

    describe("Creation", () => {
        test("sets the stats screen if the current screen is not the pause screen", () => {
            OverlayLayout.create(mockScreen);
            expect(mockGmi.setStatsScreen).toHaveBeenCalledWith(mockScreen.visibleLayer);
        });

        test("does not set the stats screen if the current screen is the pause screen", () => {
            mockScreen.visibleLayer = "pause";
            OverlayLayout.create(mockScreen);
            expect(mockGmi.setStatsScreen).not.toHaveBeenCalled();
        });
    });

    describe("addBackground method", () => {
        test("adds a background image and positions it in the correct order", () => {
            const overlayLayout = OverlayLayout.create(mockScreen);
            const mockBackgroundImage = { inputEnabled: false, input: {} };
            overlayLayout.addBackground(mockBackgroundImage);

            expect(mockBackgroundImage.inputEnabled).toBe(true);
            expect(mockBackgroundImage.input.priorityID).toBe(1002);
            expect(mockScreen.scene.addToBackground.mock.calls[0][0]).toEqual(mockBackgroundImage);
        });
    });

    describe("moveGelButtonsToTop method", () => {
        test("moves buttons to the top layer", () => {
            const overlayLayout = OverlayLayout.create(mockScreen);
            const mockGelLayout = {
                buttons: {
                    audio: {
                        update: jest.fn(),
                        input: { priorityID: 0 },
                        parent: {
                            updateTransform: jest.fn(),
                            parent: { updateTransform: jest.fn() },
                        },
                    },
                },
            };
            overlayLayout.moveGelButtonsToTop(mockGelLayout);
            expect(mockGelLayout.buttons.audio.input.priorityID).toEqual(1003);
            expect(mockGelLayout.buttons.audio.parent.updateTransform).toHaveBeenCalledTimes(1);
            expect(mockGelLayout.buttons.audio.parent.parent.updateTransform).toHaveBeenCalledTimes(1);
            expect(mockGelLayout.buttons.audio.update).toHaveBeenCalledTimes(1);
        });
    });

    describe("moveToTop method", () => {
        test("moves an item to the top layer", () => {
            const overlayLayout = OverlayLayout.create(mockScreen);
            const mockItem = {
                inputEnabled: false,
                input: { priorityID: 0 },
            };
            overlayLayout.moveToTop(mockItem);
            expect(mockItem.inputEnabled).toBe(true);
            expect(mockItem.input.priorityID).toBe(1003);
        });
    });
});
