import { createAssetLoader, Pack, PackList, ScreenMap } from "../core/asset-loader";
import "../lib/phaser";

const MASTER_PACK_KEY: string = "MasterAssetPack";
const GEL_PACK_KEY: string = "GelAssetPack";

const gamePacksToLoad: PackList = {
    [MASTER_PACK_KEY]: { url: "asset-master-pack.json" },
    [GEL_PACK_KEY]: { url: "gel/gel-pack.json" },
};
const loadscreenPack: Pack = {
    key: "loadscreen",
    url: "loader/loadscreen-pack.json",
};

export class Loadscreen extends Phaser.State {
    /**
     * Placeholder Loadscreen for development
     */
    constructor() {
        super();
    }

    public preload() {
        console.log("entered Loadscreen preload()");
        createAssetLoader(this.game, gamePacksToLoad, loadscreenPack, this.updateLoadProgress);
    }

    public create() {
        console.log("entered Loadscreen create()");
        this.game.add.image(0, 0, "logo");
    }

    private updateLoadProgress(progress: number, keyLookups?: ScreenMap) {
        console.log(progress, keyLookups);
    }
}
