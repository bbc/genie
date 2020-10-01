import { overlays1Wide } from "../../../../src/core/layout/scrollable-list/button-overlays.js";

const mockScene = {
    add: {
        image: jest.fn().mockReturnValue("mockImage"),
        text: jest.fn().mockReturnValue("mockText"),
    },
};

const mockGelButton = {
    overlays: {
        set: jest.fn(),
    },
    width: 200,
};

const mockItem = {
    name: "someItemName",
    description: "someItemDescription",
    price: 42,
    icon: "test.icon",
};

const mockConfig = {
    offset: {
        itemIconX: 1,
        currencyIconX: 2,
        currencyTextX: 3,
        currencyTextY: 5,
        textX: 7,
        textY: 11,
    },
    assetKeys: {
        prefix: "test",
        itemBackground: "itemBackground",
        currency: "currency",
        icon: "icon",

    },
    font: {
        fontFamily: "fontFamily",
        resolution: 13,
    }
};

describe("Button overlays", () => {

    afterEach(() => jest.clearAllMocks());

    describe("overlays1Wide", () => {
        
        test("sets background, icon, and currency icon image overlays", () => {
            const withOverlays = overlays1Wide(mockScene, mockGelButton, mockItem, mockConfig);
            const edge = mockGelButton.width / 2;
            const offset = mockConfig.offset;

            expect(mockGelButton.overlays.set).toHaveBeenCalledWith("background", "mockImage");
            expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "test.itemBackground");

            expect(mockGelButton.overlays.set).toHaveBeenCalledWith("icon", "mockImage");
            expect(mockScene.add.image).toHaveBeenCalledWith(-edge + offset.itemIconX, 0, "test.icon");

            expect(mockGelButton.overlays.set).toHaveBeenCalledWith("currencyIcon", "mockImage");
            expect(mockScene.add.image).toHaveBeenCalledWith(edge - offset.currencyIconX, 0, "test.currency");
        });

        test("sets currencyAmount, itemName, and itemDescription overlays", () => {
            const withOverlays = overlays1Wide(mockScene, mockGelButton, mockItem, mockConfig);
            const edge = mockGelButton.width / 2;
            const offset = mockConfig.offset;

            expect(mockGelButton.overlays.set).toHaveBeenCalledWith("currencyAmount", "mockText");
            expect(mockScene.add.text).toHaveBeenCalledWith(edge - offset.currencyTextX, -offset.currencyTextY, mockItem.price, mockConfig.font);
            
            expect(mockGelButton.overlays.set).toHaveBeenCalledWith("itemName", "mockText");
            expect(mockScene.add.text).toHaveBeenCalledWith(-edge + offset.textX, -offset.textY * 2, mockItem.name, { ...mockConfig.font, fontSize: 20 });
            
            expect(mockGelButton.overlays.set).toHaveBeenCalledWith("itemDescription", "mockText");
            expect(mockScene.add.text).toHaveBeenCalledWith(-edge + offset.textX, 0, mockItem.description, mockConfig.font);
        });

        test("offsets the item name less if there is no item description", () => {
            mockItem.description = undefined;
            const withOverlays = overlays1Wide(mockScene, mockGelButton, mockItem, mockConfig);
            const edge = mockGelButton.width / 2;
            const offset = mockConfig.offset;

            expect(mockGelButton.overlays.set).toHaveBeenCalledWith("itemName", "mockText");
            expect(mockScene.add.text).toHaveBeenCalledWith(-edge + offset.textX, -offset.textY, mockItem.name, { ...mockConfig.font, fontSize: 20 });

        });
    });
});