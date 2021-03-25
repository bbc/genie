/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Indicator } from "../../../src/core/layout/gel-indicator.js";
import { assetPath } from "../../../src/core/layout/asset-paths.js";

describe("Gel Indicator", () => {
    let mockButton;

    beforeEach(() => {
        const mockFrame = {};
        const mockTexture = {
            get: jest.fn(() => mockFrame),
        };
        mockButton = {
            height: 100,
            width: 200,
            isMobile: true,
            config: {
                indicator: {
                    offsets: {
                        mobile: { x: 50, y: 0 },
                        desktop: { x: 100, y: -50 },
                    },
                },
            },
            scene: {
                add: { existing: jest.fn(), tween: jest.fn() },
                sys: {
                    queueDepthSort: jest.fn(),
                    anims: {
                        on: jest.fn(),
                    },
                    textures: {
                        get: jest.fn(() => mockTexture),
                    },
                },
            },
        };

        Indicator.prototype.setDepth = jest.fn();
        Indicator.prototype.setTexture = jest.fn();
        Indicator.prototype.frame = {
            realWidth: 200,
        };
    });

    describe("Constructor", () => {
        test("sets depth of indicator to 1", () => {
            const indicator = new Indicator(mockButton);
            expect(indicator.setDepth).toHaveBeenCalledWith(1);
        });

        test("sets scale of indicator to 0", () => {
            const indicator = new Indicator(mockButton);
            expect(indicator.scale).toBe(0);
        });
    });

    describe("resize method", () => {
        test("sets correct x and y positions for mobile devices", () => {
            const indicator = new Indicator(mockButton);

            indicator.resize();

            expect(indicator.x).toBe(150);
            expect(indicator.y).toBe(-50);
        });

        test("sets correct x and y positions for desktop", () => {
            mockButton.isMobile = false;
            const indicator = new Indicator(mockButton);

            indicator.resize();

            expect(indicator.x).toBe(200);
            expect(indicator.y).toBe(-100);
        });

        test("updates texture", () => {
            const indicator = new Indicator(mockButton);

            indicator.resize();

            expect(indicator.setTexture).toHaveBeenCalledWith(assetPath({ key: "notification", isMobile: true }));
        });
    });
});
