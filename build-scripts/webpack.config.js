/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
var path = require("path");
var dynamicallyExposeGlobals = require("../dev/scripts/dynamicExpose.js");

// Phaser webpack config
var phaserModule = path.resolve("node_modules/phaser-ce/");
var phaser = path.join(phaserModule, "build/custom/phaser-split.js");
var pixi = path.join(phaserModule, "build/custom/pixi.js");
var p2 = path.join(phaserModule, "build/custom/p2.js");
const webpack = require("webpack");

module.exports = env => {
    var development = env && env.development;
    var webPackConfig = {
        mode: development ? "development" : "production",
        devtool: development ? "cheap-module-eval-source-map" : false,
        performance: { hints: false },
        entry: ["@babel/polyfill", pixi, p2, phaser, "webfontloader"],
        output: {
            path: path.resolve("output"),
            publicPath: "output",
            filename: "main.js",
        },
        resolve: {
            symlinks: false,
        },
        module: {
            rules: [
                { test: /\.js$/, use: ["babel-loader"], include: [path.resolve("src"), path.resolve("lib")] },
                {
                    test: /\.js$/,
                    use: ["babel-loader"],
                    include: [path.resolve("node_modules/genie/src"), path.resolve("node_modules/genie/lib")],
                },
                { test: /pixi\.js/, use: ["expose-loader?PIXI"] },
                { test: /phaser-split\.js$/, use: ["expose-loader?Phaser"] },
                { test: /p2\.js/, use: ["expose-loader?p2"] },
                { test: /webfontloader\.js/, use: ["expose-loader?WebFont"] },
            ],
        },
        devServer: {
            writeToDisk: true,
            useLocalIp: true,
            host: "0.0.0.0",
            port: 9000,
            historyApiFallback: {
                index: "node_modules/genie/dev/index.main.html",
            },
        },
        plugins: [],
    };

    try {
        var dynamicConfig = dynamicallyExposeGlobals(path.resolve("globals.json"));
        webPackConfig.entry = webPackConfig.entry.concat(dynamicConfig.entry);
        webPackConfig.module.rules = webPackConfig.module.rules.concat(dynamicConfig.rules);
    } catch (err) {
        if (err.code !== "ENOENT") throw err;
    }

    webPackConfig.entry.push(path.resolve("src/main.js"));

    const genieVersion = require("../package.json").version;
    webPackConfig.plugins.push(new webpack.BannerPlugin(`\nBBC GAMES GENIE: ${genieVersion}\n`));

    if (env && env.genieCore) {
        const Visualizer = require("webpack-visualizer-plugin");
        webPackConfig.plugins.push(new Visualizer());

        webPackConfig.devServer.historyApiFallback.index = "dev/index.main.html";
        webPackConfig.devServer.historyApiFallback.rewrites = [
            {
                from: /^\/node_modules\/genie/,
                to: function(context) {
                    return context.parsedUrl.pathname.replace(context.match[0], "");
                },
            },
        ];
    }

    return webPackConfig;
};
