import { 
    scrollableList, 
    getPanelConfig, 
    createPanel,
    createTable,
    createItem,
    lib } from "../../../../src/core/layout/scrollable-list/scrollable-list.js";
import * as buttons from "../../../../src/core/layout/scrollable-list/scrollable-list-buttons.js";

const mockScrollablePanel = { layout: jest.fn() };

const mockSizer = { add: jest.fn() };

const mockGridSizer = { add: jest.fn() };

const mockItem = { id: "someItem", name: "someItemName" };

const mockButton = { foo: "bar "};

const mockScene = {
    rexUI: {
        add: {
            scrollablePanel: jest.fn().mockReturnValue(mockScrollablePanel),
            sizer: jest.fn().mockReturnValue(mockSizer),
            gridSizer: jest.fn().mockReturnValue(mockGridSizer),
            label: jest.fn(),
        },
    },
    input: {
        topOnly: true,
    },
    add: {
        image: jest.fn(),
    },
    config: {
        assetKeys: {
            prefix: "test",
            background: "background",
            scrollbar: "scrollbar",
            scrollbarHandle: "scrollbarHandle",
        },
        space: 10,
        items: [
            mockItem,
            { id: "someOtherItem" },
        ],
    },
    layout: {
        getSafeArea: jest.fn().mockReturnValue({ width: 100, height: 100}),
    },
};

const mockPanelConfig = { foo: "bar" };

const mockTable = { baz: "qux" };

describe.only("Scrollable List", () => {
    
    afterEach(() => jest.clearAllMocks());

    describe("scrollableList()", () => {
        beforeEach(() => {
            lib.getPanelConfig = jest.fn().mockReturnValue(mockPanelConfig);
        });

        test("gets the panel config", () => {
            const panel = scrollableList(mockScene);
            expect(lib.getPanelConfig).toHaveBeenCalledWith(mockScene);
        });

        test("calls rexUI to add a scrollable panel and calls its layout()", () => {
            const panel = scrollableList(mockScene);
            expect(mockScene.rexUI.add.scrollablePanel).toHaveBeenCalledWith(mockPanelConfig);
            expect(mockScrollablePanel.layout).toHaveBeenCalled();
        });

        test("sets scene.input.topOnly to false", () => {
            const panel = scrollableList(mockScene);
            expect(mockScene.input.topOnly).toBe(false);
        });
    });

    describe("getPanelConfig()", () => {
        beforeEach(() => {
            lib.createPanel = jest.fn();
        });

        test("adds images for panel background, scrollbar, and handle", () => {
            const panelConfig = getPanelConfig(mockScene);
            expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "test.background");
            expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "test.scrollbar");
            expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "test.scrollbarHandle");
        });

        test("gets a panel from createPanel", () => {
            const panelConfig = getPanelConfig(mockScene);
            expect(lib.createPanel).toHaveBeenCalledWith(mockScene);
        });
    });

    describe("createPanel()", () => {
        beforeEach(() => {
            lib.createTable = jest.fn().mockReturnValue(mockTable);
        });

        test("creates a rexUI sizer", () => {
            const panel = createPanel(mockScene);
            expect(mockScene.rexUI.add.sizer).toHaveBeenCalledWith({orientation: "x", space: { item: 0 }});
        });

        test("calls createTable and adds that object to its sizer", () => {
            const panel = createPanel(mockScene);
            expect(lib.createTable).toHaveBeenCalledWith(mockScene);
            expect(mockSizer.add).toHaveBeenCalledWith(mockTable, { expand: true });
        });
    });

    describe("createTable()", () => {
        beforeEach(() => {
            lib.createItem = jest.fn();
        });

        test("creates a rexUI grid sizer", () => {
            const table = createTable(mockScene);
            expect(mockScene.rexUI.add.gridSizer).toHaveBeenCalledWith({
                column: 1,
                row: 2,
                space: { column: 10, row: 10 },
            });
        });

        test("calls createItem per item and adds it to the grid sizer", () => {
            const table = createTable(mockScene);
            expect(lib.createItem).toHaveBeenCalledWith(mockScene, mockItem);
            expect(lib.createItem).toHaveBeenCalledWith(mockScene, { id: "someOtherItem" });
            expect(mockGridSizer.add).toHaveBeenCalledTimes(2);
        });

        test("wraps the grid sizer in a regular sizer", () => {
            const table = createTable(mockScene);
            expect(mockScene.rexUI.add.sizer).toHaveBeenCalledWith({
                orientation: "y",
                space: { left: 10, right: 10, top: 0, bottom: 10, item: 10},
            }); 
            expect(mockSizer.add).toHaveBeenCalledWith(mockGridSizer, 1, "center", 0, true);
        });
    });

    describe("createItem()", () => {
        beforeEach(() => {
            buttons.createGelButton = jest.fn().mockReturnValue(mockButton);
        });

        test("creates a rexUI label using a gel button as an icon", () => {
            const item = createItem(mockScene, mockItem);
            expect(buttons.createGelButton).toHaveBeenCalledWith(mockScene, mockItem, mockScene.config);
            expect(mockScene.rexUI.add.label).toHaveBeenCalledWith({
                orientation: 0,
                icon: mockButton,
                name: mockItem.name,
                space: { icon: 3},
            });
        });
    });
});
