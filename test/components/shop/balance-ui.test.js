/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

import * as shopLayout from "../../../src/components/shop/shop-layout.js";
import { createBalance } from "../../../src/components/shop/balance-ui.js";

describe("createBalance()", () => {
    let balanceElem;
    const mockContainer = { getBounds: jest.fn(), setScale: jest.fn(), setPosition: jest.fn(), add: jest.fn() };
    const mockReturnedIcon = {
        getBounds: jest.fn().mockReturnValue({ width: 13 }),
        setPosition: jest.fn(),
    };
    const mockIcon = { setOrigin: jest.fn().mockReturnValue(mockReturnedIcon) };
    const mockReturnedBackground = {
        setScale: jest.fn(),
        setPosition: jest.fn(),
        getBounds: jest.fn().mockReturnValue({ width: 24 }),
    };
    const mockBackground = { setOrigin: jest.fn().mockReturnValue(mockReturnedBackground) };
    const mockReturnedText = {
        setPosition: jest.fn(),
        getBounds: jest.fn().mockReturnValue({ width: 17 }),
        setText: jest.fn(),
        text: "43",
    };
    const mockText = { setOrigin: jest.fn().mockReturnValue(mockReturnedText) };
    const mockScene = {
        assetPrefix: "shop",
        add: {
            container: jest.fn().mockReturnValue(mockContainer),
            image: jest.fn().mockImplementation((x, y, key) => {
                if (key === "shop.balanceIcon") return mockIcon;
                return mockBackground;
            }),
            text: jest.fn().mockReturnValue(mockText),
        },
        config: {
            balance: {
                background: {
                    type: "image",
                    key: "balanceBackground",
                },
                icon: {
                    type: "image",
                    key: "balanceIcon",
                },
                value: {
                    type: "text",
                    value: 1000,
                    styles: { foo: "bar" },
                },
            },
            balancePadding: 6,
            listPadding: { x: 1 },
        },
    };
    const mockMetrics = { foo: "bar" };
    const mockSafeArea = { baz: "qux" };

    beforeEach(() => {
        shopLayout.getXPos = jest.fn().mockReturnValue(42);
        shopLayout.getYPos = jest.fn().mockReturnValue(69);
        shopLayout.getScaleFactor = jest.fn().mockReturnValue(3.14);
        balanceElem = createBalance(mockScene, mockMetrics, mockSafeArea);
    });

    afterEach(() => jest.clearAllMocks());

    test("adds a container", () => {
        expect(mockScene.add.container).toHaveBeenCalled();
    });
    test("adds elements for background & icon", () => {
        expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "shop.balanceBackground");
        expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "shop.balanceIcon");
    });
    test("adds a text element, merging the provided styles with defaults", () => {
        const expectedStyles = {
            fontFamily: "ReithSans",
            fontSize: "24px",
            resolution: 4,
            foo: "bar",
        };
        expect(mockScene.add.text).toHaveBeenCalledWith(0, 0, 1000, expectedStyles);
    });
    test("positions the icon to the left", () => {
        expect(mockReturnedIcon.setPosition).toHaveBeenCalledWith(-12, 0);
    });
    test("positions the value to the right", () => {
        expect(mockReturnedText.setPosition).toHaveBeenCalledWith(6, 0);
    });
    test("scales the background to accommodate the other elements", () => {
        expect(mockReturnedBackground.setScale).toHaveBeenCalledWith(2);
    });
    test("scales the container based on getScaleFactor", () => {
        const expectedArgs = {
            metrics: mockMetrics,
            container: mockContainer,
            safeArea: mockSafeArea,
        };
        expect(shopLayout.getScaleFactor).toHaveBeenCalledWith(expectedArgs);
        expect(mockContainer.setScale).toHaveBeenCalledWith(3.14);
    });
    test("positions the container based on getXPos and getYPos", () => {
        expect(shopLayout.getXPos).toHaveBeenCalledWith(mockContainer, mockSafeArea, mockScene.config.listPadding.x);
        expect(shopLayout.getYPos).toHaveBeenCalledWith(mockMetrics, mockSafeArea);
        expect(mockContainer.setPosition).toHaveBeenCalledWith(42, 69);
    });
    test("exposes a setText fn that sets the text of the value text elem", () => {
        balanceElem.setText("foo");
        expect(mockReturnedText.setText).toHaveBeenCalledWith("foo");
    });
    test("exposes a getValue fn that gets the value of the value text elem as an int", () => {
        const value = balanceElem.getValue();
        expect(value).toBe(43);
    });
});
