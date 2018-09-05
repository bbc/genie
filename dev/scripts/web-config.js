/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
module.exports = {
    compress: true,
    staticIndex: "dev/index.dev.html",
    mime: {
        "application/wasm": ["wasm"],
    },
    rewrite: [{ from: "/node_modules/genie/*", to: "/$1" }],
};
