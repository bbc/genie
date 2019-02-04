import convert from './convert.js';
import padCharsEnd from '../padEnd.js';
var func = convert('padCharsEnd', padCharsEnd);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
