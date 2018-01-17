var webpackConfig = require("./webpack.config");

module.exports = function(config) {
    config.set({
        basePath: "",
        browserStack: {
            username: "adambeswick1",
            accessKey: "notmypassword",
            binaryBasePath: ".",
        },
        customLaunchers: {
            bs_chrome63_win: {
                base: "BrowserStack",
                browser: "Chrome",
                browser_version: "63.0",
                os: "Windows",
                os_version: "10",
            },
        },
        frameworks: ["mocha", "chai", "sinon"],
        files: ["../test/**/*.ts"],
        exclude: [],
        preprocessors: {
            "../test/**/*.ts": ["webpack"],
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
        browsers: ["bs_chrome63_win"],
        mime: {
            "text/x-typescript": ["ts", "tsx"],
        },
        singleRun: true,
        concurrency: Infinity,
    });
};
