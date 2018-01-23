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

    function startNextLoadQueue() {
        let nextQueueIsDefined: boolean = true;
        switch (nextQueue) {
            case 1:
                loadAssetPackJSON(gamePacks);
                break;
            case 2:
                [keyLookups, gameAssetPack] = processAssetPackJSON(gamePacks);
                const missingScreenPack = getMissingScreens();
                loadAssetPackJSON(missingScreenPack);
                Object.assign([keyLookups, gameAssetPack], processAssetPackJSON(missingScreenPack));
                break;
            case 3:
                loadAssetPack(gameAssetPack);
                if (game.load.totalQueuedPacks() === 0) {
                    nextQueueIsDefined = false;
                    updateCallback(100);
                    doResolve(keyLookups);
                }
                game.load.onFileComplete.add(updateLoadProgress);
                break;
            default:
                nextQueueIsDefined = false;
        }
        nextQueue += 1;
        if (nextQueueIsDefined) {
            game.time.events.add(0, game.load.start, game.load);
        } else {
            game.load.onLoadComplete.removeAll();
            game.load.onFileComplete.removeAll();
            doResolve(keyLookups);
        }
    }

    function loadAssetPackJSON(packs: PackList) {
        for (const key in packs) {
            if (packs.hasOwnProperty(key)) {
                game.load.json(key, packs[key].url);
            }
        }
    }

    function processAssetPackJSON(packs: PackList): [ScreenMap, AssetPack] {
        for (const key in packs) {
            if (packs.hasOwnProperty(key)) {
                packs[key].data = game.cache.getJSON(key);
            }
        }
        const assetPack = convertPackListToAssetPack(packs);
        return namespaceAssetsByScreen(assetPack);
    }

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

    function getMissingScreens(): PackList {
        const missingScreenList: PackList = {};
        const missingScreens: string[] = Object.keys(game.state.states).slice(1);
        missingScreens.forEach((key: string) => {
            if (!gameAssetPack.hasOwnProperty(key) && loadscreenPack.key !== key) {
                missingScreenList[key] = { url: key + ".json" };
            }
        });
        return missingScreenList;
    }
}

function convertPackListToAssetPack(packs: PackList): AssetPack {
    const assetPack: AssetPack = {};
    for (const pack in packs) {
        if (packs.hasOwnProperty(pack)) {
            _.assign(assetPack, packs[pack].data);
        }
    }
    return assetPack;
}

function namespaceAssetsByScreen(pack: AssetPack): [ScreenMap, AssetPack] {
    const keyLookups: ScreenMap = {};
    for (const screen in pack) {
        if (pack.hasOwnProperty(screen)) {
            keyLookups[screen] = {};
            if (Object.keys(pack[screen]).length !== 0 && pack[screen].constructor !== Object) {
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
            } else {
                return [keyLookups, {}];
            }
        }
    }
    return [keyLookups, pack];
}
