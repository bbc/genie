import convert from './convert.js';
import xor from '../xor.js';
let func = convert('xor', xor);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
