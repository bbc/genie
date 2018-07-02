import fp from "../../../lib/lodash/fp/fp.js";

import * as ButtonFactory from "./button-factory.js";

const horizontal = {
    left: (metrics, group, horizontalsType) => {
        group.left = metrics[horizontalsType].left + metrics.borderPad;
    },
    center: (metrics, group, horizontalsType) => {
        group.centerX = metrics[horizontalsType].center;
    },
    right: (metrics, group, horizontalsType) => {
        group.right = metrics[horizontalsType].right - metrics.borderPad;
    },
};

const vertical = {
    top: (metrics, group) => {
        group.top = metrics.verticals.top + metrics.borderPad;
    },
    middle: (metrics, group) => {
        group.centerY = metrics.verticals.middle;
    },
    bottom: (metrics, group) => {
        group.bottom = metrics.verticals.bottom - metrics.borderPad;
    },
};

export class Group extends Phaser.Group {
    constructor(game, parent, vPos, hPos, metrics, isSafe, isVertical) {
        super(game, parent, fp.camelCase([vPos, hPos, isVertical ? "v" : ""].join(" ")));

        this._vPos = vPos;
        this._hPos = hPos;
        this._metrics = metrics;
        this._isSafe = isSafe;
        this._isVertical = isVertical;
        this._buttons = [];
        this._buttonFactory = ButtonFactory.create(game);
        this._setGroupPosition = metrics => {
            horizontal[hPos](metrics, this, isSafe ? "safeHorizontals" : "horizontals");
            vertical[vPos](metrics, this);
        };
    }

    /**
     * TODO add interface for config
     */
    addButton(config, position = this._buttons.length) {
        const newButton = this._buttonFactory.createButton(this._metrics, config, this.width / 2, this.height / 2);

        this.addAt(newButton, position);
        this._buttons.push(newButton);

        this.alignChildren();

        return newButton;
    }

    removeButton(buttonToRemove) {
        this._buttons = fp.remove(n => n === buttonToRemove, this._buttons);
        buttonToRemove.destroy();
    }

    addToGroup(item, position = 0) {
        item.anchor.setTo(0.5, 0.5);
        this.addAt(item, position);
        this.alignChildren();
    }

    reset(metrics) {
        metrics = metrics || this._metrics;
        if (this._metrics.isMobile !== metrics.isMobile) {
            this.resetButtons(metrics);
        }
        this.alignChildren();

        this._metrics = metrics;
        const invScale = 1 / metrics.scale;
        this.scale.setTo(invScale, invScale);
        this._setGroupPosition(metrics);
    }

    alignChildren() {
        const pos = { x: 0, y: 0 };

        const halfWidth = this.width / 2; //Save here as size changes when you move children below
        this.children.forEach(childDisplayObject => {
            const child = childDisplayObject;
            child.y = pos.y + child.height / 2;

            if (this._isVertical) {
                child.x = halfWidth;
                pos.y += child.height + this._metrics.buttonPad;
            } else if (this._hPos === "center" && this._vPos === "middle") {
                child.y = 0;
                child.x = pos.x + child.width / 2;
                pos.x += child.width + this._metrics.buttonPad * 3;
            } else {
                child.x = pos.x + child.width / 2;
                pos.x += child.width + this._metrics.buttonPad;
            }
        }, this);
    }

    //TODO this is currently observer pattern but will eventually use pub/sub Phaser.Signals
    resetButtons(metrics) {
        this._buttons.forEach(button => button.resize(metrics));
    }
}
