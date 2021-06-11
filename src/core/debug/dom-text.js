/**
 * Test screen for Gel Text
 *
 * @module components/home
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { buttonsChannel } from "../layout/gel-defaults.js";
import { Screen } from "../screen.js";
import { eventBus } from "../event-bus.js";
import crel from "../../../lib/crel.es.js";
import { getContainerDiv } from "../loader/container.js";

const debugUiStyle =
    "width: 160px; height: 400px; background-color: rgba(0,0,0,0.5); position: absolute; top: 200px; left: 10px;color:white; padding: 10px;";

/* istanbul ignore next */
const debugUI = scene => {
    const container = getContainerDiv();
    let x = 0;
    let y = -200;

    const positionInfo = crel("p");

    const setPosition = (xVec, yVec) => {
        x += xVec * 10;
        y += yVec * 10;
        scene.domText?.setPosition(x, y);
        positionInfo.innerText = `x:${x}, y:${y}`;
    };

    setPosition(0, 0);

    const upBtn = crel("button", { onclick: () => setPosition(0, -1), tabIndex: -1 }, "↑");
    const downBtn = crel("button", { onclick: () => setPosition(0, 1), tabIndex: -1 }, "↓");
    const leftBtn = crel("button", { onclick: () => setPosition(-1, 0), tabIndex: -1 }, "←");
    const rightBtn = crel("button", { onclick: () => setPosition(1, 0), tabIndex: -1 }, "→");

    const style = crel("textarea", { style: "width: 150px; height: 80px", tabIndex: -1 }, '{\n  "color": "blue"\n}');

    const setStyleBtn = crel(
        "button",
        { onclick: () => scene.domText.setStyle(JSON.parse(style.value)), tabIndex: -1 },
        "setStyle",
    );
    const text = crel("textarea", { style: "width: 150px; height: 80px", tabIndex: -1 }, "Multiline\nText\nTest");

    const setTextBtn = crel("button", { onclick: () => scene.domText.setText(text.value), tabIndex: -1 }, "setText");

    const onchange = () => scene.domText.setAlignment(setAlign.value);

    const setAlign = crel(
        "select",
        { onchange, tabIndex: -1 },
        crel("option", { value: "center" }, "center"),
        crel("option", { value: "left" }, "left"),
        crel("option", { value: "right" }, "right"),
    );

    const ui = crel(
        "div",
        { style: debugUiStyle },
        crel("h2", ".setPosition"),
        positionInfo,
        crel("br"),
        leftBtn,
        upBtn,
        downBtn,
        rightBtn,
        crel("h2", "Style"),
        style,
        crel("br"),
        setStyleBtn,
        crel("br"),
        crel("h2", "Alignment"),
        setAlign,
        crel("br"),
        crel("h2", "Text"),
        text,
        crel("br"),
        setTextBtn,
    );

    container.appendChild(ui);

    return ui;
};

export class DomText extends Screen {
    create() {
        this.addBackgroundItems();
        this.setLayout(["exit", "play", "pause"]);

        const style = {
            "background-color": "white",
            font: "32px Arial",
            color: "red",
            "font-weight": "bold",
            padding: "5px 10px",
        };

        this.domText = this.add.domText("Multiline text\nCentered\nMultiline text", {
            style,
            position: { x: 0, y: -200 },
            align: "center",
        });

        this.ui = debugUI(this);

        /* istanbul ignore next */
        this.events.once("shutdown", () => this.ui.remove());

        eventBus.subscribe({
            channel: buttonsChannel(this),
            name: "play",
            callback: this.navigation.next,
        });
    }
}
