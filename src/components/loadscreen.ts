import { createAssetLoader, PackList } from "../core/asset-loader";

const LOADSCREEN_PACK_KEY: string = "LoadscreenAssetPack";
const MASTER_PACK_KEY: string = "MasterAssetPack";
const GEL_PACK_KEY: string = "GelAssetPack";

const packsToLoad: PackList = {
    [LOADSCREEN_PACK_KEY]: { url: "loadscreen-pack.json" },
    [MASTER_PACK_KEY]: { url: "asset-master-pack.json" },
    [GEL_PACK_KEY]: { url: "gel/gel-pack.json" },
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

        createAssetLoader(this.game, packsToLoad, this.create);
    }

    public create() {
        console.log("entered Loadscreen create()");
    }
}
