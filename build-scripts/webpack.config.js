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

module.exports = env => {
    var webPackConfig = {
        mode: "production",
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
            historyApiFallback: {
                index: "node_modules/genie/dev/index.main.html",
            },
        },
    };

    try {
        var dynamicConfig = dynamicallyExposeGlobals(path.resolve("globals.json"));
        webPackConfig.entry = webPackConfig.entry.concat(dynamicConfig.entry);
        webPackConfig.module.rules = webPackConfig.module.rules.concat(dynamicConfig.rules);
    } catch (err) {
        if (err.code !== "ENOENT") throw err;
    }

    webPackConfig.entry.push(path.resolve("src/main.js"));

    if (env && env.genieCore) {
        var HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
        var Visualizer = require("webpack-visualizer-plugin");
        webPackConfig.plugins = [new HardSourceWebpackPlugin(), new Visualizer()];

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
