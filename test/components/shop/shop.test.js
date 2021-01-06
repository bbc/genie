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
import * as titles from "../../../src/components/shop/shop-titles.js";
import * as uiScaler from "../../../src/components/shop/shop-layout.js";
import * as menu from "../../../src/components/shop/menu.js";
import * as confirm from "../../../src/components/shop/confirm.js";
import * as a11y from "../../../src/core/accessibility/accessibility-layer.js";
import { eventBus } from "../../../src/core/event-bus.js";

jest.mock("../../../src/core/layout/scrollable-list/scrollable-list.js");

describe("Shop", () => {
    let shopScreen;
    const mockScrollableList = { setVisible: jest.fn() };
    const config = {
        shop: {
            balance: { value: { key: "currencyItemKey" } },
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
    const mockConfirm = { setVisible: jest.fn(), resize: jest.fn() };
    const mockTitles = { setTitleText: jest.fn(), setScale: jest.fn(), setPosition: jest.fn() };

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
        titles.createTitle = jest.fn().mockReturnValue(mockTitles);
        confirm.createConfirm = jest.fn().mockReturnValue(mockConfirm);
        uiScaler.getScaleFactor = jest.fn();
        uiScaler.getYPos = jest.fn();
        menu.createMenu = jest.fn().mockReturnValue(mockMenu);
        eventBus.subscribe = jest.fn();
        eventBus.removeSubscription = jest.fn();
        a11y.reset = jest.fn();
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
            expect(ScrollableList).toHaveBeenCalledTimes(2);
            expect(shopScreen.panes.shop).toBe(mockScrollableList);
            expect(shopScreen.panes.manage).toBe(mockScrollableList);
        });

        test("passes a filter function to the inventory pane", () => {
            const filterFn = ScrollableList.mock.calls[1][3];
            const mockCollection = [{ id: "currencyItemKey" }, { id: "someOtherId" }];
            expect(mockCollection.filter(filterFn)).toStrictEqual([{ id: "someOtherId" }]);
        });

        test("calls createTitle to create the title UI component", () => {
            expect(titles.createTitle).toHaveBeenCalledWith(shopScreen);
            expect(shopScreen.title).toBe(mockTitles);
        });

        test("calls createBalance to create the balance UI component", () => {
            expect(balance.createBalance).toHaveBeenCalledWith(shopScreen);
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
            expect(mockConfirm.setVisible).toHaveBeenCalledWith(false);
            expect(mockScrollableList.setVisible).toHaveBeenCalledTimes(2);
        });

        describe("sets up resize", () => {
            test("adds a callback to onScaleChange that updates scale and position for UI elems", () => {
                const onScaleChangeCallback = scaler.onScaleChange.add.mock.calls[0][0];
                onScaleChangeCallback();

                expect(shopScreen.title.setScale).toHaveBeenCalled();
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
        test("sets one pane visible and sets the others invisible", () => {
            jest.clearAllMocks();
            shopScreen.setVisiblePane("top");
            expect(shopScreen.panes.top.setVisible).toHaveBeenCalledWith(true);
            expect(shopScreen.panes.shop.setVisible).toHaveBeenCalledWith(false);
            expect(shopScreen.panes.manage.setVisible).toHaveBeenCalledWith(false);
            expect(shopScreen.panes.confirm.setVisible).toHaveBeenCalledWith(false);
        });
    });
    describe("pane stacking", () => {
        beforeEach(() => shopScreen.create());

        describe("stack()", () => {
            beforeEach(() => {
                jest.clearAllMocks();
                shopScreen.stack("shop");
            });

            test("pushes a pane name onto the stack", () => {
                expect(shopScreen.paneStack).toStrictEqual(["shop"]);
            });
            test("sets that pane visible", () => {
                expect(shopScreen.panes.shop.setVisible).toHaveBeenCalledWith(true);
            });
            test("resets a11y", () => {
                expect(a11y.reset).toHaveBeenCalled();
            });
            test("on starting the stack, changes the event subscription", () => {
                expect(eventBus.subscribe).toHaveBeenCalledWith(shopScreen.customMessage);
                expect(eventBus.removeSubscription).toHaveBeenCalledWith(shopScreen.backMessage);
            });
            test("the new event sub calls back()", () => {
                const message = eventBus.subscribe.mock.calls[0][0];
                shopScreen.paneStack = ["foo"];
                message.callback();
                expect(shopScreen.paneStack).toStrictEqual([]);
            });
        });

        describe("back()", () => {
            test("pops a pane name off the stack and sets the new top pane visible", () => {
                shopScreen.paneStack = ["shop", "confirm"];
                shopScreen.back();
                expect(shopScreen.paneStack).toStrictEqual(["shop"]);
                expect(shopScreen.panes.top.setVisible).toHaveBeenCalled();
            });
        });
        describe("back() on last item in pane stack", () => {
            beforeEach(() => {
                shopScreen.stack("shop");
                jest.clearAllMocks();
                shopScreen.back();
            });
            test("on stack empty, sets top visible and change event subscription", () => {
                expect(shopScreen.panes.top.setVisible).toHaveBeenCalledWith(true);
                expect(eventBus.subscribe).toHaveBeenCalledWith(shopScreen.backMessage);
                expect(eventBus.removeSubscription).toHaveBeenCalledWith(shopScreen.customMessage);
            });
        });
    });
});
