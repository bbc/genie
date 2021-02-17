/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const { renameSync } = require("fs");
/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
    on("after:screenshot", ({ path }) => {
        renameSync(path, path.replace(/ \(\d*\)/i, ""));
    });

    config.env.THEME = process.env.THEME;
    config.env.LOCAL_DEV = process.env.LOCAL_DEV;
    return config;
};
