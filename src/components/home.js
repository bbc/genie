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
        //catalogue
        this.load.json5({ key: "game-items", url: "themes/default/items/game-items.json5" });

        //armoury collection
        this.load.json5({ key: "armoury", url: "themes/default/items/armoury.json5" });
    }

    create() {
        const armouryConfig = this.cache.json.get("armoury");
        const itemConfig = this.cache.json.get("game-items");

        initList("armoury", armouryConfig, itemConfig);

        const armoury = itemLists.get("armoury");

        debugger;


        gameItems.set("sword", {state: null, qty: 5})

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
