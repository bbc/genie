import { getContainerDiv } from "../loader/container.js";
import crel from "../../../lib/crel.es.js";

import { getMetrics, onScaleChange } from "../scaler.js";

let container = crel("div", {
    id: "gel",
    role: "application",
    style:
        "position:absolute; transform-origin: top left; left:0; top: 0; background-color: rgba(255,0,0,0.2); width:1400px; height:600px;pointer-events:none;",
}); //TODO check role

export const addGelContainer = () => getContainerDiv().appendChild(container);

/*

const setSize = metrics => {
        const under4by3 = game.scale.parent.offsetWidth / game.scale.parent.offsetHeight < 4 / 3;

        const viewHeight = under4by3 ? game.scale.parent.offsetWidth * (3 / 4) : game.scale.parent.offsetHeight;

        game.canvas.style.height = px(viewHeight);

        const bounds = game.canvas.getBoundingClientRect();
        const marginLeft = (game.scale.parent.offsetWidth - bounds.width) / 2;
        const marginTop = (game.scale.parent.offsetHeight - bounds.height) / 2;

        game.canvas.style.marginLeft = px(marginLeft);
        game.canvas.style.marginTop = px(marginTop);
        game.scale.refresh();
        _onSizeChange.dispatch(metrics);
    };


 */

const resizeContainer = metrics => {
    console.log(metrics);

    container.style.top = `${metrics.marginTop}px`;
    container.style.left = `${metrics.marginLeft}px`;
    container.style.transform = `scale(${metrics.scale})`;
};

onScaleChange.add(resizeContainer);

const px = val => `${val}px`;

class gelText {
    constructor(text, style) {
        this._el = document.createElement("div");
        Object.assign(this._el.style, defaults, style);

        this._textNode = document.createTextNode(text);

        this._el.appendChild(this._textNode);
    }

    setText(newText) {
        this._textNode.nodeValue = newText;
    }

    setPosition(x, y) {
        x ?? (this._el.style.left = px(x));
        y ?? (this._el.style.top = px(y));
    }

    alignText(align = "left") {
        const alignments = { left: -50, center: 0, right: -100 };
        if (Object.keys(alignments).indexOf(align) === -1) {
            console.log(`value ${align} passed to alignText not one of ${Object.keys(alignments).join("|")}`);
        }

        this._el.style.transform = `translate(${alignments[align]}%, 0);`;
    }
}

export const addGelText = (text, style = {}) => {
    const CSS = document.createElement("span").style;

    const defaults = {
        top: "200px",
        left: "700px",
        position: "absolute",
    };

    Object.assign(CSS, defaults, style);

    console.log(CSS.cssText);

    const gelText = crel("div", { style: CSS.cssText }, text);

    container.appendChild(gelText);
};
