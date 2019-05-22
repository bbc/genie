/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */

module.exports = {
    collectCoverageFrom: ["src/**/*.js", "!src/components/test-harness/**/*.js", "!src/output/**/*.js"],
    coverageThreshold: {
        global: {
            statements: 87.5,
            branches: 77.42,
            lines: 88.6,
            functions: 84.88,
        },
    },
    testEnvironment: "jsdom",
    modulePathIgnorePatterns: ["/.node_modules.+/"],
    testPathIgnorePatterns: ["/node_modules/", "/.node_modules.+/", ".node_modules_production"],
    setupTestFrameworkScriptFile: "./test/set-up/set-up-jest.js",
    transform: { "^.+\\.js$": "babel-jest" },
};
