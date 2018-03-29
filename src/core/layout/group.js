import fp from "../../lib/lodash/fp/fp.js";

import * as ButtonFactory from "./button-factory.js";

const horizontal = {
    left: (width, pad, pos) => pos + pad,
    right: (width, pad, pos) => pos - width - pad,
    center: (width, pad, pos) => pos - width / 2,
};

const vertical = {
    top: (height, pad, pos) => pos + pad,
    middle: (height, pad, pos) => pos - height / 2,
    bottom: (height, pad, pos) => pos - (height + pad),
};

const getGroupPosition = sizes => ({
    x: getGroupX(sizes),
    y: getGroupY(sizes),
});

const getGroupX = sizes => {
    const horizontals = sizes.metrics["horizontals"];

    return horizontal[sizes.pos.h](sizes.width, sizes.metrics.borderPad * sizes.scale, horizontals[sizes.pos.h]);
};

const getGroupY = sizes =>
    vertical[sizes.pos.v](sizes.height, sizes.metrics.borderPad * sizes.scale, sizes.metrics.verticals[sizes.pos.v]);

export class Group extends Phaser.Group {
    constructor(game, parent, vPos, hPos, metrics, isVertical) {
        super(game, parent, fp.camelCase([vPos, hPos, isVertical ? "v" : ""].join(" ")));

        this._vPos = vPos;
        this._hPos = hPos;
        this._metrics = metrics;
        this._isVertical = isVertical;
        this._buttons = [];

        this._buttonFactory = ButtonFactory.create(game);
        this._setGroupPosition = fp.flow(this.getSizes, getGroupPosition, this.setPos);
        this._setGroupPosition();
    }

    /**
     * TODO add interface for config
     */
    addButton(config, position = this._buttons.length) {
        const newButton = this._buttonFactory.createButton(this._metrics.isMobile, config.key);

        this.addAt(newButton, position);
        this._buttons.push(newButton);

        this.alignChildren();
        this._setGroupPosition();

        return newButton;
    }

    addToGroup(item, position = 0) {
        item.anchor.setTo(0.5, 0.5);
        this.addAt(item, position);
        this.alignChildren();
        this._setGroupPosition();
    }

    reset(metrics) {
        if (this._metrics.isMobile !== metrics.isMobile) {
            this.resetButtons(metrics);
            this.alignChildren();
        }

        this._metrics = metrics;
        const invScale = 1 / metrics.scale;
        this.scale.setTo(invScale, invScale);
        this._setGroupPosition();
    }

    alignChildren() {
        const pos = { x: 0, y: 0 };

        const groupWidth = this.width; //Save here as size changes when you move children below
        this.children.forEach(childDisplayObject => {
            const child = childDisplayObject;
            child.y = pos.y + child.height / 2;

            if (this._isVertical) {
                child.x = groupWidth / 2;
                pos.y += child.height + this._metrics.buttonPad;
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

    getSizes() {
        return {
            metrics: this._metrics,
            pos: { h: this._hPos, v: this._vPos },
            width: this.width,
            height: this.height,
            scale: this.scale.x,
        };
    }

    setPos({ x, y }) {
        this.x = x;
        this.y = y;
    }
}
