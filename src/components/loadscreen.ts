import { AssetLoader, createAssetLoader } from "../core/asset-loader";

export class Loadscreen extends Phaser.State {
    private loader: AssetLoader = createAssetLoader(this.game.load);
    /**
     * Placeholder Loadscreen for development
     */
    constructor() {
        super();
    }

    public preload() {
        console.log("entered Loadscreen preload()");

        this.loader.preloadLoadscreenAssets();
    }

    public create() {
        console.log("entered Loadscreen create()");

        this.loader.loadGameAssets();
    }
}
