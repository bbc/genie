var webpackConfig = require("./webpack.config");

module.exports = function(config) {
    config.set({
        basePath: "",
        frameworks: ["mocha", "chai", "sinon"],
        files: ["test/**/*.ts"],
        exclude: [],
        preprocessors: {
            "test/**/*.ts": ["webpack"]
        },
        webpack: {
            module: webpackConfig.module,
            resolve: webpackConfig.resolve
        },
        reporters: ["progress", "verbose"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ["PhantomJS"],
        singleRun: true,
        concurrency: Infinity
    });
};
