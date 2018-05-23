import convert from './convert.js';
import isEqualWith from '../isEqualWith.js';
let func = convert('isEqualWith', isEqualWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
