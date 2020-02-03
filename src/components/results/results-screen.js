/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { Screen } from "../../core/screen.js";
import * as Rows from "../../core/layout/rows.js";
import { buttonsChannel } from "../../core/layout/gel-defaults.js";
import { eventBus } from "../../core/event-bus.js";
import { gmi } from "../../core/gmi/gmi.js";
import { getMetrics, onScaleChange } from "../../core/scaler.js";
import { tweenRows } from "./results-row-tween.js";
import { playRowAudio } from "./results-row-audio.js";

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
        this.add.image(0, 0, "results.background").setDepth(-1);
        this.addAnimations();
        this.createLayout();
        this.createBackdrop();
        this.subscribeToEventBus();
        fireGameCompleteStat(this.transientData.results);
    }

    resultsArea() {
        return this.layout.getSafeArea(getMetrics(), { top: false });
    }

    createLayout() {
        const achievements = this.context.config.theme.game.achievements ? ["achievementsSmall"] : [];
        const buttons = ["pause", "restart", "continueGame"];
        this.setLayout(buttons.concat(achievements));
        this.createRows();
    }

    createRows() {
        this.rows = Rows.create(this, () => this.resultsArea(), this.theme.rows, Rows.RowType.Results);
        tweenRows(this, this.rows.containers);
        playRowAudio(this, this.rows.containers);
    }

    createBackdrop() {
        fp.get("backdrop.key", this.theme) && this.backdropFill();
        this.sizeToParent(this.backdrop, this.resultsArea());
    }

    backdropFill() {
        this.backdrop = this.add.image(0, 0, this.theme.backdrop.key);
        this.backdrop.alpha = this.theme.backdrop.alpha || 1;
        this.backdrop.setDepth(-1);
    }

    sizeToParent(item, safeArea) {
        if (fp.get("backdrop.key", this.theme) && safeArea) {
            item.x = safeArea.centerX;
            item.y = safeArea.centerY;
            item.scale = Math.min(safeArea.width / item.width, safeArea.height / item.height);
        }
    }

    subscribeToEventBus() {
        const scaleEvent = onScaleChange.add(() => this.sizeToParent(this.backdrop, this.resultsArea()));
        this.events.once("shutdown", scaleEvent.unsubscribe);
        fp.toPairs({
            continue: this.navigation.next,
            restart: this.navigation.game,
        }).map(([name, callback]) => eventBus.subscribe({ name, callback, channel: buttonsChannel(this) }));
    }
}
