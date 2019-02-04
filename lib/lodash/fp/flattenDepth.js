import convert from './convert.js';
import flattenDepth from '../flattenDepth.js';
var func = convert('flattenDepth', flattenDepth);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
