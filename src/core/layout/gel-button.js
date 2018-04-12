import fp from "../../lib/lodash/fp/fp.js";
import * as signal from "../signal-bus.js";

export class GelButton extends Phaser.Button {
    constructor(game, x, y, isMobile, config) {
        super(game, x, y, assetPath({ key: config.key, isMobile }), publish(config, { game }), undefined, 1, 0);
        this._id = config.key;
        this.animations.sprite.anchor.setTo(0.5, 0.5);
    }

    resize(metrics) {
        this.animations.sprite.loadTexture(assetPath({ key: this._id, isMobile: metrics.isMobile }));
    }
}

const paths = [
    [x => x.isMobile, x => "gel/mobile/" + x.key + ".png"],
    [x => !x.isMobile, x => "gel/desktop/" + x.key + ".png"],
];

const assetPath = fp.cond(paths);

const publish = (config, data) => () => {
    signal.bus.publish({
        channel: config.channel,
        name: config.key,
        data,
    });
};
