/**
 * @module core/layout/scrollable-list-covers
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createCovers, resizeCovers } from "../../../../src/components/shop/scrollable-list/scrollable-list-covers.js";

describe("Scrollable list covers", () => {
    let mockConfig;
    let mockScene;
    let mockWidth;
    let mockScrollablePanel;
    let mockImage;
    let mockSafeArea;
    let mockSetScale;
    let mockSetX;
    let mockSetY;

    afterEach(jest.clearAllMocks);
    beforeEach(() => {
        mockScrollablePanel = {
            getChildrenWidth: jest.fn(() => mockWidth),
        };
        mockSafeArea = { width: 200, height: 200, centerX: -150, centerY: 0, y: -100 };
        mockConfig = {
            x: 0,
            y: 0,
            outerPadFactor: 1,
            top: { key: "mock-shop-list.listCoverTop" },
            bottom: { key: "mock-shop-list.listCoverBottom" },
        };
        mockScene = {
            config: {
                listCovers: {},
            },
            add: {
                image: jest.fn(() => mockImage),
                rectangle: jest.fn(),
                text: jest.fn(),
            },
            layout: {
                getSafeArea: jest.fn(() => mockSafeArea),
            },
        };
        mockSetScale = jest.fn(() => mockImage);
        mockSetX = jest.fn(() => mockImage);
        mockSetY = jest.fn(() => mockImage);
        mockImage = {
            setX: mockSetX,
            setY: mockSetY,
            setScale: mockSetScale,
        };
    });

    describe("createCovers", () => {
        afterEach(jest.clearAllMocks);
        test("creates covers for top and bottom images", () => {
            createCovers(mockScene, mockConfig);

            expect(mockScene.add.image).toHaveBeenCalledTimes(2);
            expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "mock-shop-list.listCoverTop");
            expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "mock-shop-list.listCoverBottom");
        });

        test("creates top image when only top cover is in config", () => {
            mockConfig.bottom = undefined;

            createCovers(mockScene, mockConfig);

            expect(mockScene.add.image).toHaveBeenCalledTimes(1);
            expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "mock-shop-list.listCoverTop");
        });

        test("creates bottom image when only bottom cover in config", () => {
            mockConfig.top = undefined;

            createCovers(mockScene, mockConfig);

            expect(mockScene.add.image).toHaveBeenCalledTimes(1);
            expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "mock-shop-list.listCoverBottom");
        });

        test("does not create image when covers are not in config", () => {
            mockConfig.top = undefined;
            mockConfig.bottom = undefined;
            mockScene.config.listCovers = undefined;

            createCovers(mockScene, mockConfig);

            expect(mockScene.add.image).not.toHaveBeenCalled();
        });
    });

    describe("resizeCovers", () => {
        test("sets image scale", () => {
            const covers = createCovers(mockScene, mockConfig);
            resizeCovers(mockScene, mockScrollablePanel, covers, mockConfig);

            expect(covers.top.setScale).toHaveBeenCalled();
            expect(covers.bottom.setScale).toHaveBeenCalled();
            expect(mockSetScale).toHaveBeenCalledTimes(2);
        });

        test("only scales the top cover when there is no bottom cover", () => {
            mockConfig.bottom = null;

            const covers = createCovers(mockScene, mockConfig);
            resizeCovers(mockScene, mockScrollablePanel, covers, mockConfig);

            expect(covers.top.setScale).toHaveBeenCalled();
            expect(mockSetScale).toHaveBeenCalledTimes(1);
        });

        test("only scales the bottom cover when there is no top cover", () => {
            mockConfig.top = null;

            const covers = createCovers(mockScene, mockConfig);
            resizeCovers(mockScene, mockScrollablePanel, covers, mockConfig);

            expect(covers.bottom.setScale).toHaveBeenCalled();
            expect(mockSetScale).toHaveBeenCalledTimes(1);
        });

        test("does not set scale and position when there is no panel", () => {
            mockScrollablePanel = undefined;

            const covers = createCovers(mockScene, mockConfig);
            resizeCovers(mockScene, mockScrollablePanel, covers, mockConfig);

            expect(mockSetScale).not.toHaveBeenCalled();
            expect(mockSetX).not.toHaveBeenCalled();
            expect(mockSetY).not.toHaveBeenCalled();
        });

        test("sets the position of the top cover based on the safe area of the panel", () => {
            mockConfig.bottom = null;
            mockSafeArea.y = -80;

            const expectedXPosition = 0;
            const expectedYPosition = -80;

            const covers = createCovers(mockScene, mockConfig);
            resizeCovers(mockScene, mockScrollablePanel, covers, mockConfig);

            expect(covers.top.setX).toHaveBeenCalledWith(expectedXPosition);
            expect(covers.top.setY).toHaveBeenCalledWith(expectedYPosition);
        });

        test("sets the position of the top cover when the panel has padding", () => {
            mockConfig.bottom = null;
            mockConfig.y = 10;
            mockConfig.x = 10;
            mockSafeArea.y = -80;

            const expectedYPosition = -70;
            const expectedXPosition = -10;

            const covers = createCovers(mockScene, mockConfig);
            resizeCovers(mockScene, mockScrollablePanel, covers, mockConfig);

            expect(covers.top.setX).toHaveBeenCalledWith(expectedXPosition);
            expect(covers.top.setY).toHaveBeenCalledWith(expectedYPosition);
        });

        test("sets the position of the bottom cover when the panel has padding", () => {
            mockConfig.top = null;
            mockConfig.y = 10;
            mockConfig.x = 10;
            mockSafeArea.y = -80;
            mockSafeArea.height = 160;

            const expectedYPosition = 70;
            const expectedXPosition = -10;

            const covers = createCovers(mockScene, mockConfig);
            resizeCovers(mockScene, mockScrollablePanel, covers, mockConfig);

            expect(covers.bottom.setX).toHaveBeenCalledWith(expectedXPosition);
            expect(covers.bottom.setY).toHaveBeenCalledWith(expectedYPosition);
        });
    });
});
