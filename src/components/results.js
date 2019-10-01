/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { buttonsChannel } from "../core/layout/gel-defaults.js";
import { Screen } from "../core/screen.js";
import * as signal from "../core/signal-bus.js";
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
    create() {
        const theme = this.context.config.theme[this.scene.key];
        this.add.image(0, 0, "results.background");
        this.add.image(0, -150, "results.title");
        this.add.text(0, 50, this.context.transientData.results, theme.resultText.style);

        const achievements = this.context.config.theme.game.achievements ? ["achievements"] : [];
        const buttons = ["pause", "restart", "continueGame"];
        this.addLayout(buttons.concat(achievements));

        fireGameCompleteStat(this.transientData.results);

        signal.bus.subscribe({
            name: "continue",
            channel: buttonsChannel,
            callback: this.navigation.next,
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
