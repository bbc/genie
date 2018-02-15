/*jshint esversion: 6 */
var webpackConfig = require("../build-scripts/webpack.config");
const webpack = require("webpack");

module.exports = {
    devtool: "source-map",
    module: {
        rules: webpackConfig.module.rules.concat([
            {
                enforce: "post",
                test: /\.tsx?$/,
                include: /(src)/,
                exclude: /(node_modules|resources\/js\/vendor)/,
                loader: "istanbul-instrumenter-loader",
            },
        ]),
    },
    resolve: webpackConfig.resolve,
    plugins: webpackConfig.plugins.concat([
        new webpack.SourceMapDevToolPlugin({
            filename: null, // if no value is provided the sourcemap is inlined
            test: /\.(ts|js)x?$/i, // process .js, .tsx and .ts files only
        }),
    ]),
};
