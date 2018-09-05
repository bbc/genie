/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import { assert } from "chai";
import * as sinon from "sinon";

import * as accessibleDomElement from "../../../src/core/accessibility/accessible-dom-element.js";
import * as accessibleCarouselElements from "../../../src/core/accessibility/accessible-carousel-elements.js";

describe("Accessible Carousel Elements", () => {
    let domElementStubs;
    let mountPoint;
    let mockSprite;
    let mockSprites;
    let firstMockSprite;
    let sandbox;

    before(() => {
        sandbox = sinon.createSandbox();
    });

    beforeEach(() => {
        mountPoint = document.createElement("div");
        document.body.appendChild(mountPoint);

        domElementStubs = [
            { el: document.createElement("div") },
            { el: document.createElement("div") },
            { el: document.createElement("div") },
        ];

        const accessibleDomElementStub = sandbox.stub(accessibleDomElement, "accessibleDomElement");
        accessibleDomElementStub.onCall(0).returns(domElementStubs[0]);
        accessibleDomElementStub.onCall(1).returns(domElementStubs[1]);
        accessibleDomElementStub.onCall(2).returns(domElementStubs[2]);

        firstMockSprite = { events: { onDestroy: { add: sandbox.spy() } } };
        mockSprite = { events: { onDestroy: { add: () => {} } } };
        mockSprites = [firstMockSprite, mockSprite, mockSprite];
    });

    afterEach(() => {
        sandbox.restore();
        mountPoint.remove();
    });

    it("creates a carousel DOM element", () => {
        accessibleCarouselElements.create("select-screen", mockSprites, mountPoint);

        const carouselDomElement = mountPoint.firstChild;

        assert.equal(carouselDomElement.getAttribute("id"), "carousel-select-screen");
        assert.equal(carouselDomElement.getAttribute("aria-live"), "polite");
    });

    it("prepends the carousel DOM element to the mount point to give the correct on-screen tabbing start position for iPhoneX", () => {
        mountPoint.appendChild(document.createElement("canvas"));
        accessibleCarouselElements.create("select-screen", mockSprites, mountPoint);

        const carouselDomElement = mountPoint.firstChild;
        const canvasElement = mountPoint.childNodes[1];

        assert.equal(carouselDomElement.getAttribute("id"), "carousel-select-screen");
        assert.equal(carouselDomElement.getAttribute("aria-live"), "polite");

        assert.equal(canvasElement.nodeName, "CANVAS");
    });

    it("creates an accessible DOM element for each carousel item", () => {
        accessibleCarouselElements.create("select-screen", mockSprites, mountPoint);

        assert.equal(accessibleDomElement.accessibleDomElement.callCount, 3);

        mockSprites.forEach((mockSprite, index) => {
            const actualCall = accessibleDomElement.accessibleDomElement.getCall(index).args[0];
            const count = index + 1;
            const expectedHidden = index !== 0;

            assert.equal(actualCall.id, "carousel-select-screen__" + count);
            assert.equal(actualCall.ariaHidden, expectedHidden);
            assert.isTrue(actualCall.parent instanceof HTMLElement);
            assert.equal(actualCall.text, "Page " + count);
            assert.equal(actualCall.notClickable, true);
        });
    });

    it("creates accessible DOM elements with custom text, if set in the theme choices", () => {
        const mockChoices = [
            { accessibilityText: "Custom Text 1" },
            { accessibilityText: "Custom Text 2" },
            { accessibilityText: "Custom Text 3" },
        ];

        accessibleCarouselElements.create("select-screen", mockSprites, mountPoint, mockChoices);

        mockSprites.forEach((mockSprite, index) => {
            const count = index + 1;
            const actualCall = accessibleDomElement.accessibleDomElement.getCall(index).args[0];
            assert.equal(actualCall.text, "Custom Text " + count);
        });
    });

    it("Hides all but the first element to support Firefox with NVDA screen reader", () => {
        accessibleCarouselElements.create("select-screen", mockSprites, mountPoint);

        mockSprites.forEach((mockSprite, index) => {
            assert.equal(domElementStubs[index].el.style.display, index ? "none" : "block");
        });
    });

    it("removes the carousel when the first carousel item sprite is destroyed", () => {
        accessibleCarouselElements.create("select-screen", mockSprites, mountPoint);

        const destroyCallback = firstMockSprite.events.onDestroy.add.getCall(0).args[0];
        destroyCallback();

        assert.equal(mountPoint.firstChild, null);
    });
});
