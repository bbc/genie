/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createTitles } from "../../src/core/titles.js";
import * as scaler from "../../src/core/scaler.js";

jest.mock("../../src/core/layout/text.js");
jest.mock("../../src/core/scaler.js");

describe("Titles", () => {
    let mockScene;
    let mockTitleBackdrop;
    let mockSubtitleBackdrop;
    let mockSubtitleIcon;
    let mockButtonPad;
    let mockText;
    let mockTitleArea;
    let mockScaleEvent;

    beforeEach(() => {
        mockButtonPad = 10;
        mockScaleEvent = { unsubscribe: jest.fn() };
        scaler.onScaleChange = { add: jest.fn().mockReturnValue(mockScaleEvent) };
        scaler.getMetrics = jest.fn().mockReturnValue({ buttonPad: mockButtonPad });
        mockTitleArea = { centerY: 50, right: 100 };
        mockTitleBackdrop = { setOrigin: jest.fn(), destroy: jest.fn() };
        mockSubtitleBackdrop = { setOrigin: jest.fn(), destroy: jest.fn() };
        mockSubtitleIcon = { setOrigin: jest.fn(), destroy: jest.fn(), width: 20 };
        mockText = { setOrigin: jest.fn(), destroy: jest.fn(), width: 50, x: 0 };
        mockScene = {
            events: { once: jest.fn() },
            layout: { getTitleArea: jest.fn().mockReturnValue(mockTitleArea) },
            scene: { key: "sceneKey" },
            add: {
                image: jest
                    .fn()
                    .mockReturnValueOnce(mockTitleBackdrop)
                    .mockReturnValueOnce(mockSubtitleBackdrop)
                    .mockReturnValueOnce(mockSubtitleIcon),
                text: jest.fn(() => mockText),
            },
            config: {
                title: {
                    text: "Title",
                    backgroundKey: "titleKey",
                    style: { fontSize: "36px", fontFamily: "ReithSans", align: "center" },
                },
                subtitle: {
                    text: "Subtitle",
                    backgroundKey: "subtitleKey",
                    style: { fontSize: "24px", fontFamily: "ReithSans", align: "center" },
                },
            },
            transientData: {},
        };
    });

    afterEach(jest.clearAllMocks);

    test("adds an onScaleChange event", () => {
        createTitles(mockScene);
        expect(scaler.onScaleChange.add).toHaveBeenCalledWith(expect.any(Function));
    });

    test("unsubscribes the onScaleChange event when scene is shutdown", () => {
        createTitles(mockScene);
        expect(mockScene.events.once).toHaveBeenCalledWith("shutdown", expect.any(Function));
        const callback = mockScene.events.once.mock.calls[0][1];
        callback();
        expect(mockScaleEvent.unsubscribe).toHaveBeenCalled();
    });

    describe("Title", () => {
        test("adds title backdrop", () => {
            createTitles(mockScene);
            expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, mockScene.config.title.backgroundKey);
        });

        test("adds title text", () => {
            createTitles(mockScene);
            expect(mockScene.add.text).toHaveBeenCalledWith(0, 0, "Title", mockScene.config.title.style);
            expect(mockText.setOrigin).toHaveBeenCalledWith(0.5, 0.5);
        });

        test("adds title text when string template is provided", () => {
            mockScene.config.title.text = "<%= fruit %>";
            mockScene.transientData[mockScene.scene.key] = { fruit: "banana" };
            createTitles(mockScene);
            expect(mockScene.add.text).toHaveBeenCalledWith(0, 0, "Banana", mockScene.config.title.style);
        });

        test("title text reverts to default style when one is not provided", () => {
            delete mockScene.config.title.style;
            const expectedStyle = { fontSize: "36px", fontFamily: "ReithSans", align: "center" };
            createTitles(mockScene);
            expect(mockScene.add.text).toHaveBeenCalledWith(0, 0, "Title", expectedStyle);
        });

        test("repositions the backdrop and text when resize is called", () => {
            const titles = createTitles(mockScene);
            titles.title.resize();
            expect(mockText.y).toBe(mockTitleArea.centerY);
            expect(mockTitleBackdrop.y).toBe(mockTitleArea.centerY);
        });

        test("destroys backdrop and text when destroy is called", () => {
            const titles = createTitles(mockScene);
            titles.title.destroy();
            expect(mockTitleBackdrop.destroy).toHaveBeenCalled();
            expect(mockText.destroy).toHaveBeenCalled();
        });
    });

    describe("Subtitle", () => {
        test("adds subtitle backdrop", () => {
            createTitles(mockScene);
            expect(mockScene.add.image).toHaveBeenCalledWith(0, 0, mockScene.config.subtitle.backgroundKey);
        });

        test("adds subtitle text", () => {
            createTitles(mockScene);
            expect(mockScene.add.text).toHaveBeenCalledWith(0, 0, "Subtitle", mockScene.config.subtitle.style);
            expect(mockText.setOrigin).toHaveBeenCalledWith(0.5, 0.5);
        });

        test("adds subtitle text when string template is provided", () => {
            mockScene.config.subtitle.text = "<%= fruit %>";
            mockScene.transientData[mockScene.scene.key] = { fruit: "banana" };
            createTitles(mockScene);
            expect(mockScene.add.text).toHaveBeenCalledWith(0, 0, "Banana", mockScene.config.subtitle.style);
        });

        test("subtitle text reverts to default style when one is not provided", () => {
            delete mockScene.config.subtitle.style;
            const expectedStyle = { fontSize: "36px", fontFamily: "ReithSans", align: "center" };
            createTitles(mockScene);
            expect(mockScene.add.text).toHaveBeenCalledWith(0, 0, "Subtitle", expectedStyle);
        });

        test("repositions the backdrop, text and icon when resize is called", () => {
            const titles = createTitles(mockScene);
            titles.subtitle.resize();
            expect(mockText.x).toBe(mockTitleArea.right - mockButtonPad * 2 - mockText.width / 2);
            expect(mockText.y).toBe(mockTitleArea.centerY);
            expect(mockSubtitleBackdrop.x).toBe(
                mockTitleArea.right - (mockSubtitleIcon.width + mockButtonPad * 4.5 + mockText.width) / 2,
            );
            expect(mockSubtitleBackdrop.y).toBe(mockTitleArea.centerY);
            expect(mockSubtitleIcon.x).toBe(
                mockText.x - mockText.width / 2 - mockSubtitleIcon.width / 2 - mockButtonPad / 2,
            );
            expect(mockSubtitleIcon.y).toBe(mockTitleArea.centerY);
        });

        test("destroys backdrop, text and icon when destroy is called", () => {
            const titles = createTitles(mockScene);
            titles.subtitle.destroy();
            expect(mockSubtitleBackdrop.destroy).toHaveBeenCalled();
            expect(mockSubtitleIcon.destroy).toHaveBeenCalled();
            expect(mockText.destroy).toHaveBeenCalled();
        });
    });
});
