import convert from './convert.js';
import mergeWith from '../mergeWith.js';
var func = convert('mergeWith', mergeWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
