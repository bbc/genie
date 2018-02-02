import { loadAssets, Pack, PackList, ScreenMap } from "../core/asset-loader";
import { Screen } from "../core/screen";

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

export class Loadscreen extends Screen {
    /**
     * Placeholder Loadscreen for development
     * Example Usage
     */
    constructor() {
        super();
    }

    public preload() {
        loadAssets(this.game, gamePacksToLoad, loadscreenPack, this.updateLoadProgress).then(keyLookups => {
            // do something with keyLookups
            this.exit({});
        });
    }

    public create() {
        this.game.add.image(50, 50, "logo");
    }

    private updateLoadProgress(progress: number) {
        // use progress to update loading bar
    }
}
