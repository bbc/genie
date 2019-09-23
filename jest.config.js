/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
module.exports = {
    collectCoverageFrom: ["src/**/*.js", "!src/components/test-harness/**/*.js", "!src/output/**/*.js"],
    coverageThreshold: {
        // global: {
        //     statements: 94.34,
        //     branches: 87.74,
        //     lines: 95.25,
        //     functions: 90.8,
        // },
        global: {
            statements: 0,
            branches: 0,
            lines: 0,
            functions: 0,
        },
        "src/core/layout/gel-button.js": {
            statements: 0,
            branches: 0,
            lines: 0,
            functions: 0,
        },
        "src/core/layout/debug-button.js": {
            statements: 0,
            branches: 0,
            lines: 0,
            functions: 0,
        },
    },
    testEnvironment: "jsdom",
    modulePathIgnorePatterns: ["/.node_modules.+/"],
    testPathIgnorePatterns: [
        "/node_modules/",
        "/.node_modules.+/",
        ".node_modules_production",
        "./test/components/overlays/how-to-play",
        "./test/components/overlays/pause",
        "./test/components/test-harness/layout-harness",
        "./test/components/home",
        "./test/components/loadscreen",
        "./test/components/results",
        "./test/components/select",
        "./test/core/accessibility",
        "./test/core/debug",
        "./test/core/font-loader",
        "./test/core/layout",
        "./test/core/navigation",
        "./test/core/scaler",
        "./test/core/screen",
        "./test/core/signal-bus",
        "./test/core/startup",
    ],
    setupFilesAfterEnv: ["./test/set-up-jest.js"],
    transform: { "^.+\\.js$": "babel-jest" },
    transformIgnorePatterns: ["node_modules/(?!(bowser)/)"],
};
