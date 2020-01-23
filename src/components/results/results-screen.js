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
        const achievements = this.context.config.theme.game.achievements ? ["achievementsSmall"] : [];
        const buttons = ["pause", "restart", "continueGame"];
        this.backdropFill();
        this.setLayout(buttons.concat(achievements));
        this.resultsArea = this.layout.getSafeArea(getMetrics()); //rename
        this.backdrop.safeArea = this.resultsArea;
        this.sizeToParent(this.backdrop);

        this.rows = Rows.create(this, this.resultsArea, this.theme.rows, Rows.RowType.Results);
    }

    backdropFill() {
        this.backdrop = this.add.image(0, 0, this.theme.backdrop.key);
        this.backdrop.alpha = this.theme.backdrop.alpha;
    }

    sizeToParent(item) {
        item.x = item.safeArea.centerX;
        item.y = item.safeArea.centerY;
        item.scale = Math.min(item.safeArea.width / item.width, item.safeArea.height / item.height);
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
