import convert from './convert.js';
import findIndexFrom from '../findIndex.js';
let func = convert('findIndexFrom', findIndexFrom);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
