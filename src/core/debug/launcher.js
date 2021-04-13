/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../screen.js";
import { eventBus } from "../event-bus.js";
import { buttonsChannel } from "../layout/gel-defaults.js";
import { accessibilify } from "../accessibility/accessibilify.js";
import { examples } from "./examples.js";
import { addExampleScreens } from "./debug-screens.js";
import { CAMERA_X, CAMERA_Y } from "../layout/metrics.js";

const addButton = config => {
    const button = config.scene.add.gelButton(config.x + CAMERA_X, config.y + CAMERA_Y, {
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

const getButtonConfig = launcher => (id, idx) => ({
    scene: launcher,
    x: -240 + Math.floor(idx / 5) * 240,
    y: -140 + (idx % 5) * 80,
    id,
    title: examples[id].title,
    callback: () => {
        launcher.transientData[id] = getTransientData(examples[id]);
        launcher.navigation[id]();
    },
});

const getTransientData = example => {
    const transientData = example.transientData || {};
    if (!example.prompt) return transientData;
    const response = JSON.parse(prompt(example.prompt.title, example.prompt.default) || null);
    return response || transientData;
};

const titleStyle = {
    font: "32px ReithSans",
    fill: "#f6931e",
    align: "center",
};

const excludeHidden = key => !examples[key].hidden;

export class Launcher extends Screen {
    create() {
        addExampleScreens(this);

        this.add.image(0, 0, "home.background");
        this.add.text(0, -250, "EXAMPLES", titleStyle).setOrigin(0.5);

        this.setLayout(["home"]);

        Object.keys(examples).filter(excludeHidden).map(getButtonConfig(this)).map(addButton);
    }
}
