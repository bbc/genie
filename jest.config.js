/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

module.exports = {
    collectCoverageFrom: ["src/**/*.js"],
    coverageThreshold: {
        global: {
            statements: 73.75,
            branches: 71.6,
            lines: 74.49,
            functions: 77.54,
        },
    },
    testEnvironment: "jsdom",
    modulePathIgnorePatterns: ["/.node_modules.+/"],
    testPathIgnorePatterns: ["/node_modules/", "/.node_modules.+/", ".node_modules_production"],
    setupTestFrameworkScriptFile: "./test/set-up/set-up-jest.js",
    transform: { "^.+\\.js$": "babel-jest" },
};
