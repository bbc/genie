import convert from './convert.js';
import padEnd from '../padEnd.js';
let func = convert('padEnd', padEnd);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
