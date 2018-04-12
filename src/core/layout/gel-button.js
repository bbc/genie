import fp from "../../lib/lodash/fp/fp.js";
import * as signal from "../signal-bus.js";

export class GelButton extends Phaser.Button {
    constructor(game, x, y, metrics, key) {
        super(game, x, y, assetPath({ key, isMobile: metrics.isMobile }), publish(key, { game }), undefined, 1, 0);
        this._id = key;
        this.animations.sprite.anchor.setTo(0.5, 0.5);
        this.setHitArea(metrics);
    }

    setHitArea(metrics) {
        const bounds = this.getLocalBounds();
        const width = fp.max([bounds.width, metrics.hitMin]);
        const height = fp.max([bounds.height, metrics.hitMin]);
        this.hitArea = new Phaser.Rectangle(-width / 2, -height / 2, width, height);
    }

    resize(metrics) {
        this.animations.sprite.loadTexture(assetPath({ key: this._id, isMobile: metrics.isMobile }));
        this.setHitArea(metrics);
    }
}

const paths = [
    [x => x.isMobile, x => "gel/mobile/" + x.key + ".png"],
    [x => !x.isMobile, x => "gel/desktop/" + x.key + ".png"],
];

const signalId = key => "GEL-" + key;
const assetPath = fp.cond(paths);

const publish = (key, data) => () =>
    signal.bus.publish({
        name: signalId(key),
        data,
    });
