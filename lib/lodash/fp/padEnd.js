import convert from './convert.js';
import padEnd from '../padEnd.js';
var func = convert('padEnd', padEnd);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
