/*jshint esversion: 6 */
const path = require("path");
const webpack = require("webpack");
const HappyPack = require("happypack");
var ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

var phaserModule = path.join(__dirname, "../node_modules/phaser-ce/");
var phaser = path.join(phaserModule, "build/custom/phaser-split.js"),
    pixi = path.join(phaserModule, "build/custom/pixi.js"),
    p2 = path.join(phaserModule, "build/custom/p2.js");

module.exports = {
    context: path.join(__dirname, ".."),
    devtool: "cheap-module-eval-source-map",
    entry: "./src/main.ts",
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
            {
                test: /\.tsx?$/,
                include: /(src|test)/,
                use: "happypack/loader?id=ts",
            },
            {
                test: /\.js$/,
                include: /(src|test)/,
                exclude: /node_modules/,
                loader: "happypack/loader?id=babel",
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
            threads: 1,
            loaders: [
                {
                    path: "babel-loader",
                    query: { presets: [["env", { targets: { ie: 11 } }]] },
                },
                {
                    path: "ts-loader",
                    query: { happyPackMode: true },
                },
            ],
        }),
        new HappyPack({
            id: "script-loader",
            threads: 1,
            loaders: [
                {
                    path: "script-loader",
                },
            ],
        }),
        new HappyPack({
            id: "babel",
            threads: 1,
            loaders: [
                {
                    path: "babel-core",
                    query: {
                        presets: [["env", { targets: { ie: 11 } }]],
                        cacheDirectory: true,
                    },
                },
            ],
        }),
        new ForkTsCheckerWebpackPlugin({
            checkSyntacticErrors: true,
            workers: ForkTsCheckerWebpackPlugin.ONE_CPU,
        }),
        new webpack.SourceMapDevToolPlugin({
            filename: null, // if no value is provided the sourcemap is inlined
            test: /\.(ts|js)x?$/i, // process .js, .tsx and .ts files only
            moduleFilenameTemplate: "[absolute-resource-path]",
        }),
    ],
};
