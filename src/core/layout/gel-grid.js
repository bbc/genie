/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import * as a11y from "../accessibility/accessibility-layer.js";
import * as ButtonFactory from "./button-factory.js";
import { GelButton } from "./gel-button.js";

const horizontal = {
    left: (metrics, group, horizontalsType) => {
        let hitAreaOffset = 0;
        fp.forEach(child => {
            if (!child.input.hitArea) return;
            hitAreaOffset = fp.max([hitAreaOffset, -(child.x - child.input.hitArea.width / 2) / metrics.scale]);
        }, group.list);
        group.x = metrics[horizontalsType].left + metrics.borderPad + hitAreaOffset;
    },
    center: (metrics, group, horizontalsType) => {
        group.x = metrics[horizontalsType].center - group.getBounds().width / 2;
    },
    right: (metrics, group, horizontalsType) => {
        let hitAreaOffset = 0;
        fp.forEach(child => {
            if (!child.input.hitArea) return;
            hitAreaOffset = fp.max([
                hitAreaOffset,
                (child.x + child.input.hitArea.width / 2) / metrics.scale - group.getBounds().width,
            ]);
        }, group.list);
        group.x = metrics[horizontalsType].right - metrics.borderPad - hitAreaOffset - group.getBounds().width;
    },
};

const vertical = {
    top: (metrics, group) => {
        let hitAreaOffset = 0;
        fp.forEach(child => {
            if (!child.input.hitArea) return;
            hitAreaOffset = fp.max([hitAreaOffset, -(child.y - child.input.hitArea.height / 2) / metrics.scale]);
        }, group.list);
        group.y = metrics.verticals.top + metrics.borderPad + hitAreaOffset;
    },
    middle: (metrics, group) => {
        group.y = metrics.verticals.middle;
    },
    bottom: (metrics, group) => {
        let hitAreaOffset = 0;
        fp.forEach(child => {
            if (!child.input.hitArea) return;
            hitAreaOffset = fp.max([
                hitAreaOffset,
                (child.y + child.input.hitArea.height / 2) / metrics.scale - group.getBounds().height,
            ]);
        }, group.list);
        group.y = metrics.verticals.bottom - metrics.borderPad - hitAreaOffset - group.getBounds().height;
    },
};

export class GelGrid extends Phaser.GameObjects.Container {
    constructor(scene, parent, vPos, hPos, metrics, isSafe, isVertical) {
        super(scene, 0, 0);
        //TODO P3 we used to name the groups - useful for debugging. Might be usuaful as a propery? [NT]
        //super(game, parent, fp.camelCase([vPos, hPos, isVertical ? "v" : ""].join(" ")));
        this._vPos = vPos;
        this._hPos = hPos;
        this._metrics = metrics;
        this._isSafe = isSafe;
        this._isVertical = isVertical;
        this._cells = [];
        this._buttonFactory = ButtonFactory.create(scene);
        this._setGroupPosition = metrics => {
            return; //TODO
            horizontal[hPos](metrics, this, isSafe ? "safeHorizontals" : "horizontals");
            vertical[vPos](metrics, this);
        };

        this.x = -400;
        this.xOffset = 0; //TODO DELETE ME!!!

        window.check = this.scene;
    }

    addGridCells() {
        const config = {
            group: "topLeft",
            title: "Exit",
            key: "IRRELEVANT",
            ariaLabel: "Exit Game",
            order: 0,
            id: "__exit",
            channel: "gel-buttons-" + this.scene.scene.key,
        };

        [1].forEach(idx => {
            this.addCell(Object.assign({}, config, { forceKey: "char" + idx }));
        }, this);

        this.makeAccessible();
    }

    // TODO This should return the list of cell keys (obviously) - keys need to be added to the button objects
    //
    // cellKeys() {
    //     return this._cells.map(cell => {
    //         // return cell.forceKey || cell.key; // TODO GET THE KEY/FORCEKEY here
    //     });
    // }

    addCell(config, position = this._cells.length) {
        const newCell = new GelButton(this.scene, this.xOffset, 0, this._metrics, config);

        this.xOffset = this.xOffset + 200;

        newCell.setScale(0.2);
        newCell.setSize();

        this.addAt(newCell, position);
        this._cells.push(newCell);

        //this.alignChildren();

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

    makeAccessible() {
        this._cells.forEach(cell => a11y.addToAccessibleButtons(this.scene, cell));
    }
}
