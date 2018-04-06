import { Screen } from "../core/screen.js";
import * as signal from "../core/signal-bus.js";
import * as Pause from "./pause.js";
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

        const titleText = this.game.add.text(0, -150, theme.titleText.content, theme.titleText.style);
        this.layoutFactory.addToBackground(titleText);

        const resultsData = this.context.inState.transient.resultsData;
        const resultsText = this.game.add.text(0, -50, resultsData, theme.resultText.style);
        this.layoutFactory.addToBackground(resultsText);

        this.layoutFactory.addLayout(["pause", "restart", "continue"]);
        createTestHarnessDisplay(this.game, this.context, this.layoutFactory);

        signal.bus.subscribe({
            name: "GEL-continue",
            callback: () => {
                this.next();
            },
        });

        signal.bus.subscribe({
            name: "GEL-restart",
            callback: () => {
                this.next({ transient: { game: true } });
            },
        });

        signal.bus.subscribe({
            name: "GEL-pause",
            callback: () => {
                Pause.create(this.game, this);
            },
        });
    }
}
