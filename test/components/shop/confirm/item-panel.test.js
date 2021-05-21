/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createItemPanel, resizeItemPanel } from "../../../../src/components/shop/confirm/item-panel.js";
import * as textModule from "../../../../src/core/layout/text.js";

jest.mock("../../../../src/core/layout/text.js");

describe("Confirm item view", () => {
    let mockConfig;
    let mockScene;
    let image;
    let mockBounds;
    let container;
    let mockText;

    beforeEach(() => {
        global.Phaser.Display.Align.In.Center = jest.fn();
        mockText = {
            setOrigin: jest.fn(() => mockText),
            setPosition: jest.fn(),
            getBounds: jest.fn(() => ({
                bottom: 10,
            })),
            setStyle: jest.fn(),
        };
        textModule.addText = jest.fn(() => mockText);
        mockConfig = {
            confirm: {
                background: "backgroundKey",
                itemBackground: "itemBackgroundKey",
                buttons: { buttonsRight: true },
                detailView: true,
                title: { mock: "titleStyle" },
                subtitle: { mock: "subtitleStyle" },
                description: { mock: "descriptionStyle" },
            },
        };

        image = {
            setPosition: jest.fn(),
            setScale: jest.fn(),
            height: 50,
            width: 100,
            setOrigin: jest.fn(() => image),
            getBounds: jest.fn(() => ({ bottom: 100 })),
        };

        mockScene = {
            assetPrefix: "prefix",
            add: { image: jest.fn(() => image), container: jest.fn(() => container), text: jest.fn(() => mockText) },
            config: mockConfig,
            layout: {
                getSafeArea: jest.fn(() => mockBounds),
            },
        };

        container = {
            width: 300,
            height: 400,
            setPosition: jest.fn(),
            setScale: jest.fn(),
            add: jest.fn(),
            list: [
                { testTag: "background", x: 0 },
                { testTag: "iconBackground", x: 0 },
                { testTag: "icon", x: 0 },
            ],
        };

        mockBounds = new Phaser.Geom.Rectangle(0, 0, 300, 400);
    });

    afterEach(jest.clearAllMocks);

    describe("resizeItemPanel", () => {
        test("sets container position correctly when buttonsRight set to true", () => {
            resizeItemPanel(mockScene, container)();

            expect(container.setPosition).toHaveBeenCalledWith(75, 200);
        });

        test("sets container position correctly when buttonsRight false", () => {
            mockConfig.confirm.buttons.buttonsRight = false;
            resizeItemPanel(mockScene, container)();

            expect(container.setPosition).toHaveBeenCalledWith(150, 200);
        });

        test("sets container scale correctly", () => {
            resizeItemPanel(mockScene, container)();

            expect(container.setScale).toHaveBeenCalledWith(0.5, 0.5);
        });

        test("Centers icon images on left section of background if basic view", () => {
            mockScene.config.confirm.detailView = false;

            resizeItemPanel(mockScene, container)();

            expect(Phaser.Display.Align.In.Center.mock.calls[0].map(ob => ob.testTag)).toEqual([
                "iconBackground",
                "background",
            ]);
            expect(Phaser.Display.Align.In.Center.mock.calls[1].map(ob => ob.testTag)).toEqual(["icon", "background"]);
            expect(container.list[1].x).toEqual(-150);
            expect(container.list[2].x).toEqual(-150);
        });
    });

    describe("createItemPanel", () => {
        test("adds a container to the scene", () => {
            createItemPanel(mockScene, {});
            expect(mockScene.add.container).toHaveBeenCalled();
        });

        test("sets origins to 0.5, 0 when in detail view", () => {
            createItemPanel(mockScene, {});
            expect(mockText.setOrigin).toHaveBeenCalledWith(0.5, 0);
            expect(image.setOrigin).toHaveBeenCalledWith(0.5, 0);
        });

        test("sets origins to 0.5, 0.5 when in basic view", () => {
            mockScene.config.confirm.detailView = false;
            createItemPanel(mockScene, {});
            expect(image.setOrigin).toHaveBeenCalledWith(0.5, 0.5);
        });

        test("adds a background image", () => {
            createItemPanel(mockScene, {});
            expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "prefix.backgroundKey");
        });

        test("adds an offset background image when basic View", () => {
            mockScene.config.confirm.detailView = false;
            createItemPanel(mockScene, {});
            expect(mockScene.add.image).toHaveBeenCalledWith(150, 0, "prefix.backgroundKey");
        });

        test("adds an icon background image", () => {
            createItemPanel(mockScene, {});
            expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "prefix.itemBackgroundKey");
            expect(image.setPosition).toHaveBeenCalledWith(0, -130);
        });

        test("adds an icon image", () => {
            createItemPanel(mockScene, { icon: "mockIcon" });
            expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, "mockIcon");
            expect(global.Phaser.Display.Align.In.Center).toHaveBeenCalledWith(image, image);
        });

        test("adds item title text", () => {
            createItemPanel(mockScene, { title: "mockTitle" });
            expect(textModule.addText).toHaveBeenCalledWith(mockScene, 0, 0, "mockTitle", mockConfig.confirm.title);
            expect(mockText.setPosition).toHaveBeenCalledWith(0, 16);
        });

        test("adds item subtitle text", () => {
            createItemPanel(mockScene, { subtitle: "mockSubtitle" });
            expect(textModule.addText).toHaveBeenCalledWith(
                mockScene,
                0,
                0,
                "mockSubtitle",
                mockConfig.confirm.subtitle,
            );
            expect(mockText.setPosition).toHaveBeenCalledWith(0, 14);
        });

        test("adds item description text", () => {
            createItemPanel(mockScene, { description: "mockDescription" });
            expect(textModule.addText).toHaveBeenCalledWith(
                mockScene,
                0,
                0,
                "mockDescription",
                mockConfig.confirm.description,
            );
            expect(mockText.setPosition).toHaveBeenCalledWith(0, 16);
        });

        test("adds 3 game objects to the container when in detail view", () => {
            createItemPanel(mockScene, { description: "mockDescription" });
            expect(container.add).toHaveBeenCalledTimes(6);
        });

        test("adds 6 game objects to the container when in basic view", () => {
            mockScene.config.confirm.detailView = false;
            createItemPanel(mockScene, { description: "mockDescription" });
            expect(container.add).toHaveBeenCalledTimes(3);
        });

        test("sets word wrap style if item description present", () => {
            mockScene.config.confirm.detailView = true;
            createItemPanel(mockScene, {});

            const expected = { wordWrap: { width: 280, useAdvancedWrap: true } };
            expect(mockText.setStyle).toHaveBeenCalledWith(expected);
        });
    });
});
