/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { resizeButtonPanel } from "../../../../src/components/shop/confirm/button-panel.js";

describe("button panel", () => {
    let mockScene;
    let container;
    let mockButton;
    let mockPanel;
    beforeEach(() => {
        const mockSafeArea = { width: 900, height: 600, centerX: -150, centerY: 0, y: 0 };
        mockScene = {
            config: { confirm: { buttons: { buttonsRight: true } } },
            layout: {
                getSafeArea: jest.fn(() => mockSafeArea),
            },
        };
        container = { width: 300, height: 300, setPosition: jest.fn(), setScale: jest.fn() };
        mockButton = { setX: jest.fn(), setY: jest.fn(), setScale: jest.fn(), width: 200 };
        const buttons = [mockButton, mockButton];
        mockPanel = { container, buttons };
    });

    afterEach(jest.clearAllMocks);

    describe("resizeButtonPanel", () => {
        test("sets correct container / button positions", () => {
            resizeButtonPanel(mockScene, mockPanel)();
            expect(container.setPosition).toHaveBeenCalledWith(-150, 0);
            expect(container.setScale).toHaveBeenCalledWith(2, 2);

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
            expect(container.setPosition).toHaveBeenCalledWith(-150, 0);
            expect(container.setScale).toHaveBeenCalledWith(1.5, 1.5);

            expect(mockButton.setScale.mock.calls[0][0]).toBe(0.73125);
            expect(mockButton.setX.mock.calls[0][0]).toBe(587.5);
            expect(mockButton.setY.mock.calls[0][0]).toBe(600);

            expect(mockButton.setScale.mock.calls[1][0]).toBe(0.73125);
            expect(mockButton.setX.mock.calls[1][0]).toBe(587.5);
            expect(mockButton.setY.mock.calls[1][0]).toBe(700);
        });
    });
});
