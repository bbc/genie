/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
module.exports = {
    collectCoverageFrom: ["src/components/**/*.js", "src/core/**/*.js", "!src/output/**/*.js"],
    coverageThreshold: {
        global: {
            statements: 99.49,
            branches: 99.17,
            lines: 99.68,
            functions: 98.95,
        },
    },
    testEnvironment: "jsdom",
    modulePathIgnorePatterns: ["/.node_modules.+/"],
    testPathIgnorePatterns: ["/node_modules/", "/.node_modules.+/", ".node_modules_production"],
    setupFilesAfterEnv: ["./test/set-up-jest.js"],
    transform: { "^.+\\.js$": "babel-jest" },
    transformIgnorePatterns: ["node_modules/(?!(bowser)/)"],
};
