import { Screen } from "../core/screen.js";
import * as signal from "../core/signal-bus.js";
import { createTestHarnessDisplay } from "./test-harness/layout-harness.js";
import { getScreenAssets } from "../core/assets.js";

export class Results extends Screen {
    constructor() {
        super();
    }

    create() {
        const assets = getScreenAssets(this);
        const theme = this.context.config.theme[this.game.state.current];

        const backgroundImage = this.game.add.image(0, 0, assets.background);
        this.layoutFactory.addToBackground(backgroundImage);

        const titleImage = this.layoutFactory.addToBackground(this.game.add.image(0, -150, assets.title));
        this.layoutFactory.addToBackground(titleImage);

        const resultsData = this.context.inState.transient.resultsData;
        const resultsText = this.game.add.text(0, 50, resultsData, theme.resultText.style);
        this.layoutFactory.addToBackground(resultsText);

        this.layoutFactory.addLayout(["pause", "restart", "continue"]);
        createTestHarnessDisplay(this.game, this.context, this.layoutFactory);

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
