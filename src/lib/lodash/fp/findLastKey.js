import convert from './convert.js';
import findLastKey from '../findLastKey.js';
let func = convert('findLastKey', findLastKey);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
