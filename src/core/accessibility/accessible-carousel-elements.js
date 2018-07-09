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



    const controls = document.createElement("fieldset");

    controls.setAttribute("aria-controls", "carousel");

    const next = document.getElementById("character-select__next");
    const previous = document.getElementById("character-select__previous");


    controls.appendChild(previous);
    controls.appendChild(next);
    parentElement.appendChild(controls);


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
