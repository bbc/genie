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

export class GelButton extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, metrics, config) {
        super(scene, x, y, assetPath(Object.assign({}, config, { isMobile: metrics.isMobile })));
        this._id = config.key;
        this._isMobile = metrics.isMobile;
        this.name = config.name || "";
        this.positionOverride = config.positionOverride;
        this.indicator = noIndicator;
        this.setIndicator();
        this.shiftX = config.shiftX || 0;
        this.shiftY = config.shiftY || 0;

        if (config.animConfig) {
            config.animConfig.frames = this.scene.anims.generateFrameNumbers(config.animConfig.key);
            this.scene.anims.create(config.animConfig);
            this.play(config.animConfig.key);
        }

        this.setInteractive({ useHandCursor: true });
        this.setHitArea(metrics);
        this.setupMouseEvents(config, scene);
    }

    onPointerUp(config, screen) {
        const inputManager = this.scene.sys.game.input;
        inputManager.updateInputPlugins("", inputManager.pointers);
        publish(config, { screen })();
    }

    setupMouseEvents(config, screen) {
        this.on("pointerup", () => this.onPointerUp(config, screen));
        this.on("pointerout", () => this.setFrame(0));
        this.on("pointerover", () => this.setFrame(1));
    }

    setHitArea(metrics) {
        const hitPadding = fp.max([metrics.hitMin - this.width, metrics.hitMin - this.height, 0]);
        const width = this.width + hitPadding;
        const height = this.height + hitPadding;
        if (this.input) {
            this.input.hitArea = new Phaser.Geom.Rectangle(-hitPadding / 2, -hitPadding / 2, width, height);
        }
    }

    setImage(key) {
        this._id = key;
        this.setTexture(assetPath({ key: this._id, isMobile: this._isMobile }));
    }

    resize(metrics) {
        this._isMobile = metrics.isMobile;
        this.setTexture(assetPath({ key: this._id, isMobile: metrics.isMobile }));
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

/* istanbul ignore next */
Phaser.GameObjects.GameObjectFactory.register("gelButton", function(x, y, metrics, config) {
    const gelButton = new GelButton(this.scene, x, y, metrics, config);

    this.displayList.add(gelButton);
    this.updateList.add(gelButton);

    return gelButton;
});
