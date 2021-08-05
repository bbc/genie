/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const fse = require("fs-extra");

async function cleanupReports() {
	await fse.remove("mochawesome-report");
}

cleanupReports();
