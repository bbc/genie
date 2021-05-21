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
import { tweenRows, tweenRowBackdrops } from "./results-row-tween.js";
import { playRowAudio } from "./results-row-audio.js";
import { addParticlesToRows } from "./results-particles.js";
import { fireGameCompleteStat } from "./results-stats.js";
import { createTitles } from "../../core/titles.js";
import { createRowBackdrops, scaleRowBackdrops } from "./results-row-backdrop.js";
import { gmi } from "../../core/gmi/gmi.js";

export class Results extends Screen {
    create() {
        this.addBackgroundItems();
        this.createLayout();
        this.createCentralBackdrop();
        this.createRows();
        this.subscribeToEventBus();
        fireGameCompleteStat(this.transientData[this.scene.key]);
        this.createTitles();
        this.children.bringToTop(this.layout.root);
    }

    resultsArea() {
        if (this.config.title) return this.layout.getSafeArea();
        const safeArea = this.layout.getSafeArea({ top: false });
        const center = Phaser.Geom.Rectangle.GetCenter(safeArea);
        this.backdrop && (safeArea.height = this.backdrop.height);
        return Phaser.Geom.Rectangle.CenterOn(safeArea, center.x, center.y);
    }

    createLayout() {
        const achievements = gmi.achievements.get().length ? ["achievementsSmall"] : [];
        const buttons = ["pause", "continueGame"];
        const onwardButton = fp.get(`${this.scene.key}.gameComplete`, this.transientData) ? "playAgain" : "restart";
        this.setLayout([...buttons, ...achievements, onwardButton]);
    }

    createTitles() {
        if (this.config.title) {
            const title = this.config.title;
            const template = fp.template(title.text);
            const titleText = template(this.transientData[this.scene.scene.key]);
            this.config.title = {
                ...title,
                text: titleText,
            };
            return createTitles(this);
        }
        return false;
    }

    createRows() {
        this.rows = Rows.create(this, () => this.resultsArea(), this.config.rows, Rows.RowType.Results);
        this.rowBackdrops = createRowBackdrops(this, this.rows.containers);
        tweenRows(this, this.rows.containers);
        tweenRowBackdrops(this, this.rowBackdrops, this.rows.containers);
        playRowAudio(this, this.rows.containers);
        addParticlesToRows(this, this.rows.containers);
    }

    createCentralBackdrop() {
        fp.get("backdrop.key", this.config) && this.centralBackdropFill();
        this.resizeCentralBackdrop();
    }

    centralBackdropFill() {
        this.backdrop = this.add.image(0, 0, this.config.backdrop.key);
        this.backdrop.alpha = this.config.backdrop.alpha === undefined ? 1 : this.config.backdrop.alpha;
    }

    resizeCentralBackdrop() {
        const safeArea = this.resultsArea();
        if (fp.get("backdrop.key", this.config) && safeArea) {
            this.backdrop.x = safeArea.centerX;
            this.backdrop.y = safeArea.centerY;
        }
    }

    subscribeToEventBus() {
        const scaleEvent = onScaleChange.add(() => {
            this.resizeCentralBackdrop();
            scaleRowBackdrops(this.rowBackdrops, this.rows.containers);
        });
        this.events.once("shutdown", scaleEvent.unsubscribe);
        const fpMap = fp.map.convert({ cap: false });
        fpMap((callback, name) => eventBus.subscribe({ name, callback, channel: buttonsChannel(this) }), {
            continue: this.navigation.continue,
            restart: this.navigation.restart,
        });
    }
}
