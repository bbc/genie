import fp from "../../../lib/lodash/fp/fp.js";

const BORDER_PAD_RATIO = 0.02;
const MOBILE_BREAK_WIDTH = 770;
export const GEL_MIN_ASPECT_RATIO = 4 / 3;
export const GEL_MAX_ASPECT_RATIO = 7 / 3;

const getScale = fp.curry((scaleMethods, { width, height }) => {
    return scaleMethods[width / height >= GEL_MIN_ASPECT_RATIO ? "wide" : "narrow"](width, height);
});

const scaleMethods = stageHeight => ({
    wide: (width, height) => height / stageHeight,
    narrow: width => width / stageHeight / GEL_MIN_ASPECT_RATIO,
});

export const calculateMetrics = fp.curry((stageHeight, { width, height }) => {
    const scale = getScale(scaleMethods(stageHeight), { width, height });
    const aspectRatio = fp.clamp(GEL_MIN_ASPECT_RATIO, GEL_MAX_ASPECT_RATIO, width / height);
    const stageWidth = aspectRatio * stageHeight;
    const isMobile = width < MOBILE_BREAK_WIDTH;
    const safeWidth = height * GEL_MIN_ASPECT_RATIO;

    const metrics = {
        width,
        height,
        scale,
        stageWidth,
        stageHeight,
        borderPad: fp.floor(fp.max([stageWidth, stageHeight]) * BORDER_PAD_RATIO),
        isMobile,
        buttonPad: isMobile ? 22 : 24,
        buttonMin: isMobile ? 42 : 64,
        hitMin: isMobile ? 64 : 70,
        horizontals: {
            left: -stageWidth / 2,
            center: 0,
            right: stageWidth / 2,
        },
        safeHorizontals: {
            left: -safeWidth / 2,
            center: 0,
            right: safeWidth / 2,
        },
        verticals: {
            top: -stageHeight / 2,
            middle: 0,
            bottom: stageHeight / 2,
        },
    };

    return metrics;
});
