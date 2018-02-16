/*jshint esversion: 6 */
const path = require("path");
const webpack = require("webpack");
const TsConfigPathsPlugin = require("awesome-typescript-loader").TsConfigPathsPlugin;

var phaserModule = path.join(__dirname, "../node_modules/phaser-ce/");
var phaser = path.join(phaserModule, "build/custom/phaser-split.js"),
    pixi = path.join(phaserModule, "build/custom/pixi.js"),
    p2 = path.join(phaserModule, "build/custom/p2.js");

module.exports = {
    devtool: "source-map",
    entry: "./src/main.ts",
    output: {
        devtoolModuleFilenameTemplate: "[absolute-resource-path]",
        filename: "output/main.js",
    },
    module: {
        rules: [
            {
                test: /(phaser-split|p2|pixi).js$/,
                use: "script-loader",
            },
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
            },
        ],
    },
    resolve: {
        alias: {
            "phaser-ce": phaser,
            "pixi.js": pixi,
            p2: p2,
        },
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js", ".jsx"],
        plugins: [new TsConfigPathsPlugin()],
    },
    plugins: [],
};
