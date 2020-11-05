/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import { Shop } from "../../../src/components/shop/shop.js";
import { ScrollableList } from "../../../src/core/layout/scrollable-list/scrollable-list.js";
import * as scaler from "../../../src/core/scaler.js";
import * as balance from "../../../src/components/shop/balance-ui.js";
import * as titles from "../../../src/components/select/titles.js";
import * as uiScaler from "../../../src/components/shop/shop-layout.js";
import * as menu from "../../../src/components/shop/menu.js";
import { eventBus } from "../../../src/core/event-bus.js";

jest.mock("../../../src/core/layout/scrollable-list/scrollable-list.js");

describe("Shop", () => {
    let shopScreen;
    const mockScrollableList = { setVisible: jest.fn() };
    const config = {
        shop: {
            title: [],
            balance: [],
            assetKeys: {
                prefix: "shop",
                background: "background",
            },
            listPadding: { x: 10, y: 8 },
        },
        home: {},
        furniture: [],
    };

    const mockMetrics = {
        verticals: { top: 100 },
        horizontals: { right: 100 },
        verticalBorderPad: 100,
        buttonPad: 100,
    };
    scaler.getMetrics = jest.fn().mockReturnValue(mockMetrics);
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
    const mockSafeArea = { foo: "bar " };
    const mockButtonConfig = { channel: "foo", key: "bar", action: "baz" };
    const mockMenu = { setVisible: jest.fn(), resize: jest.fn() };

    beforeEach(() => {
        shopScreen = new Shop();
        shopScreen.setData({ config });
        shopScreen.scene = { key: "shop" };
        shopScreen._layout = {
            getSafeArea: jest.fn().mockReturnValue(mockSafeArea),
            buttons: { back: { config: mockButtonConfig } },
        };
        shopScreen.addBackgroundItems = jest.fn();
        shopScreen.setLayout = jest.fn();
        shopScreen.plugins = { installScenePlugin: jest.fn() };
        shopScreen.add = {
            image: jest.fn().mockReturnValue(mockImage),
            text: jest.fn().mockReturnValue({ setOrigin: jest.fn().mockReturnValue(mockText) }),
            container: jest.fn().mockReturnValue(mockContainer),
        };
        shopScreen.events = { once: jest.fn() };
        ScrollableList.mockImplementation(() => mockScrollableList);
        balance.createBalance = jest.fn().mockReturnValue(mockContainer);
        titles.createTitles = jest.fn();
        uiScaler.getScaleFactor = jest.fn();
        uiScaler.getYPos = jest.fn();
        menu.createMenu = jest.fn().mockReturnValue(mockMenu);
        eventBus.subscribe = jest.fn();
        eventBus.removeSubscription = jest.fn();
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
            const expectedButtons = ["back", "pause"];
            expect(shopScreen.setLayout).toHaveBeenCalledWith(expectedButtons);
        });

        test("adds a top menu pane", () => {
            expect(menu.createMenu).toHaveBeenCalled();
            expect(shopScreen.panes.top).toBe(mockMenu);
        });

        test("adds scrollable list panes", () => {
            expect(ScrollableList).toHaveBeenCalled();
            expect(shopScreen.panes.shop).toBe(mockScrollableList);
            expect(shopScreen.panes.manage).toBe(mockScrollableList);
        });

        describe("creates the title UI component", () => {
            test("with a container", () => {
                expect(shopScreen.title).toBe(mockContainer);
            });

            test("containing the result of createTitles", () => {
                expect(titles.createTitles).toHaveBeenCalledWith(shopScreen);
            });

            test("appropriately scaled and positioned", () => {
                expect(uiScaler.getScaleFactor).toHaveBeenCalledWith({
                    metrics: mockMetrics,
                    container: mockContainer,
                    fixedWidth: true,
                    safeArea: mockSafeArea,
                });
            });
        });

        test("adds a balance UI component", () => {
            expect(balance.createBalance).toHaveBeenCalledWith(shopScreen, mockMetrics);
        });

        test("stores the back button event bus message", () => {
            const message = shopScreen.backMessage;
            expect(message.channel).toBe(mockButtonConfig.channel);
            expect(message.name).toBe(mockButtonConfig.key);
            expect(message.callback).toBe(mockButtonConfig.action);
        });
        test("makes a custom event bus message", () => {
            const message = shopScreen.customMessage;
            expect(message.channel).toBe(mockButtonConfig.channel);
            expect(message.name).toBe(mockButtonConfig.key);
            expect(typeof message.callback).toBe("function");
        });
        test("sets visibility of its panes", () => {
            expect(mockMenu.setVisible).toHaveBeenCalledWith(true);
            expect(mockScrollableList.setVisible).toHaveBeenCalledTimes(2);
        });

        describe("sets up resize", () => {
            test("adds a callback to onScaleChange that updates scale and position for UI elems", () => {
                const onScaleChangeCallback = scaler.onScaleChange.add.mock.calls[0][0];
                onScaleChangeCallback();

                expect(shopScreen.title.setScale).toHaveBeenCalled(); // can you show that these weren't called by setup?
                expect(shopScreen.title.setPosition).toHaveBeenCalled();
                expect(shopScreen.balance.setScale).toHaveBeenCalled();
                expect(shopScreen.balance.setPosition).toHaveBeenCalled();
            });
            test("unsubscribes on shutdown", () => {
                expect(shopScreen.events.once).toHaveBeenCalledWith("shutdown", "foo");
            });
        });
    });
    describe("setVisiblePane()", () => {
        beforeEach(() => shopScreen.create());

        describe("when called with 'shop'", () => {
            beforeEach(() => shopScreen.setVisiblePane("shop"));

            test("unsubscribes the default back button message", () => {
                expect(eventBus.removeSubscription).toHaveBeenCalledWith(shopScreen.backMessage);
            });
            test("resubscribes with a custom message", () => {
                expect(eventBus.subscribe).toHaveBeenCalledWith(shopScreen.customMessage);
            });
            test("that sets the top menu visible", () => {
                shopScreen.customMessage.callback();
                expect(shopScreen.panes.top.setVisible).toHaveBeenCalledWith(true);
            });
            test("calls setVisible(true) on the shop list", () => {
                expect(shopScreen.panes.shop.setVisible).toHaveBeenCalledWith(true);
            });
            test("calls setVisible(false) on the top menu", () => {
                expect(shopScreen.panes.top.setVisible).toHaveBeenCalledWith(false);
            });
        });
        describe("when called with 'manage'", () => {
            beforeEach(() => shopScreen.setVisiblePane("manage"));

            test("sets the inventory list visible instead", () => {
                expect(shopScreen.panes.manage.setVisible).toHaveBeenCalledWith(true);
            });
        });

        describe("when called with 'top'", () => {
            beforeEach(() => shopScreen.setVisiblePane("top"));
            test("unsubscribes the back button custom message", () => {
                expect(eventBus.removeSubscription).toHaveBeenCalledWith(shopScreen.customMessage);
            });
            test("resubscribes with its original message", () => {
                expect(eventBus.subscribe).toHaveBeenCalledWith(shopScreen.backMessage);
            });
            test("calls setVisible(false) on both scrollable lists", () => {
                expect(shopScreen.panes.shop.setVisible).toHaveBeenCalledWith(false);
                expect(shopScreen.panes.manage.setVisible).toHaveBeenCalledWith(false);
            });
            test("calls setVisible(true) on the top menu", () => {
                expect(shopScreen.panes.top.setVisible).toHaveBeenCalledWith(true);
            });
        });
    });
});
