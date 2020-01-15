/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { debugLayout } from "../../../src/core/debug/layout-debug-draw.js";

describe("Layout debug draw", () => {
    let mockScreen;
    let mockGraphicsObject;

    beforeEach(() => {
        mockGraphicsObject = {
            fillRectShape: jest.fn(),
            strokeRect: jest.fn(),
            destroy: jest.fn(),
            fillStyle: jest.fn(),
            lineStyle: jest.fn(),
        };
        mockScreen = {
            debugGraphics: mockGraphicsObject,
            game: {
                canvas: { width: 800, height: 600 },
                scale: { parent: { offsetWidth: 800, offsetHeight: 600 } },
            },
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe("debugLayout function", () => {
        test("draws a box to represent the game area", () => {
            debugLayout(mockScreen);
            expect(mockGraphicsObject.fillStyle).toHaveBeenCalledWith(0x32cd32, 0.5);

            expect(mockGraphicsObject.fillRectShape).toHaveBeenCalledWith({
                height: 600,
                type: 5,
                width: 800,
                x: -400,
                y: -300,
            });
        });

        test("draws a box to represent the outer GEL padding", () => {
            debugLayout(mockScreen);

            expect(mockGraphicsObject.lineStyle).toHaveBeenCalledWith(16, 0xffff00, 0.5);
            expect(mockGraphicsObject.strokeRect).toHaveBeenCalledWith(-392, -292, 784, 584);
        });

        test("draws a box to represent the outer GEL padding when aspect ratio is above 4:3", () => {
            mockScreen.game.scale.parent = { offsetWidth: 1600, offsetHeight: 800 };

            debugLayout(mockScreen);

            expect(mockGraphicsObject.lineStyle).toHaveBeenCalledWith(24, 0xffff00, 0.5);
            expect(mockGraphicsObject.strokeRect).toHaveBeenCalledWith(-588, -288, 1176, 576);
        });
    });
});
