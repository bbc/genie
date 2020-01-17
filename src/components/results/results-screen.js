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
import { getMetrics } from "../../core/scaler.js";
import { GEL_MIN_ASPECT_RATIO } from "../../core/layout/calculate-metrics.js";

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

    getResultsArea() {
        const metrics = getMetrics();
        const safeWidth = metrics.stageHeight * GEL_MIN_ASPECT_RATIO - metrics.borderPad * 2;
        const x = -safeWidth / 2;
        const y = -metrics.stageHeight / 2 + metrics.borderPad;
        return new Phaser.Geom.Rectangle(x, y, safeWidth, this.layout.groups.bottomCenter.y - y);
    }

    createLayout() {
        const achievements = this.context.config.theme.game.achievements ? ["achievements"] : [];
        const buttons = ["pause", "restart", "continueGame"];
        this.setLayout(buttons.concat(achievements));

        this.rows = Rows.create(this, this.getResultsArea.bind(this), this.theme.rows, Rows.RowType.Results);
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
