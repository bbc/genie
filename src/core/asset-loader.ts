import * as _ from "lodash";

export interface Pack {
    key: string;
    url: string;
}

export interface PackList {
    [key: string]: { url: string; data?: string };
}

interface AssetPack {
    [key: string]: Array<{ [key: string]: any }>;
}

export interface ScreenMap {
    [screen: string]: { [key: string]: string };
}

/**
 * Creates an Asset Loader, which can handle the loading of load screen assets,
 * as well as the assets for the rest of the game.
 * @param  game           The Phaser.Game to load assets to.
 * @param  gamePacks      The AssetPacks that should be loaded for states after the loading screen.
 * @param  loadscreenPack The AssetPack to load the loading screen assets.
 * @param  updateCallback A callback to return the load progress and keyLookups.
 */
export function loadAssets(
    game: Phaser.Game,
    gamePacks: PackList,
    loadscreenPack: Pack,
    updateCallback: (progress: number) => void,
): Promise<ScreenMap> {
    let gameAssetPack: AssetPack = {};
    let keyLookups: ScreenMap = {};
    let nextQueue: number = 1;
    game.load.onLoadComplete.add(startNextLoadQueue);
    game.load.pack(loadscreenPack.key, loadscreenPack.url);

    let doResolve: (value: ScreenMap) => void;
    return new Promise(resolve => {
        doResolve = resolve;
    });

    /**
     * Starts the next batch of loads to do. Each batch is defined under the
     * switch statement.
     */
    function startNextLoadQueue() {
        let nextQueueIsDefined: boolean = true;
        switch (nextQueue) {
            case 1:
                loadAssetPackJSON(gamePacks);
                break;
            case 2:
                [keyLookups, gameAssetPack] = processAssetPackJSON(gamePacks);
                loadAssetPack(gameAssetPack);
                game.load.onFileComplete.add(updateLoadProgress);
                break;
            default:
                nextQueueIsDefined = false;
        }
        nextQueue += 1;
        if (nextQueueIsDefined) {
            game.time.events.add(0, game.load.start, game.load);
        } else {
            updateCallback(100);
            game.load.onLoadComplete.removeAll();
            game.load.onFileComplete.removeAll();
            doResolve(keyLookups);
        }
    }

    /**
     * Loads each AssetPack in the PackList as JSON using the Phaser.Loader
     * @param  packs The list of AssetPacks to load.
     */
    function loadAssetPackJSON(packs: PackList) {
        for (const key in packs) {
            if (packs.hasOwnProperty(key)) {
                game.load.json(key, packs[key].url);
            }
        }
    }

    /**
     * Gets each asset pack as a JSON object from the Phaser.Cache
     * and merges it into one asset pack.
     * @param  packs The list of asset packs which have already been loaded,
     * which to get fetch from the cache.
     * @return       An asset pack which contains data from all the given asset packs.
     */
    function processAssetPackJSON(packs: PackList): [ScreenMap, AssetPack] {
        for (const key in packs) {
            if (packs.hasOwnProperty(key)) {
                packs[key].data = game.cache.getJSON(key);
            }
        }
        const assetPack = convertPackListToAssetPack(packs);
        return namespaceAssetsByScreen(assetPack);
    }

    /**
     * Loads all of the entries in an AssetPack into the game.
     * @param packs The AssetPack to load.
     */
    function loadAssetPack(pack: AssetPack) {
        for (const screen in pack) {
            if (pack.hasOwnProperty(screen)) {
                game.load.pack(screen, undefined, pack);
            }
        }
    }
    /**
     * Updates the current load progress and sends it to the updateCallback.
     * Progress is provided by a Phaser.Loader callback.
     * @param  progress The progress of the Phaser.Loader
     */
    function updateLoadProgress(progress: number) {
        updateCallback(progress);
    }
}

/**
 * A helper function for processAssetPackJSON which converts a PackList
 * that contains data, into a AssetPack.
 * @param  packs The list of asset packs which already have data fetched
 * from the cache.
 * @return       An asset pack which contains all the data from the given PackList.
 */
function convertPackListToAssetPack(packs: PackList): AssetPack {
    const assetPack: AssetPack = {};
    for (const pack in packs) {
        if (packs.hasOwnProperty(pack)) {
            _.assign(assetPack, packs[pack].data);
        }
    }
    return assetPack;
}

/**
 * Changes the AssetPack, so that the Phaser.Cache key for the asset is actually it's
 * URL, which is accessible by its screen and key in the keyLookups dictionary.
 * @param  pack The AssetPack to namespace by screen.
 * @return      The keyLookups dictionary and the modified AssetPack.
 */
function namespaceAssetsByScreen(pack: AssetPack): [ScreenMap, AssetPack] {
    const keyLookups: ScreenMap = {};
    for (const screen in pack) {
        if (pack.hasOwnProperty(screen)) {
            keyLookups[screen] = {};
            for (const asset of pack[screen]) {
                let newKey = "<pending>";
                if (asset.url) {
                    newKey = asset.url;
                } else if (asset.urls) {
                    newKey = asset.urls[0].replace(/\.[^.]*$/, "");
                } else {
                    throw Error("expected url or urls field for asset key " + asset.key);
                }
                keyLookups[screen][asset.key] = newKey;
                asset.key = newKey;
            }
        }
    }
    return [keyLookups, pack];
}
