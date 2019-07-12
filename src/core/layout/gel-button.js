/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import * as signal from "../signal-bus.js";
import * as GameSound from "../game-sound.js";
import { gmi } from "../gmi/gmi.js";

class Indicator extends Phaser.Sprite {
    constructor(parent) {
        super(parent.game, 0, 0, assetPath({ key: "notification", isMobile: parent._isMobile }));
        this.parent = parent;
        this.scale = { x: 0, y: 0 };
        this.anchor.set(0.5, 0.5);
        parent.game.add.tween(this.scale).to({ x: 1, y: 1 }, 500, Phaser.Easing.Bounce.Out, true, 1000);
        parent.addChild(this);
        this.resize();
    }

    resize() {
        this.position.x = this.parent.width / 2;
        this.position.y = this.parent.height / -2;
        this.animations.sprite.loadTexture(assetPath({ key: "notification", isMobile: this.parent._isMobile }));
    }
}

const noIndicator = {
    resize: () => {},
    destroy: () => {},
};

export class GelButton extends Phaser.Button {
    constructor(game, x, y, metrics, config) {
        super(
            game,
            x,
            y,
            assetPath({ key: config.key, isMobile: metrics.isMobile }),
            publish(config, { game }),
            undefined,
            1,
            0,
        );
        this._id = config.key;
        this._isMobile = metrics.isMobile;
        this.positionOverride = config.positionOverride;
        this.animations.sprite.anchor.setTo(0.5, 0.5);
        this.setHitArea(metrics);
        this.indicator = noIndicator;
        this.setIndicator();
        this.shiftX = config.shiftX || 0;
        this.shiftY = config.shiftY || 0;
    }

    setHitArea(metrics) {
        const hitPadding = fp.max([metrics.hitMin - this.width, metrics.hitMin - this.height, 0]);

        const width = this.width + hitPadding;
        const height = this.height + hitPadding;
        this.hitArea = new Phaser.Rectangle(-width / 2, -height / 2, width, height);
    }

    setImage(key) {
        this._id = key;
        this.animations.sprite.loadTexture(assetPath({ key: this._id, isMobile: this._isMobile }));
    }

    resize(metrics) {
        this._isMobile = metrics.isMobile;
        this.animations.sprite.loadTexture(assetPath({ key: this._id, isMobile: metrics.isMobile }));
        this.setHitArea(metrics);

        this.indicator.resize();
    }

    setIndicator() {
        this.indicator.destroy();
        const show = this._id === "achievements" && gmi.achievements.unseen;
        this.indicator = show ? new Indicator(this) : noIndicator;
    }
}

const paths = [[x => x.isMobile, x => "gelMobile." + x.key], [x => !x.isMobile, x => "gelDesktop." + x.key]];

const assetPath = fp.cond(paths);

const publish = (config, data) => () => {
    GameSound.Assets.buttonClick.play();
    signal.bus.publish({
        channel: config.channel,
        name: config.key,
        data,
    });
};
