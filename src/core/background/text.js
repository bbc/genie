/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const defaultStyle = {
	fontFamily: '"ReithSans"',
	fontSize: 24,
};

const defaults = {
	x: 0,
	y: 0,
};

export const addText = scene => textConfig => {
	const config = { ...defaults, ...textConfig };
	config.style = { ...defaultStyle, ...textConfig.style };
	return scene.add.text(config.x, config.y, config.text, config.style);
};

export const isText = config => Boolean(config.text);
