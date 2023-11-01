/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gelDom } from "./gel-dom.js";
import { CAMERA_X, CAMERA_Y } from "./metrics.js";

const px = val => Math.floor(val) + "px";
const alignments = { left: "0", center: "-50%", right: "-100%" };
const invalidAlign = align => checkAlign(align) && warning(align);
const checkAlign = align => Object.keys(alignments).indexOf(align) === -1;
const warning = align => {
	// eslint-disable-next-line no-console
	console.warn(
		`Invalid alignment value of ${align} passed to alignText. Use one of ${Object.keys(alignments).join("|")}`,
	);
	return true;
};

const defaultStyle = {
	top: "0",
	left: "0",
	position: "absolute",
};

const getTextNodes = text => text.split("\n").map(line => document.createTextNode(line));
const addBreaks = (el, i, arr) => [el].concat(i !== arr.length - 1 ? [document.createElement("br")] : []);

let uid = 0;

class DomText {
	constructor(text, newConfig) {
		const config = { ...defaultConfig, ...newConfig };
		this.el = document.createElement("div");
		this.el.id = `domtext-${uid++}`;
		this.el.dataset.text = text;
		this.setStyle({ ...defaultStyle, ...config.style });
		this._textNodes = [];
		this.setText(text);

		this.setAlignment(config.align);
		this.setPosition(config.position.x, config.position.y);
	}

	addOuterStroke(size, color) {
		this.inlineStyleSheet = document.createElement("style");
		const css = `
		  #${this.el.id}::after {
		  content: attr(data-text);
		  position: absolute;
		  left: 0;
		  top:0;
		  -webkit-text-stroke: ${size * 2}px ${color};
		  width: ${this.el.style.width};
		  z-index:-1;
		  font-size: 1em;
		}`;
		this.inlineStyleSheet.appendChild(document.createTextNode(css));
		gelDom.current().appendChild(this.inlineStyleSheet);
	}

	setText(newText) {
		this._textNodes.forEach(textNode => textNode.remove());
		this._textNodes = getTextNodes(newText).flatMap(addBreaks);
		this._textNodes.forEach(textNode => this.el.appendChild(textNode));
	}

	setPosition(x, y) {
		x !== undefined && (this.el.style.left = px(x + CAMERA_X));
		y !== undefined && (this.el.style.top = px(y + CAMERA_Y));
	}

	setAlignment(alignment) {
		if (invalidAlign(alignment)) return;
		this.el.style.transform = `translate(${alignments[alignment]})`;
		this.el.style.textAlign = alignment;
	}

	setStyle(newStyle) {
		Object.assign(this.el.style, newStyle);
	}

	destroy() {
		this.el.remove();
		this.inlineStyleSheet?.remove();
	}
}

const defaultConfig = {
	style: {},
	position: { x: 0, y: 0 },
	align: "left",
};

export const addDomText = (text, config) => {
	const domText = new DomText(text, config);
	gelDom.current().appendChild(domText.el);
	return domText;
};
