var webpackConfig = require("../build-scripts/webpack.config");

module.exports = function(config) {
    config.set({
        basePath: "",
        frameworks: ["mocha", "chai", "sinon"],
        files: ["**/*.ts"],
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
