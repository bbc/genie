import { Screen } from "../core/screen.js";
import * as signal from "../core/signal-bus.js";
import { createTestHarnessDisplay } from "./test-harness/layout-harness.js";

export class Results extends Screen {
    constructor() {
        super();
    }

    preload() {
        this.gel = this.scene.keyLookups.gel;
        this.keyLookup = this.scene.keyLookups[this.game.state.current];
    }

    create() {
        const theme = this.context.config.theme[this.game.state.current];

        const backgroundImage = this.game.add.image(0, 0, this.keyLookup.background);
        this.scene.addToBackground(backgroundImage);

        const titleImage = this.scene.addToBackground(this.game.add.image(0, -150, this.keyLookup.title));
        this.scene.addToBackground(titleImage);

        const resultsData = this.context.inState.transient.resultsData;
        const resultsText = this.game.add.text(0, 50, resultsData, theme.resultText.style);
        this.scene.addToBackground(resultsText);

        this.scene.addLayout(["pause", "restart", "continue"]);
        createTestHarnessDisplay(this.game, this.context, this.scene);

        signal.bus.subscribe({
            name: "continue",
            channel: "gel-buttons",
            callback: () => {
                this.next();
            },
        });

        signal.bus.subscribe({
            name: "restart",
            channel: "gel-buttons",
            callback: () => {
                this.next({ transient: { game: true } });
            },
        });
    }
}
