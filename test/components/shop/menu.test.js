/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { createMenu } from "../../../src/components/shop/menu.js";
import * as layout from "../../../src/components/shop/shop-layout.js";

jest.mock("../../../src/components/shop/shop-layout.js");
jest.mock("../../../src/components/shop/menu-buttons.js");

describe("shop menu", () => {
    let menu;
    let mockContainer;
    let mockInnerRectBounds;
    let mockSafeArea;
    let mockScene;

    beforeEach(() => {
        mockInnerRectBounds = { width: 100, height: 100, x: 0, y: 0 };
        mockContainer = {
            add: jest.fn(),
            setY: jest.fn(),
        };
        mockScene = {
            add: {
                container: jest.fn().mockReturnValue(mockContainer),
                rectangle: jest.fn(),
                image: jest.fn(),
            },
            config: {
                menu: { buttonsRight: true },
                assetKeys: {
                    background: "background",
                },
            },
        };
        mockSafeArea = { width: 800, height: 600, x: 0, y: -100 };
        layout.getInnerRectBounds = () => mockInnerRectBounds;
        layout.getSafeArea = () => mockSafeArea;
        menu = createMenu(mockScene);
    });
    afterEach(() => jest.clearAllMocks());

    describe("createMenu()", () => {
        test("with a rect added", () => {
            expect(mockScene.add.rectangle).toHaveBeenCalledTimes(1);
        });
        test("calls setY on the container with an appropriate Y offset", () => {
            expect(mockContainer.setY).toHaveBeenCalledWith(200);
        });
    });
});
