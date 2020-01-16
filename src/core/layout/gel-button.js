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
import { Indicator, noIndicator } from "./gel-indicator.js";

export class GelButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, metrics, config) {
        super(scene, x, y);

        this.sprite = scene.add.sprite(0, 0, assetPath(Object.assign({}, config, { isMobile: metrics.isMobile })));
        this.add(this.sprite);

        this._id = config.id;
        this._key = config.key;
        this._isMobile = metrics.isMobile;
        this.name = config.name || "";
        this.indicator = noIndicator;
        this.setIndicator();
        this.shiftX = config.shiftX || 0;
        this.shiftY = config.shiftY || 0;

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
        set: (key, x, y, asset) => {
            //how do we handle breakpoints?
            this.overlays.list[key] = this.scene.add.sprite(x, y, asset);
            this.add(this.overlays.list[key]);
        },
        remove: key => {
            this.remove(this.overlays.list[key]);
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
        const hitPadding = fp.max([metrics.hitMin - this.sprite.width, metrics.hitMin - this.sprite.height, 0]);
        const width = this.sprite.width + hitPadding;
        const height = this.sprite.height + hitPadding;
        if (this.input) {
            this.input.hitArea = new Phaser.Geom.Rectangle(-hitPadding / 2, -hitPadding / 2, width, height);
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
        this._key = key;
        this.sprite.setTexture(assetPath({ key, isMobile: this._isMobile }));
    }

    resize(metrics) {
        this._isMobile = metrics.isMobile;
        this.sprite.setTexture(assetPath({ key: this._key, isMobile: metrics.isMobile }));
        this.setHitArea(metrics);
    }

    setIndicator() {
        this.indicator.destroy();
        const show = (this._key === "achievements" || this._key === "achievements-circular") && gmi.achievements.unseen;
        this.indicator = show ? new Indicator(this.sprite, this._key) : noIndicator;
    }

    updateIndicatorPosition() {
        this.indicator.resize();
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
