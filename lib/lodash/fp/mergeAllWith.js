import convert from './convert.js';
import mergeAllWith from '../mergeWith.js';
var func = convert('mergeAllWith', mergeAllWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
