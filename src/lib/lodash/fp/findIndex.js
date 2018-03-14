import convert from './convert.js';
import findIndex from '../findIndex.js';
let func = convert('findIndex', findIndex);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
