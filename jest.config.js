/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
module.exports = {
    collectCoverageFrom: ["src/**/*.js", "!src/output/**/*.js", "!src/components/overlays/pause-old.js"],
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
    },
    testEnvironment: "jsdom",
    modulePathIgnorePatterns: ["/.node_modules.+/"],
    testPathIgnorePatterns: [
        "/node_modules/",
        "/.node_modules.+/",
        ".node_modules_production",
        "./test/components/overlays/how-to-play",
        "./test/components/overlays/pause",
        "./test/core/accessibility",
    ],
    setupFilesAfterEnv: ["./test/set-up-jest.js"],
    transform: { "^.+\\.js$": "babel-jest" },
    transformIgnorePatterns: ["node_modules/(?!(bowser)/)"],
};
