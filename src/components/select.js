/**
 * Select gives a choice of different items, which can be configured in main.js.
 *
 * @module components/select
 */

import { Screen } from "../core/screen.js";
import * as signal from "../core/signal-bus.js";
import { createTestHarnessDisplay } from "./test-harness/layout-harness.js";

export class Select extends Screen {
    constructor() {
        super();
    }


    create() {
        this.layoutFactory.addToBackground(this.game.add.image(0, 0, this.getAsset("background")));
        this.layoutFactory.addToBackground(this.game.add.image(0, -150, this.getAsset("title")));
        this.layoutFactory.addLayout(["home", "audioOff", "pause", "previous", "next", "continue"]);
        createTestHarnessDisplay(this.game, this.context, this.layoutFactory);

        const theme = this.context.config.theme[this.game.state.current];
        const CHAR_Y_POSITION = 0;

        this.choice = [];
        this.currentIndex = 1;
        this.numberOfChoices = Object.keys(theme.choices).length;

        theme.choices.forEach((item, index) => {
            const main = this.game.add.sprite(0, CHAR_Y_POSITION, this.getAsset(theme.choices[index].main));
            if (index !== 0) {
                main.visible = false;
            }
            this.layoutFactory.addToBackground(main);
            this.choice = this.choice.concat({ main: main });
        });

        signal.bus.subscribe({
            channel: "gel-buttons",
            name: "exit",
            callback: () => {
                this.next({ transient: { home: true } });
            },
        });

        signal.bus.subscribe({
            channel: "gel-buttons",
            name: "previous",
            callback: this.leftButton.bind(this),
        });

        signal.bus.subscribe({
            channel: "gel-buttons",
            name: "next",
            callback: this.rightButton.bind(this),
        });

        signal.bus.subscribe({
            channel: "gel-buttons",
            name: "continue",
            callback: this.startGame.bind(this),
        });
    }

    leftButton() {
        this.currentIndex--;
        if (this.currentIndex < 1) {
            this.currentIndex = this.numberOfChoices;
        }
        this.showChoice();
    }

    rightButton() {
        this.currentIndex++;
        if (this.currentIndex > this.numberOfChoices) {
            this.currentIndex = 1;
        }
        this.showChoice();
    }

    showChoice() {
        this.choice.forEach(item => {
            item.main.visible = false;
        });
        this.choice[this.currentIndex - 1].main.visible = true;
    }

    startGame() {
        this.next({ transient: { [this.game.state.current]: this.currentIndex } });
    }
}
