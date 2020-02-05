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
    if (result == "" || result == undefined) {
        return undefined;
    }
    let resultString = resultsToString(result);
    return { metadata: `SCO=${resultString}` };
};

const resultsToString = obj => {
    let resultString = "";
    let first = true;
    for (const x in obj) {
        if (first === true) {
            resultString += "[" + x + ":" + obj[x] + "]";
            first = false;
        } else {
            resultString += "::[" + x + ":" + obj[x] + "]";
        }
    }
    return resultString;
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
        fireGameCompleteStat(this.transientData.results);
        this.subscribeToEventBus();
        this.rows.rowTransitions();
    }

    resultsArea() {
        return this.layout.getSafeArea(getMetrics(), { top: false });
    }

    createLayout() {
        const achievements = this.context.config.theme.game.achievements ? ["achievementsSmall"] : [];
        const buttons = ["pause", "restart", "continueGame"];

        this.setLayout(buttons.concat(achievements));

        this.rows = Rows.create(this, () => this.resultsArea(), this.theme.rows, Rows.RowType.Results);
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
        eventBus.subscribe({
            name: "continue",
            channel: buttonsChannel(this),
            callback: this.navigation.next,
        });

        eventBus.subscribe({
            name: "restart",
            channel: buttonsChannel(this),
            callback: this.navigation.game,
        });
    }
}
