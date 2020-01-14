/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { eventBus } from "../../../src/core/event-bus.js";
import * as GameSound from "../../../src/core/game-sound.js";
import { GelButton } from "../../../src/core/layout/gel-button";
import { noIndicator } from "../../../src/core/layout/gel-indicator.js";
import { gmi } from "../../../src/core/gmi/gmi.js";
import { assetPath } from "../../../src/core/layout/asset-paths.js";

describe("Gel Button", () => {
    let mockScene;
    let mockX;
    let mockY;
    let mockMetrics;
    let mockConfig;
    let mockSprite;

    beforeEach(() => {
        gmi.achievements = { unseen: false };
        GelButton.prototype.width = 64;
        GelButton.prototype.height = 64;
        GelButton.prototype.setFrame = jest.fn();
        GelButton.prototype.setSizeToFrame = jest.fn();
        GelButton.prototype.add = jest.fn();
        eventBus.publish = jest.fn();
        GameSound.Assets = {
            backgroundMusic: {},
            buttonClick: { play: jest.fn() },
        };
        mockSprite = {
            width: 100,
            height: 50,
            setTexture: jest.fn(),
            setFrame: jest.fn(),
            play: jest.fn(),
        };
        mockScene = {
            add: {
                existing: jest.fn(),
                tween: jest.fn(),
                sprite: jest.fn(() => mockSprite),
            },
            sys: {
                queueDepthSort: jest.fn(),
                anims: {
                    once: jest.fn(),
                    generateFrameNumbers: jest.fn(),
                },
                textures: {
                    get: jest.fn(() => ({
                        get: jest.fn(() => new Map()),
                    })),
                },
                game: {
                    input: {
                        pointers: [],
                        updateInputPlugins: jest.fn(),
                    },
                    renderer: {},
                },
                input: {
                    enable: jest.fn(),
                },
            },
            anims: {
                once: jest.fn(),
                generateFrameNumbers: jest.fn(),
                create: jest.fn(),
                load: jest.fn(),
            },
        };
        mockX = 7;
        mockY = 42;
        mockMetrics = {
            borderPad: 24,
            buttonMin: 64,
            buttonPad: 24,
            height: 600,
            hitMin: 70,
            horizontals: { left: -608.5, center: 0, right: 608.5 },
            isMobile: false,
            safeHorizontals: { left: -400, center: 0, right: 400 },
            scale: 1,
            stageHeight: 600,
            stageWidth: 1217,
            verticals: { top: -300, middle: 0, bottom: 300 },
            width: 1217,
        };
        mockConfig = {
            channel: "mockChannel",
            key: "mockKey",
            shiftX: 9,
            shiftY: 21,
        };
    });

    afterEach(() => jest.clearAllMocks());

    describe("Constructor", () => {
        test("correctly sets class properties", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(gelButton._key).toBe(mockConfig.key);
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
            expect(gelButton.setInteractive).toHaveBeenCalled();
        });
        test("sets up mouse events", () => {
            GelButton.prototype.on = jest.fn();
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(gelButton.on).toHaveBeenCalledWith("pointerup", expect.any(Function));
            expect(gelButton.on).toHaveBeenCalledWith("pointerout", expect.any(Function));
            expect(gelButton.on).toHaveBeenCalledWith("pointerover", expect.any(Function));
        });
    });

    describe("Pointer events", () => {
        test("pointerout event sets frame to 0", () => {
            GelButton.prototype.on = jest.fn((event, callback) => {
                if (event === Phaser.Input.Events.POINTER_OUT) {
                    callback();
                }
            });
            new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(mockSprite.setFrame).toHaveBeenCalledWith(0);
        });
        test("pointerover event sets frame to 1", () => {
            GelButton.prototype.on = jest.fn((event, callback) => {
                if (event === Phaser.Input.Events.POINTER_OVER) {
                    callback();
                }
            });
            new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(mockSprite.setFrame).toHaveBeenCalledWith(1);
        });
        test("callback is added to the POINTER_UP event emitter", () => {
            GelButton.prototype.on = jest.fn((event, callback) => {
                if (event === Phaser.Input.Events.POINTER_UP) {
                    callback();
                }
            });
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(gelButton.on).toHaveBeenCalledWith(Phaser.Input.Events.POINTER_UP, expect.any(Function));
        });
        test("pointerup function publishes to event bus", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            gelButton.onPointerUp(mockConfig, mockScene);
            expect(eventBus.publish).toHaveBeenCalledWith({
                channel: mockConfig.channel,
                name: mockConfig.key,
                data: { screen: mockScene },
            });
        });
        test("pointerup function updates pointer states", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            gelButton.onPointerUp(mockConfig, mockScene);
            expect(mockScene.sys.game.input.updateInputPlugins).toHaveBeenCalledWith(
                "",
                mockScene.sys.game.input.pointers,
            );
        });
    });

    describe("setHitArea function", () => {
        test("sets the correct hitarea on the button", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            gelButton.input = { hitArea: {} };
            gelButton.setHitArea(mockMetrics);
            expect(gelButton.input.hitArea).toEqual(new Phaser.Geom.Rectangle(-10, -10, 120, 70));
        });
    });

    describe("Set Image function", () => {
        test("sets the correct key", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            gelButton.setTexture = jest.fn();
            gelButton.setImage("mockKey");
            expect(gelButton._key).toEqual("mockKey");
        });
        test("sets correct texture", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            gelButton.setTexture = jest.fn();
            gelButton.setImage("mockKey");
            expect(mockSprite.setTexture).toHaveBeenCalledWith(
                assetPath({ key: "mockKey", isMobile: gelButton._isMobile }),
            );
        });
    });

    describe("Resize function", () => {
        test("sets correct texture", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            gelButton.resize(mockMetrics);
            expect(mockSprite.setTexture).toHaveBeenCalledWith(
                assetPath({ key: gelButton._key, isMobile: gelButton._isMobile }),
            );
        });
        test("sets the button hit area", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            gelButton.input = { hitArea: {} };
            mockMetrics.hitMin = 66;
            gelButton.resize(mockMetrics);
            expect(gelButton.input.hitArea).toEqual(new Phaser.Geom.Rectangle(-8, -8, 116, 66));
        });
    });

    describe("Indicator Constructor", () => {
        test("sets depth of indicator to 1", () => {
            mockConfig.key = "achievements";
            gmi.achievements.unseen = true;
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(gelButton.indicator.depth).toBe(1);
        });
        test("sets scale of indicator to 0", () => {
            mockConfig.key = "achievements";
            gmi.achievements.unseen = true;
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(gelButton.indicator.scale).toBe(0);
        });
    });

    describe("Set Indicator function", () => {
        test("creates an indicator when the id is achievements and gmi unseen is true", () => {
            mockConfig.key = "achievements";
            gmi.achievements.unseen = true;
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(gelButton.indicator).toBeInstanceOf(Phaser.GameObjects.Sprite);
        });
        test("creates a noIndicator when the id is achievements and gmi unseen is false", () => {
            mockConfig.key = "achievements";
            gmi.achievements.unseen = false;
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(gelButton.indicator).toBe(noIndicator);
        });
        test("creates a noIndicator when the id is not achievements and gmi unseen is true", () => {
            mockConfig.key = "something";
            gmi.achievements.unseen = true;
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            gelButton.indicator.resize();
            expect(gelButton.indicator).toBe(noIndicator);
        });
        test("creates a noIndicator when the id is not achievements and gmi unseen is false", () => {
            mockConfig.key = "something";
            gmi.achievements.unseen = false;
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(gelButton.indicator).toBe(noIndicator);
        });
    });

    describe("Update Indicator Position function", () => {
        test("calls resize function on indicator", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            const mockIndicator = { resize: jest.fn() };
            gelButton.indicator = mockIndicator;
            gelButton.updateIndicatorPosition();
            expect(mockIndicator.resize).toHaveBeenCalled();
        });
    });

    describe("getHitAreaBounds method", () => {
        test("returns the hit Area as a Phaser rectangle in world space", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);

            gelButton.input = {
                hitArea: {
                    width: 200,
                    height: 100,
                },
            };

            gelButton.parentContainer = {
                scale: 2,
            };

            const mockWtm = {
                getX: () => 0,
                getY: () => 0,
            };

            gelButton.getWorldTransformMatrix = () => mockWtm;

            expect(gelButton.getHitAreaBounds()).toEqual(new Phaser.Geom.Rectangle(0, 0, 400, 200));
        });

        test("indicator resize function updates x and y positions", () => {
            mockConfig.key = "achievements";
            gmi.achievements.unseen = true;
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            gelButton.getBounds = () => {
                return { x: 50, y: 80, width: 100 };
            };
            gelButton.updateIndicatorPosition();
            expect(gelButton.indicator.x).toBe(150);
            expect(gelButton.indicator.y).toBe(80);
        });

        test("indicator resize function updates texture", () => {
            mockConfig.key = "achievements";
            gmi.achievements.unseen = true;
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            gelButton.indicator.setTexture = jest.fn();
            gelButton.getBounds = () => ({ x: 50, y: 80, width: 100 });
            gelButton.updateIndicatorPosition();
            expect(gelButton.indicator.setTexture).toHaveBeenCalledWith(
                assetPath({ key: "notification", isMobile: gelButton._isMobile }),
            );
        });
    });

    describe("overlays", () => {
        test("set adds sprite to overlays list", () => {
            mockScene.add.sprite = jest.fn((x, y, asset) => ({ x, y, asset }));
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);

            gelButton.overlays.set("test_key", 10, 20, "test_asset");

            expect(gelButton.overlays.list.test_key).toEqual({ x: 10, y: 20, asset: "test_asset" });
        });

        test("set makes sprite a child of the button's container", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            gelButton.add = jest.fn();

            gelButton.overlays.set("test_key", 10, 20, "test_asset");

            expect(gelButton.add).toHaveBeenCalledTimes(1);
        });

        test("remove deletes sprite from overlays list", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);

            gelButton.overlays.set("test_key", 10, 20, "test_asset");
            gelButton.overlays.remove("test_key");

            expect(gelButton.overlays.list.test_key).not.toBeDefined();
        });

        test("remove unparents sprite from button's container", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            gelButton.remove = jest.fn();

            gelButton.overlays.set("test_key", 10, 20, "test_asset");
            gelButton.overlays.remove("test_key");

            expect(gelButton.remove).toHaveBeenCalledTimes(1);
        });
    });

    describe("Animated Buttons", () => {
        test("sets depth of indicator to 1", () => {
            mockConfig.animConfig = {
                key: "character-select.char1",
                frames: 18,
                frameRate: 6,
                yoyo: true,
                repeat: -1,
            };
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(gelButton.indicator).toBe(noIndicator);
        });
    });
});
