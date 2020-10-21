/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { Shop } from "../../../src/components/shop/shop.js";
import * as scroller from "../../../src/core/layout/scrollable-list/scrollable-list.js";
import * as scaler from "../../../src/core/scaler.js";

describe("Shop", () => {
    let shopScreen;
    const mockScrollableList = { foo: "bar" };
    const config = {
        shop: {
            title: {
                text: "Shop",
                background: "shop.titleBackground",
                titlePadding: 10,
                font: { foo: "bar" },
            },
            wallet: {
                background: "shop.walletBackground",
                icon: "shop.walletIcon",
                defaultBalance: 1000,
                font: { baz: "qux" },
            },
            assetKeys: {
                prefix: "shop",
                background: "background",
            },
            listPadding: { x: 10, y: 8 },
        },
        home: {},
        furniture: [],
    };
    scaler.getMetrics = jest.fn().mockReturnValue({
        verticals: { top: 100 },
        horizontals: { right: 100 },
        verticalBorderPad: 100,
        buttonPad: 100,
    });
    scaler.onScaleChange = { add: jest.fn().mockReturnValue({ unsubscribe: "foo" }) };
    const mockText = {
        getBounds: jest.fn().mockReturnValue({ width: 100 }),
        setScale: jest.fn(),
        setPosition: jest.fn(),
    };
    const mockImage = {
        getBounds: jest.fn().mockReturnValue({ width: 100 }),
        setScale: jest.fn(),
        setPosition: jest.fn(),
    };
    const mockContainer = {
        add: jest.fn(),
        setScale: jest.fn(),
        setPosition: jest.fn(),
        getBounds: jest.fn().mockReturnValue({ height: 100 }),
    };

    beforeEach(() => {
        shopScreen = new Shop();
        shopScreen.setData({ config });
        shopScreen.scene = { key: "shop", layout: { getSafeArea: jest.fn() } }; // yagni?
        shopScreen._layout = { getSafeArea: jest.fn().mockReturnValue({ y: 100 }) };
        shopScreen.addBackgroundItems = jest.fn();
        shopScreen.setLayout = jest.fn();
        shopScreen.plugins = { installScenePlugin: jest.fn() };
        shopScreen.add = {
            image: jest.fn().mockReturnValue(mockImage),
            text: jest.fn().mockReturnValue({ setOrigin: jest.fn().mockReturnValue(mockText) }),
            container: jest.fn().mockReturnValue(mockContainer),
        };
        shopScreen.events = { once: jest.fn() };
        scroller.scrollableList = jest.fn().mockReturnValue(mockScrollableList);
    });

    afterEach(() => jest.clearAllMocks());

    describe("preload", () => {
        beforeEach(() => shopScreen.preload());

        test("loads the rexUI plugin", () => {
            expect(shopScreen.plugins.installScenePlugin).toHaveBeenCalled();
        });
    });

    describe("create()", () => {
        beforeEach(() => shopScreen.create());

        test("adds background items", () => {
            expect(shopScreen.addBackgroundItems).toHaveBeenCalled();
        });

        test("adds GEL buttons to layout", () => {
            const expectedButtons = ["home", "pause"];
            expect(shopScreen.setLayout).toHaveBeenCalledWith(expectedButtons);
        });

        test("adds a scrollable list panel", () => {
            expect(scroller.scrollableList).toHaveBeenCalled();
            expect(shopScreen.panel).toBe(mockScrollableList);
        });

        describe("creates the title UI component", () => {
            test("with a container", () => {
                expect(shopScreen.title).toBe(mockContainer);
            });

            test("containing an image and a text element", () => {
                expect(shopScreen.add.image).toHaveBeenCalledWith(0, 0, "shop.titleBackground");
                expect(shopScreen.add.text).toHaveBeenCalledWith(0, 0, "Shop", { foo: "bar" });
            });
        });

        describe("creates the wallet UI component", () => {
            test("with a container", () => {
                expect(shopScreen.wallet).toBe(mockContainer);
            });

            test("containing a background image, an icon image, and a text element", () => {
                expect(shopScreen.add.image).toHaveBeenCalledWith(0, 0, "shop.walletBackground");
                expect(shopScreen.add.image).toHaveBeenCalledWith(0, 0, "shop.walletIcon");
                expect(shopScreen.add.text).toHaveBeenCalledWith(0, 0, 1000, { baz: "qux" });
            });
        });

        describe("sets up resize", () => {
            test("adds a callback to onScaleChange that updates scale and position for UI elems", () => {
                const onScaleChangeCallback = scaler.onScaleChange.add.mock.calls[0][0];
                onScaleChangeCallback();
                expect(shopScreen.title.setScale).toHaveBeenCalled();
                expect(shopScreen.title.setPosition).toHaveBeenCalled();
                expect(shopScreen.wallet.setScale).toHaveBeenCalled();
                expect(shopScreen.wallet.setPosition).toHaveBeenCalled();
            });
            test("unsubscribes on shutdown", () => {
                expect(shopScreen.events.once).toHaveBeenCalledWith("shutdown", "foo");
            });
        });
    });
});
