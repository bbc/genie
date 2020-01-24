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
import { getMetrics, onScaleChange } from "../../core/scaler.js";
import fp from "../../../lib/lodash/fp/fp.js";

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

        fp.get("backdrop.key", this.theme) && this.backdropFill();
        this.setLayout(buttons.concat(achievements));

        const getSafeArea = this.layout.getSafeArea;
        this.resultsArea = getSafeArea(getMetrics(), { top: false });
        this.sizeToParent(this.backdrop, this.resultsArea);

        const scaleBackdrop = () => this.sizeToParent(this.backdrop, getSafeArea(getMetrics(), { top: false }));
        this._scaleEvent = onScaleChange.add(scaleBackdrop.bind(this));

        this.rows = Rows.create(
            this,
            () => getSafeArea(getMetrics(), { top: false }),
            this.theme.rows,
            Rows.RowType.Results,
        );
    }

    backdropFill() {
        this.backdrop = this.add.image(0, 0, this.theme.backdrop.key);
        this.backdrop.alpha = this.theme.backdrop.alpha || 1;
    }

    sizeToParent(item, safeArea) {
        if (fp.get("backdrop.key", this.theme) && safeArea) {
            item.x = safeArea.centerX;
            item.y = safeArea.centerY;
            item.scale = Math.min(safeArea.width / item.width, safeArea.height / item.height);
        }
    }

    subscribeToEventBus() {
        eventBus.subscribe({
            name: "continue",
            channel: buttonsChannel(this),
            callback: () => {
                this._scaleEvent.unsubscribe();
                this.navigation.next();
            },
        });

        eventBus.subscribe({
            name: "restart",
            channel: buttonsChannel(this),
            callback: () => {
                this._scaleEvent.unsubscribe();
                this.navigation.game();
            },
        });
    }
}
