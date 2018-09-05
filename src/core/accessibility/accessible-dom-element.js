export function accessibleDomElement(options) {
    const el = document.createElement("div");
    let events;

    init();

    return {
        el,
        hide,
        show,
        visible,
        position,
        events,
    };

    function init() {
        el.id = options.id;
        el.setAttribute("tabindex", "0");
        el.setAttribute("aria-hidden", options.ariaHidden || false);
        el.setAttribute("role", "button");
        el.style.position = "absolute";
        el.style.cursor = "pointer";
        el.style.touchAction = "manipulation";

        el.innerHTML = options.text || "";
        if (options.ariaLabel) {
            el.setAttribute("aria-label", options.ariaLabel);
        }
        if (options.htmlClass) {
            el.setAttribute("class", options.htmlClass);
        }

        events = assignEvents();
    }

    function assignEvents() {
        el.addEventListener("keyup", keyUp);
        el.addEventListener("click", options.onClick);
        el.addEventListener("mouseover", options.onMouseOver);
        el.addEventListener("mouseleave", options.onMouseOut);
        el.addEventListener("focus", options.onMouseOver);
        el.addEventListener("blur", options.onMouseOut);

        el.addEventListener("touchmove", e => e.preventDefault());

        return { keyup: keyUp, click: options.onClick };
    }

    function hide() {
        el.setAttribute("aria-hidden", true);
        el.setAttribute("tabindex", "-1");
        el.style.display = "none";
        el.style.visibility = "hidden";
    }

    function show() {
        el.setAttribute("aria-hidden", false);
        el.setAttribute("tabindex", "0");
        el.style.display = "block";
        el.style.visibility = "visible";
    }

    function visible() {
        return el.style.visibility === "visible";
    }

    function position(positionOptions) {
        el.style.left = positionOptions.x.toString() + "px";
        el.style.top = positionOptions.y.toString() + "px";
        el.style.width = positionOptions.width.toString() + "px";
        el.style.height = positionOptions.height.toString() + "px";
    }

    function keyUp(event) {
        const enterKey = event.key === "Enter";
        const spaceKey = event.key === " ";

        if (enterKey || spaceKey) {
            options.onClick();
        }
    }
}
