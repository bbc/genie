/**
 * @module components/shop
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { createConfirm } from "../../../../src/components/shop/confirm/confirm.js";
import * as layout from "../../../../src/components/shop/shop-layout.js";
import * as text from "../../../../src/core/layout/text.js";
import * as buttons from "../../../../src/components/shop/menu-buttons.js";
import * as transact from "../../../../src/components/shop/transact.js";
import { collections } from "../../../../src/core/collections.js";
//import * as bgModule from "../../../../src/components/shop/backgrounds.js";
import { initResizers } from "../../../../src/components/shop/backgrounds.js";

jest.mock("../../../../src/components/shop/transact.js");

describe("Confirm pane", () => {
    let confirmPane;

    let mockBalanceItem;
    let mockContainer;
    let mockImage;
    let mockButton;
    let mockConfig;
    let mockBalance;
    let mockScene;
    let mockCollection;
    let mockText;

    beforeEach(() => {
        mockContainer = { add: jest.fn(), setY: jest.fn(), removeAll: jest.fn(), destroy: jest.fn() };
        mockImage = {
            setScale: jest.fn(),
            setVisible: jest.fn(),
            setTexture: jest.fn(),
            setPosition: jest.fn(),
            type: "Image",
        };
        mockButton = {
            setLegal: jest.fn(),
            setY: jest.fn(),
            setX: jest.fn(),
            setScale: jest.fn(),
            input: { enabled: true },
            accessibleElement: { update: jest.fn() },
        };

        mockConfig = {
            confirm: {
                background: "testBackgroundKey",
                prompt: {
                    buy: { legal: "legalBuyPrompt", illegal: "illegalBuyPrompt", unavailable: "unavailableBuyPrompt" },
                    equip: { legal: "equipPrompt", illegal: "illegalEquipPrompt" },
                    unequip: "unequipPrompt",
                    use: "usePrompt",
                },
                detailView: false,
                buttons: {
                    buttonsRight: true,
                },
            },
            assetKeys: { background: { confirm: "background" } },
            balance: { icon: { key: "balanceIcon" } },
            styleDefaults: {},
        };
        mockBalance = { setText: jest.fn(), getValue: jest.fn() };

        mockScene = {
            scene: {
                key: "test-scene-key",
            },
            _data: {
                addedBy: {
                    scene: {
                        resume: jest.fn(),
                    },
                },
            },
            add: {
                container: jest.fn(() => mockContainer),
                image: jest.fn(() => mockImage),
                rectangle: jest.fn(() => ({ setScale: jest.fn() })),
            },
            stack: jest.fn(),
            back: jest.fn(),
            layout: {
                getSafeArea: jest.fn(() => ({ height: 200, width: 200, x: 0, y: 5 })),
            },
            config: mockConfig,
            balance: mockBalance,
            panes: {
                manage: { setVisible: jest.fn() },
                shop: { setVisible: jest.fn() },
            },
            paneStack: [],
            transientData: {
                shop: {
                    mode: "shop",
                    item: {},
                    config: {
                        shopCollections: { shop: "armoury", manage: "inventory" },
                    },
                },
            },
            removeOverlay: jest.fn(),
        };
        mockCollection = { get: jest.fn(() => ({ state: "equipped", qty: 1, price: 99 })) };
        collections.get = jest.fn(() => mockCollection);

        const setVisibleFn = jest.fn();
        const resizeFn = jest.fn();

        layout.setVisible = jest.fn(() => setVisibleFn);
        layout.resize = jest.fn(() => resizeFn);
        layout.getInnerRectBounds = jest.fn(() => ({ x: 50, y: 0, width: 100, height: 100 }));
        layout.textStyle = jest.fn(() => ({ some: "textStyle" }));

        buttons.createConfirmButtons = jest.fn(() => [mockButton, mockButton]);
        mockText = {
            setText: jest.fn(),
            style: { some: "style" },
            setPosition: jest.fn(),
            setStyle: jest.fn(),
        };
        text.addText = jest.fn(() => ({
            setOrigin: jest.fn(() => mockText),
        }));

        mockBalanceItem = { qty: 500 };
        transact.getBalanceItem = jest.fn(() => mockBalanceItem);

        global.RexPlugins = {
            GameObjects: {
                NinePatch: jest.fn(),
            },
        };
        initResizers();
    });
    afterEach(() => jest.clearAllMocks());

    describe("createConfirm()", () => {
        beforeEach(() => {
            confirmPane = createConfirm(mockScene);
        });
        test("returns a resize function", () => {
            expect(confirmPane).toEqual(expect.any(Function));
        });
        test(" creates gel buttons for confirm and cancel", () => {
            expect(buttons.createConfirmButtons).toHaveBeenCalled();
        });
    });

    describe("Item detail view", () => {
        beforeEach(() => {
            mockScene.transientData.shop.item = {
                id: "someItem",
                qty: 1,
                price: 99,
                title: "itemTitle",
                description: "itemDescription",
                longDescription: "itemBlurb",
                icon: "itemIcon",
            };

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
        test("adds text objects and an image for the item", () => {
            expect(text.addText.mock.calls[1][3]).toBe("itemTitle");
            expect(text.addText.mock.calls[2][3]).toBe("itemDescription");
            expect(text.addText.mock.calls[3][3]).toBe("itemBlurb");
            expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "itemIcon");
        });
    });

    describe(".handleClick()", () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        test("when action is 'buy', calls transact.buy correctly", () => {
            mockScene.transientData.shop.item = { mock: "item" };
            confirmPane = createConfirm(mockScene);
            const handleClick = buttons.createConfirmButtons.mock.calls[0][2];
            handleClick();
            expect(transact.buy).toHaveBeenCalledWith(mockScene, { mock: "item" });
        });

        test("when action is 'equip', calls transact.equip correctly", () => {
            mockScene.transientData.shop.item = { mock: "item" };
            mockScene.transientData.shop.mode = "manage";
            mockCollection = { get: jest.fn(() => ({ state: "purchased", slot: "someSlot" })) };
            confirmPane = createConfirm(mockScene);
            const handleClick = buttons.createConfirmButtons.mock.calls[0][2];
            handleClick();
            expect(transact.equip).toHaveBeenCalledWith(mockScene, { mock: "item" });
        });

        test("when action is 'unequip', calls transact.unequip correctly", () => {
            mockScene.transientData.shop.item = { mock: "item" };
            mockScene.transientData.shop.mode = "manage";
            mockCollection = { get: jest.fn(() => ({ state: "equipped", slot: "someSlot" })) };
            confirmPane = createConfirm(mockScene);
            const handleClick = buttons.createConfirmButtons.mock.calls[0][2];
            handleClick();
            expect(transact.unequip).toHaveBeenCalledWith(mockScene, { mock: "item" });
        });
        test("when action is 'use', calls transact.use correctly", () => {
            mockScene.transientData.shop.item = { mock: "item" };
            mockScene.transientData.shop.mode = "manage";
            mockCollection = { get: jest.fn(() => ({ state: "purchased", qty: 1 })) };
            confirmPane = createConfirm(mockScene);
            const handleClick = buttons.createConfirmButtons.mock.calls[0][2];
            handleClick();
            expect(transact.use).toHaveBeenCalledWith(mockScene, { mock: "item" });
        });
    });
    describe("cancel button", () => {
        let cancelCallback;

        beforeEach(() => {
            confirmPane = createConfirm(mockScene);
            cancelCallback = buttons.createConfirmButtons.mock.calls[0][3];
        });
        test("removes this overlay and resumes the scene below", () => {
            cancelCallback();
            expect(mockScene._data.addedBy.scene.resume).toHaveBeenCalled();
            expect(mockScene.removeOverlay).toHaveBeenCalled();
        });
    });

    //TODO NT these are possibly handled now by the resize module
    //describe("resize", () => {
    //    let resizeSpy = jest.fn();
    //    beforeEach(() => {
    //        bgModule.resizeBackground = jest.fn(() => resizeSpy);
    //    });
    //
    //    test("Calls Image resize if background is Image", () => {
    //        mockImage.constructor = Phaser.GameObjects.Image;
    //        createConfirm(mockScene)(mockScene, mockImage, {});
    //        expect(bgModule.resizeBackground).toHaveBeenCalledWith(Phaser.GameObjects.Image);
    //    });
    //
    //    test("Calls NinePatch resize if background is NinePatch", () => {
    //        mockImage.constructor = RexPlugins.GameObjects.NinePatch;
    //        createConfirm(mockScene, "shop", {}).resize(mockScene, mockImage, {});
    //        expect(bgModule.resizeBackground).toHaveBeenCalledWith(RexPlugins.GameObjects.NinePatch);
    //    });
    //
    //    test("Calls noop if background is Object", () => {
    //        mockImage.constructor = Object;
    //        createConfirm(mockScene, "shop", {}).resize(mockScene, mockImage, {});
    //        expect(bgModule.resizeBackground).toHaveBeenCalledWith(Object);
    //    });
    //
    //    test("Passes default spec to Ninepatch resize", () => {
    //        mockImage.constructor = RexPlugins.GameObjects.NinePatch;
    //        createConfirm(mockScene, "shop", {}).resize(mockScene, mockImage, {});
    //
    //        const expectedSpec = {
    //            aspect: 0.5,
    //            xOffset: -0.25,
    //            yOffset: 105,
    //        };
    //
    //        expect(resizeSpy.mock.calls[0][2]).toEqual(expectedSpec);
    //    });
    //
    //    test("Passes right hand offset spec to Ninepatch resize", () => {
    //        mockImage.constructor = RexPlugins.GameObjects.NinePatch;
    //        mockConfig.confirm.buttons.buttonsRight = false;
    //
    //        createConfirm(mockScene, "shop", {}).resize(mockScene, mockImage, {});
    //
    //        const expectedSpec = {
    //            aspect: 0.5,
    //            xOffset: 0.25,
    //            yOffset: 105,
    //        };
    //
    //        expect(resizeSpy.mock.calls[0][2]).toEqual(expectedSpec);
    //    });
    //});
});
