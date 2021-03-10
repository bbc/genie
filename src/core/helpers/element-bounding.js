/**
 * restricts positioning of an elements on a screen.
 *
 * @module components/helpers/element-bounding
 * @copyright BBC 2019
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

const scaleElement = (element, bounds) => {
    const safeHeight = bounds.bottom - bounds.top;
    const safeWidth = bounds.right - bounds.left;

    if (element.height > safeHeight && safeHeight > 0) {
        const hDiff = (element.height - safeHeight) / element.height;
        element.setScale(1 - hDiff);
    }
    // Check safeWidth is positive, can scale negatively when the screen is too small
    if (element.width > safeWidth && safeWidth > 0) {
        const wDiff = (element.width - safeWidth) / element.width;
        element.setScale(1 - wDiff);
    }
};

const restrictBounds = (element, safeArea, metrics) => {
    if (element.type === "Text") enforceTextSize(element, metrics);

    scaleElement(element, safeArea);

    const hitArea = element.getBounds();

    const elementBounds = {
        top: hitArea.y,
        bottom: hitArea.y + hitArea.height,
        left: hitArea.x,
        right: hitArea.x + hitArea.width,
    };

    if (elementBounds.top < safeArea.top) {
        element.setPosition(element.x, element.y - (elementBounds.top - safeArea.top));
    }
    if (elementBounds.bottom > safeArea.bottom) {
        element.setPosition(element.x, element.y - (elementBounds.bottom - safeArea.bottom));
    }
    if (elementBounds.left < safeArea.left) {
        element.setPosition(element.x - (elementBounds.left - safeArea.left), element.y);
    }
    if (elementBounds.right > safeArea.right) {
        element.setPosition(element.x - (elementBounds.right - safeArea.right), element.y);
    }
};

export const positionElement = (element, position, safeArea, metrics) => {
    element.setPosition(position.x, position.y);
    element.setOrigin(0.5);
    restrictBounds(element, safeArea, metrics);
};

export const enforceTextSize = (element, { scale }) => {
    const fontSize = parseInt(element.defaultStyle.fontSize);
    const minimumSize = 13;
    const currentSize = fontSize * scale;
    element.setFontSize(`${fontSize}px`);
    if (currentSize < minimumSize) {
        const newScale = minimumSize / currentSize;
        element.setFontSize(`${fontSize * newScale}px`);
    }
};
