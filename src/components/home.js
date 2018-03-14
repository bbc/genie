import { Screen } from "../core/screen.js";
import * as signal from "../core/signal-bus.js";
import { createTestHarnessDisplay } from "./test-harness/layout-harness.js";

export class Home extends Screen {
    constructor() {
        super();
    }

    preload() {
        this.keyLookup = this.layoutFactory.keyLookups[this.game.state.current];
    }

    create() {
        this.layoutFactory.addToBackground(this.game.add.image(0, 0, this.keyLookup.background));
        this.layoutFactory.addToBackground(this.game.add.image(0, -150, this.keyLookup.title));
        this.layoutFactory.addLayout(["exit", "howToPlay", "play", "audioOff", "settings"]);
        createTestHarnessDisplay(this.game, this.context, this.layoutFactory);

        //Example Subscription to signal bus
        signal.bus.subscribe({
            name: "GEL-play",
            callback: () => {
                console.log("Play was pressed");
            },
        });
    }
}
