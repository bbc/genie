/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

module.exports = {
    collectCoverageFrom: ["src/**/*.js"],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    testEnvironment: "jsdom",
    modulePathIgnorePatterns: ["/.node_modules.+/"],
    testPathIgnorePatterns: ["/node_modules/", "/.node_modules.+/", ".node_modules_production"],
    setupTestFrameworkScriptFile: "./test/helpers/setup-jest.js",
    transform: { "^.+\\.js$": "babel-jest" },
};
