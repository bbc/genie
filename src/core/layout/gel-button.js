import fp from "../../../lib/lodash/fp/fp.js";
import * as signal from "../signal-bus.js";
import { GameAssets } from "../game-assets.js";

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
        this.animations.sprite.anchor.setTo(0.5, 0.5);
        this.setHitArea(metrics);
    }

    setHitArea(metrics) {
        const width = fp.max([this.width, metrics.hitMin]);
        const height = fp.max([this.height, metrics.hitMin]);
        this.hitArea = new Phaser.Rectangle(-width / 2, -height / 2, width, height);
    }

    resize(metrics) {
        this.animations.sprite.loadTexture(assetPath({ key: this._id, isMobile: metrics.isMobile }));
        this.setHitArea(metrics);
    }
}

const paths = [[x => x.isMobile, x => "gelMobile." + x.key], [x => !x.isMobile, x => "gelDesktop." + x.key]];

const assetPath = fp.cond(paths);

const publish = (config, data) => () => {
    GameAssets.sounds.buttonClick.play();
    signal.bus.publish({
        channel: config.channel,
        name: config.key,
        data,
    });
};
