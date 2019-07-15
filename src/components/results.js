/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { buttonsChannel } from "../core/layout/gel-defaults.js";
import { Screen } from "../core/screen.js";
import * as signal from "../core/signal-bus.js";
import { createTestHarnessDisplay } from "./test-harness/layout-harness.js";
import { gmi } from "../core/gmi/gmi.js";

const getScoreMetaData = result => {
    if (typeof result === "number") {
        return { metadata: `SCO=[${result}]` };
    }
    if (typeof result === "string") {
        const digitsRegex = /\d+/;
        const score = result.match(digitsRegex);
        return score ? { metadata: `SCO=[${score}]` } : undefined;
    }
};

const fireGameCompleteStat = result => {
    gmi.sendStatsEvent("score", "display", getScoreMetaData(result));
};

export class Results extends Screen {
    constructor() {
        super();
    }

    create() {
        const theme = this.context.config.theme[this.game.state.current];
        this.scene.addToBackground(this.game.add.image(0, 0, "results.background"));
        this.scene.addToBackground(this.scene.addToBackground(this.game.add.image(0, -150, "results.title")));

        const resultsText = this.game.add.text(0, 50, this.transientData.results, theme.resultText.style);
        this.scene.addToBackground(resultsText);

        const achievements = this.context.config.theme.game.achievements ? ["achievements"] : [];
        const buttons = ["pause", "restart", "continueGame"];
        this.scene.addLayout(buttons.concat(achievements));
        createTestHarnessDisplay(this.game, this.context, this.scene);

        fireGameCompleteStat(this.transientData.results);

        signal.bus.subscribe({
            name: "continue",
            channel: buttonsChannel,
            callback: () => {
                this.navigation.next();
            },
        });

        signal.bus.subscribe({
            name: "restart",
            channel: buttonsChannel,
            callback: () => {
                this.navigation.game(this.transientData);
            },
        });
    }
}
