import * as _ from "lodash";
import { PromiseTrigger } from "./promise-utils";

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
    let missingScreenPack: PackList = {};
    let keyLookups: ScreenMap = {};
    const promisedScreenMap = new PromiseTrigger<ScreenMap>();
    const loadQueue: Array<() => void> = [
        () => {
            loadAssetPackJSON(gamePacks);
        },
        () => {
            [keyLookups, gameAssetPack] = processAssetPackJSON(gamePacks);
            missingScreenPack = getMissingScreens();
            loadAssetPackJSON(missingScreenPack);
        },
        () => {
            const [missingKeyLookups, missingScreenAssetPack] = processAssetPackJSON(missingScreenPack);
            Object.assign(keyLookups, missingKeyLookups);
            Object.assign(gameAssetPack, missingScreenAssetPack);
            loadAssetPack(gameAssetPack);
            if (game.load.totalQueuedPacks() === 0) {
                updateCallback(100);
                promisedScreenMap.resolve(keyLookups);
            }
            game.load.onFileComplete.add(updateLoadProgress);
        },
    ];
    loadQueue.push(() => {});

    game.load.onLoadComplete.add(startNextLoadInQueue);
    game.load.pack(loadscreenPack.key, loadscreenPack.url);

    return promisedScreenMap;

    function startNextLoadInQueue() {
        const loadFunction = loadQueue.shift();
        if (loadFunction) {
            loadFunction();
        }
        if (!_.isEmpty(loadQueue)) {
            game.time.events.add(0, game.load.start, game.load);
        } else {
            game.load.onLoadComplete.removeAll();
            game.load.onFileComplete.removeAll();
            promisedScreenMap.resolve(keyLookups);
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
        // For loading based on screen ids we'll ignore the "default" state and anything starting with "__".
        const missingScreens: string[] = _.filter(
            _.keys(game.state.states),
            k => k != "default" && !_.startsWith(k, "__"),
        );
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
            Object.assign(assetPack, packs[pack].data);
        }
    }
    return assetPack;
}

function namespaceAssetsByScreen(pack: AssetPack): [ScreenMap, AssetPack] {
    const keyLookups: ScreenMap = {};
    for (const screen in pack) {
        if (pack.hasOwnProperty(screen)) {
            if (Object.keys(pack[screen]).length !== 0 && pack[screen].constructor !== Object) {
                Object.assign(keyLookups, namespaceScreen(pack, screen));
            } else {
                return [keyLookups, {}];
            }
        }
    }
    return [keyLookups, pack];
}

function namespaceScreen(pack: AssetPack, screenName: string): ScreenMap {
    const keyLookup: ScreenMap = {};
    keyLookup[screenName] = {};
    for (const asset of pack[screenName]) {
        let newKey = "<pending>";
        if (asset.url) {
            newKey = asset.url;
        } else if (asset.urls) {
            newKey = asset.urls[0].replace(/\.[^.]*$/, "");
        } else {
            throw Error("expected url or urls field for asset key " + asset.key);
        }
        keyLookup[screenName][asset.key] = newKey;
        asset.key = newKey;
    }
    return keyLookup;
}
