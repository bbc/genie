export interface PackList {
    [Key: string]: { url: string; data?: string };
}

export function createAssetLoader(game: Phaser.Game, packs: PackList, drawCallback: Function, context?: any) {
    let nextQueue: number = 1;
    game.load.onLoadComplete.add(startNextLoadQueue);
    startNextLoadQueue();

    function startNextLoadQueue() {
        let nextQueueIsDefined: boolean = true;
        switch (nextQueue) {
            case 1:
                loadAssetPackJSON();
                break;
            case 2:
                processAssetPackJSON();
                break;
            default:
                nextQueueIsDefined = false;
        }
        nextQueue += 1;
        if (nextQueueIsDefined) {
            console.log("Loading queue", nextQueue - 1);
            game.time.events.add(0, game.load.start, game.load);
        } else {
            game.load.onLoadComplete.removeAll();
        }
    }

    function loadAssetPackJSON() {
        for (let key in packs) {
            if (packs.hasOwnProperty(key)) {
                game.load.json(key, packs[key].url);
            }
        }
    }

    function processAssetPackJSON() {
        for (let key in packs) {
            if (packs.hasOwnProperty(key)) {
                packs[key].data = game.cache.getJSON(key);
            }
        }
    }
}
