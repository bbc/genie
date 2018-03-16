var path = require('path');

var checkCoverageFlag = process.argv.toString().includes("--coverage");
var webpackConfig = require("../build-scripts/webpack.config.js");

module.exports = function(config) {
    config.set({
        basePath: "..",
        frameworks: ["mocha", "chai", "sinon"],
        files: [
            'node_modules/phaser-ce/build/phaser.min.js',
            { pattern: 'test/**/*.spec.js', watched: false }
        ],
        preprocessors: {
            'test/**/*.spec.js': [ 'webpack' ]
        },
        client: {
            mocha: {
                timeout: 20000, // 20 seconds - upped from 2 seconds
            },
        },
        webpack: {
			module: checkCoverageFlag ? {rules: webpackConfig.module.rules.concat([{
                enforce: "post",
                test: /\.jsx?$/,
                include: path.resolve('src'),
                exclude: path.resolve('src/lib/lodash'),
                loader: "istanbul-instrumenter-loader"
            }])} : webpackConfig.module,
			resolve: webpackConfig.resolve,
			devtool: 'inline-source-map'
		},
        webpackMiddleware: {
            stats: "errors-only",
            noInfo: true,
        },
        coverageReporter: {
            type: "in-memory",
        },
        remapCoverageReporter: {
            "text-summary": null,
            html: "./coverage/html",
            cobertura: "./coverage/cobertura.xml",
            json: "./coverage/coverage.json",
            lcovonly: "./coverage/lcov.info",
        },
        reporters: checkCoverageFlag ? ["mocha", "coverage", "remap-coverage"] : ["mocha"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ["ChromeHeadless"],
        customLaunchers: {
            ChromeHeadlessNoWebGL: {
                base: "ChromeHeadless",
                flags: ["--disable-webgl"],
            },
        },
        singleRun: true,
        concurrency: Infinity
    });
};
