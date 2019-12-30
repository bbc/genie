/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { accessibilify } from "../accessibility/accessibilify.js";
import { GelButton } from "./gel-button.js";

const cellDefaults = {
    group: "grid",
    ariaLabel: "",
    order: 0,
};

export class GelGrid extends Phaser.GameObjects.Container {
    constructor(scene, vPos, hPos, metrics, isSafe, isVertical) {
        super(scene, 0, 0);
        //TODO P3 we used to name the groups - useful for debugging. Might be usuaful as a propery? [NT]
        //super(game, parent, fp.camelCase([vPos, hPos, isVertical ? "v" : ""].join(" ")));
        this._vPos = vPos;
        this._hPos = hPos;
        this._metrics = metrics;
        this._isSafe = isSafe;
        this._isVertical = isVertical;
        this._cells = [];
        this._displayWidth = { mobile: 300, desktop: 400 };
        this._displayHeight = { mobile: 300, desktop: 400 };

        this.eventChannel = `gel-buttons-${scene.scene.key}`;
    }

    addGridCells() {
        this.scene.theme.choices.map((cell, idx) => {
            this.addCell(cell, idx);
        });
        this._cells.forEach(this.makeAccessible, this);
        this.reset();
    }

    makeAccessible(cell, idx) {
        const config = {
            id: "__" + fp.kebabCase(cell.name),
            ariaLabel: cell.name,
            group: "grid",
            title: `Selection ${idx}`,
            key: `selection_${idx}`,
            order: 0,
            channel: this.eventChannel,
        };

        return accessibilify(cell, config, true);
    }

    cellKeys() {
        return this._cells.map(cell => {
            return cell.key;
        });
    }

    addCell(choice, idx) {
        const config = Object.assign({}, cellDefaults, {
            id: fp.kebabCase(choice.title),
            key: choice.asset,
            name: choice.title ? choice.title : `option ${idx + 1}`,
            scene: this.scene.scene.key,
            channel: this.eventChannel,
        });

        const newCell = new GelButton(this.scene, 0, 0, this._metrics, config);
        newCell.visible = Boolean(!idx);
        newCell.key = config.key;
        this._cells.push(newCell);
        this.addAt(newCell, this._cells.length);
    }

    removeCell(cellToRemove) {
        this._cell = fp.remove(n => n === cellToRemove, this._cells);
        cellToRemove.destroy();
    }

    reset(metrics) {
        metrics = metrics || this._metrics;
        // if (this._metrics.isMobile !== metrics.isMobile) { }
        this.resetButtons(metrics);
    }

    gridMetrics(metrics) {
        return {
            displayWidth: metrics.isMobile ? this._displayWidth.mobile : this._displayWidth.desktop,
            displayHeight: metrics.isMobile ? this._displayHeight.mobile : this._displayHeight.desktop,
        };
    }

    resetButtons(metrics) {
        // TODO This should resize the buttons for mobile/desktop breakpoints?
        this._cells.map(cell => {
            cell.displayWidth = this.gridMetrics(metrics).displayWidth;
            cell.displayHeight = this.gridMetrics(metrics).displayHeight;
        });
    }
}
