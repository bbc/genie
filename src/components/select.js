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
import * as accessibleCarouselElements from "../core/accessibility/accessible-carousel-elements.js";
import { gmi } from "../core/gmi/gmi.js";

const wrapRange = (value, max) => ((value % max) + max) % max;

export class Select extends Screen {
    create() {
        this.add.image(0, 0, `${this.scene.key}.background`);

        this.theme = this.context.config.theme[this.scene.key];
        this.currentIndex = 0;
        this.choiceSprites = this.createChoiceSprites(this.theme.choices);
        this.add.image(0, -170, `${this.scene.key}.title`);

        if (this.theme.howToPlay) {
            this.addLayout(["overlayBack", "audio", "settings", "previous", "next"]);
            this.layouts[0].buttons.previous.alpha = 0;
            this.layouts[0].buttons.previous.disableInteractive();
        } else {
            this.addLayout(["home", "audio", "pauseNoReplay", "previous", "next", "continue"]);
        }

        // TODO P3 Accessibility
        // this.accessibleElements = accessibleCarouselElements.create(
        //     this.visibleLayer,
        //     this.choiceSprites,
        //     this.game.canvas.parentElement,
        //     theme.choices,
        // );

        this.addSignalSubscriptions();
    }

    createChoiceSprites(choices) {
        const choiceSprites = [];
        choices.forEach((item, index) => {
            const choiceAsset = `${this.scene.key}.${choices[index].asset}`;
            const choiceSprite = this.add.sprite(0, 0, choiceAsset);

            choiceSprite.visible = index === 0;
            choiceSprites.push(choiceSprite);
        });
        return choiceSprites;
    }

    leftButton() {
        this.layouts[0].buttons.next.alpha = 1;
        this.layouts[0].buttons.next.setInteractive();
        this.currentIndex = wrapRange(--this.currentIndex, this.choiceSprites.length);
        this.showChoice();
        if (this.currentIndex == 0 && this.theme.howToPlay) {
            this.layouts[0].buttons.previous.alpha = 0;
            this.layouts[0].buttons.previous.disableInteractive();
        }
    }

    rightButton() {
        this.layouts[0].buttons.previous.alpha = 1;
        this.layouts[0].buttons.previous.setInteractive();
        this.currentIndex = wrapRange(++this.currentIndex, this.choiceSprites.length);
        this.showChoice();
        if (this.currentIndex + 1 == this.choiceSprites.length && this.theme.howToPlay) {
            this.layouts[0].buttons.next.alpha = 0;
            this.layouts[0].buttons.next.disableInteractive();
        }
    }

    showChoice() {
        this.choiceSprites.forEach((item, index) => {
            item.visible = index === this.currentIndex;
        });
        // TODO P3 Accessibility
        // this.accessibleElements.forEach((element, index) => {
        //     element.setAttribute("aria-hidden", index !== this.currentIndex);
        //     element.style.display = index !== this.currentIndex ? "none" : "block"; //Needed for Firefox
        // });
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

    addSignalSubscriptions() {
        signal.bus.subscribe({
            channel: `${buttonsChannel}-${this.scene.key}`,
            name: "previous",
            callback: this.leftButton.bind(this),
        });

        signal.bus.subscribe({
            channel: `${buttonsChannel}-${this.scene.key}`,
            name: "next",
            callback: this.rightButton.bind(this),
        });

        signal.bus.subscribe({
            channel: `${buttonsChannel}-${this.scene.key}`,
            name: "continue",
            callback: this.startGame.bind(this),
        });

        signal.bus.subscribe({
            channel: `${buttonsChannel}-${this.scene.key}`,
            name: "pause",
            callback: () => {
                //stops screenreader from announcing the options when the pause overlay is covering them
                // this.accessibleElements.forEach(element => {
                //     element.setAttribute("aria-hidden", true);
                // });
            },
        });

        signal.bus.subscribe({
            channel: `${buttonsChannel}-${this.scene.key}`,
            name: "play",
            callback: () => {
                // makes the screenreader announce the selected option
                // this.accessibleElements[this.currentIndex].setAttribute("aria-hidden", false);
            },
        });
    }
}
