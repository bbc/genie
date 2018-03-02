// @ts-ignore
import * as fp from "lodash/fp";

export class GelButton extends Phaser.Button {
    private id: string;

    constructor(game: Phaser.Game, x: number, y: number, isMobile: boolean, key: string) {
        super(game, 0, 0, assetPath({key, isMobile}), publish(key));

        this.id = key;
        this.animations.sprite.anchor.setTo(0.5, 0.5);
    }

    public resize(metrics: ViewportMetrics) {
        this.animations.sprite.loadTexture(assetPath({key: this.id, isMobile: metrics.isMobile}));
    }
}

const paths = [
    [(x: any) => x.isMobile, (x: any) => "gel/mobile/" + x.key + ".png"],
    [(x: any) => !x.isMobile, (x: any) => "gel/desktop/" + x.key + ".png"],
];

const assetPath = fp.cond(paths);

const publish = (key: string) => () => {
    //TODO publish signal here
    console.log(key);
};
