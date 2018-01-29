import { ScreenMap } from "src/core/asset-loader";
import * as GelLayers from "src/core/gelLayers";
import * as Scaler from "src/core/scaler";
import "../lib/phaser";
export class Home extends Phaser.State {
    private keyLookups: { [key: string]: string };
    private gel: { [key: string]: string };

    constructor() {
        super();
    }
    public init(keyLookups: ScreenMap) {
        this.keyLookups = keyLookups.title;
        this.gel = keyLookups.gel;
    }

    public create() {
        const scaler = Scaler.create(600, this.game);
        const gelLayers = GelLayers.create(this.game, scaler);
        gelLayers.addToBackground(this.game.add.image(0, 0, this.keyLookups.background));
        const title = gelLayers.addToBackground(this.game.add.image(0, -130, this.keyLookups.title)) as Phaser.Image;
        title.anchor.set(0.5, 0.5);
        const play = gelLayers.addToBackground(this.game.add.button(0, 130, this.gel.play)) as Phaser.Button;
        play.anchor.set(0.5, 0.5);
    }
}
