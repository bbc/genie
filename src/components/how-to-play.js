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
import * as event from "../core/event-bus.js";
import * as accessibleCarouselElements from "../core/accessibility/accessible-carousel-elements.js";
import { gmi } from "../core/gmi/gmi.js";
import { createTestHarnessDisplay } from "../core/qa/layout-harness.js";

const wrapRange = (value, max) => ((value % max) + max) % max;

export class HowToPlay extends Screen {
    create() {
        this.add.image(0, 0, `${this.scene.key}.background`);
        this.addAnimations();

        this.theme = this.context.config.theme[this.scene.key];
        this.currentIndex = 0;
        this.choiceSprites = this.createChoiceSprites(this.theme.choices);
        this.theme.howToPlay
            ? this.add.image(0, -230, `${this.scene.key}.title`)
            : this.add.image(0, -170, `${this.scene.key}.title`);

        if (this.theme.howToPlay) {
            this.buttonLayout = this.setLayout(["overlayBack", "audio", "settings", "previous", "next"]);
        } else {
            this.buttonLayout = this.setLayout(["home", "audio", "pause", "previous", "next", "continue"]);
        }

        this.setButtonVisibility();

        this.accessibleCarouselElements = accessibleCarouselElements.create(
            this.scene.key,
            this.choiceSprites,
            this.game.canvas.parentElement,
            this.theme.choices,
        );

        this.addEventSubscriptions();
        createTestHarnessDisplay(this);
    }

    setButtonVisibility() {
        this.buttonLayout.buttons.previous.visible = Boolean(!this.theme.howToPlay || this.currentIndex !== 0);

        const isNotLastPage = this.currentIndex + 1 !== this.choiceSprites.length;
        this.buttonLayout.buttons.next.visible = Boolean(!this.theme.howToPlay || isNotLastPage);
    }

    focusOnButton(buttonName) {
        const button = this.buttonLayout.buttons[buttonName];
        button.accessibleElement.focus();
    }

    setButtonFocus() {
        if (this.theme.howToPlay && this.currentIndex === 0) {
            this.focusOnButton("next");
        }
        if (this.theme.howToPlay && this.currentIndex === this.choiceSprites.length - 1) {
            this.focusOnButton("previous");
        }
    }

    createChoiceSprites(choices) {
        const choiceSprites = [];
        choices.forEach((item, index) => {
            const choiceAsset = `${this.scene.key}.${choices[index].asset}`;
            const choiceSprite = this.theme.howToPlay
                ? this.add.sprite(0, 30, choiceAsset)
                : this.add.sprite(0, 0, choiceAsset);

            choiceSprite.visible = index === 0;
            choiceSprites.push(choiceSprite);
        });
        return choiceSprites;
    }

    handleLeftButton() {
        this.currentIndex = wrapRange(--this.currentIndex, this.choiceSprites.length);
        this.showChoice();
        this.setButtonVisibility();
        this.setButtonFocus();
    }

    handleRightButton() {
        this.currentIndex = wrapRange(++this.currentIndex, this.choiceSprites.length);
        this.showChoice();
        this.setButtonVisibility();
        this.setButtonFocus();
    }

    showChoice() {
        this.choiceSprites.forEach((item, index) => {
            item.visible = index === this.currentIndex;
        });
        this.accessibleCarouselElements.forEach((element, index) => {
            element.setAttribute("aria-hidden", index !== this.currentIndex);
            element.style.display = index !== this.currentIndex ? "none" : "block"; //Needed for Firefox
        });
    }

    startGame() {
        const theme = this.context.config.theme[this.scene.key];
        const metaData = { metadata: `ELE=[${theme.choices[this.currentIndex].title}]` };
        const screenType = this.scene.key.split("-")[0];
        gmi.sendStatsEvent(screenType, "select", metaData);

        const choice = this.context.config.theme[this.scene.key].choices[this.currentIndex];
        this.transientData[this.scene.key] = { choice, index: this.currentIndex };
        this.navigation.next();
    }

    addEventSubscriptions() {
        event.bus.subscribe({
            channel: buttonsChannel(this),
            name: "previous",
            callback: this.handleLeftButton.bind(this),
        });

        event.bus.subscribe({
            channel: buttonsChannel(this),
            name: "next",
            callback: this.handleRightButton.bind(this),
        });

        event.bus.subscribe({
            channel: buttonsChannel(this),
            name: "continue",
            callback: this.startGame.bind(this),
        });

        event.bus.subscribe({
            channel: buttonsChannel(this),
            name: "pause",
            callback: () => {
                // stops screenreader from announcing the options when the pause overlay is covering them
                this.accessibleCarouselElements.forEach(element => {
                    element.setAttribute("aria-hidden", true);
                });
            },
        });

        event.bus.subscribe({
            channel: buttonsChannel(this),
            name: "play",
            callback: () => {
                // makes the screenreader announce the selected option
                this.accessibleCarouselElements[this.currentIndex].setAttribute("aria-hidden", false);
            },
        });
    }
}
