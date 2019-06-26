/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
module.exports = function(api) {
    api.cache(true);

    const presets = [
        [
            "@babel/preset-env",
            {
                debug: false,
                targets: {
                    ie: "11",
                    safari: "9",
                },
            },
        ],
    ];

    const plugins = [];

    return {
        presets,
        plugins,
    };
};
