/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
module.exports = function (api) {
	api.cache(true);

	const presets = [
		[
			"@babel/preset-env",
			{
				useBuiltIns: "entry",
				corejs: { version: 3, proposals: true },
				debug: false,
				targets: {
					ie: "11",
					safari: "9",
				},
				loose: true,
			},
		],
	];

	// Fixes absolute paths so npm modules can be used in dev and webpack e.g: import x from "/node_modules/x/x.js"
	const plugins = [
		["@babel/plugin-proposal-private-methods"],
		["@babel/plugin-proposal-class-properties"],
		[
			"module-resolver",
			{
				root: ["./"],
				alias: {
					"/node_modules": ([, path]) => `./node_modules${path}`,
				},
			},
		],
		["@babel/plugin-proposal-private-property-in-object", { loose: false }],
	];

	return {
		presets,
		plugins,
	};
};
