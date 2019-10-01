/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { GelButton, assetPath } from "../../../src/core/layout/gel-button";

describe("Gel Button", () => {
    let mockScene;
    let mockX;
    let mockY;
    let mockMetrics;
    let mockConfig;

    beforeEach(() => {
        mockScene = {
            sys: {
                queueDepthSort: jest.fn(),
                anims: {
                    once: jest.fn(),
                },
                textures: {
                    get: jest.fn(() => ({
                        get: jest.fn(() => new Map()),
                    })),
                },
                game: {
                    renderer: {},
                },
                input: {
                    enable: jest.fn(),
                },
            },
        };
        mockX = 7;
        mockY = 42;
        mockMetrics = {
            isMobile: true,
        };
        mockConfig = {
            key: "mockKey",
            shiftX: 9,
            shiftY: 21,
        };
    });

    afterEach(() => jest.clearAllMocks());

    describe("Constructor", () => {
        test("correctly sets class properties", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(gelButton._id).toBe(mockConfig.key);
            expect(gelButton._isMobile).toBe(mockMetrics.isMobile);
            expect(gelButton.positionOverride).toBe(mockConfig.positionOverride);
            expect(gelButton.shiftX).toBe(mockConfig.shiftX);
            expect(gelButton.shiftY).toBe(mockConfig.shiftY);
        });
        test("correctly sets shift defaults if not provided in config", () => {
            delete mockConfig.shiftX;
            delete mockConfig.shiftY;
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(gelButton.shiftX).toBe(0);
            expect(gelButton.shiftY).toBe(0);
        });
        test("makes the sprite interactive", () => {
            GelButton.prototype.setInteractive = jest.fn();
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(gelButton.setInteractive).toHaveBeenCalledWith({ useHandCursor: true });
        });
        test("sets up mouse events", () => {
            GelButton.prototype.on = jest.fn();
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(gelButton.on).toHaveBeenCalledWith("pointerdown", expect.any(Function));
            expect(gelButton.on).toHaveBeenCalledWith("pointerup", expect.any(Function));
            expect(gelButton.on).toHaveBeenCalledWith("pointerout", expect.any(Function));
            expect(gelButton.on).toHaveBeenCalledWith("pointerover", expect.any(Function));
        });
        test("sets the button hit area", () => {
            GelButton.prototype.setHitArea = jest.fn();
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(gelButton.setHitArea).toHaveBeenCalledWith(mockMetrics);
        });
    });

    describe("Resize function", () => {
        test("sets correct texture", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            gelButton.setTexture = jest.fn();
            gelButton.resize(mockMetrics);
            expect(gelButton.setTexture).toHaveBeenCalledWith(
                assetPath({ key: gelButton._id, isMobile: gelButton._isMobile }),
            );
        });
        test("sets the button hit area", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            gelButton.setHitArea = jest.fn();
            gelButton.resize(mockMetrics);
            expect(gelButton.setHitArea).toHaveBeenCalledWith(mockMetrics);
        });
    });
});
