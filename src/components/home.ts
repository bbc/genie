import { ScreenMap } from "src/core/asset-loader";
export class Title extends Phaser.State {
    private keyLookups: { [key: string]: string };

    constructor() {
        super();
    }
    public init(keyLookups: ScreenMap) {
        this.keyLookups = keyLookups.title;
    }

    public create() {
        this.game.add.image(0, 0, this.keyLookups.background);
    }
}
