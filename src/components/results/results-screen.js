/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { buttonsChannel } from "../../core/layout/gel-defaults.js";
import { Screen } from "../../core/screen.js";
import { eventBus } from "../../core/event-bus.js";
import { gmi } from "../../core/gmi/gmi.js";
import * as Rows from "../../core/layout/rows.js";

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
        this.theme = this.context.config.theme[this.scene.key];
        this.add.image(0, 0, "results.background");
        this.addAnimations();
        this.add.image(0, -150, "results.title");
        const resultsText = this.add.text(0, 50, this.context.transientData.results, this.theme.resultText.style);
        resultsText.setOrigin(0.5, 0.5);

        this.createLayout();
        fireGameCompleteStat(this.transientData.results);
        this.subscribeToEventBus();
    }

    createLayout() {
        const achievements = this.context.config.theme.game.achievements ? ["achievementsCircular"] : [];
        const buttons = ["pause", "restart", "continueGame", "next", "previous"]; // TODO remove next and previous buttons
        this.setLayout(buttons.concat(achievements));
        this.layout.buttons.next.visible = false;
        this.layout.buttons.previous.visible = false;

        this.rows = Rows.create(this, this.theme.rows, Rows.RowType.Results);
    }

    subscribeToEventBus() {
        eventBus.subscribe({
            name: "continue",
            channel: buttonsChannel(this),
            callback: this.navigation.next,
        });

        eventBus.subscribe({
            name: "restart",
            channel: buttonsChannel(this),
            callback: () => {
                this.navigation.game();
            },
        });
    }
}
