import convert from './convert.js';
import findLastIndexFrom from '../findLastIndex.js';
let func = convert('findLastIndexFrom', findLastIndexFrom);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
