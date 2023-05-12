import terser from "@rollup/plugin-terser";

export default {
	input: "lib/lodash/fp/fp_source.js",
	output: [
		{
			file: "lib/lodash/fp/fp.js",
			format: "esm",
			plugins: [terser()],
		},
	],
};
