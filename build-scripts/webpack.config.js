/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const path = require("path");
const dynamicallyExposeGlobals = require("../dev/scripts/dynamicExpose.js");

const webpack = require("webpack");

module.exports = env => {
    const development = env && env.development;
    const genieCore = env && env.genieCore;
    let webPackConfig = {
        mode: development ? "development" : "production",
        devtool: development ? "cheap-module-eval-source-map" : false,
        performance: { hints: false },
        entry: ["@babel/polyfill", "phaser", "webfontloader"],
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
                {
                    test: /\.m?js$/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            configFile: path.resolve("node_modules/genie/babel.config.js"),
                        },
                    },
                    include: [
                        path.resolve("src"),
                        path.resolve("lib"),
                        path.resolve("node_modules/genie/src"),
                        path.resolve("node_modules/genie/lib"),
                        path.resolve("node_modules/bowser/src"),
                        path.resolve("node_modules/json5/dist/"),
                    ],
                },
                { test: /webfontloader\.js/, use: ["expose-loader?WebFont"] },
            ],
        },
        devServer: {
            writeToDisk: true,
            useLocalIp: true,
            host: "0.0.0.0",
            port: 9000,
            historyApiFallback: {
                index: "node_modules/genie/dev/index.main.html",
            },
        },
        plugins: [],
    };

    try {
        const globals = dynamicallyExposeGlobals(path.resolve("globals.json"));
        webPackConfig.plugins = webPackConfig.plugins.concat(globals.map(global => new webpack.ProvidePlugin(global)));
    } catch (err) {
        if (err.code !== "ENOENT") throw err;
    }

    webPackConfig.entry.push(path.resolve("src/main.js"));

    const genieVersion = require("../package.json").version;
    webPackConfig.plugins.push(new webpack.BannerPlugin(`\nBBC GAMES GENIE: ${genieVersion}\n`));

    if (genieCore) {
        const Visualizer = require("webpack-visualizer-plugin");
        webPackConfig.plugins.push(new Visualizer());

        delete webPackConfig.module.rules[0].use.options;

        webPackConfig.devServer.historyApiFallback.index = "dev/index.main.html";
        webPackConfig.devServer.historyApiFallback.rewrites = [
            {
                from: /^\/node_modules\/genie/,
                to: context => context.parsedUrl.pathname.replace(context.match[0], ""),
            },
        ];
    }

    return webPackConfig;
};
