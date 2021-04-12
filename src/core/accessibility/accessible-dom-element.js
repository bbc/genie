/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import crel from "../../../lib/crel.es.js";
import fp from "../../../lib/lodash/fp/fp.js";

const keyUp = options => event => {
    const enterKey = event.key === "Enter";
    const spaceKey = event.key === " ";

    if (enterKey || spaceKey) {
        options.onClick && options.onClick();
    }
};

const defaultAttributes = {
    tabindex: 0,
    role: "button",
};

const assignEvents = (el, options) => {
    const keyup = keyUp(options);
    el.addEventListener("click", options.onClick);
    el.addEventListener("keyup", keyup);
    el.addEventListener("mouseover", options.onMouseOver);
    el.addEventListener("mouseleave", options.onMouseOut);
    el.addEventListener("focus", options.onMouseOver);
    el.addEventListener("blur", options.onMouseOut);

    el.addEventListener("touchmove", e => e.preventDefault(), { passive: true });
    el.addEventListener("touchstart", () => {});

    return { keyup, click: options.onClick };
};

const style = {
    position: "absolute",
    cursor: "pointer",
    touchAction: "manipulation",
    "pointer-events": "none",
};

const visible = el => el.style.visibility !== "hidden";

const show = el => {
    el.setAttribute("aria-hidden", false);
    el.setAttribute("tabindex", "0");
    el.style.display = "block";
    el.style.visibility = "visible";
};

const hide = el => {
    el.setAttribute("aria-hidden", true);
    el.setAttribute("tabindex", "-1");
    el.style.display = "none";
    el.style.visibility = "hidden";
};

export const accessibleDomElement = options => {
    const button = options.button;

    const el = crel(
        "div",
        { ...defaultAttributes, ...fp.pick(["id", "class", "aria-label", "aria-hidden"], options) },
        options.text || "",
    );
    Object.assign(el.style, style);
    const events = assignEvents(el, options);

    const position = pos => {
        el.style.left = pos.x.toString() + "px";
        el.style.top = pos.y.toString() + "px";
        el.style.width = pos.width.toString() + "px";
        el.style.height = pos.height.toString() + "px";
    };

    const update = () => {
        if (el.getAttribute("aria-label") !== button.config.ariaLabel) {
            el.setAttribute("aria-label", button.config.ariaLabel);
        }
        if (!button.config.tabbable && ((button.input && !button.input.enabled) || !button.visible)) {
            visible(el) && hide(el);
        } else if (!visible(el)) {
            show(el);
        }
    };

    return {
        el,
        button,
        position,
        update,
        events,
    };
};
