import convert from './convert.js';
import xorBy from '../xorBy.js';
var func = convert('xorBy', xorBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
