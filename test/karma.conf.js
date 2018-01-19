var webpackConfig = require("../build-scripts/webpack.config");

module.exports = function(config) {
    config.set({
        basePath: "",
        frameworks: ["mocha", "chai", "sinon"],
        files: [
            { pattern: "../test/**/*.ts", watched: false, served: true, included: true },
            { pattern: "../src/**/*.ts", watched: false, served: false, included: false },
        ],
        exclude: [],
        preprocessors: {
            "**/*.ts": ["webpack"],
        },
        webpack: {
            module: webpackConfig.module,
            resolve: webpackConfig.resolve,
        },
        webpackMiddleware: {
            stats: "errors-only",
        },
        reporters: ["progress"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ["PhantomJS"],
        mime: {
            "text/x-typescript": ["ts", "tsx"],
        },
        singleRun: true,
        concurrency: Infinity,
    });
};
