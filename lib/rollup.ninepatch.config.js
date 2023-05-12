import terser from "@rollup/plugin-terser";

export default {
	input: "node_modules/phaser3-rex-plugins/plugins/ninepatch-plugin.js",
	output: [
		{
			file: "lib/rexninepatchplugin.min.js",
			format: "esm",
			plugins: [terser()],
		},
	],
};
