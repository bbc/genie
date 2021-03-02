/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */

import { createBalance } from "../../../src/components/shop/balance-ui.js";
import * as shopLayout from "../../../src/components/shop/shop-layout.js";
import * as text from "../../../src/core/layout/text-elem.js";
import * as scalerModule from "../../../src/core/scaler.js";
import { collections } from "../../../src/core/collections.js";

describe("createBalance()", () => {
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

    const mockSafeArea = { baz: "qux" };

    const mockScene = {
        assetPrefix: "shop",
        add: {
            container: jest.fn().mockReturnValue(mockContainer),
            image: jest.fn().mockImplementation((x, y, key) => {
                if (key === "balanceIcon") return mockIcon;
                return mockBackground;
            }),
        },
        transientData: {
            shop: {
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
                            key: "someId",
                        },
                    },
                    balancePadding: 6,
                    shopCollections: { manage: "inventory" },
                },
            },
        },
        layout: {
            getSafeArea: jest.fn(() => mockSafeArea),
        },
    };
    const mockMetrics = { foo: "bar" };
    scalerModule.getMetrics = jest.fn(() => mockMetrics);
    const mockCurrencyItem = { id: "someId", qty: 100 };
    const mockCollection = { get: jest.fn().mockReturnValue(mockCurrencyItem) };
    collections.get = jest.fn().mockReturnValue(mockCollection);

    shopLayout.getXPos = jest.fn().mockReturnValue(42);
    shopLayout.getYPos = jest.fn().mockReturnValue(69);
    shopLayout.getScaleFactor = jest.fn().mockReturnValue(3.14);
    text.addText = jest.fn().mockReturnValue(mockText);

    beforeEach(() => {
        createBalance(mockScene, mockMetrics, mockSafeArea);
    });

    afterEach(() => jest.clearAllMocks());

    test("adds a container", () => {
        expect(mockScene.add.container).toHaveBeenCalled();
    });
    test("adds elements for background & icon", () => {
        expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "balanceBackground");
        expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "balanceIcon");
    });
    test("adds a text element with the value of the balance", () => {
        expect(text.addText.mock.calls[0][3]).toBe(100);
    });
    test("uses the quantity of the currency item from inventory as its value", () => {
        expect(collections.get).toHaveBeenCalledWith("inventory");
        expect(mockCollection.get).toHaveBeenCalledWith("someId");
        expect(text.addText.mock.calls[0][3]).toStrictEqual(mockCurrencyItem.qty);
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
        expect(shopLayout.getXPos).toHaveBeenCalledWith(mockContainer, mockSafeArea);
        expect(shopLayout.getYPos).toHaveBeenCalledWith(mockMetrics, mockSafeArea);
        expect(mockContainer.setPosition).toHaveBeenCalledWith(42, 69);
    });
});
