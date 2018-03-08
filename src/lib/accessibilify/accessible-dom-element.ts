export function accessibleDomElement(options: AccessibleDomElementOptions) {
    const el = document.createElement("div");

    init();

    return {
        el,
        hide,
        show,
        visible,
        position,
        remove,
    };

    function init(): void {
        el.setAttribute("tabindex", "0");
        el.setAttribute("aria-label", options.ariaLabel);
        el.setAttribute("role", "button");
        el.style.position = "absolute";
        el.addEventListener("keyup", keyUp);
        el.addEventListener("click", options.onClick);
        options.parent.appendChild(el);
    }

    function hide(): void {
        el.setAttribute("tabindex", "-1");
        el.style.visibility = "hidden";
    }

    function show(): void {
        el.setAttribute("tabindex", "0");
        el.style.visibility = "visible";
    }

    function visible(): boolean {
        return el.style.visibility === "visible";
    }

    function position(positionOptions: { x: number, y: number, width: number, height: number }): void {
        el.style.left = positionOptions.x.toString() + "px";
        el.style.top = positionOptions.y.toString() + "px";
        el.style.width = positionOptions.width.toString() + "px";
        el.style.height = positionOptions.height.toString() + "px";
    }

    function keyUp(event: KeyboardEvent): void {
        const enterKey = event.key === "Enter";
        const spaceKey = event.key === " ";

        if (enterKey || spaceKey) {
            options.onClick();
        }
    }

    function remove(): void {
        el.remove();
    }
}
