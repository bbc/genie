/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { eventBus } from "../event-bus.js";
import * as GameSound from "../game-sound.js";
import { gmi } from "../gmi/gmi.js";

class Indicator extends Phaser.GameObjects.Sprite {
    constructor(gelButton) {
        super(gelButton.scene, 0, 0, assetPath({ key: "notification", isMobile: gelButton._isMobile }));
        this.scene.add.existing(this);
        this.setDepth(1);
        this.gelButton = gelButton;
        this.scale = 0;
        this.scene.add.tween({ targets: this, ease: "Bounce", delay: 500, duration: 500, scale: 1 });
    }

    resize() {
        const { x, y, width } = this.gelButton.getBounds();
        this.x = x + width;
        this.y = y;
        this.setTexture(assetPath({ key: "notification", isMobile: this.gelButton._isMobile }));
    }
}

export const noIndicator = {
    resize: () => {},
    destroy: () => {},
};

/*
    addOverlay(key, x, y) //key is unique so we can always pull that out
    removeOverlay(key)  //

    //maybe the above should just pass the sprite in?

    //Could we also combine the above
    all it needs is resize calling on it?

 */

export class GelButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, metrics, config) {
        super(scene, x, y);

        this.sprite = scene.add.sprite(0, 0, assetPath(Object.assign({}, config, { isMobile: metrics.isMobile })))
        this.add(this.sprite)

        this._id = config.key;
        this._isMobile = metrics.isMobile;
        this.name = config.name || "";
        this.indicator = noIndicator;
        this.setIndicator();
        this.shiftX = config.shiftX || 0;
        this.shiftY = config.shiftY || 0;

        this.setInteractive({ hitArea: this.sprite, useHandCursor: true, hitAreaCallback: Phaser.Geom.Rectangle.Contains });
        this.setHitArea(metrics);
        this.setupMouseEvents(config, scene);
    }

    addOverlay(x, y, key) {
        //Todo X and Y should be rel to button? Will this work with containers automatically?
        //needs to be added to an array
        this.scene.add.sprite(x, y, key);
    }

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

        this.setSize(width, height)
    }

    getHitAreaBounds() {
        const wtm = this.getWorldTransformMatrix();

        return new Phaser.Geom.Rectangle(
            wtm.getX(-this.input.hitArea.width / 2, 0),
            wtm.getY(0, -this.input.hitArea.height / 2),
            this.input.hitArea.width * this.parentContainer.scale,
            this.input.hitArea.height * this.parentContainer.scale
        )
    }

    setImage(key) {
        this._id = key;
        this.sprite.setTexture(assetPath({ key: this._id, isMobile: this._isMobile }));
    }

    resize(metrics) {
        this._isMobile = metrics.isMobile;
        this.sprite.setTexture(assetPath({ key: this._id, isMobile: metrics.isMobile }));
        this.setHitArea(metrics);
    }

    setIndicator() {
        this.indicator.destroy();
        const show = this._id === "achievements" && gmi.achievements.unseen;
        this.indicator = show ? new Indicator(this) : noIndicator;
    }

    updateIndicatorPosition() {
        this.indicator.resize();
    }
}

const paths = [
    [x => x.gameButton, x => `${x.scene}.${x.key}`],
    [x => x.isMobile, x => "gelMobile." + x.key],
    [x => !x.isMobile, x => "gelDesktop." + x.key],
];

export const assetPath = fp.cond(paths);

const publish = (config, data) => () => {
    GameSound.Assets.buttonClick.play();
    eventBus.publish({
        channel: config.channel,
        name: config.key,
        data,
    });
};
