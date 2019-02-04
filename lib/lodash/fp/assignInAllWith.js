import convert from './convert.js';
import assignInAllWith from '../assignInWith.js';
var func = convert('assignInAllWith', assignInAllWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
