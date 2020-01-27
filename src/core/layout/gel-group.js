/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import * as a11y from "../accessibility/accessibility-layer.js";
import * as ButtonFactory from "./button-factory.js";

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
        group.x = metrics[horizontalsType].center - group.width / 2;
    },
    right: (metrics, group, horizontalsType) => {
        let hitAreaOffset = 0;
        fp.forEach(child => {
            if (!child.input.hitArea) return;
            hitAreaOffset = fp.max([
                hitAreaOffset,
                (child.x + (child.input.hitArea.width  / 2)) / metrics.scale - group.width,
            ]);
        }, group.list);
        group.x = metrics[horizontalsType].right - metrics.borderPad - hitAreaOffset - group.width;
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
        group.y = metrics.verticals.middle - group.height / 2;
    },
    bottom: (metrics, group) => {
        let hitAreaOffset = 0;
        fp.forEach(child => {
            if (!child.input.hitArea) return;
            hitAreaOffset = fp.max([
                hitAreaOffset,
                (child.y + child.input.hitArea.height / 2) / metrics.scale - group.height,
            ]);
        }, group.list);
        group.y = metrics.verticals.bottom - metrics.borderPad - hitAreaOffset - group.height;
    },
};

export class GelGroup extends Phaser.GameObjects.Container {
    constructor(scene, parent, vPos, hPos, metrics, isSafe, isVertical = false) {
        super(scene, 0, 0);
        //TODO P3 we used to name the groups - useful for debugging. Might be usuaful as a propery? [NT]
        //super(game, parent, fp.camelCase([vPos, hPos, isVertical ? "v" : ""].join(" ")));
        this._vPos = vPos;
        this._hPos = hPos;
        this._metrics = metrics;
        this._isSafe = isSafe;
        this._isVertical = isVertical;
        this._buttons = [];
        this._buttonFactory = ButtonFactory.create(scene);
        this._setGroupPosition = metrics => {
            //TODO change this to returns e.g: this.y = vertical[vPos](metrics, this);
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

        this.reset(this._metrics);

        return newButton;
    }

    getBoundingRect() {
        return new Phaser.Geom.Rectangle(this.x, this.y, this.width, this.height);
    }

    removeButton(buttonToRemove) {
        this._buttons = fp.remove(n => n === buttonToRemove, this._buttons);
        buttonToRemove.destroy();
    }

    addToGroup(item, position = 0) {
        this.addAt(item, position);
        this.reset();
    }

    reset(metrics) {
        metrics = metrics || this._metrics;
        this.resetButtons(metrics);
        this.alignChildren();

        this._metrics = metrics;
        const invScale = 1 / metrics.scale;

        this.setScale(invScale);
        this.updateSize();
        this._setGroupPosition(metrics);

        this._buttons.forEach(button => {
            button.x = button.x + button.config.shiftX * metrics.scale;
            button.y = button.y + button.config.shiftY * metrics.scale;
        });
    }

    updateSize() {
        const childBounds = this.list.map(child => child.getHitAreaBounds());

        const left = childBounds[0]? Math.min(...childBounds.map(bounds => bounds.x)) : 0
        const right = childBounds[0]? Math.max(...childBounds.map(bounds => bounds.x + bounds.width)) : 0
        let top = childBounds[0]? Math.min(...childBounds.map(bounds => bounds.y)) : 0
        let bottom = childBounds[0]? Math.max(...childBounds.map(bounds => bounds.y + bounds.height)) : 0

        this.setSize(right - left, bottom - top);
    }

    alignChildren() {
        const pos = { x: 0, y: 0 };
        this.iterate(child => {
            child.y = pos.y + child.height / 2;

            if (this._isVertical) {
                child.x = 0;
                pos.y += child.height + Math.max(0, this._metrics.buttonPad - child.height + child.sprite.height);
            } else {
                child.x = pos.x + child.width / 2;
                pos.x += child.width + Math.max(0, this._metrics.buttonPad - child.width + child.sprite.width)
            }
        }, this);
    }

    makeAccessible() {
        this._buttons.forEach(button => a11y.addToAccessibleButtons(this.scene, button));
    }

    //TODO this is currently observer pattern but will eventually use pub/sub Phaser.Events
    resetButtons(metrics) {
        this._buttons.forEach(button => button.resize(metrics));
    }
}
