/**
 * Creates an Asset Loader, which can handle the loading of load screen assets,
 * as well as the assets for the rest of the game.
 *
 * @module core/asset-loader
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import _ from "../../lib/lodash/lodash.js";

/**
 * This callback is displayed as a global member.
 *
 * @callback updateCallback
 * @param {number} responseCode
 * @param {string} responseMessage
 */

/**
 * @param {Phaser.Game} game - The Game to load assets to.
 * @param {Object} gamePacks - The AssetPacks that should be loaded for states after the loading screen.
 * @param {Object} loadscreenPack - The AssetPack to load the loading screen assets.
 * @param {updateCallback} updateCallback - A callback to return the load progress and keyLookups.
 * @returns {Promise} A Promise which resolves on load complete
 */
export function loadAssets(game, gamePacks, loadscreenPack, updateCallback) {
    let gameAssetPack;
    let missingScreenPack;
    let keyLookups;

    return new Promise(resolve => {
        const loadQueue = [
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
                    resolve(keyLookups);
                }
                game.load.onFileComplete.add(updateLoadProgress);
            },
        ];
        loadQueue.push(() => {});

        game.load.onLoadComplete.add(startNextLoadInQueue);
        game.load.pack(loadscreenPack.key, loadscreenPack.url);

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
                resolve(keyLookups); //NT TODO: keyLookups are now unused
            }
        }
    });

    function loadAssetPackJSON(packs) {
        for (const key in packs) {
            if (packs.hasOwnProperty(key)) {
                game.load.json(key, packs[key].url);
            }
        }
    }

    function processAssetPackJSON(packs) {
        for (const key in packs) {
            if (packs.hasOwnProperty(key)) {
                packs[key].data = game.cache.getJSON(key);
            }
        }
        const assetPack = convertPackListToAssetPack(packs);
        return namespaceAssetsByScreen(assetPack);
    }

    function loadAssetPack(pack) {
        for (const screen in pack) {
            if (pack.hasOwnProperty(screen)) {
                game.load.pack(screen, undefined, pack);
            }
        }
    }

    function updateLoadProgress(progress) {
        updateCallback(progress);
    }

    function getMissingScreens() {
        const missingScreenList = {};
        // For loading based on screen ids we'll ignore the "default" state and anything starting with "__".
        const missingScreens = _.filter(_.keys(game.state.states), k => k !== "default" && !_.startsWith(k, "__"));
        missingScreens.forEach(key => {
            if (!gameAssetPack.hasOwnProperty(key) && loadscreenPack.key !== key) {
                missingScreenList[key] = { url: key + ".json" };
            }
        });
        return missingScreenList;
    }
}

function convertPackListToAssetPack(packs) {
    const assetPack = {};
    for (const pack in packs) {
        if (packs.hasOwnProperty(pack)) {
            Object.assign(assetPack, packs[pack].data);
        }
    }
    return assetPack;
}

function namespaceAssetsByScreen(pack) {
    const keyLookups = {};
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

const makeAssetKey = (screenName, asset) => [screenName, asset.key].join(".");

function namespaceScreen(pack, screenName) {
    const keyLookup = {};
    keyLookup[screenName] = {};
    for (const asset of pack[screenName]) {
        let newKey = "<pending>";
        if (asset.url || asset.urls) {
            newKey = makeAssetKey(screenName, asset);
        } else {
            throw Error("expected url or urls field for asset key " + asset.key);
        }
        keyLookup[screenName][asset.key] = makeAssetKey(screenName, asset);
        asset.key = newKey;
    }
    return keyLookup;
}
