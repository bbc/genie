/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../screen.js";
import { eventBus } from "../event-bus.js";
import { buttonsChannel } from "../layout/gel-defaults.js";
import { accessibilify } from "../accessibility/accessibilify.js";
import { getDebugScreens } from "./get-debug-screens.js";

const addButton = config => {
    const button = config.scene.add.gelButton(config.x, config.y, {
        scene: "gelDebug",
        key: "button",
        id: config.id,
        channel: buttonsChannel(config.scene),
        gameButton: true,
        ariaLabel: config.title,
    });
    const text = config.scene.add.text(0, 0, config.title).setOrigin(0.5, 0.5);
    button.overlays.set("text", text);
    accessibilify(button, true);

    eventBus.subscribe({
        channel: buttonsChannel(config.scene),
        name: config.id,
        callback: config.callback,
    });
};

const notDebugScreen = id => id !== "debug";

const getButtonConfig = (launcher, debugScreens) => (id, idx) => ({
    scene: launcher,
    x: -240 + Math.floor(idx / 6) * 240,
    y: -180 + (idx % 6) * 80,
    id,
    title: debugScreens[id].title,
    callback: () => {
        launcher.transientData = debugScreens[id].transientData || {};
        launcher.navigation[id]();
    },
});

const titleStyle = {
    font: "32px ReithSans",
    fill: "#f6931e",
    align: "center",
};

export class Launcher extends Screen {
    create() {
        this.add.image(0, 0, "home.background");
        this.add.text(0, -250, "EXAMPLES", titleStyle).setOrigin(0.5);

        this.setLayout(["home"]);

        Object.keys(getDebugScreens(true))
            .filter(notDebugScreen)
            .map(getButtonConfig(this, getDebugScreens(true)))
            .map(addButton);
    }
}
