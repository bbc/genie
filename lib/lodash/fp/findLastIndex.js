import convert from './convert.js';
import findLastIndex from '../findLastIndex.js';
let func = convert('findLastIndex', findLastIndex);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
