/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { eventBus } from "../../../src/core/event-bus.js";
import * as GameSound from "../../../src/core/music.js";
import { GelButton } from "../../../src/core/layout/gel-button";
import { Indicator } from "../../../src/core/layout/gel-indicator.js";
import { gmi } from "../../../src/core/gmi/gmi.js";
import { assetPath } from "../../../src/core/layout/asset-paths.js";
import * as ScalerModule from "../../../src/core/scaler.js";

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
        GelButton.prototype.setInteractive = jest.fn(function () {
            this.input = {};
        });
        GelButton.prototype.setScrollFactor = jest.fn();
        eventBus.publish = jest.fn();
        GameSound.Assets = {
            backgroundMusic: {},
            buttonClick: {
                play: jest.fn(() => GameSound.Assets.buttonClick),
                once: jest.fn(() => GameSound.Assets.buttonClick),
                resume: jest.fn(() => GameSound.Assets.buttonClick),
            },
        };
        mockSprite = {
            width: 100,
            height: 50,
            setTexture: jest.fn(),
            setFrame: jest.fn(),
            play: jest.fn(),
            setDisplaySize: jest.fn(),
            setScrollFactor: jest.fn(),
            texture: {
                frames: {
                    0: "foo",
                    1: "bar",
                },
            },
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
                    on: jest.fn(),
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
            sound: {
                add: jest.fn(() => GameSound.Assets.buttonClick),
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
            horizontalBorderPad: 24,
            verticalBorderPad: 24,
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

        ScalerModule.getMetrics = jest.fn(() => mockMetrics);
        mockConfig = {
            channel: "mockChannel",
            id: "mockId",
            key: "mockKey",
            shiftX: 9,
            shiftY: 21,
            gameButton: false,
            name: "test name",
            clickSound: "loader.buttonClick",
        };
    });

    afterEach(() => jest.clearAllMocks());

    describe("Constructor", () => {
        test("correctly sets class properties", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);
            expect(gelButton.config).toEqual(mockConfig);
            expect(gelButton.isMobile).toBe(mockMetrics.isMobile);
            expect(mockSprite.setScrollFactor).toHaveBeenCalledWith(0);
            expect(gelButton.setScrollFactor).toHaveBeenCalledWith(0);
        });
        test("correctly sets shift defaults if not provided in config", () => {
            delete mockConfig.shiftX;
            delete mockConfig.shiftY;
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);
            expect(gelButton.config.shiftX).toBe(0);
            expect(gelButton.config.shiftY).toBe(0);
        });
        test("makes the sprite interactive", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);
            expect(gelButton.setInteractive).toHaveBeenCalled();
        });
        test("sets up mouse events", () => {
            GelButton.prototype.on = jest.fn();
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(gelButton.on).toHaveBeenCalledWith("pointerup", expect.any(Function));
            expect(gelButton.on).toHaveBeenCalledWith("pointerout", expect.any(Function));
            expect(gelButton.on).toHaveBeenCalledWith("pointerover", expect.any(Function));
        });
        test("does not call setScrollFactor if configured scrollable", () => {
            const scrollableMockConfig = { ...mockConfig, scrollable: true };
            new GelButton(mockScene, mockX, mockY, scrollableMockConfig);
            expect(mockSprite.setScrollFactor).not.toHaveBeenCalled();
        });
    });

    describe("Pointer events", () => {
        test("pointerup event calls button.onPointerUp with config and scene", () => {
            let callback;
            GelButton.prototype.on = jest.fn((event, cb) => {
                if (event === Phaser.Input.Events.POINTER_UP) {
                    callback = cb;
                }
            });
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);
            gelButton.onPointerUp = jest.fn();

            callback();
            expect(gelButton.onPointerUp).toHaveBeenCalledWith(mockConfig, mockScene);
        });

        test("pointerout event sets frame to 0", () => {
            GelButton.prototype.on = jest.fn((event, callback) => {
                if (event === Phaser.Input.Events.POINTER_OUT) {
                    callback();
                }
            });
            new GelButton(mockScene, mockX, mockY, mockConfig);
            expect(mockSprite.setFrame).toHaveBeenCalledWith(0);
        });
        test("pointerover event sets frame to 1", () => {
            GelButton.prototype.on = jest.fn((event, callback) => {
                if (event === Phaser.Input.Events.POINTER_OVER) {
                    callback();
                }
            });
            new GelButton(mockScene, mockX, mockY, mockConfig);
            expect(mockSprite.setFrame).toHaveBeenCalledWith(1);
        });
        test("pointerover event does not set frame to 1 if no frame 1 exists", () => {
            mockSprite.texture.frames = { 0: "foo" };
            GelButton.prototype.on = jest.fn((event, callback) => {
                if (event === Phaser.Input.Events.POINTER_OVER) {
                    callback();
                }
            });
            new GelButton(mockScene, mockX, mockY, mockConfig);
            expect(mockSprite.setFrame).not.toHaveBeenCalled();
        });
        test("callback is added to the POINTER_UP event emitter", () => {
            GelButton.prototype.on = jest.fn();
            const gelButton = new GelButton(mockScene, mockX, mockY, mockMetrics, mockConfig);
            expect(gelButton.on).toHaveBeenCalledWith(Phaser.Input.Events.POINTER_UP, expect.any(Function));
        });
        test("pointerup function publishes to event bus", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);
            gelButton.onPointerUp(mockConfig, mockScene);
            expect(eventBus.publish).toHaveBeenCalledWith({
                channel: mockConfig.channel,
                name: mockConfig.id,
                data: { screen: mockScene },
            });
        });
        test("pointerup updates pointer states", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);
            gelButton.onPointerUp(mockConfig, mockScene);
            expect(mockScene.sys.game.input.updateInputPlugins).toHaveBeenCalledWith(
                "",
                mockScene.sys.game.input.pointers,
            );
        });

        test("pointerup calls play on button click sound", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);
            gelButton.onPointerUp(mockConfig, mockScene);
            expect(GameSound.Assets.buttonClick.play).toHaveBeenCalled();
        });

        test("pointerup calls play on button click sound after it has been changed", () => {
            const mockSound = { play: jest.fn(), once: jest.fn(() => mockSound) };
            mockScene.sound.add = jest.fn(() => mockSound);

            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);
            gelButton.setClickSound("test-key");

            gelButton.onPointerUp(mockConfig, mockScene);
            expect(mockSound.play).toHaveBeenCalled();
        });

        test("pointerup function calls once on button click to prevent pausing", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);
            gelButton.onPointerUp(mockConfig, mockScene);
            expect(GameSound.Assets.buttonClick.once).toHaveBeenCalled();

            GameSound.Assets.buttonClick.once.mock.calls[0][1]();
            expect(GameSound.Assets.buttonClick.resume).toHaveBeenCalled();
        });
    });

    describe("setHitArea function", () => {
        test("sets the correct hitarea on the button", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);
            gelButton.input = { hitArea: {} };
            gelButton.setHitArea(mockMetrics);
            expect(gelButton.input.hitArea).toEqual(new Phaser.Geom.Rectangle(0, 0, 120, 70));
        });
    });

    describe("setClickSound function", () => {
        test("sets the correct sound key in button config", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);
            const mockSound = { testProp: "testValue" };
            (mockScene.sound.add = jest.fn(() => mockSound)), gelButton.setClickSound("test-key");

            expect(gelButton.config.clickSound).toBe("test-key");
            expect(gelButton._click).toBe(mockSound);
        });
    });

    describe("Set Image function", () => {
        test("sets the correct key", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);
            gelButton.setTexture = jest.fn();
            gelButton.setImage("mockKey");
            expect(gelButton.config.key).toEqual("mockKey");
        });
        test("sets correct texture", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);
            gelButton.setTexture = jest.fn();
            gelButton.setImage("mockKey");
            expect(mockSprite.setTexture).toHaveBeenCalledWith(
                assetPath({ key: "mockKey", isMobile: gelButton.isMobile }),
            );
        });
    });

    describe("Resize function", () => {
        test("sets correct texture", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);
            gelButton.resize(mockMetrics);
            expect(mockSprite.setTexture).toHaveBeenCalledWith(
                assetPath({ key: gelButton.config.key, isMobile: gelButton.isMobile }),
            );
        });
        test("sets the button hit area", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);
            gelButton.input = { hitArea: {} };
            mockMetrics.hitMin = 66;
            gelButton.resize(mockMetrics);
            expect(gelButton.input.hitArea).toEqual(new Phaser.Geom.Rectangle(0, 0, 116, 66));
        });
        test("calls any overlays that have a resize method", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);
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
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);

            expect(gelButton.overlays.list.indicator).toBeInstanceOf(Indicator);
        });

        test("does not create an indicator when no config block and gmi unseen is false", () => {
            gmi.achievements.unseen = false;
            delete mockConfig.indicator;
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);
            expect(gelButton.indicator).not.toBeDefined();
        });

        test("does not create an indicator when no config block and gmi unseen is true", () => {
            gmi.achievements.unseen = true;
            delete mockConfig.indicator;
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);
            expect(gelButton.indicator).not.toBeDefined();
        });

        test("does not create an indicator when has config block and gmi unseen is false", () => {
            gmi.achievements.unseen = false;
            mockConfig.indicator = { offsets: { desktop: { x: 0, y: 0 } } };
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);
            expect(gelButton.indicator).not.toBeDefined();
        });
    });

    describe("getHitAreaBounds method", () => {
        test("returns the hit Area as a Phaser rectangle in world space", () => {
            const gelButton = new GelButton(mockScene, 50, 25, mockConfig);

            gelButton.input = {
                hitArea: {
                    width: 200,
                    height: 100,
                },
            };

            gelButton.parentContainer = {
                scale: 2,
            };

            expect(gelButton.getHitAreaBounds()).toEqual(new Phaser.Geom.Rectangle(-800, -350, 400, 200));
        });

        test("Takes button scale into account", () => {
            const gelButton = new GelButton(mockScene, 50, 25, mockConfig);
            gelButton.scale = 0.5;

            gelButton.input = {
                hitArea: {
                    width: 200,
                    height: 100,
                },
            };

            gelButton.parentContainer = {
                scale: 2,
            };
            expect(gelButton.getHitAreaBounds()).toEqual(new Phaser.Geom.Rectangle(-700, -300, 200, 100));
        });

        test("Uses a scale of 1 if button is not parented to a gel group (debug buttons)", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);
            gelButton.scale = 0.5;

            gelButton.input = {
                hitArea: {
                    width: 200,
                    height: 100,
                },
            };

            expect(gelButton.getHitAreaBounds()).toEqual(new Phaser.Geom.Rectangle(-743, -283, 100, 50));
        });
    });

    describe("overlays", () => {
        test("set adds sprite to overlays list", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);

            gelButton.overlays.set("test_key", "test_asset");

            expect(gelButton.overlays.list.test_key).toEqual("test_asset");
        });

        test("set makes sprite a child of the button's container", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);
            gelButton.add = jest.fn();

            gelButton.overlays.set("test_key", "test_asset");

            expect(gelButton.add).toHaveBeenCalledTimes(1);
        });

        test("remove deletes sprite from overlays list", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);

            gelButton.overlays.set("test_key", { destroy: jest.fn() });
            gelButton.overlays.remove("test_key");

            expect(gelButton.overlays.list.test_key).not.toBeDefined();
        });

        test("remove unparents sprite from button's container", () => {
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);
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
            const gelButton = new GelButton(mockScene, mockX, mockY, mockConfig);

            expect(mockScene.anims.create).toHaveBeenCalledWith(mockConfig.anim);
            expect(gelButton.sprite.play).toHaveBeenCalledWith(mockConfig.anim.key);
        });
    });
});
