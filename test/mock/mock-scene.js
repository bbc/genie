/**
 * @copyright BBC 2020
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
export const mockBaseScene = () => ({
    sys: {
        game: { config: { resolution: {} }, events: { on: () => {} }, renderer: {} },
        queueDepthSort: () => {},
        textures: {
            addCanvas: () => ({
                get: () => ({ source: {}, resolution: {}, setSize: () => {} }),
            }),
        },
    },
});
