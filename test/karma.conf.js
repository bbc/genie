var webpackConfig = require("./test.webpack.config");

module.exports = function(config) {
    config.set({
        basePath: "",
        frameworks: ["mocha", "chai", "sinon"],
        files: [{ pattern: "../test/**/*.ts", watched: false, served: true, included: true }],
        exclude: [],
        preprocessors: {
            "../test/**/*.ts": ["webpack", "sourcemap"],
            "../src/**/*.ts": ["webpack", "sourcemap", "coverage"],
        },
        client: {
            mocha: {
                timeout: 20000, // 20 seconds - upped from 2 seconds
            },
        },
        webpack: webpackConfig,
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
        reporters: ["mocha", "coverage", "remap-coverage"],
        port: 9876,
        colors: true,
        logLevel: config.LOG_DEBUG,
        autoWatch: false,
        browsers: ["ChromeHeadless"],
        customLaunchers: {
            ChromeHeadlessNoWebGL: {
                base: "ChromeHeadless",
                flags: ["--disable-webgl"],
            },
            PhantomJSNoSecurity: {
                // requires karma-phantomjs-launcher
                base: "PhantomJS",
                options: {
                    settings: {
                        // Enables loading JSON data urls:
                        webSecurityEnabled: false,
                    },
                },
            },
        },
        mime: {
            "text/x-typescript": ["ts", "tsx"],
        },
        singleRun: true,
        concurrency: Infinity,
    });
};
