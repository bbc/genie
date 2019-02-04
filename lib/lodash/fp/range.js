import convert from './convert.js';
import range from '../range.js';
var func = convert('range', range);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
