import { Screen } from "../core/screen.js";
import * as signal from "../core/signal-bus.js";
import * as Pause from "./overlays/pause.js";
import { createTestHarnessDisplay } from "./test-harness/layout-harness.js";

export class Results extends Screen {
    constructor() {
        super();
    }

    preload() {
        this.gel = this.layoutFactory.keyLookups.gel;
        this.keyLookup = this.layoutFactory.keyLookups[this.game.state.current];
    }

    create() {
        const theme = this.context.config.theme[this.game.state.current];

        const backgroundImage = this.game.add.image(0, 0, this.keyLookup.background);
        this.layoutFactory.addToBackground(backgroundImage);

        const titleImage = this.layoutFactory.addToBackground(this.game.add.image(0, -150, this.keyLookup.title));
        this.layoutFactory.addToBackground(titleImage);

        const resultsText = this.game.add.text(0, 50, this.transientData.results, theme.resultText.style);
        this.layoutFactory.addToBackground(resultsText);

        this.layoutFactory.addLayout(["pause", "restart", "continue"]);
        createTestHarnessDisplay(this.game, this.context, this.layoutFactory);

        signal.bus.subscribe({
            name: "continue",
            channel: "gel-buttons",
            callback: () => {
                this.navigation.next();
            },
        });

        signal.bus.subscribe({
            name: "restart",
            channel: "gel-buttons",
            callback: () => {
                this.navigation.game(this.transientData);
            },
        });
    }
}
