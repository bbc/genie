const BORDER_PAD = 0.02;
const BREAK_WIDTH = 770;
const SAFE_ASPECT_RATIO = 4 / 3;

export const calculateMetrics = (
    width,
    height,
    scale,
    stageHeight,
) => {
    const isMobile = width < BREAK_WIDTH;
    const safeWidth = height * SAFE_ASPECT_RATIO;

    const metrics = {
        width,
        height: stageHeight,
        scale,
        borderPad: Math.floor(Math.max(width, stageHeight) * BORDER_PAD),
        isMobile,
        buttonPad: isMobile ? 22 : 24,
        buttonMin: isMobile ? 42 : 64,
        hitMin: isMobile ? 64 : 70,
        horizontals: {
            left: width / scale * -0.5,
            center: 0,
            right: width / scale * 0.5,
        },
        safeHorizontals: {
            left: safeWidth * -0.5,
            center: 0,
            right: safeWidth * 0.5,
        },
        verticals: {
            top: stageHeight * -0.5,
            middle: 0,
            bottom: stageHeight * 0.5,
        },
    };

    return metrics;
};
