/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const path = require("path");
const dynamicallyExposeGlobals = require("../dev/scripts/dynamicExpose.js");

const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = env => {
	const development = env && env.development;
	const genieCore = env && env.genieCore;
	let webPackConfig = {
		mode: development ? "development" : "production",
		devtool: development ? "eval-cheap-module-source-map" : "hidden-source-map",
		performance: { hints: false },
		entry: [
			"core-js/stable",
			"core-js/modules/es.object.from-entries",
			"regenerator-runtime/runtime",
			"event-target-polyfill",
			"phaser/dist/phaser.min",
			"webfontloader",
		],
		output: {
			path: path.resolve("output"),
			publicPath: "output",
			filename: "main.js",
		},
		target: ["web", "es5"],
		resolve: {
			symlinks: false,
			preferRelative: true, //required for webfontloader which uses outdated paths
		},
		module: {
			rules: [
				{
					test: /\.m?js$/,
					exclude: [/@babel(?:\/|\\{1,2})runtime|core-js/],
					use: {
						loader: "babel-loader",
						options: {
							configFile: path.resolve("node_modules/genie/babel.config.js"),
						},
					},
				},
				{
					test: /webfontloader\.js/,
					loader: "expose-loader",
					options: {
						exposes: [
							"WebFont",
							{
								globalName: "WebFont",
								override: true,
							},
						],
					},
				},
			],
		},
		optimization: {
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						keep_fnames: /./,
					},
				}),
			],
		},
		devServer: {
			static: [path.resolve(__dirname, "../")],
			host: "0.0.0.0",
			port: 9001,
			historyApiFallback: {
				index: "node_modules/genie/dev/index.main.html",
			},
			devMiddleware: {
				publicPath: "/output",
			},
		},
		plugins: [],
	};

	try {
		const globals = dynamicallyExposeGlobals(path.resolve("globals.json"));
		webPackConfig.plugins = webPackConfig.plugins.concat(globals.map(global => new webpack.ProvidePlugin(global)));
	} catch (err) {
		if (err.code !== "ENOENT") throw err;
	}

	webPackConfig.entry.push(path.resolve("src/main.js"));

	const genieVersion = require("../package.json").version;
	const buildNumber = process.env.BUILD_NUMBER;
	const jobName = process.env.JOB_NAME;

	webPackConfig.plugins.push(new webpack.BannerPlugin(`\nBBC GAMES GENIE: ${genieVersion}\n`));
	webPackConfig.plugins.push(
		new webpack.DefinePlugin({
			__BUILD_INFO__: {
				version: `"${genieVersion}"`,
				job: `"${jobName || ""}"`,
				build: `"${buildNumber || "PRODUCTION"}"`,
			},
		}),
	);

	if (genieCore) {
		delete webPackConfig.module.rules[0].use.options;

		webPackConfig.devServer.historyApiFallback.index = "dev/index.main.html";
		webPackConfig.devServer.historyApiFallback.rewrites = [
			{
				from: /^\/node_modules\/genie/,
				to: context => context.parsedUrl.pathname.replace(context.match[0], ""),
			},
		];
	}

	return webPackConfig;
};
