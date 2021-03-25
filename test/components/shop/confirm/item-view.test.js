/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { itemPanel, scaleItemView } from "../../../../src/components/shop/confirm/item-panel.js";
import * as textModule from "../../../../src/core/layout/text.js";

describe("Confirm item view", () => {
    let mockConfig;
    let mockScene;
    let image;
    let itemTitle;
    let itemBlurb;
    let iconBackground;
    let mockItemView;
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
        };

        mockScene = {
            add: { image: jest.fn(() => image), container: jest.fn(() => container), text: jest.fn(() => mockText) },
            config: mockConfig,
            layout: {
                getSafeArea: jest.fn(() => mockBounds),
            },
        };

        iconBackground = {
            setPosition: jest.fn(),
            setScale: jest.fn(),
            height: 50,
            width: 100,
        };

        itemTitle = {
            setPosition: jest.fn(),
        };

        itemBlurb = {
            setStyle: jest.fn(),
            setPosition: jest.fn(),
            style: { a: 1, b: 2 },
        };

        container = {
            width: 300,
            height: 400,
            setPosition: jest.fn(),
            setScale: jest.fn(),
            add: jest.fn(),
        };

        mockItemView = { image, itemTitle, iconBackground, itemBlurb, container };
        mockBounds = new Phaser.Geom.Rectangle(0, 0, 300, 400);
    });

    afterEach(jest.clearAllMocks);

    describe("scaleItemView", () => {
        test("sets container position correctly when buttonsRight set to true", () => {
            scaleItemView(mockScene, mockItemView);

            expect(mockItemView.container.setPosition).toHaveBeenCalledWith(75, 200);
        });

        test("sets container position correctly when buttonsRight false", () => {
            mockConfig.confirm.buttons.buttonsRight = false;
            scaleItemView(mockScene, mockItemView);

            expect(mockItemView.container.setPosition).toHaveBeenCalledWith(150, 200);
        });

        test("sets container scale correctly", () => {
            scaleItemView(mockScene, mockItemView);

            expect(mockItemView.container.setScale.mock.calls[0][0].toFixed(2)).toBe("0.50");
            expect(mockItemView.container.setScale.mock.calls[0][1].toFixed(2)).toBe("0.50");
        });
    });

    describe("itemView", () => {
        test("creates standard view if detailView falsy in scene config", () => {
            mockScene.config.confirm.detailView = false;

            expect(Object.keys(itemPanel(mockScene, {}))).toEqual(["image", "container"]);
        });

        test("creates detail view if set in scene config", () => {
            mockScene.config.confirm.detailView = true;

            expect(Object.keys(itemPanel(mockScene, {}))).toEqual([
                "background",
                "iconBackground",
                "icon",
                "title",
                "detail",
                "blurb",
                "container",
            ]);
        });

        test("sets word wrap style if item blurb present", () => {
            mockScene.config.confirm.detailView = true;
            const mockText = {
                setStyle: jest.fn(() => mockText),
                setOrigin: jest.fn(() => mockText),
                setPosition: jest.fn(() => mockText),
            };
            textModule.addText = jest.fn(() => mockText);

            itemPanel(mockScene, {});

            const expected = { wordWrap: { width: 280, useAdvancedWrap: true } };

            expect(mockText.setStyle).toHaveBeenCalledWith(expected);
        });
    });
});
