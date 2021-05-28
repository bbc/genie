/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import crel from "../../../lib/crel.es.js";
import { getContainerDiv } from "../loader/container.js";
import { onScaleChange } from "../scaler.js";

const resizeContainer = game => metrics => {
    gelDom.style.top = game.canvas.style.marginTop;
    gelDom.style.left = game.canvas.style.marginLeft;
    gelDom.style.transform = `scale(${metrics.scale})`;
};

const gelDomStyle = {
    position: "absolute",
    "transform-origin": "top left",
    left: 0,
    top: 0,
    "background-color": "rgba(255,0,0,0.2)",
    width: "1400px",
    height: "600px",
    "pointer-events": "none",
};

const style = Object.keys(gelDomStyle).reduce((acc, cur) => `${acc}${cur}:${gelDomStyle[cur]}; `, "");
const createGelDom = () => crel("div", { id: "gel", role: "application", style });

export let gelDom;

export const addGelContainer = game => {
    gelDom = createGelDom();
    getContainerDiv().appendChild(gelDom);
    onScaleChange.add(resizeContainer(game));
    return gelDom;
};
