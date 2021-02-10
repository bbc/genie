/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createConfirm } from "../../../src/components/shop/confirm.js";
import * as layout from "../../../src/components/shop/shop-layout.js";
import * as text from "../../../src/core/layout/text-elem.js";
import * as buttons from "../../../src/components/shop/menu-buttons.js";
import * as transact from "../../../src/components/shop/transact.js";
import { collections } from "../../../src/core/collections.js";

jest.mock("../../../src/components/shop/transact.js");

describe("createConfirm()", () => {
    let confirmPane;
    let mockBalanceItem;
    const mockContainer = { add: jest.fn(), setY: jest.fn(), removeAll: jest.fn(), destroy: jest.fn() };
    const mockImage = { setScale: jest.fn(), setVisible: jest.fn(), setTexture: jest.fn(), type: "Image" };
    const mockRect = { foo: "bar" };
    const mockButton = {
        baz: "qux",
        setLegal: jest.fn(),
        setY: jest.fn(),
        setX: jest.fn(),
        setScale: jest.fn(),
        input: { enabled: true },
        accessibleElement: { update: jest.fn() },
    };
    const mockText = { setText: jest.fn(), type: "Text" };
    let mockConfig = {
        menu: { buttonsRight: true },
        confirm: {
            prompt: {
                buy: { legal: "legalBuyPrompt", illegal: "illegalBuyPrompt", unavailable: "unavailableBuyPrompt" },
                equip: "equipPrompt",
                unequip: "unequipPrompt",
            },
            detailView: false,
        },
        assetKeys: { background: { confirm: "background" } },
        balance: { icon: { key: "balanceIcon" } },
        styleDefaults: {},
        paneCollections: { shop: "armoury", manage: "inventory" },
    };

    const mockBounds = { height: 100, y: 5 };

    const mockBalance = { setText: jest.fn(), getValue: jest.fn() };

    const mockScene = {
        add: {
            container: jest.fn().mockReturnValue(mockContainer),
            image: jest.fn().mockReturnValue(mockImage),
            rectangle: jest.fn(() => ({ setScale: jest.fn() })),
        },
        stack: jest.fn(),
        back: jest.fn(),
        layout: {
            getSafeArea: jest.fn(() => mockBounds),
        },
        config: mockConfig,
        balance: mockBalance,
        panes: {
            manage: { setVisible: jest.fn() },
            shop: { setVisible: jest.fn() },
        },
        paneStack: [],
        title: { setTitleText: jest.fn() },
    };

    buttons.createConfirmButtons = jest.fn().mockReturnValue([mockButton, mockButton]);
    const setVisibleFn = jest.fn();
    const resizeFn = jest.fn();

    layout.setVisible = jest.fn().mockReturnValue(setVisibleFn);
    layout.resize = jest.fn().mockReturnValue(resizeFn);
    layout.createRect = jest.fn().mockReturnValue(mockRect);
    layout.getInnerRectBounds = jest.fn().mockReturnValue({ x: 28, y: 0, width: 100, height: 100 });
    layout.textStyle = jest.fn().mockReturnValue({ some: "textStyle" });

    text.addText = jest.fn().mockReturnValue({ setOrigin: jest.fn().mockReturnValue(mockText) });

    const mockCollection = { get: jest.fn().mockReturnValue({ state: "foo" }) };
    collections.get = jest.fn().mockReturnValue(mockCollection);

    beforeEach(() => {
        mockBalanceItem = { qty: 500 };
        transact.getBalanceItem = jest.fn(() => mockBalanceItem);
        confirmPane = createConfirm(mockScene);
        confirmPane.scene = mockScene;
    });

    afterEach(() => jest.clearAllMocks());

    test("returns a container", () => {
        expect(confirmPane).toBe(mockContainer);
    });
    test("with gel buttons for confirm and cancel", () => {
        expect(buttons.createConfirmButtons).toHaveBeenCalled();
    });
    test("in a layout that can be flipped L-R in config", () => {
        expect(layout.getInnerRectBounds.mock.calls[0][0]).toBe(mockScene);
        jest.clearAllMocks();
        mockScene.config = { ...mockConfig, menu: { buttonsRight: false } };
        createConfirm(mockScene);
        expect(text.addText.mock.calls[0][1]).toBe(-28);
        expect(text.addText.mock.calls[0][2]).toBe(-37.5);
    });
    test("that is displayed with an appropriate Y offset", () => {
        expect(mockContainer.setY).toHaveBeenCalledWith(55);
    });
    describe("Item detail view", () => {
        beforeEach(() => {
            mockScene.config = {
                ...mockConfig,
                confirm: {
                    ...mockConfig.confirm,
                    detailView: true,
                },
            };
            jest.clearAllMocks();
            confirmPane = createConfirm(mockScene);
        });
        test("adds extra placeholder text objects", () => {
            expect(text.addText).toHaveBeenCalledTimes(4);
            const containerContents = mockContainer.add.mock.calls[0][0];
            expect(containerContents.slice(-4)).toStrictEqual([mockImage, mockText, mockText, mockText]);
        });
    });

    describe(".handleClick()", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        test("when action is 'buy', calls transact.buy correctly", () => {
            confirmPane = createConfirm(mockScene, "shop", "buy", { mock: "item" });
            const handleClick = buttons.createConfirmButtons.mock.calls[0][2];
            handleClick();
            expect(transact.buy).toHaveBeenCalledWith(mockScene, { mock: "item" });
        });

        test("when action is 'equip', calls transact.buy correctly", () => {
            confirmPane = createConfirm(mockScene, "manage", "equip", { mock: "item" });
            const handleClick = buttons.createConfirmButtons.mock.calls[0][2];
            handleClick();
            expect(transact.equip).toHaveBeenCalledWith(mockScene, { mock: "item" });
        });

        test("when action is 'unequip', calls transact.buy correctly", () => {
            confirmPane = createConfirm(mockScene, "manage", "unequip", { mock: "item" });
            const handleClick = buttons.createConfirmButtons.mock.calls[0][2];
            handleClick();
            expect(transact.unequip).toHaveBeenCalledWith(mockScene, { mock: "item" });
        });
    });
});
