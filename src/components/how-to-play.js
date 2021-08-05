/**
 * Select gives a choice of different items, which can be configured in main.js.
 *
 * @module components/select
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

import fp from "../../lib/lodash/fp/fp.js";
import { buttonsChannel } from "../core/layout/gel-defaults.js";
import { Screen } from "../core/screen.js";
import { eventBus } from "../core/event-bus.js";
import * as accessibleCarouselElements from "../core/accessibility/accessible-carousel-elements.js";
import { gmi } from "../core/gmi/gmi.js";

const wrapRange = (value, max) => ((value % max) + max) % max;

export class HowToPlay extends Screen {
	create() {
		this.addBackgroundItems();
		this.currentIndex = 0;
		this.choiceSprites = this.createChoiceSprites(this.config.choices);
		this.setLayout(["overlayBack", "audio", "settings", "previous", "next"]);
		this.setButtonVisibility();

		this.accessibleCarouselElements = accessibleCarouselElements.create(
			this.scene.key,
			this.choiceSprites,
			this.game.canvas.parentElement,
			this.config.choices,
		);

		this.addEventSubscriptions();
	}

	setButtonVisibility() {
		this.layout.buttons.previous.visible = Boolean(this.currentIndex !== 0);

		const isNotLastPage = this.currentIndex + 1 !== this.choiceSprites.length;
		this.layout.buttons.next.visible = Boolean(isNotLastPage);

		this.layout.buttons.previous.accessibleElement.update();
		this.layout.buttons.next.accessibleElement.update();
	}

	focusOnButton(buttonName) {
		const button = this.layout.buttons[buttonName];
		button.accessibleElement.el.focus();
	}

	setButtonFocus() {
		if (this.currentIndex === 0) {
			this.focusOnButton("next");
		}
		if (this.currentIndex === this.choiceSprites.length - 1) {
			this.focusOnButton("previous");
		}
	}

	createChoiceSprites(choices) {
		const choiceSprites = [];
		choices.forEach((item, index) => {
			const choiceAsset = `${this.scene.key}.${choices[index].asset}`;
			const choiceSprite = this.add.sprite(0, 30, choiceAsset);

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
		const metaData = { metadata: `ELE=[${this.config.choices[this.currentIndex].title}]` };
		const screenType = this.scene.key.split("-")[0];
		gmi.sendStatsEvent(screenType, "select", metaData);

		const choice = this.config.choices[this.currentIndex];
		this.transientData[this.scene.key] = { choice, index: this.currentIndex };
		this.navigation.next();
	}

	addEventSubscriptions() {
		const fpMap = fp.map.convert({ cap: false });
		fpMap((callback, name) => eventBus.subscribe({ name, callback, channel: buttonsChannel(this) }), {
			previous: this.handleLeftButton.bind(this),
			next: this.handleRightButton.bind(this),
			continue: this.startGame.bind(this),
			pause: () => {
				// stops screenreader from announcing the options when the pause overlay is covering them
				this.accessibleCarouselElements.forEach(element => {
					element.setAttribute("aria-hidden", true);
				});
			},
			play: () => {
				// makes the screenreader announce the selected option
				this.accessibleCarouselElements[this.currentIndex].setAttribute("aria-hidden", false);
			},
		});
	}
}
