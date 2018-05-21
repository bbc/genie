import convert from './convert.js';
import cloneDeepWith from '../cloneDeepWith.js';
let func = convert('cloneDeepWith', cloneDeepWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
