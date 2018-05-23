import convert from './convert.js';
import difference from '../difference.js';
let func = convert('difference', difference);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
