"use strict";

module.exports = {
	//plugins: ['plugins/markdown']
	source: {
		include: ["./src", "./README.md"], // './package.json'],
		exclude: ["./src/lib"],
		includePattern: ".+\\.js(doc|x)?$",
		excludePattern: "(^|\\/|\\\\)_",
	},
	sourceType: "module",
	applicationName: "Genie",
	opts: {
		//"template": "./node_modules/@freshes/jsdoc-template",
		//"template": "./node_modules/jaguarjs-jsdoc",
		//"template": "node_modules/minami",
		//"template": "node_modules/jsdoc-baseline",
		recurse: true,
		destination: "./docs/api",
	},
	templates: {
		default: {
			layoutFile: "./build-scripts/docs/layout.tmpl",
			staticFiles: {
				include: ["./build-scripts/docs/static"],
			},
		},
	},
};
