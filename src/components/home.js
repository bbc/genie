/**
 * Home is the main title screen for the game.
 *
 * @module components/home
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { buttonsChannel } from "../core/layout/gel-defaults.js";
import { Screen } from "../core/screen.js";
import { eventBus } from "../core/event-bus.js";
import { isDebug } from "../core/debug/debug-mode.js";
import { gmi } from "../core/gmi/gmi.js";

import { initList, itemLists } from "../core/item-list.js";

export class Home extends Screen {
    preload() {
        this.load.json5({ key: "game-items", url: "themes/default/items/game-items.json5" });
    }

    create() {
        const gameItemsConfig = this.cache.json.get("game-items");

        initList("game-items", gameItemsConfig);

        const gameItems = itemLists.get("game-items");

        gameItems.set("sword", {state: "liquid", qty: 9})
        debugger;

        const achievements = gmi.achievements.get().length ? ["achievements"] : [];
        const debug = isDebug() ? ["debug"] : [];
        this.addBackgroundItems();
        const buttons = ["exit", "howToPlay", "play", "audio", "settings"];
        this.setLayout(buttons.concat(achievements, debug));

        eventBus.subscribe({
            channel: buttonsChannel(this),
            name: "play",
            callback: this.navigation.next,
        });
    }
}
