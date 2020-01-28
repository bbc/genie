/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { eventBus } from "../../../src/core/event-bus.js";
import * as GameSound from "../../../src/core/game-sound.js";
import { GelButton } from "../../../src/core/layout/gel-button";
import { Indicator } from "../../../src/core/layout/gel-indicator.js";
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
        GelButton.prototype.setInteractive = jest.fn(function() {
            this.input = {};
        });
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
            setDisplaySize: jest.fn(),
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
            id: "mockId",
            key: "mockKey",
            shiftX: 9,
            shiftY: 21,
            gameButton: false,
            name: "test name",
        };
    });

    afterEach(() => jest.clearAllMocks());

    describe("Constructor", () => {
        test("correctly sets class properties", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(gelButton.config).toEqual(mockConfig);
            expect(gelButton.isMobile).toBe(mockMetrics.isMobile);
        });

        test("correctly sets shift defaults if not provided in config", () => {
            delete mockConfig.shiftX;
            delete mockConfig.shiftY;
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(gelButton.config.shiftX).toBe(0);
            expect(gelButton.config.shiftY).toBe(0);
        });
        test("makes the sprite interactive", () => {
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
                name: mockConfig.id,
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
            expect(gelButton.input.hitArea).toEqual(new Phaser.Geom.Rectangle(0, 0, 100, 70));
        });
    });

    describe("Set Image function", () => {
        test("sets the correct key", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            gelButton.setTexture = jest.fn();
            gelButton.setImage("mockKey");
            expect(gelButton.config.key).toEqual("mockKey");
        });
        test("sets correct texture", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            gelButton.setTexture = jest.fn();
            gelButton.setImage("mockKey");
            expect(mockSprite.setTexture).toHaveBeenCalledWith(
                assetPath({ key: "mockKey", isMobile: gelButton.isMobile }),
            );
        });
    });

    describe("Resize function", () => {
        test("sets correct texture", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            gelButton.resize(mockMetrics);
            expect(mockSprite.setTexture).toHaveBeenCalledWith(
                assetPath({ key: gelButton.config.key, isMobile: gelButton.isMobile }),
            );
        });
        test("sets the button hit area", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            gelButton.input = { hitArea: {} };
            mockMetrics.hitMin = 66;
            gelButton.resize(mockMetrics);
            expect(gelButton.input.hitArea).toEqual(new Phaser.Geom.Rectangle(0, 0, 100, 66));
        });
        test("calls any overlays that have a resize method", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            const mockOverlay = { resize: jest.fn() };

            gelButton.overlays.set("test", mockOverlay);
            gelButton.resize(mockMetrics);
            expect(mockOverlay.resize).toHaveBeenCalled();
        });
    });

    describe("Set Indicator function", () => {
        test("creates an indicator when gmi unseen is true and button config has an indicator block", () => {
            gmi.achievements.unseen = true;
            mockConfig.indicator = { offsets: { desktop: { x: 0, y: 0 } } };
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);

            expect(gelButton.overlays.list.indicator).toBeInstanceOf(Indicator);
        });

        test("does not create an indicator when no config block and gmi unseen is false", () => {
            gmi.achievements.unseen = false;
            delete mockConfig.indicator;
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(gelButton.indicator).not.toBeDefined();
        });

        test("does not create an indicator when no config block and gmi unseen is true", () => {
            gmi.achievements.unseen = true;
            delete mockConfig.indicator;
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(gelButton.indicator).not.toBeDefined();
        });

        test("does not create an indicator when has config block and gmi unseen is false", () => {
            gmi.achievements.unseen = false;
            mockConfig.indicator = { offsets: { desktop: { x: 0, y: 0 } } };
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(gelButton.indicator).not.toBeDefined();
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
    });

    describe("overlays", () => {
        test("set adds sprite to overlays list", () => {
            mockScene.add.sprite = jest.fn((x, y, asset) => ({ x, y, asset }));
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);

            gelButton.overlays.set("test_key", "test_asset");

            expect(gelButton.overlays.list.test_key).toEqual("test_asset");
        });

        test("set makes sprite a child of the button's container", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            gelButton.add = jest.fn();

            gelButton.overlays.set("test_key", "test_asset");

            expect(gelButton.add).toHaveBeenCalledTimes(1);
        });

        test("remove deletes sprite from overlays list", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);

            gelButton.overlays.set("test_key", { destroy: jest.fn() });
            gelButton.overlays.remove("test_key");

            expect(gelButton.overlays.list.test_key).not.toBeDefined();
        });

        test("remove unparents sprite from button's container", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            gelButton.remove = jest.fn();

            gelButton.overlays.set("test_key", { destroy: jest.fn() });
            gelButton.overlays.remove("test_key");
            expect(gelButton.remove).toHaveBeenCalledTimes(1);
        });
    });

    describe("Animated Buttons", () => {
        test("Creates and plays an animation if config is present", () => {
            mockConfig.anim = {
                key: "character-select.char1",
                frames: 18,
                frameRate: 6,
                yoyo: true,
                repeat: -1,
            };
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);

            expect(mockScene.anims.create).toHaveBeenCalledWith(mockConfig.anim);
            expect(gelButton.sprite.play).toHaveBeenCalledWith(mockConfig.anim.key);
        });
    });
});
