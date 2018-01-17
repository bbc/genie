import { AssetLoader, createAssetLoader } from "../core/asset-loader";

export class Loadscreen extends Phaser.State {
    private loader: AssetLoader;
    /**
     * Placeholder Loadscreen for development
     */
    constructor() {
        super();
    }

    public preload() {
        console.log("entered Loadscreen preload()");

        this.loader = createAssetLoader(this.game.load);
    }

    public create() {
        console.log("entered Loadscreen create()");

        this.loader.loadGameAssets();
    }
}
