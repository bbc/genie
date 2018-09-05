/**
 * Rule loading shim for genie specific linting
 * See ./dev/eslint-rules/eslint-rules-genie for available rules
 *
 * @copyright BBC 2018
 * @author BBC Children's D+E
 * @license Apache-2.0
 */
const genieRules = require("./dev/eslint-rules/eslint-rules-genie");
module.exports = genieRules;
