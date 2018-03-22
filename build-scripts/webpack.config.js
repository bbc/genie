var path = require("path");
var HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
var Visualizer = require("webpack-visualizer-plugin");

// Phaser webpack config
var phaserModule = path.join(__dirname, "../node_modules/phaser-ce/");
var phaser = path.join(phaserModule, "build/custom/phaser-split.js");
var pixi = path.join(phaserModule, "build/custom/pixi.js");
var p2 = path.join(phaserModule, "build/custom/p2.js");

module.exports = {
    mode: "production",
    plugins: [new HardSourceWebpackPlugin(), new Visualizer()],
    entry: ["babel-polyfill", "pixi", "p2", "phaser", path.resolve("src/main.js")],
    output: {
        pathinfo: true,
        path: path.resolve("output"),
        publicPath: "output",
        filename: "main.js",
    },
    module: {
        rules: [
            { test: /\.js$/, use: ["babel-loader"], include: path.resolve("src") },
            { test: /pixi\.js/, use: ["expose-loader?PIXI"] },
            { test: /phaser-split\.js$/, use: ["expose-loader?Phaser"] },
            { test: /p2\.js/, use: ["expose-loader?p2"] },
        ],
    },
    resolve: {
        alias: {
            phaser: phaser,
            pixi: pixi,
            p2: p2,
        },
    },
    target: "web",
};
