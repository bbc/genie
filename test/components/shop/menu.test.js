/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { createMenu } from "../../../src/components/shop/menu.js";
import * as buttons from "../../../src/components/shop/menu-buttons.js";

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

    beforeEach(() => (menu = createMenu(mockScene)));
    afterEach(() => jest.clearAllMocks());

    describe("createMenu()", () => {
        test("returns a container", () => {
            expect(menu).toBe(mockContainer);
        });
        test("with stored config", () => {
            expect(menu.config).toStrictEqual(mockScene.config);
        });
        test("with a setVisible() function", () => {
            expect(typeof menu.setVisible).toBe("function");
        });
        test("with a resize()", () => {
            expect(typeof menu.resize).toBe("function");
        });
        test("with memoised safe area bounds", () => {
            expect(menu.memoisedBounds).toBe(mockSafeArea);
        });
        test("with a rect added", () => {
            expect(mockScene.add.rectangle).toHaveBeenCalledTimes(2);
        });
        test("with a buttons property from createGelButtons()", () => {
            expect(menu.buttons).toBe(mockGelButtons);
        });
        test("calls setY on the container with an appropriate Y offset", () => {
            expect(menu.setY).toHaveBeenCalledWith(200);
        });
    });
    describe("setVisible", () => {
        beforeEach(() => menu.setVisible(false));

        test("sets the menu visibility", () => {
            expect(menu.visible).toBe(false);
        });
        test("sets button visibility", () => {
            expect(menu.buttons[0].visible).toBe(false);
            expect(menu.buttons[1].visible).toBe(false);
        });
        test("sets button input.enabled", () => {
            expect(menu.buttons[0].input.enabled).toBe(false);
            expect(menu.buttons[1].input.enabled).toBe(false);
        });
        test("updates the accessible element", () => {
            expect(menu.buttons[0].accessibleElement.update).toHaveBeenCalled();
            expect(menu.buttons[1].accessibleElement.update).toHaveBeenCalled();
        });
    });
    describe("resize", () => {
        const newBounds = { width: 400, height: 300, x: 0, y: -100 };
        beforeEach(() => menu.resize(newBounds));

        test("sets memoisedBounds to the value of the bounds argument", () => {
            expect(menu.memoisedBounds).toBe(newBounds);
        });
        test("sets container scale", () => {
            expect(mockContainer.setScale).toHaveBeenCalledWith(0.5, 0.5);
        });
        test("sets container y", () => {
            expect(mockContainer.setY.mock.calls[1][0]).toBe(100);
        });
        test("resizes the gel buttons", () => {
            expect(resizeGelButtonsSpy).toHaveBeenCalled();
        });
    });
});
