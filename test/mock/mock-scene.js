/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const context = {
	measureText: () => 100,
	save: () => {},
	scale: () => {},
	translate: () => {},
	fillText: () => {},
	restore: () => {},
};

export const mockBaseScene = () => ({
	sys: {
		anims: { once: () => {} },
		cache: { bitmapFont: { get: () => ({ data: {} }) } },
		game: { config: { resolution: {} }, events: { on: () => {} }, renderer: {} },
		queueDepthSort: () => {},
		textures: {
			get: () => ({ get: () => ({ cutWidth: 0, cutHeight: 0 }) }),
			addCanvas: () => ({
				get: () => ({ source: {}, resolution: {}, setSize: () => {} }),
				context,
			}),
		},
	},
});
