/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const genieCore = Boolean(process.env.genieCore);
const geniePath = genieCore ? "" : "node_modules/genie/";
const rewrite = [];

genieCore && rewrite.push({ from: "/node_modules/genie/(.*)", to: "/$1" });

module.exports = {
	compress: true,
	staticIndex: `${geniePath}dev/index.dev.html`,
	port: "9000",
	mime: {
		"application/wasm": ["wasm"],
	},
	rewrite,
};
