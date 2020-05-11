/**
 * Narrative screens are used to relay information.
 *
 * @module components/narrative
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { buttonsChannel } from "../core/layout/gel-defaults.js";
import { Screen } from "../core/screen.js";
import { eventBus } from "../core/event-bus.js";
import { accessibilify } from "../core/accessibility/accessibilify.js";



const addContinueButton = scene => {
    const button = scene.add.gelButton(0, 0, {
        scene: "gelDebug",
        key: "button",
        id: "Config",
        channel: buttonsChannel(scene),
        gameButton: true,
        ariaLabel: "Continue",
    });
    const text = scene.add.text(0, 0, "Continue").setOrigin(0.5, 0.5);
    button.overlays.set("text", text);
    accessibilify(button, true);

    //eventBus.subscribe({
    //    channel: buttonsChannel(config.scene),
    //    name: config.id,
    //    callback: config.callback,
    //});
};

const continueNarrative = () => {

    console.log("NEXT PAGE")
}


export class Narrative extends Screen {
    create() {
        this.addBackgroundItems();
        this.setLayout(["continue", "skip", "audio", "settings"]);
        //addContinueButton(this)

        eventBus.subscribe({
            channel: buttonsChannel(this),
            name: "continue",
            callback: continueNarrative,
        });
    }
}
