/**
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const fs = require("fs");

const getKeyNameMap = script => {
	let global = {};
	global[script.moduleVar] = script.npmName;

	return global;
};

module.exports = path => JSON.parse(fs.readFileSync(path)).map(getKeyNameMap);
