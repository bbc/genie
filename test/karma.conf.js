/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
var path = require("path");

var checkCoverageFlag = process.argv.toString().includes("--coverage");
var webpackConfig = require("../build-scripts/webpack.config.js")();

module.exports = function(config) {
    config.set({
        basePath: "..",
        frameworks: ["mocha"],
        files: ["node_modules/phaser-ce/build/phaser.min.js", "test/test-context.js"],
        preprocessors: {
            "test/test-context.js": ["webpack", "sourcemap"],
        },
        client: {
            mocha: {
                timeout: 20000, // 20 seconds - upped from 2 seconds
            },
        },
        webpack: {
            mode: "development",
            plugins: webpackConfig.plugins,
            devtool: "inline-source-map",
            module: {
                rules: checkCoverageFlag
                    ? webpackConfig.module.rules.concat([
                          {
                              enforce: "post",
                              test: /\.jsx?$/,
                              include: path.resolve("src"),
                              exclude: path.resolve("src/lib/lodash"),
                              loader: "istanbul-instrumenter-loader",
                          },
                      ])
                    : webpackConfig.module.rules,
            },
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
        concurrency: Infinity,
    });
};
