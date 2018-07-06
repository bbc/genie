import { accessibleDomElement } from "./accessible-dom-element.js";

function createCarouselElement(parentElement, pageName) {
    const carouselElement = document.createElement("div");
    carouselElement.id = "carousel-" + pageName;
    carouselElement.setAttribute("aria-live", "polite");
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

        accessibleElement.style.display = "none";
        accessibleElements.push(accessibleElement);

        if (index === 0) {
            sprite.events.onDestroy.add(() => {
                parentElement.removeChild(carousel);
            });
        }
    });

    return accessibleElements;
}
