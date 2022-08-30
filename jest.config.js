/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
module.exports = {
	collectCoverageFrom: ["src/components/**/*.js", "src/core/**/*.js", "!src/output/**/*.js"],
	coverageThreshold: {
		global: {
			statements: 100,
			branches: 100,
			lines: 100,
			functions: 100,
		},
	},
	//coverageProvider: "v8",
	testEnvironment: "jest-environment-jsdom",
	modulePathIgnorePatterns: ["/.node_modules.+/"],
	testPathIgnorePatterns: ["/node_modules/", "/.node_modules.+/", ".node_modules_production"],
	setupFilesAfterEnv: ["./test/set-up-jest.js"],
	transform: { "^.+\\.m?js$": "babel-jest" },
	transformIgnorePatterns: ["node_modules/(?!(bowser|json5|crel)/)"],
};
