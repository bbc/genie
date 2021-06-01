/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import crel from "../../../lib/crel.es.js";
import { getContainerDiv } from "../loader/container.js";
import { onScaleChange } from "../scaler.js";

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

const toInlineStyle = (acc, cur) => `${acc}${cur}:${gelDomStyle[cur]}; `;
const style = Object.keys(gelDomStyle).reduce(toInlineStyle, "");
const createGelDom = () => crel("div", { id: "gel", role: "application", style });

export let gel;

export const initGel = game => {
    const root = createGelDom();
    getContainerDiv().appendChild(root);

    const resize = metrics => {
        root.style.top = game.canvas.style.marginTop;
        root.style.left = game.canvas.style.marginLeft;
        root.style.transform = `scale(${metrics.scale})`;
    };

    onScaleChange.add(resize);

    const clear = () => {
        const scene = scenes.pop();
        scene.innerHTML = "";
        scene.remove();
        scenes.length && (scenes[scenes.length - 1].style.display = "");
    };

    let scenes = [];
    const start = () => {
        const scene = crel("div");
        root.appendChild(scene);
        scenes.push(scene);
    };

    const hide = () => (scenes[scenes.length - 1].style.display = "none");
    const current = () => scenes[scenes.length - 1];

    gel = { current, clear, start, hide };

    return gel;
};
