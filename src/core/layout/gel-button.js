/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { eventBus } from "../event-bus.js";
import * as GameSound from "../game-sound.js";
import { gmi } from "../gmi/gmi.js";
import { assetPath } from "./asset-paths.js";
import { Indicator } from "./gel-indicator.js";

const defaults = {
    shiftX: 0,
    shiftY: 0,
    name: "",
};

export class GelButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, metrics, config) {
        super(scene, x, y);

        this.sprite = scene.add.sprite(0, 0, assetPath(Object.assign({}, config, { isMobile: metrics.isMobile })));
        this.add(this.sprite);

        this.config = { ...defaults, ...config };
        this.isMobile = metrics.isMobile;
        config.indicator && this.setIndicator();

        if (config.anim) {
            config.anim.frames = this.scene.anims.generateFrameNumbers(config.anim.key);
            this.scene.anims.create(config.anim);
            this.sprite.play(config.anim.key);
        }

        this.setInteractive({
            hitArea: this.sprite,
            useHandCursor: true,
            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
        });

        this.setHitArea(metrics);
        this.setupMouseEvents(config, scene);
    }

    overlays = {
        set: (key, asset) => {
            this.overlays.list[key] = asset;
            this.add(this.overlays.list[key]);
        },
        remove: key => {
            if (!this.overlays.list[key]) {
                return;
            }
            this.remove(this.overlays.list[key]);
            this.overlays.list[key].destroy();
            delete this.overlays.list[key];
        },
        list: {},
    };

    onPointerUp(config, screen) {
        const inputManager = this.scene.sys.game.input;
        inputManager.updateInputPlugins("", inputManager.pointers);
        publish(config, { screen })();
    }

    setupMouseEvents(config, screen) {
        this.on("pointerup", () => this.onPointerUp(config, screen));
        this.on("pointerout", () => this.sprite.setFrame(0));
        this.on("pointerover", () => this.sprite.setFrame(1));
    }

    setHitArea(metrics) {
        const hitPadding = {
            x: fp.max([metrics.hitMin - this.sprite.width, 0]),
            y: fp.max([metrics.hitMin - this.sprite.height, 0]),
        };
        const width = this.sprite.width + hitPadding.x;
        const height = this.sprite.height + hitPadding.y;
        if (this.input) {
            this.input.hitArea = new Phaser.Geom.Rectangle(-hitPadding.x / 2, -hitPadding.y / 2, width, height);
        }

        this.setSize(width, height);
    }

    getHitAreaBounds() {
        const wtm = this.getWorldTransformMatrix();

        return new Phaser.Geom.Rectangle(
            wtm.getX(-this.input.hitArea.width / 2, 0),
            wtm.getY(0, -this.input.hitArea.height / 2),
            this.input.hitArea.width * this.parentContainer.scale,
            this.input.hitArea.height * this.parentContainer.scale,
        );
    }

    setImage(key) {
        this.config.key = key;
        this.sprite.setTexture(assetPath({ ...this.config, key, isMobile: this.isMobile }));
    }

    resize(metrics) {
        this.isMobile = metrics.isMobile;
        this.sprite.setTexture(assetPath({ key: this.config.key, isMobile: metrics.isMobile }));
        this.setHitArea(metrics);

        Object.values(this.overlays.list)
            .filter(overlay => Boolean(overlay.resize))
            .map(overlay => overlay.resize());
    }

    setIndicator() {
        this.overlays.remove("indicator");
        if (!gmi.achievements.unseen) {
            return;
        }

        this.overlays.set("indicator", new Indicator(this));
        this.overlays.list.indicator.resize();
    }
}

const publish = (config, data) => () => {
    GameSound.Assets.buttonClick.play();
    eventBus.publish({
        channel: config.channel,
        name: config.key,
        data,
    });
};
