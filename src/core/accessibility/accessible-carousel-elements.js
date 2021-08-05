/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { accessibleDomElement } from "./accessible-dom-element.js";

//Should be in a stylesheet however we have no support for this (v0.4)
const setCSS = element => {
	element.style.position = "absolute";
	element.style.overflow = "hidden";
	element.style.width = "0";
	element.style.height = "0";
};

function createCarouselElement(parentElement, pageName) {
	const carouselElement = document.createElement("div");
	carouselElement.id = "carousel-" + pageName;
	carouselElement.setAttribute("aria-live", "polite");

	setCSS(carouselElement);

	parentElement.insertBefore(carouselElement, parentElement.firstChild); // Node.prepend() not supported in Edge

	return carouselElement;
}

function getAccessibilityText(choices, index) {
	return choices ? choices[index].accessibilityText : "Page " + (index + 1);
}

export function create(pageName, carouselSprites, parentElement, choices) {
	const accessibleElements = [];
	const carousel = createCarouselElement(parentElement, pageName);

	// NOTE: Hack to force tab accessibility order
	// needs a refactor once we have an accessibility layer
	carouselSprites.forEach((sprite, index) => {
		const accessibleElement = accessibleDomElement({
			id: "carousel-" + pageName + "__" + (index + 1),
			"aria-hidden": index !== 0,
			parent: carousel,
			text: getAccessibilityText(choices, index),
			notClickable: true,
		}).el;
		carousel.appendChild(accessibleElement);

		accessibleElement.style.display = index ? "none" : "block";
		accessibleElement.setAttribute("tabIndex", -1);

		accessibleElements.push(accessibleElement);

		if (index === 0) {
			accessibleElement.focus();
			sprite.once("destroy", () => {
				if (parentElement.contains(carousel)) {
					parentElement.removeChild(carousel);
				}
			});
		}
	});

	return accessibleElements;
}
