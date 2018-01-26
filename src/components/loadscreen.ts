import { loadAssets, Pack, PackList, ScreenMap } from "../core/asset-loader";

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
     * Example Usage
     */
    constructor() {
        super();
    }

    public preload() {
        loadAssets(this.game, gamePacksToLoad, loadscreenPack, this.updateLoadProgress.bind(this)).then(keyLookups => {
            this.game.state.start("title", undefined, undefined, keyLookups);
        });
    }

    public create() {}

    private updateLoadProgress(progress: number) {
        // use progress to update loading bar
    }
}
