import convert from './convert.js';
import set from '../set.js';
let func = convert('set', set);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
