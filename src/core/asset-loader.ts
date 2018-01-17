const LOADSCREEN_PACK_KEY: string = "LoadscreenAssetPack";
const MASTER_PACK_KEY: string = "MasterAssetPack";
const GEL_PACK_KEY: string = "GelAssetPack";

export interface AssetLoader {
    preloadLoadscreenAssets(): void;
    loadGameAssets(): void;
}

export function createAssetLoader(load: Phaser.Loader): AssetLoader {
    const self = {
        preloadLoadscreenAssets,
        loadGameAssets,
    };

    return self;

    function preloadLoadscreenAssets() {
        // load the load screen assets
        load.json(LOADSCREEN_PACK_KEY, "loadscreen-pack.json");
        load.json(MASTER_PACK_KEY, "asset-master-pack.json");
        load.json(GEL_PACK_KEY, "gel/gel-pack.json");
    }

    function loadGameAssets() {
        // load the rest of the games assets
    }
}
