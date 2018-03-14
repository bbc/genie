/*jshint esversion: 6 */
const path = require("path");
const webpack = require("webpack");
const HappyPack = require("happypack");

var phaserModule = path.join(__dirname, "../node_modules/phaser-ce/");
var phaser = path.join(phaserModule, "build/custom/phaser-split.js"),
    pixi = path.join(phaserModule, "build/custom/pixi.js"),
    p2 = path.join(phaserModule, "build/custom/p2.js");

module.exports = {
    context: path.join(__dirname, ".."),
    devtool: "cheap-module-eval-source-map",
    entry: "./src/main.js",
    output: {
        devtoolModuleFilenameTemplate: "[absolute-resource-path]",
        filename: "output/main.js",
    },
    module: {
        rules: [
            {
                test: /(phaser-split|p2|pixi).js$/,
                include: /(node_modules[\\\/]phaser-ce)/,
                use: "happypack/loader?id=script-loader",
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
        plugins: [],
    },
    plugins: [
        new HappyPack({
            id: "script-loader",
            threads: 1,
            loaders: [
                {
                    path: "script-loader",
                },
            ],
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: null, // if no value is provided the sourcemap is inlined
            test: /\.(ts|js)x?$/i, // process .js, .tsx and .ts files only
            moduleFilenameTemplate: "[absolute-resource-path]",
        }),
    ],
};
