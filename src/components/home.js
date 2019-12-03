/**
 * Home is the main title screen for the game.
 *
 * @module components/home
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { buttonsChannel } from "../core/layout/gel-defaults.js";
import { Screen } from "../core/screen.js";
import * as event from "../core/event-bus.js";
import { createTestHarnessDisplay } from "../core/qa/layout-harness.js";
import { gmi } from "../core/gmi/gmi.js";

export class Home extends Screen {
    preload() {
        //this.load.setBaseURL(gmi.gameDir);
        //this.load.setPath(gmi.embedVars.configPath);
        //this.load.spine('spine_owl', 'shared/owl/export/owl-pro.json', [ 'shared/owl/export/owl-pma.atlas' ], true);
    }
    create() {
        const achievements = this.context.config.theme.game.achievements ? ["achievements"] : [];
        this.add.image(0, 0, `${this.scene.key}.background`);
        this.add.image(0, -150, `${this.scene.key}.title`);

        this.addAnimations()

        const buttons = ["exit", "howToPlay", "play", "audio", "settings"];
        this.setLayout(buttons.concat(achievements));

        //TODO how do we set the layering?

        /*

            "spine": {
        "prefix": "spine.",
        "files": [
            {
                "type": "spine",
                "key": "owl",
                "jsonURL": "shared/owl/export/owl-pro.json",
                "atlasURL": "shared/owl/export/owl-pma.atlas",
                "textureURL": "shared/owl/export/owl-pma.png"
            }
        ]
    }


         */

        createTestHarnessDisplay(this);

        event.bus.subscribe({
            channel: buttonsChannel(this),
            name: "play",
            callback: this.navigation.next,
        });
    }
}
