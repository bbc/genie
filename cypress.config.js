// eslint-disable-next-line local-rules/require-bbc-header
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
