/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const imageDefaults = {
	x: 0,
	y: 0,
};

export const isImage = scene => config => scene.textures.exists(config.key) && !config.frames;

export const addImage = scene => imageConfig => {
	const config = Object.assign({}, imageDefaults, imageConfig);
	const image = scene.add.image(config.x, config.y, config.key);

	config.props && Object.assign(image, config.props);

	return image;
};
