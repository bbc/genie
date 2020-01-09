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
import { eventBus } from "../core/event-bus.js";
import { createTestHarnessDisplay } from "../core/qa/layout-harness.js";

export class Home extends Screen {
    create() {
        const achievements = this.context.config.theme.game.achievements ? ["achievements"] : [];
        this.add.image(0, 0, `${this.scene.key}.background`);
        this.addAnimations();
        this.add.image(0, -150, `${this.scene.key}.title`);

        const buttons = ["exit", "howToPlay", "play", "audio", "settings"];
        this.setLayout(buttons);

        createTestHarnessDisplay(this);

        eventBus.subscribe({
            channel: buttonsChannel(this),
            name: "play",
            callback: this.navigation.next,
        });
        this.graphics = this.add.graphics();
    }

    update() {
        //debug draw groups.
        this.graphics.clear();

        this.debugDrawGroups()
        //this.debugDrawButtons()
    }

    debugDrawGroups() {
        //Gel Groups
        this.graphics.lineStyle(1,0x33ff33, 1);

        Object.keys(this.layout.groups).map(key => {
            const group = this.layout.groups[key]   //.getBounds();
            this.graphics.strokeRectShape(new Phaser.Geom.Rectangle(group.x, group.y, group.width, group.height));
        })

    }

    debugDrawButtons() {
        //Gel Groups
        this.graphics.lineStyle(1,0x3333ff, 1);

        Object.keys(this.layout.buttons).map(key => {
            const button = this.layout.buttons[key];
            this.graphics.strokeRectShape(new Phaser.Geom.Rectangle(button.x, button.y, button.width, button.height));
        })

    }
}
