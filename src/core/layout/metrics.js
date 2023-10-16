/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
import fp from "../../../lib/lodash/fp/fp.js";

const isWideAspect = (stageHeight, width, height) => width / height >= GEL_MIN_ASPECT_RATIO;
const isMinAspect = (stageHeight, width, height) => width / height < GEL_MIN_ASPECT_RATIO;
const scaleWideAspect = (stageHeight, width, height) => height / stageHeight;
const scaleMinAspect = (stageHeight, width) => width / (stageHeight * GEL_MIN_ASPECT_RATIO);

const getScale = fp.cond([
	[isWideAspect, scaleWideAspect],
	[isMinAspect, scaleMinAspect],
]);

const MOBILE_BREAK_WIDTH = 770;
export const BORDER_PAD_RATIO = 0.02;
export const GEL_MIN_ASPECT_RATIO = 4 / 3;
export let GEL_MAX_ASPECT_RATIO = 7 / 3;
export let CANVAS_WIDTH = 1400;
export let CANVAS_HEIGHT = 600;
export let CAMERA_X = CANVAS_WIDTH / 2;
export let CAMERA_Y = CANVAS_HEIGHT / 2;

export const calculateMetrics = ({ width, height }) => {
	const scale = getScale(CANVAS_HEIGHT, width, height);
	const aspectRatio = fp.clamp(GEL_MIN_ASPECT_RATIO, GEL_MAX_ASPECT_RATIO, width / height);
	const stageWidth = aspectRatio * CANVAS_HEIGHT;
	const isMobile = width < MOBILE_BREAK_WIDTH;
	const isIphone5 = width === 568 && height === 320;
	const safeWidth = CANVAS_HEIGHT * GEL_MIN_ASPECT_RATIO;
	const screenToCanvas = x => x / scale;
	const borderPad = fp.floor(fp.max([stageWidth, CANVAS_HEIGHT]) * BORDER_PAD_RATIO);

	return {
		width,
		height,
		scale,
		screenToCanvas,
		stageWidth,
		stageHeight: CANVAS_HEIGHT,
		verticalBorderPad: borderPad,
		bottomBorderPad: isIphone5 ? 58 : borderPad,
		horizontalBorderPad: borderPad,
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
			top: -CANVAS_HEIGHT / 2,
			middle: 0,
			bottom: CANVAS_HEIGHT / 2,
		},
	};
};

// Test function for future high resolution support and should not be used directly
export const setResolution = (multiplier, aspect = 7 / 3) => {
	GEL_MAX_ASPECT_RATIO = aspect;
	CANVAS_HEIGHT = 600 * multiplier; //1.8 for 1080
	CANVAS_WIDTH = CANVAS_HEIGHT * GEL_MAX_ASPECT_RATIO; //2520 for 1.8
	CAMERA_X = CANVAS_WIDTH / 2;
	CAMERA_Y = CANVAS_HEIGHT / 2;
};
