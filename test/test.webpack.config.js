/*jshint esversion: 6 */
var webpackConfig = require("../build-scripts/webpack.config");
const path = require("path");
const webpack = require("webpack");

module.exports = {
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /(phaser-split|p2|pixi).js$/,
                use: "script-loader",
            },
            {
                test: /\.tsx?$/,
                use: "awesome-typescript-loader",
            },
            {
                enforce: "post",
                test: /\.tsx?$/,
                include: /(src)/,
                exclude: /(node_modules|resources\/js\/vendor)/,
                loader: "istanbul-instrumenter-loader",
            },
        ],
    },
    resolve: webpackConfig.resolve,
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: null, // if no value is provided the sourcemap is inlined
            test: /\.(ts|js)x?$/i, // process .js, .tsx and .ts files only
        }),
    ],
};
