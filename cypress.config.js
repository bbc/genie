/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const { defineConfig } = require("cypress");

module.exports = defineConfig({
	reporter: "node_modules/mochawesome",
	reporterOptions: {
		overwrite: false,
		html: false,
		json: true,
		reportDir: "output/reports/cypress/",
		assetsDir: "output/reports/cypress/",
	},
	chromeWebSecurity: false,
	defaultCommandTimeout: 3000,
	pageLoadTimeout: 30000,
	screenshotOnRunFailure: true,
	retries: {
		runMode: 1,
	},
	e2e: {
		// We've imported your old cypress plugins here.
		// You may want to clean this up later by importing these.
		setupNodeEvents(on, config) {
			return require("./cypress/plugins/index.js")(on, config);
		},
	},
});
