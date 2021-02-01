/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

import * as shopLayout from "../../../src/components/shop/shop-layout.js";
import * as textUtils from "../../../src/core/layout/text-utils.js";

let mockLayout;
let mockContainer;
const mockSafeArea = { y: -150, width: 600 };
const mockPadding = 10;
const mockMetrics = {
    verticals: { top: -300 },
    verticalBorderPad: 15,
};
let mockBounds;
let mockTextElem;
let mockImageElem;
let imageScaleXSpy;
let imageScaleYSpy;
let textScaleXSpy;
let textScaleYSpy;

describe("shop element scaling functions", () => {
    beforeEach(() => {
        imageScaleXSpy = jest.fn();
        imageScaleYSpy = jest.fn();
        textScaleXSpy = jest.fn();
        textScaleYSpy = jest.fn();
        mockBounds = { width: 100, height: 100, y: 0, x: 0 };
        mockTextElem = {
            set scaleX(val) {
                textScaleXSpy(val);
            },
            set scaleY(val) {
                textScaleYSpy(val);
            },
            type: "Text",
        };
        mockImageElem = {
            memoisedScale: 2,
            set scaleX(val) {
                imageScaleXSpy(val);
            },
            set scaleY(val) {
                imageScaleYSpy(val);
            },
            type: "Image",
        };
        mockLayout = { getSafeArea: jest.fn() };
        mockContainer = {
            getBounds: jest.fn().mockReturnValue({ height: 100, width: 300, x: 0, y: 0 }),
            elems: { foo: "bar" },
            scale: 1,
            scaleX: 1,
            scaleY: 1,
            setScale: jest.fn(),
            setY: jest.fn(),
            setX: jest.fn(),
            buttons: [],
            memoisedBounds: mockBounds,
            getElems: jest.fn().mockReturnValue([mockTextElem, mockImageElem]),
            y: 0,
            visible: true,
        };
    });

    afterEach(() => jest.clearAllMocks());

    describe("getSafeArea()", () => {
        test("calls getSafeArea with no groups and no Y-mirroring", () => {
            shopLayout.getSafeArea(mockLayout);
            expect(mockLayout.getSafeArea).toHaveBeenCalledWith({}, false);
        });
    });

    describe("getXPos()", () => {
        test("returns an X value that is just inside the horizontal bounds of the safe area", () => {
            const xPos = shopLayout.getXPos(mockContainer, mockSafeArea, mockPadding);
            expect(mockContainer.getBounds).toHaveBeenCalled();
            expect(xPos).toBe(140);
        });
    });

    describe("getYPos()", () => {
        test("returns a Y position that is centered between the screen top and the safe area top", () => {
            const yPos = shopLayout.getYPos(mockMetrics, mockSafeArea);
            expect(yPos).toBe(-217.5);
        });
    });

    describe("getScaleFactor()", () => {
        let args;

        beforeEach(
            () =>
                (args = {
                    metrics: mockMetrics,
                    container: mockContainer,
                    safeArea: mockSafeArea,
                }),
        );
        describe("when called with fixedWidth: true", () => {
            test("returns a scale factor that will have the element fill the available vertical space", () => {
                args.fixedWidth = true;
                const scaleFactor = shopLayout.getScaleFactor(args);
                expect(scaleFactor).toBe(1.275);
            });
        });
        describe("when called with fixedWidth: false", () => {
            test("returns a scale factor that may constrain the element horizontally", () => {
                args.fixedWidth = false;
                const scaleFactor = shopLayout.getScaleFactor(args);
                expect(scaleFactor).toBe(0.5);
            });
        });
    });

    describe("getHalfRectBounds", () => {
        const safeAreaBounds = { width: 200, height: 100 };
        test("returns a object describing half the area passed in", () => {
            const result = shopLayout.getHalfRectBounds(safeAreaBounds, false);
            const expected = {
                x: -50,
                y: 0,
                width: 100,
                height: 100,
            };
            expect(result).toStrictEqual(expected);
        });
        test("is isOnRight is true, it's the right-hand half", () => {
            const result = shopLayout.getHalfRectBounds(safeAreaBounds, true);
            const expected = {
                x: 50,
                y: 0,
                width: 100,
                height: 100,
            };
            expect(result).toStrictEqual(expected);
        });
    });

    describe("resize()", () => {
        const newBounds = { width: 200, height: 50, x: 0, y: 10 };
        beforeEach(() => {
            shopLayout.resize(mockContainer)(newBounds);
        });

        test("sets an appropriate scale and offset on the container", () => {
            expect(mockContainer.setScale).toHaveBeenCalledWith(2, 0.5);
            expect(mockContainer.setY).toHaveBeenCalledWith(10);
        });

        test("inverse-scale text elems on both axes to preserve aspect ratio", () => {
            expect(textScaleXSpy).toHaveBeenCalledWith(0.5);
            expect(textScaleYSpy).toHaveBeenCalledWith(2);
        });

        test("inverse-scale image elems on both axes and preserve the overall scale if a memoisedScale is provided", () => {
            expect(imageScaleXSpy).toHaveBeenCalledWith(1);
            expect(imageScaleYSpy).toHaveBeenCalledWith(4);
        });

        test("when an image elem has no memoisedScale, assume a scale of 1", () => {
            jest.clearAllMocks();
            mockImageElem.memoisedScale = undefined;
            mockContainer.getElems = jest.fn().mockReturnValue([mockTextElem, mockImageElem]);
            shopLayout.resize(mockContainer)(newBounds);
            expect(imageScaleXSpy).toHaveBeenCalledWith(1);
            expect(imageScaleYSpy).toHaveBeenCalledWith(1);
        });
    });

    describe("getPaneBackgroundKey()", () => {
        let mockScene;
        const { getPaneBackgroundKey } = shopLayout;

        beforeEach(() => {
            mockScene = {
                config: {
                    assetPrefix: "prefix",
                    assetKeys: {
                        background: "someBackground",
                    },
                },
            };
        });
        test("if a string is passed in config, concatenates with assetPrefix", () => {
            mockScene.config.assetKeys.background = { shop: "shopBackground" };
            expect(getPaneBackgroundKey(mockScene, "shop")).toBe("prefix.shopBackground");
        });
        test("if an empty string is passed, returns null", () => {
            mockScene.config.assetKeys.background = "";
            expect(getPaneBackgroundKey(mockScene, "shop")).toBe(null);
        });
        test("if an object is passed in config, asset key is contextual", () => {
            mockScene.config.assetKeys.background = { shop: "shopBackground" };
            expect(getPaneBackgroundKey(mockScene, "shop")).toBe("prefix.shopBackground");
        });
        test("empty strings can be passed here too", () => {
            mockScene.config.assetKeys.background = { shop: "" };
            expect(getPaneBackgroundKey(mockScene, "shop")).toBe(null);
        });
    });

    describe("createPaneBackground()", () => {
        let mockScene;
        const mockBounds = { width: 1, height: 1 };

        beforeEach(() => {
            mockScene = {
                add: {
                    image: jest.fn().mockReturnValue({ setScale: jest.fn() }),
                    rectangle: jest.fn().mockReturnValue({ setScale: jest.fn() }),
                },
                config: {
                    assetPrefix: "some",
                    assetKeys: {
                        background: { shop: "asset" },
                    },
                },
            };
        });

        test("if it finds an asset key, returns an image", () => {
            shopLayout.createPaneBackground(mockScene, mockBounds, "shop");
            expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "some.asset");
        });
        test("if it finds no asset key, returns a rectangle", () => {
            mockScene.config.assetKeys.background = {};
            shopLayout.createPaneBackground(mockScene, mockBounds, "shop");
            expect(mockScene.add.rectangle).toHaveBeenCalled();
        });
    });

    // describe("addText()", () => {
    //     let elemConfig = { styles: { baz: "qux" } };

    //     const mockScene = {
    //         config: { styleDefaults: { foo: "bar" } },
    //         add: { text: jest.fn().mockReturnValue("textElem") },
    //     };
    //     textUtils.updateStyleOnFontLoad = jest.fn();

    //     beforeEach(() => shopLayout.addText(mockScene, 0, 0, "someText", elemConfig));

    //     test("creates a text element", () => {
    //         expect(mockScene.add.text).toHaveBeenCalled();
    //     });
    //     test("merges element styles with defaults", () => {
    //         const expectedStyle = { foo: "bar", baz: "qux" };
    //         expect(mockScene.add.text.mock.calls[0][3]).toStrictEqual(expectedStyle);
    //     });
    //     test("provides a fallback style", () => {
    //         jest.clearAllMocks();
    //         mockScene.config = {};
    //         const fallbackStyle = {
    //             fontFamily: "ReithSans",
    //             fontSize: "24px",
    //             resolution: 2,
    //             align: "center",
    //         };
    //         shopLayout.addText(mockScene, 0, 0, "someText", undefined);
    //         expect(mockScene.add.text.mock.calls[0][3]).toStrictEqual(fallbackStyle);
    //     });
    //     test("passes the text elem to updateStyleOnFontLoad", () => {
    //         expect(textUtils.updateStyleOnFontLoad).toHaveBeenCalledWith("textElem");
    //     });
    // });
});
