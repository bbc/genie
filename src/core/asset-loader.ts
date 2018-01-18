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

export function createAssetLoader(
    game: Phaser.Game,
    gamePacks: PackList,
    loadscreenPack: Pack,
    updateCallback: (progress: number, keyLookups?: ScreenMap) => void,
) {
    let gameAssetPack: AssetPack = {};
    let keyLookups: ScreenMap = {};
    let nextQueue: number = 1;
    game.load.pack(loadscreenPack.key, loadscreenPack.url);
    game.load.onLoadComplete.add(startNextLoadQueue);

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
            updateCallback(100, keyLookups);
            game.load.onLoadComplete.removeAll();
            game.load.onFileComplete.removeAll();
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
        return namespaceAssetsByURL(assetPack);
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

function namespaceAssetsByURL(pack: AssetPack): [ScreenMap, AssetPack] {
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
