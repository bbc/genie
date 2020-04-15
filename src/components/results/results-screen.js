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
import { onScaleChange } from "../../core/scaler.js";
import { tweenRows } from "./results-row-tween.js";
import { playRowAudio } from "./results-row-audio.js";
import { addParticlesToRows } from "./results-particles.js";
import { fireGameCompleteStat } from "./results-stats.js";

export class Results extends Screen {
    create() {
        this.addBackgroundItems();
        this.createLayout();
        this.createBackdrop();
        this.createRows();
        this.subscribeToEventBus();
        fireGameCompleteStat(this.transientData[this.scene.key]);

        this.children.bringToTop(this.layout.root);
    }

    resultsArea() {
        return this.layout.getSafeArea({ top: false });
    }

    createLayout() {
        const achievements = this.context.config.theme.game.achievements ? ["achievementsSmall"] : [];
        const buttons = ["pause", "restart", "continueGame"];
        this.setLayout(buttons.concat(achievements));
    }

    createRows() {
        this.rows = Rows.create(this, () => this.resultsArea(), this.context.theme.rows, Rows.RowType.Results);
        tweenRows(this, this.rows.containers);
        playRowAudio(this, this.rows.containers);
        addParticlesToRows(this, this.rows.containers);
    }

    createBackdrop() {
        fp.get("backdrop.key", this.context.theme) && this.backdropFill();
        this.sizeToParent(this.backdrop, this.resultsArea());
    }

    backdropFill() {
        this.backdrop = this.add.image(0, 0, this.context.theme.backdrop.key);
        this.backdrop.alpha = this.context.theme.backdrop.alpha || 1;
    }

    sizeToParent(item, safeArea) {
        if (fp.get("backdrop.key", this.context.theme) && safeArea) {
            item.x = safeArea.centerX;
            item.y = safeArea.centerY;
            item.scale = Math.min(safeArea.width / item.width, safeArea.height / item.height);
        }
    }

    subscribeToEventBus() {
        const scaleEvent = onScaleChange.add(() => this.sizeToParent(this.backdrop, this.resultsArea()));
        this.events.once("shutdown", scaleEvent.unsubscribe);
        const fpMap = fp.map.convert({ cap: false });
        fpMap((callback, name) => eventBus.subscribe({ name, callback, channel: buttonsChannel(this) }), {
            continue: this.navigation.continue,
            restart: this.navigation.restart,
        });
    }
}
