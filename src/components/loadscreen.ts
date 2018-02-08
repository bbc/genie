import * as _ from "lodash";

import { loadAssets, Pack, PackList, ScreenMap } from "../core/asset-loader";
import { Screen } from "../core/screen";
import { testHarnessDisplay } from "src/components/test-harness/layout";

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
        loadAssets(this.game, gamePacksToLoad, loadscreenPack, this.updateLoadProgress.bind(this)).then(keyLookups => {
            // do something with keyLookups
            if (this.context.qaMode) {
                dumpToConsole(keyLookups);
            }
            this.exit({});
        });
    }

    public create() {
        this.game.add.image(400, 50, "logo");
        const tempLayout = this.context.layout.create(["exit", "howToPlay", "play", "soundOff", "settings"]);
        testHarnessDisplay(this.game, this.context).create();
    }

    private updateLoadProgress(progress: number) {
        // use progress to update loading bar
        if (this.context.qaMode.active) {
            console.log("Loader progress:", progress);
        }
    }
}

function dumpToConsole(keyLookups: ScreenMap) {
    const lines = _.flatten([
        "Loaded assets:",
        _.flatMap(keyLookups, (keyMap, screenId) => [
            `    ${screenId}:`,
            _.map(keyMap, (path, key) => `        ${key}: ${path}`),
        ]),
    ]);
    console.log(_.join(lines, "\n"));
}
