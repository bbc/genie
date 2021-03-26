/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createItemPanel, resizeItemPanel } from "../../../../src/components/shop/confirm/item-panel.js";
import * as textModule from "../../../../src/core/layout/text.js";

describe("Confirm item view", () => {
    let mockConfig;
    let mockScene;
    let image;
    let mockBounds;
    let container;

    beforeEach(() => {
        const mockText = { setOrigin: jest.fn() };
        mockConfig = { confirm: { buttons: { buttonsRight: true } } };

        image = {
            setPosition: jest.fn(),
            setScale: jest.fn(),
            height: 50,
            width: 100,
            setOrigin: jest.fn(() => image),
            getBounds: jest.fn(() => ({ bottom: 100 })),
        };

        mockScene = {
            add: { image: jest.fn(() => image), container: jest.fn(() => container), text: jest.fn(() => mockText) },
            config: mockConfig,
            layout: {
                getSafeArea: jest.fn(() => mockBounds),
            },
        };

        container = {
            width: 300,
            height: 400,
            setPosition: jest.fn(),
            setScale: jest.fn(),
            add: jest.fn(),
        };

        mockBounds = new Phaser.Geom.Rectangle(0, 0, 300, 400);
    });

    afterEach(jest.clearAllMocks);

    describe("resizeItemPanel", () => {
        test("sets container position correctly when buttonsRight set to true", () => {
            resizeItemPanel(mockScene, container)();

            expect(container.setPosition).toHaveBeenCalledWith(75, 200);
        });

        test("sets container position correctly when buttonsRight false", () => {
            mockConfig.confirm.buttons.buttonsRight = false;
            resizeItemPanel(mockScene, container)();

            expect(container.setPosition).toHaveBeenCalledWith(150, 200);
        });

        test("sets container scale correctly", () => {
            resizeItemPanel(mockScene, container)();

            expect(container.setScale.mock.calls[0][0].toFixed(2)).toBe("0.50");
            expect(container.setScale.mock.calls[0][1].toFixed(2)).toBe("0.50");
        });
    });

    describe("createItemPanel", () => {
        test("creates standard view if detailView falsy in scene config", () => {
            mockScene.config.confirm.detailView = false;
            createItemPanel(mockScene, {});
            expect(container.add).toHaveBeenCalledTimes(3);
        });

        test("creates detail view if set in scene config", () => {
            mockScene.config.confirm.detailView = true;

            Object.keys(createItemPanel(mockScene, {}));

            expect(container.add).toHaveBeenCalledTimes(6);
        });

        test("sets word wrap style if item description present", () => {
            mockScene.config.confirm.detailView = true;
            const mockText = {
                setStyle: jest.fn(() => mockText),
                setOrigin: jest.fn(() => mockText),
                setPosition: jest.fn(() => mockText),
                getBounds: jest.fn(() => ({ bottom: 100 })),
            };
            textModule.addText = jest.fn(() => mockText);

            createItemPanel(mockScene, {});

            const expected = { wordWrap: { width: 280, useAdvancedWrap: true } };

            expect(mockText.setStyle).toHaveBeenCalledWith(expected);
        });
    });
});
