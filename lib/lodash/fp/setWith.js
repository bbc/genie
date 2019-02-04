import convert from './convert.js';
import setWith from '../setWith.js';
var func = convert('setWith', setWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
