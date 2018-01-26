import { ScreenMap } from "src/core/asset-loader";
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
        this.game.add.image(0, 0, this.keyLookups.background);
        const title = this.game.add.image(
            this.game.world.centerX,
            this.game.world.centerY * 0.7,
            this.keyLookups.title,
        );
        title.anchor.set(0.5, 0.5);
        const play = this.game.add.button(this.game.world.centerX, this.game.world.height * 0.75, this.gel.play);
        play.anchor.set(0.5, 0.5);
    }
}
