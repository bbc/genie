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
        getBounds: jest.fn().mockReturnValue({ y: 0 }),
        removeAll: jest.fn(),
        destroy: jest.fn(),
        y: 200,
        visible: true,
    };
    const mockSafeArea = { width: 800, height: 600, x: 0, y: -100 };
    const mockScene = {
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
        layout: {
            getSafeArea: jest.fn(() => mockSafeArea),
        },
    };
    const mockGelButton = {
        input: { enabled: true },
        visible: true,
        accessibleElement: { update: jest.fn() },
        removeAll: jest.fn(),
        destroy: jest.fn(),
    };
    const mockGelButtons = [mockGelButton, mockGelButton];
    buttons.createMenuButtons = jest.fn().mockReturnValue(mockGelButtons);

    const resizeGelButtonsSpy = jest.fn();
    buttons.resizeGelButtons = resizeGelButtonsSpy;

    layout.createPaneBackground = jest.fn();

    beforeEach(() => (menu = createMenu(mockScene)));
    afterEach(() => jest.clearAllMocks());

    describe("createMenu()", () => {
        test("returns an object with a container", () => {
            expect(menu.container).toBe(mockContainer);
        });
        test("with stored config", () => {
            expect(menu.config).toStrictEqual(mockScene.config);
        });
        test("with a rect added", () => {
            expect(mockScene.add.rectangle).toHaveBeenCalledTimes(1);
        });
        test("with a buttons property from createGelButtons()", () => {
            expect(menu.buttons).toBe(mockGelButtons);
        });
        test("calls setY on the container with an appropriate Y offset", () => {
            expect(menu.container.setY).toHaveBeenCalledWith(200);
        });
    });

    describe("setVisible", () => {
        beforeEach(() => {
            jest.clearAllMocks();
            menu.setVisible(false);
        });

        test("sets visibility on the container", () => {
            expect(mockContainer.visible).toBe(false);
        });

        test("sets visibility on each gel button", () => {
            expect(mockGelButton.visible).toBe(false);
        });
        test("sets input.enabled on each gel button and updates the a11y elem", () => {
            expect(mockGelButton.input.enabled).toBe(false);
            expect(mockGelButton.accessibleElement.update).toHaveBeenCalledTimes(2);
        });
    });
    describe("resize", () => {
        beforeEach(() => {
            jest.clearAllMocks();
            menu.resize();
        });

        test("removes the container contents and destroys the container", () => {
            expect(mockContainer.removeAll).toHaveBeenCalledWith(true);
            expect(mockContainer.destroy).toHaveBeenCalled();
        });
        test("creates a new container and repopulates it", () => {
            expect(mockScene.add.container).toHaveBeenCalled();
            expect(mockScene.add.rectangle).toHaveBeenCalled();
            expect(layout.createPaneBackground).toHaveBeenCalled();
            expect(buttons.createMenuButtons).toHaveBeenCalled();
        });
    });
});
