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

    parentElement.appendChild(carouselElement);
    return carouselElement;
}

function getAccessibilityText(choices, index) {
    return choices ? choices[index].accessibilityText : "Page " + (index + 1);
}

export function create(pageName, carouselSprites, parentElement, choices) {
    const accessibleElements = [];
    const carousel = createCarouselElement(parentElement, pageName);

    carouselSprites.forEach((sprite, index) => {
        const accessibleElement = accessibleDomElement({
            id: "carousel-" + pageName + "__" + (index + 1),
            ariaHidden: index !== 0,
            parent: carousel,
            text: getAccessibilityText(choices, index),
            notClickable: true,
        }).el;

        accessibleElement.style.display = index ? "none" : "block";
        accessibleElement.setAttribute("tabIndex", -1);

        accessibleElements.push(accessibleElement);

        if (index === 0) {
            sprite.events.onDestroy.add(() => {
                parentElement.removeChild(carousel);
            });
        }
    });

    return accessibleElements;
}
