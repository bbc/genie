/**
 * @copyright BBC 2021
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const nullToUndefined = val => (val === null ? undefined : val);

const getType = value => Object.prototype.toString.call(value).slice(8, -1).toLowerCase();

const backgrounds = {
	string: (scene, config) => {
		const background = scene.add.image(0, 0, `${scene.assetPrefix}.${config}`);
		const safeArea = scene.layout.getSafeArea({}, false);
		background.setScale(safeArea.width / background.width, safeArea.height / background.height);
		return background;
	},
	null: () => ({}),
	object: (scene, config) => {
		const { width, height, x, y } = scene.layout.getSafeArea({}, false);
		return scene.add.rexNinePatch({
			x: width / 2 + x,
			y: height / 2 + y,
			width,
			height,
			key: `${scene.assetPrefix}.${config.key}`,
			columns: config.columns.map(nullToUndefined),
			rows: config.rows.map(nullToUndefined),
		});
	},
};

const defaultSpec = {
	yOffset: 0,
	aspect: 1,
	xOffset: 0,
};

const resizers = new Map();

export const initResizers = () => {
	resizers.set(Object, () => {});

	resizers.set(Phaser.GameObjects.Image, (scene, background, newSpec = {}) => {
		const spec = { ...defaultSpec, ...newSpec };
		const safeArea = scene.layout.getSafeArea({}, false);
		background.y = spec.yOffset;
		background.setScale(safeArea.width / background.width, safeArea.height / background.height);
	});

	resizers.set(RexPlugins.GameObjects.NinePatch, (scene, background, newSpec = {}) => {
		const spec = { ...defaultSpec, ...newSpec };
		const { width, height, x, y } = scene.layout.getSafeArea({}, false);
		background.x = width / 2 + x + width * spec.xOffset;
		background.y = height / 2 + y - spec.yOffset;
		background.resize(width * spec.aspect, height - 2 * spec.yOffset);
	});
};

export const createBackground = (scene, config) => backgrounds[getType(config)](scene, config);

export const resizeBackground = type => resizers.get(type);
