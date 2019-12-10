/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
//import * as a11y from "../accessibility/accessibility-layer.js";
import { accessibilify } from "../accessibility/accessibilify.js";
import * as ButtonFactory from "./button-factory.js";
import { GelButton } from "./gel-button.js";

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
        this._buttonFactory = ButtonFactory.create(scene);
        window.check = this.scene;
    }

    getCellID(choice, i) {
        return fp.camelCase(`${this.scene.scene.key}${i}${choice.asset}`);
    }

    addGridCells() {
        const config = {
            group: "topLeft",
            ariaLabel: "Exit Game",
            order: 0,
            channel: "gel-buttons-" + this.scene.scene.key,
        };
        this.scene.theme.choices.map((choice, i) => {
            this.addCell(
                Object.assign({}, config, {
                    id: this.getCellID(choice, i),
                    key: choice.asset,
                    title: choice.title ? choice.title : `Option ${i + 1}`,
                    scene: this.scene.scene.key,
                }),
            );
            !!i ? (this._cells[i].visible = false) : (this._cells[i].visible = true);
        });

        //MAKE ACCESSIBLE
        this._cells.forEach((cell, idx) => {
            const config = {
                id: `__selection_${idx}`,
                ariaLabel: `Selection ${idx}`,
                group: "grid",
                title: `Selection ${idx}`,
                key: `selection_${idx}`,
                order: 0,
                channel: "gel-buttons-character-select",    //TODO pass in name
            };

            return accessibilify(cell, config, true);
        });
        this.reset();
    }

    cellKeys() {
        return this._cells.map(cell => cell.key);
    }

    addCell(config, position = this._cells.length) {
        const xOffset = 0;
        const yOffset = 0;
        const newCell = new GelButton(this.scene, xOffset, yOffset, this._metrics, config);
        newCell.key = config.key;

        this.addAt(newCell, position);
        this._cells.push(newCell);

        return newCell;
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
        const gridMetrics = {
            displayWidth: metrics.isMobile ? this._displayWidth.mobile : this._displayWidth.desktop,
            displayHeight: metrics.isMobile ? this._displayHeight.mobile : this._displayHeight.desktop,
        };
        return gridMetrics;
    }

    resetButtons(metrics) {
        // TODO This should resize the buttons for mobile/desktop breakpoints?
        this._cells.map(cell => {
            cell.displayWidth = this.gridMetrics(metrics).displayWidth;
            cell.displayHeight = this.gridMetrics(metrics).displayHeight;
        });
    }
}
