/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createScrollablePanel, getPanelY } from "../../../../src/components/shop/scrollable-list/scrollable-panel.js";

describe("Scrollable Panel", () => {
    let mockScene;
    let mockParent;
    let mockSafeArea;
    let mockSizer;
    let mockTrackImage;
    let mockThumbImage;
    let mockScrollablePanel;

    beforeEach(() => {
        mockSafeArea = { height: 10, y: 2 };
        mockSizer = { child: "mockPanel" };
        mockScrollablePanel = { layout: jest.fn() };
        mockScene = {
            assetPrefix: "prefix",
            rexUI: {
                add: {
                    sizer: jest.fn(() => mockSizer),
                    scrollablePanel: jest.fn(() => mockScrollablePanel),
                },
            },
            add: {
                image: jest
                    .fn()
                    .mockImplementationOnce(() => mockTrackImage)
                    .mockImplementationOnce(() => mockThumbImage),
            },
            config: {
                listPadding: {
                    x: 5,
                    y: 10,
                    outerPadFactor: 1,
                },
            },
            layout: {
                getSafeArea: jest.fn(() => mockSafeArea),
            },
        };
        mockParent = { reset: jest.fn() };
    });

    afterEach(jest.clearAllMocks);

    test("getPanelY returns correct y and height", () => {
        expect(getPanelY(mockScene)).toEqual({
            y: mockSafeArea.height / 2 + mockSafeArea.y,
            height: mockSafeArea.height,
        });
    });

    test("adds track and thumb image for slider", () => {
        createScrollablePanel(mockScene, "shop", mockParent);
        expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "prefix.scrollbar");
        expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "prefix.scrollbarHandle");
    });

    test("adds rexui sizer", () => {
        createScrollablePanel(mockScene, "shop", mockParent);
        expect(mockScene.rexUI.add.sizer).toHaveBeenCalledWith({
            orientation: "x",
            space: { item: 0 },
            name: "gridContainer",
        });
    });

    test("adds rexui scrollable panel", () => {
        createScrollablePanel(mockScene, "shop", mockParent);
        expect(mockScene.rexUI.add.scrollablePanel).toHaveBeenCalledWith({
            height: 10,
            y: 7,
            panel: { child: mockSizer },
            scrollMode: 0,
            slider: { thumb: mockThumbImage, track: mockTrackImage, width: mockScene.config.listPadding.x },
            space: { bottom: 10, left: 5, panel: 5, right: 5, top: 10 },
        });
    });

    test("calls layout on scrollable panel", () => {
        createScrollablePanel(mockScene, "shop", mockParent);
        expect(mockScrollablePanel.layout).toHaveBeenCalled();
    });

    test("returns mode as name", () => {
        const { scrollablePanel } = createScrollablePanel(mockScene, "shop", mockParent);
        expect(scrollablePanel.name).toBe("shop");
    });

    test("reset method calls parent reset", () => {
        const { scrollablePanel } = createScrollablePanel(mockScene, "shop", mockParent);
        scrollablePanel.reset();

        expect(mockParent.reset).toHaveBeenCalled();
    });

    test("getBoundingRect method returns the result of scene's getSafeArea", () => {
        const { scrollablePanel } = createScrollablePanel(mockScene, "shop", mockParent);
        expect(scrollablePanel.getBoundingRect()).toEqual(mockSafeArea);
    });
});
