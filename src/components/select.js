/**
 * Select gives a choice of different items, which can be configured in main.js.
 *
 * @module components/select
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import { buttonsChannel } from "../core/layout/gel-defaults.js";
import { Screen } from "../core/screen.js";
import * as signal from "../core/signal-bus.js";
import { createTestHarnessDisplay } from "./test-harness/layout-harness.js";
import * as accessibleCarouselElements from "../core/accessibility/accessible-carousel-elements.js";
import { gmi } from "../core/gmi/gmi.js";

const wrapRange = (value, max) => ((value % max) + max) % max;

export class Select extends Screen {
    constructor() {
        super();
    }

    create() {
        this.scene.addToBackground(this.game.add.image(0, 0, this.getAsset("background")));
        createTestHarnessDisplay(this.game, this.context, this.scene);

        const theme = this.context.config.theme[this.game.state.current];
        this.currentIndex = 0;
        this.choiceSprites = this.createChoiceSprites(theme.choices);
        this.scene.addToBackground(this.game.add.image(0, -170, this.getAsset("title")));

        this.scene.addLayout(["home", "audio", "pauseNoReplay", "previous", "next", "continue"]);

        this.accessibleElements = accessibleCarouselElements.create(
            this.visibleLayer,
            this.choiceSprites,
            this.game.canvas.parentElement,
            theme.choices,
        );

        this.addSignalSubscriptions();
    }

    createChoiceSprites(choices) {
        const choiceSprites = [];
        choices.forEach((item, index) => {
            const choiceAsset = this.getAsset(choices[index].asset);
            const choiceSprite = this.game.add.sprite(0, 0, choiceAsset);

            choiceSprite.visible = index === 0;
            this.scene.addToBackground(choiceSprite);
            choiceSprites.push(choiceSprite);
        });
        return choiceSprites;
    }

    leftButton() {
        this.currentIndex = wrapRange(--this.currentIndex, this.choiceSprites.length);
        this.showChoice();
    }

    rightButton() {
        this.currentIndex = wrapRange(++this.currentIndex, this.choiceSprites.length);
        this.showChoice();
    }

    showChoice() {
        this.choiceSprites.forEach((item, index) => {
            item.visible = index === this.currentIndex;
        });
        this.accessibleElements.forEach((element, index) => {
            element.setAttribute("aria-hidden", index !== this.currentIndex);
            element.style.display = index !== this.currentIndex ? "none" : "block"; //Needed for Firefox
        });
    }

    startGame() {
        const theme = this.context.config.theme[this.game.state.current];
        const metaData = { metadata: `ELE=[${theme.choices[this.currentIndex].asset}]` };
        const screenType = this.game.state.current.split("-")[0];
        gmi.sendStatsEvent(screenType, "select", metaData);

        const choice = this.context.config.theme[this.key].choices[this.currentIndex];
        this.transientData[this.key] = { index: this.currentIndex, choice };
        this.navigation.next();
    }

    addSignalSubscriptions() {
        signal.bus.subscribe({
            channel: buttonsChannel,
            name: "previous",
            callback: this.leftButton.bind(this),
        });

        signal.bus.subscribe({
            channel: buttonsChannel,
            name: "next",
            callback: this.rightButton.bind(this),
        });

        signal.bus.subscribe({
            channel: buttonsChannel,
            name: "continue",
            callback: this.startGame.bind(this),
        });

        signal.bus.subscribe({
            channel: buttonsChannel,
            name: "pause",
            callback: () => {
                //stops screenreader from announcing the options when the pause overlay is covering them
                this.accessibleElements.forEach(element => {
                    element.setAttribute("aria-hidden", true);
                });
            },
        });

        signal.bus.subscribe({
            channel: buttonsChannel,
            name: "play",
            callback: () => {
                // makes the screenreader announce the selected option
                this.accessibleElements[this.currentIndex].setAttribute("aria-hidden", false);
            },
        });
    }
}
