/*jshint esversion: 6 */
const path = require("path");
const webpack = require("webpack");
const HappyPack = require("happypack");
const { TsConfigPathsPlugin } = require("awesome-typescript-loader");
var ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

var phaserModule = path.join(__dirname, "../node_modules/phaser-ce/");
var phaser = path.join(phaserModule, "build/custom/phaser-split.js"),
    pixi = path.join(phaserModule, "build/custom/pixi.js"),
    p2 = path.join(phaserModule, "build/custom/p2.js");

module.exports = {
    context: path.join(__dirname, ".."),
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
                use: "happypack/loader?id=script",
            },
            {
                test: /\.tsx?$/,
                use: "happypack/loader?id=ts",
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
            id: "ts",
            threads: 2,
            loaders: [
                {
                    path: "ts-loader",
                    query: { happyPackMode: true },
                },
            ],
        }),
        new HappyPack({
            id: "script",
            loaders: [
                {
                    path: "script-loader",
                },
            ],
        }),
        new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true,
            workers: ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE,
        }),
    ],
};
