import convert from './convert.js';
import xorBy from '../xorBy.js';
let func = convert('xorBy', xorBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
