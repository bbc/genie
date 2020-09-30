import { createGelButton, scaleButton } from "../../../../src/core/layout/scrollable-list/scrollable-list-buttons.js"
import * as overlays from "../../../../src/core/layout/scrollable-list/button-overlays.js"
import { eventBus } from "../../../../src/core/event-bus.js";

const mockButton = {
    width: 100,
    setScale: jest.fn(),
};

const mockScene = {
    add: {
        gelButton: jest.fn().mockReturnValue(mockButton),
    },
    layout: {
        getSafeArea: jest.fn().mockReturnValue({ width: 100 }),
    },
};

const mockItem = {
    id: "mockId",
    ariaLabel: "mockAriaLabel",
};

const mockConfig = {
    eventChannel: "mockChannel",
    assetKeys: {
        prefix: "mockScene",
        itemBackground: "itemBackground"
    }
};

describe.only("Scrollable List Buttons", () => {

    overlays.overlays1Wide = jest.fn();

    afterEach(() => jest.clearAllMocks());

    describe("createGelButton", () => {

        test("adds a gel button", () => {
            createGelButton(mockScene, mockItem, mockConfig);
            expect(mockScene.add.gelButton).toHaveBeenCalled();
        });

        test("provides correct config", () => {
            const button = createGelButton(mockScene, mockItem, mockConfig);
            const expectedConfig = {
                accessibilityEnabled: true,
                ariaLabel: "mockAriaLabel",
                channel: "mockChannel",
                gameButton: true,
                group: "middleCenter",
                id: "shop_id_mockId",
                key: "itemBackground",
                scene: "mockScene"
            };
            expect(mockScene.add.gelButton).toHaveBeenCalledWith(0, 0, expectedConfig);
        });

        test("subscribes to the event bus", () => {
            eventBus.subscribe = jest.fn();
            createGelButton(mockScene, mockItem, mockConfig);
            const args = eventBus.subscribe.mock.calls[0][0];
            expect(args.channel).toEqual("mockChannel");
            expect(args.name).toEqual("shop_id_mockId");
        });

        // test("scales the button", () => {
        //     expect(false).toBe(true);
        // });

        // test("applies correct overlays", () => {
        //     expect(false).toBe(true);
        // });
    });

    // describe("scaleButton", () => {
    //     test("scales the button to leave config.space pixels each side", () => {
    //         expect(false).toBe(true);
    //     });

    //     test("preserves the aspect ratio", () => {
    //         expect(false).toBe(true);
    //     });
    // });
});
