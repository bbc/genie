/**
 * @module core/layout/scrollable-list
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0 Apache-2.0
 */
import * as buttons from "../../../../src/core/layout/scrollable-list/scrollable-list-buttons.js";
import * as overlays from "../../../../src/core/layout/scrollable-list/button-overlays.js";
import * as helpers from "../../../../src/core/layout/scrollable-list/scrollable-list-helpers.js";
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
    config: {
        eventChannel: "mockChannel",
        assetKeys: {
            prefix: "mockScene",
            itemBackground: "itemBackground",
        },
    },
};

const mockItem = {
    id: "mockId",
    ariaLabel: "mockAriaLabel",
};

// const mockConfig = {

// };

describe("Scrollable List Buttons", () => {
    overlays.overlays1Wide = jest.fn();

    afterEach(() => jest.clearAllMocks());

    describe("createGelButton()", () => {
        test("adds a gel button", () => {
            buttons.createGelButton(mockScene, mockItem);
            expect(mockScene.add.gelButton).toHaveBeenCalled();
        });

        test("provides it the correct config", () => {
            buttons.createGelButton(mockScene, mockItem);
            const expectedConfig = {
                accessibilityEnabled: true,
                ariaLabel: "mockAriaLabel",
                channel: "mockChannel",
                gameButton: true,
                group: "middleCenter",
                id: "shop_id_mockId",
                key: "itemBackground",
                scene: "mockScene",
                inScrollable: true,
            };
            expect(mockScene.add.gelButton).toHaveBeenCalledWith(0, 0, expectedConfig);
        });

        test("subscribes to the event bus", () => {
            eventBus.subscribe = jest.fn();
            helpers.onClick = jest.fn();
            buttons.createGelButton(mockScene, mockItem);
            const args = eventBus.subscribe.mock.calls[0][0];
            expect(args.channel).toEqual("mockChannel");
            expect(args.name).toEqual("shop_id_mockId");
            args.callback();
            expect(helpers.onClick).toHaveBeenCalledWith(mockButton);
        });

        test("scales the button", () => {
            buttons.createGelButton(mockScene, mockItem);
            expect(mockButton.setScale).toHaveBeenCalled();
        });

        test("applies correct overlays", () => {
            buttons.createGelButton(mockScene, mockItem);
            expect(overlays.overlays1Wide).toHaveBeenCalled();
        });
    });
});
