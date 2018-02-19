/*jshint esversion: 6 */
var webpackConfig = require("../build-scripts/webpack.config");
const webpack = require("webpack");
const HappyPack = require("happypack");

module.exports = {
    module: {
        rules: webpackConfig.module.rules.concat([
            {
                enforce: "post",
                test: /\.tsx?$/,
                include: /(src)/,
                exclude: /(node_modules|resources\/js\/vendor)/,
                loader: "happypack/loader?id=istanbul-instrumenter",
            },
        ]),
    },
    resolve: webpackConfig.resolve,
    plugins: webpackConfig.plugins.concat([
        new webpack.SourceMapDevToolPlugin({
            filename: null, // if no value is provided the sourcemap is inlined
            test: /\.(ts|js)x?$/i, // process .js, .tsx and .ts files only
            moduleFilenameTemplate: "[absolute-resource-path]",
        }),
        new HappyPack({
            id: "istanbul-instrumenter",
            threads: 1,
            loaders: [
                {
                    path: "istanbul-instrumenter-loader",
                },
            ],
        }),
    ]),
};
