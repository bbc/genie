/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { itemView, scaleItemView } from "../../../../src/components/shop/confirm/item-view.js";

describe("Confirm item view", () => {
    let mockConfig;
    let mockScene;
    let itemImage;
    let itemTitle;
    let itemBlurb;
    let mockItemView;
    let mockBounds;

    beforeEach(() => {
        const mockText = { setOrigin: jest.fn() };
        mockScene = {
            add: { image: jest.fn(), text: jest.fn(() => mockText) },
            config: {
                confirm: {},
            },
        };
        mockConfig = { confirm: { buttons: { buttonsRight: true } } };

        itemImage = {
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

        mockItemView = { itemImage, itemTitle, itemBlurb };
        mockBounds = { width: 200, x: 0, height: 200 };
    });

    afterEach(jest.clearAllMocks);

    describe("scaleItemView", () => {
        test("sets word wrap style if item blurb present", () => {
            scaleItemView(mockItemView, mockConfig, mockBounds);

            expect(itemBlurb.setStyle).toHaveBeenCalledWith({
                ...itemBlurb.style,
                wordWrap: { width: 200 / (21 / 10), useAdvancedWrap: true },
            });
        });

        test("sets image position correctly when buttonsRight set to true", () => {
            scaleItemView(mockItemView, mockConfig, mockBounds);

            expect(mockItemView.itemImage.setPosition).toHaveBeenCalledWith(50, -50);
        });

        test("sets image position correctly when buttonsRight false", () => {
            mockConfig.confirm.buttons.buttonsRight = false;
            scaleItemView(mockItemView, mockConfig, mockBounds);

            expect(mockItemView.itemImage.setPosition).toHaveBeenCalledWith(150, -50);
        });

        test("sets image scale correctly when title is present", () => {
            scaleItemView(mockItemView, mockConfig, mockBounds);

            expect(mockItemView.itemImage.setScale.mock.calls[0][0].toFixed(2)).toBe("1.33");
            expect(mockItemView.itemImage.setScale.mock.calls[0][1].toFixed(2)).toBe("1.33");
        });

        test("sets image scale correctly when title is not present", () => {
            delete mockItemView.itemTitle;
            scaleItemView(mockItemView, mockConfig, mockBounds);

            expect(mockItemView.itemImage.setScale.mock.calls[0][0].toFixed(2)).toBe("0.90");
            expect(mockItemView.itemImage.setScale.mock.calls[0][1].toFixed(2)).toBe("0.90");
        });

        test("sets itemDetail position if present", () => {
            mockItemView.itemDetail = {
                setPosition: jest.fn(),
            };
            scaleItemView(mockItemView, mockConfig, mockBounds);

            expect(mockItemView.itemDetail.setPosition).toHaveBeenCalledWith(50, 10);
        });
    });

    describe("itemView", () => {
        test("creates standard view if detailView falsy in scene config", () => {
            mockScene.config.confirm.detailView = false;

            expect(Object.keys(itemView(mockScene, {}))).toEqual(["itemImage"]);
        });

        test("creates detail view if set in scene config", () => {
            mockScene.config.confirm.detailView = true;

            expect(Object.keys(itemView(mockScene, {}))).toEqual(["itemImage", "itemTitle", "itemDetail", "itemBlurb"]);
        });
    });
});
