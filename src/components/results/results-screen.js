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
        this.transientData[this.scene.key] = { stars: 10 }; // TODO remove this fake data
        this.theme = this.context.config.theme[this.scene.key];
        this.add.image(0, 0, "results.background");
        this.addAnimations();
        this.createLayout();
        fireGameCompleteStat(this.transientData.results);
        this.subscribeToEventBus();
    }

    createLayout() {
        const achievements = this.context.config.theme.game.achievements ? ["achievementsSmall"] : [];
        const buttons = ["pause", "restart", "continueGame"];
        this.setLayout(buttons.concat(achievements));
        const getSafeArea = this.layout.getSafeArea;

        this.rows = Rows.create(
            this,
            () => getSafeArea(getMetrics(), { top: false }),
            this.theme.rows,
            Rows.RowType.Results,
        );
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
