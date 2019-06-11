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

export class Select extends Screen {
    constructor() {
        super();
    }

    create() {
        this.scene.addToBackground(this.game.add.image(0, 0, this.getAsset("background")));
        this.scene.addToBackground(this.game.add.image(0, -150, this.getAsset("title")));
        createTestHarnessDisplay(this.game, this.context, this.scene);

        const theme = this.context.config.theme[this.game.state.current];
        this.currentIndex = 1;
        this.choiceSprites = this.createChoiceSprites(theme.choices);

        // TODO the following line should be added back once the overlap issue is resolved NT:04:02:19
        const showAchievements = false; //!!this.context.config.theme.game.achievements;
        const defaultButtons = ["home", "audio", "pauseNoReplay", "previous", "next", "continue"];
        const buttons = showAchievements ? defaultButtons.concat("achievements") : defaultButtons;

        this.scene.addLayout(buttons);
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
        this.currentIndex--;
        if (this.currentIndex < 1) {
            this.currentIndex = this.choiceSprites.length;
        }
        this.showChoice();
    }

    rightButton() {
        this.currentIndex++;
        if (this.currentIndex > this.choiceSprites.length) {
            this.currentIndex = 1;
        }
        this.showChoice();
    }

    showChoice() {
        this.choiceSprites.forEach((item, index) => {
            item.visible = index === this.currentIndex - 1;
        });
        this.accessibleElements.forEach((element, index) => {
            element.setAttribute("aria-hidden", index !== this.currentIndex - 1);
            element.style.display = index !== this.currentIndex - 1 ? "none" : "block"; //Needed for Firefox
        });
    }

    startGame() {
        const theme = this.context.config.theme[this.game.state.current];
        const metaData = { metadata: `ELE=[${theme.choices[this.currentIndex].asset}]` };
        const screenType = this.game.state.current.split("-")[0];
        gmi.sendStatsEvent(screenType, "select", metaData);
        this.navigation.next({ characterSelected: this.currentIndex });
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
                this.accessibleElements[this.currentIndex - 1].setAttribute("aria-hidden", false);
            },
        });
    }
}
