import convert from './convert.js';
import cloneWith from '../cloneWith.js';
var func = convert('cloneWith', cloneWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
