import convert from './convert.js';
import xor from '../xor.js';
var func = convert('xor', xor);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
