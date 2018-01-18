import * as _ from "lodash";

export interface Pack {
    key: string;
    url: string;
}

export interface PackList {
    [key: string]: { url: string; data?: string };
}

interface AssetPack {
    [key: string]: Array<{ [Key: string]: any }>;
}

export function createAssetLoader(game: Phaser.Game, gamePacks: PackList, loadscreenPack: Pack) {
    let gameAssetPack: AssetPack = {};
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
                gameAssetPack = processAssetPackJSON(gamePacks);
                loadAssetPack(gameAssetPack);
                break;
            default:
                nextQueueIsDefined = false;
        }
        nextQueue += 1;
        if (nextQueueIsDefined) {
            game.time.events.add(0, game.load.start, game.load);
        } else {
            console.log(gameAssetPack);
            game.load.onLoadComplete.removeAll();
        }
    }

    /**
     * Loads each AssetPack in the PackList as JSON using the Phaser.Loader
     * @param  packs The list of AssetPacks to load.
     */
    function loadAssetPackJSON(packs: PackList) {
        for (let key in packs) {
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
    function processAssetPackJSON(packs: PackList): AssetPack {
        for (let key in packs) {
            if (packs.hasOwnProperty(key)) {
                packs[key].data = game.cache.getJSON(key);
            }
        }
        return convertPackListToAssetPack(packs);
    }

    /**
     * Loads all of the entries in an AssetPack into the game.
     * @param packs The AssetPack to load.
     */
    function loadAssetPack(pack: AssetPack) {
        for (let screen in pack) {
            if (pack.hasOwnProperty(screen)) {
                game.load.pack(screen, undefined, pack);
            }
        }
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
    for (let pack in packs) {
        if (packs.hasOwnProperty(pack)) {
            _.assign(assetPack, packs[pack].data);
        }
    }
    return assetPack;
}
