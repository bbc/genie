/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { Screen } from "../screen.js";
import { eventBus } from "../event-bus.js";

const createButtons = (ids, scene) =>
    ids.map((id, idx) => {
        const button = scene.add.gelButton(500 + 400 * idx, 400, {
            gameButton: true,
            channel: scene.config.eventChannel,
            group: scene.scene.key,
            id,
            key: "button",
            scene: "gelDebug",
            callback: () => scene.navigation[id.toLowerCase()](),
        });
        button.overlays.set("label", scene.add.text(0, 0, id).setOrigin(0.5));

        const buttonSub = eventBus.subscribe({
            channel: scene.config.eventChannel,
            name: id,
            callback: button.config.callback,
        });
        scene.events.once("shutdown", buttonSub.unsubscribe);
    });

class ShopDemo extends Screen {
    create() {
        this.addBackgroundItems();
        this.setLayout(["back"]);

        this.buttons = createButtons(["Game", "Shop"], this);
    }
}

class ShopDemoGame extends Screen {
    create() {
        this.addBackgroundItems();
        this.setLayout(["back"]);
    }
}

export { ShopDemo, ShopDemoGame };
