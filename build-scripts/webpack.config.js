var path = require("path");
var HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
var Visualizer = require("webpack-visualizer-plugin");

// Phaser webpack config
var phaserModule = path.join(__dirname, "../node_modules/phaser-ce/");
var phaser = path.join(phaserModule, "build/custom/phaser-split.js");
var pixi = path.join(phaserModule, "build/custom/pixi.js");
var p2 = path.join(phaserModule, "build/custom/p2.js");

module.exports = env => {
    var webPackConfig = {
        mode: "production",
        performance: { hints: false },
        plugins: [new HardSourceWebpackPlugin(), new Visualizer()],
        entry: ["babel-polyfill", "pixi", "p2", "phaser", "webfontloader", path.resolve("src/main.js")],
        output: {
            path: path.resolve("output"),
            publicPath: "output",
            filename: "main.js",
        },
        module: {
            rules: [
                { test: /\.js$/, use: ["babel-loader"], include: path.resolve("src") },
                { test: /\.js$/, use: ["babel-loader"], include: path.resolve("node_modules/genie/src") },
                { test: /pixi\.js/, use: ["expose-loader?PIXI"] },
                { test: /phaser-split\.js$/, use: ["expose-loader?Phaser"] },
                { test: /p2\.js/, use: ["expose-loader?p2"] },
                { test: /webfontloader\.js/, use: ["expose-loader?WebFont"] },
            ],
        },
        resolve: {
            alias: {
                phaser: phaser,
                pixi: pixi,
                p2: p2,
            },
        },
        devServer: {
            useLocalIp: true,
            host: "0.0.0.0",
            historyApiFallback: {
                index: "node_modules/genie/dev/index.main.html",
            },
        },
    };

    if (env && env.genieCore) {
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
