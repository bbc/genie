import convert from './convert.js';
import findKey from '../findKey.js';
let func = convert('findKey', findKey);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
