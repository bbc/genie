/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { createMenu } from "../../../src/components/shop/menu.js";
import * as buttons from "../../../src/components/shop/menu-buttons.js";
import * as layout from "../../../src/components/shop/shop-layout.js";

describe("shop menu", () => {
    let menu;
    const mockContainer = {
        add: jest.fn(),
        setY: jest.fn(),
        setScale: jest.fn(),
        getBounds: jest.fn().mockReturnValue({ y: 0 }),
        scaleX: 1,
        scaleY: 1,
        y: 200,
    };
    const mockSafeArea = { width: 800, height: 600, x: 0, y: -100 };
    const mockImage = { setScale: jest.fn() };
    const mockRectangle = { setScale: jest.fn() };
    const mockScene = {
        add: {
            container: jest.fn().mockReturnValue(mockContainer),
            rectangle: jest.fn().mockReturnValue(mockRectangle),
            image: jest.fn().mockReturnValue(mockImage),
        },
        config: {
            menu: { buttonsRight: true },
            assetKeys: {
                background: "background",
            },
        },
        layout: {
            getSafeArea: jest.fn(() => mockSafeArea),
        },
    };
    const mockGelButton = { input: { enabled: true }, visible: true, accessibleElement: { update: jest.fn() } };
    const mockGelButtons = [mockGelButton, mockGelButton];
    buttons.createMenuButtons = jest.fn().mockReturnValue(mockGelButtons);

    const resizeGelButtonsSpy = jest.fn();
    buttons.resizeGelButtons = resizeGelButtonsSpy;

    const mockSetVisible = jest.fn();
    layout.setVisible = jest.fn(() => mockSetVisible);

    const mockResize = jest.fn();
    layout.resize = jest.fn(() => mockResize);

    beforeEach(() => (menu = createMenu(mockScene)));
    afterEach(() => jest.clearAllMocks());

    describe("createMenu()", () => {
        test("returns an object with a container", () => {
            expect(menu.container).toBe(mockContainer);
        });
        test("with stored config", () => {
            expect(menu.config).toStrictEqual(mockScene.config);
        });
        test("with a setVisible() from setVisible layout fn", () => {
            expect(menu.setVisible).toBe(mockSetVisible);
        });
        test("with a resize() from resize layout function", () => {
            expect(menu.resize).toBe(mockResize);
        });
        test("with a rect added", () => {
            expect(mockScene.add.rectangle).toHaveBeenCalledTimes(2);
        });
        test("with a buttons property from createGelButtons()", () => {
            expect(menu.buttons).toBe(mockGelButtons);
        });
        test("calls setY on the container with an appropriate Y offset", () => {
            expect(menu.container.setY).toHaveBeenCalledWith(200);
        });
    });
});
