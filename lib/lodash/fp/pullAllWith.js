import convert from './convert.js';
import pullAllWith from '../pullAllWith.js';
var func = convert('pullAllWith', pullAllWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
