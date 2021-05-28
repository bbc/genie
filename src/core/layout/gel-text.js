/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { gelDom } from "./gel-container.js";

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
const addBreaks = (el, i, arr) => [el].concat(i != arr.length - 1 ? [document.createElement("br")] : []);

class GelText {
    constructor(text, newConfig) {
        const config = { ...defaultConfig, ...newConfig };
        this.el = document.createElement("div");
        Object.assign(this.el.style, defaultStyle, config.style);

        this._textNodes = [];
        this.setText(text);

        this.alignText(config.align);
        this.setPosition(config.position.x, config.position.y);
    }

    setText(newText) {
        this._textNodes.forEach(textNode => textNode.remove());
        this._textNodes = getTextNodes(newText).flatMap(addBreaks);
        this._textNodes.forEach(textNode => this.el.appendChild(textNode));
    }

    setPosition(x, y) {
        x && (this.el.style.left = px(x));
        y && (this.el.style.top = px(y));
    }

    alignText(align) {
        if (invalidAlign(align)) return;
        this.el.style.transform = `translate(${alignments[align]})`;
        this.el.style.textAlign = align;
    }

    destroy() {
        this.el.remove();
    }
}

const defaultConfig = {
    style: {},
    position: { x: 0, y: 0 },
    align: "left",
};

export const addGelText = (text, config) => {
    const gelText = new GelText(text, config);
    gelDom.appendChild(gelText.el);
    return gelText;
};
