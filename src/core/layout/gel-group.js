/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";
import * as a11y from "../accessibility/accessibility-layer.js";
import { createButton } from "./create-button.js";
import { CANVAS_HEIGHT, GEL_MIN_ASPECT_RATIO } from "./metrics.js";

const canvasSafeWidth = CANVAS_HEIGHT * GEL_MIN_ASPECT_RATIO;
const dim = { x: "width", y: "height" };

const getOverlap = metrics => Math.max(0, metrics.horizontalBorderPad - (metrics.stageWidth - canvasSafeWidth) / 2);
const getPad = (group, metrics) => (group.isSafe ? getOverlap(metrics) : metrics.horizontalBorderPad);
const getType = group => (group.isSafe ? "safeHorizontals" : "horizontals");
const sum = (a, b) => a + b;
const hasHitArea = gameObject => Boolean(gameObject.input.hitArea);
const sumArea = (group, getHitArea) => group.list.filter(hasHitArea).reduce(getHitArea, 0);
const hitAreaFn = (metrics, size, sign, axis) => (acc, cur) =>
	Math.max(acc, sign * ((cur[axis] + (sign * cur.input.hitArea[dim[axis]]) / 2) / metrics.scale - size));

const horizontal = {
	left: (metrics, group) => {
		const getHitArea = hitAreaFn(metrics, 0, -1, "x");
		return metrics[getType(group)].left + getPad(group, metrics) + sumArea(group, getHitArea);
	},
	center: (metrics, group) => metrics[getType(group)].center - group.width / 2,
	right: (metrics, group) => {
		const getHitArea = hitAreaFn(metrics, group.width, 1, "x");
		return metrics[getType(group)].right - getPad(group, metrics) - sumArea(group, getHitArea) - group.width;
	},
};

const vertical = {
	top: (metrics, group) => {
		const getHitArea = hitAreaFn(metrics, 0, -1, "y");
		return metrics.verticals.top + metrics.verticalBorderPad + sumArea(group, getHitArea);
	},
	middle: (metrics, group) => metrics.verticals.middle - group.height / 2,
	bottom: (metrics, group) => {
		const getHitArea = hitAreaFn(metrics, group.height, 1, "y");
		return metrics.verticals.bottom - metrics.bottomBorderPad - sumArea(group, getHitArea) - group.height;
	},
};

export class GelGroup extends Phaser.GameObjects.Container {
	constructor(scene, parent, vPos, hPos, metrics, isSafe, isVertical = false) {
		super(scene, 0, 0);
		this.setScrollFactor(0);
		this._vPos = vPos;
		this._hPos = hPos;
		this._metrics = metrics;
		this.isSafe = isSafe;
		this._isVertical = isVertical;
		this._buttons = [];
		this._setGroupPosition = metrics => {
			this.x = horizontal[hPos](metrics, this);
			this.y = vertical[vPos](metrics, this);
		};

		this.makeAccessible();
	}

	addButton(config, position = this._buttons.length) {
		position = this._isVertical ? 0 : position;
		const newButton = createButton(this.scene, config, this.width / 2, this.height / 2);

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

		const left = childBounds[0] ? Math.min(...childBounds.map(bounds => bounds.x)) : 0;
		const right = childBounds[0] ? Math.max(...childBounds.map(bounds => bounds.x + bounds.width)) : 0;
		let top = childBounds[0] ? Math.min(...childBounds.map(bounds => bounds.y)) : 0;
		let bottom = childBounds[0] ? Math.max(...childBounds.map(bounds => bounds.y + bounds.height)) : 0;

		this.setSize(right - left, bottom - top);
	}

	alignChildren() {
		const pos = { x: 0, y: 0 };
		const groupHeight = Math.max(...this.list.map(i => i.height));
		const pads = this.list.map(child => Math.max(0, this._metrics.buttonPad - child.width + child.sprite.width));
		const widths = this.list.map(child => child.width);
		this.list.forEach((child, idx) => {
			child.y = pos.y + groupHeight / 2;
			this._isVertical &&
				(pos.y += child.height + Math.max(0, this._metrics.buttonPad - child.height + child.sprite.height));
			child.x = this._isVertical
				? child.width / 2
				: widths.slice(0, idx).reduce(sum, widths[idx] / 2) +
				  pads.slice(0, idx).reduce(sum, pads[idx] / 2 - pads[0] / 2);
		}, this);
	}

	makeAccessible() {
		a11y.addGroupAt(
			fp.camelCase([this._vPos, this._hPos, this._isVertical ? "v" : "", this.isSafe ? "safe" : ""].join("-")),
		);
		this._buttons.forEach(a11y.addButton);
	}

	//TODO this is currently observer pattern but will eventually use pub/sub Phaser.Events
	resetButtons(metrics) {
		this._buttons.forEach(button => button.resize(metrics));
	}
}
