/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import { accessibilify } from "../accessibility/accessibilify.js";
import { GelButton } from "./gel-button.js";

const cellDefaults = {
    group: "topLeft",
    ariaLabel: "Exit Game",
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
        this.scene.theme.choices.map(this.addCell, this);
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
        return this._cells.map(cell => cell.key);
    }

    addCell(choice, i) {
        const config = Object.assign({}, cellDefaults, {
            id: fp.kebabCase(choice.title),
            key: choice.asset,
            name: choice.title ? choice.title : `option ${i + 1}`,
            scene: this.scene.scene.key,
            channel: this.eventChannel,
        });

        const newCell = new GelButton(this.scene, 0, 0, this._metrics, config);
        newCell.visible = Boolean(!i);
        newCell.key = config.key;

        this.addAt(newCell, this._cells.length);
        this._cells.push(newCell);
    }

    removeCell(cellToRemove) {
        this._cell = fp.remove(n => n === cellToRemove, this._cells);
        cellToRemove.destroy();
    }

    addToGroup(item, position = 0) {
        this.addAt(item, position);
        this.alignChildren();
    }

    alignChildren() {
        const pos = { x: 0, y: 0 };

        const halfWidth = this.width / 2; //Save here as size changes when you move children below
        this.iterate(child => {
            child.y = pos.y + child.height / 2;

            if (this._isVertical) {
                child.x = halfWidth;
                pos.y += child.height + this._metrics.buttonPad;
            } else if (this._vPos === "middle") {
                child.y = 0;

                child.x = pos.x + child.width / 2;
                pos.x += child.width + this._metrics.buttonPad * 3;
            } else {
                child.x = pos.x + child.width / 2;
                pos.x += child.width + this._metrics.buttonPad;
            }
        }, this);
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
