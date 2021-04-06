/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { createButtonPanel, resizeButtonPanel } from "../../../../src/components/shop/confirm/button-panel.js";
import * as Text from "../../../../src/core/layout/text.js";
import * as TitleText from "../../../../src/components/shop/confirm/title-text.js";
import * as Action from "../../../../src/components/shop/confirm/actions.js";
import * as Buttons from "../../../../src/components/shop/confirm/confirm-buttons.js";

jest.mock("../../../../src/components/shop/confirm/title-text.js");
jest.mock("../../../../src/core/layout/text.js");
jest.mock("../../../../src/components/shop/confirm/confirm-buttons.js");
jest.mock("../../../../src/components/shop/confirm/actions.js");
jest.mock("../../../../src/core/layout/metrics.js");

describe("button panel", () => {
    let mockScene;
    let mockContainer;
    let mockButton;
    let mockPanel;
    let mockItem;
    let mockText;
    let mockImage;
    let mockConfirmButtons;

    beforeEach(() => {
        mockConfirmButtons = "mockConfirmButtons";
        Buttons.addConfirmButtons = jest.fn(() => mockConfirmButtons);
        Action.actions = {
            mockMode: () => "mockButtonText",
        };
        mockImage = { setOrigin: jest.fn(() => mockImage) };
        mockText = { setOrigin: jest.fn(() => mockText) };
        Text.addText = jest.fn(() => mockText);
        TitleText.titleText = {
            mockAction: () => "mockTitleText",
        };
        const mockSafeArea = { width: 900, height: 600, centerX: -150, centerY: 0, y: 0 };
        mockScene = {
            assetPrefix: "prefix",
            add: { container: jest.fn(() => mockContainer), image: jest.fn(() => mockImage) },
            config: { confirm: { buttons: { buttonsRight: true }, prompt: "mockPrompt" } },
            layout: {
                getSafeArea: jest.fn(() => mockSafeArea),
            },
            scene: { key: "sceneKey" },
            transientData: { sceneKey: { action: "mockAction" }, shop: { mode: "mockMode" } },
        };
        mockContainer = { width: 300, height: 300, setPosition: jest.fn(), setScale: jest.fn(), add: jest.fn() };
        mockButton = { setX: jest.fn(), setY: jest.fn(), setScale: jest.fn(), width: 200 };
        const buttons = [mockButton, mockButton];
        mockPanel = { container: mockContainer, buttons };
        mockItem = { price: 42 };
    });

    afterEach(jest.clearAllMocks);

    describe("resizeButtonPanel", () => {
        test("sets correct container / button positions", () => {
            resizeButtonPanel(mockScene, mockPanel)();
            expect(mockContainer.setPosition).toHaveBeenCalledWith(-150, 0);
            expect(mockContainer.setScale).toHaveBeenCalledWith(2, 2);

            expect(mockButton.setScale.mock.calls[0][0]).toBe(1.4625);
            expect(mockButton.setX.mock.calls[0][0]).toBe(925);
            expect(mockButton.setY.mock.calls[0][0]).toBe(600);

            expect(mockButton.setScale.mock.calls[1][0]).toBe(1.4625);
            expect(mockButton.setX.mock.calls[1][0]).toBe(925);
            expect(mockButton.setY.mock.calls[1][0]).toBe(700);
        });

        test("sets correct container / button positions when configured to show on the left", () => {
            mockScene.config.confirm.buttons.buttonsRight = false;
            resizeButtonPanel(mockScene, mockPanel)();
            expect(mockContainer.setPosition).toHaveBeenCalledWith(-150, 0);
            expect(mockContainer.setScale).toHaveBeenCalledWith(1.5, 1.5);

            expect(mockButton.setScale.mock.calls[0][0]).toBe(0.73125);
            expect(mockButton.setX.mock.calls[0][0]).toBe(587.5);
            expect(mockButton.setY.mock.calls[0][0]).toBe(600);

            expect(mockButton.setScale.mock.calls[1][0]).toBe(0.73125);
            expect(mockButton.setX.mock.calls[1][0]).toBe(587.5);
            expect(mockButton.setY.mock.calls[1][0]).toBe(700);
        });
    });

    describe("createButtonPanel", () => {
        test("adds a container to the scene", () => {
            createButtonPanel(mockScene, mockItem);
            expect(mockScene.add.container).toHaveBeenCalled();
        });

        test("adds panel title text", () => {
            createButtonPanel(mockScene, mockItem);
            expect(Text.addText).toHaveBeenCalledWith(mockScene, 0, -120, "mockTitleText", "mockPrompt");
            expect(mockText.setOrigin).toHaveBeenCalledWith(0.5, 0);
        });

        test("adds panel currency text", () => {
            createButtonPanel(mockScene, mockItem);
            expect(Text.addText).toHaveBeenCalledWith(mockScene, 5, -70, mockItem.price, mockScene.config);
            expect(mockText.setOrigin).toHaveBeenCalledWith(0.5, 0);
            expect(mockText.setOrigin).toHaveBeenCalledWith(0, 0.5);
        });

        test("adds panel currency icon", () => {
            createButtonPanel(mockScene, mockItem);
            expect(mockScene.add.image).toHaveBeenCalledWith(-5, -70, "prefix.currencyIcon");
            expect(mockImage.setOrigin).toHaveBeenCalledWith(1, 0.5);
        });

        test("adds panel confirm buttons", () => {
            createButtonPanel(mockScene, mockItem);
            expect(Buttons.addConfirmButtons).toHaveBeenCalledWith(
                mockScene,
                mockScene.transientData.shop.mode,
                "mockButtonText",
                mockItem,
            );
        });

        test("adds panel title, currency text and icon to container", () => {
            createButtonPanel(mockScene, mockItem);
            expect(mockContainer.add).toHaveBeenCalledWith(mockText);
            expect(mockContainer.add).toHaveBeenCalledWith(mockImage);
            expect(mockContainer.add).toHaveBeenCalledTimes(3);
        });

        test("returns panel", () => {
            expect(createButtonPanel(mockScene, mockItem)).toEqual({
                title: mockText,
                currencyText: mockText,
                currencyIcon: mockImage,
                buttons: mockConfirmButtons,
                container: mockContainer,
            });
        });
    });
});
