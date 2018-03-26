import fp from "../../lib/lodash/fp/fp.js";
import * as signal from "../signal-bus.js";

const minButtonSize = 64;

export class GelButton extends Phaser.Button {
    constructor(game, x, y, isMobile, key) {
        super(game, 0, 0, assetPath({ key, isMobile }), publish(key), undefined, 1, 0);
        this._id = key;
        this.animations.sprite.anchor.setTo(0.5, 0.5);
        this.setHitArea();
    }

    setHitArea() {
        const bounds = this.getLocalBounds();
        const width = fp.max([bounds.width, minButtonSize]);
        const height = fp.max([bounds.height, minButtonSize]);
        this.hitArea = new Phaser.Rectangle(0, 0, width, height).centerOn(this.x, this.y);
    }

    resize(metrics) {
        this.animations.sprite.loadTexture(assetPath({ key: this._id, isMobile: metrics.isMobile }));
        this.setHitArea();
    }
}

const paths = [
    [x => x.isMobile, x => "gel/mobile/" + x.key + ".png"],
    [x => !x.isMobile, x => "gel/desktop/" + x.key + ".png"],
];

const signalId = key => "GEL-" + key;
const assetPath = fp.cond(paths);
const publish = key => () => signal.bus.publish({ name: signalId(key) });
