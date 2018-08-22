// Ensure touches occur rapidly
const delay = 500;
// Sequential touches must be in close vicinity
const minZoomTouchDelta = 10;

// Track state of the last touch
let lastTapAt = 0;
let lastClientX = 0;
let lastClientY = 0;

export const preventDoubleTapZoom = event => {
    // Exit early if this involves more than one finger (e.g. pinch to zoom)
    if (event.touches.length > 1) {
        return;
    }

    const tapAt = new Date().getTime();
    const timeDiff = tapAt - lastTapAt;
    const { clientX, clientY } = event.touches[0];
    const xDiff = Math.abs(lastClientX - clientX);
    const yDiff = Math.abs(lastClientY - clientY);
    if (xDiff < minZoomTouchDelta && yDiff < minZoomTouchDelta && event.touches.length === 1 && timeDiff < delay) {
        event.preventDefault();
        // Trigger a fake click for the tap we just prevented
        event.target.click();
    }
    lastClientX = clientX;
    lastClientY = clientY;
    lastTapAt = tapAt;
};
