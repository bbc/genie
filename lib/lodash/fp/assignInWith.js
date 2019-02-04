import convert from './convert.js';
import assignInWith from '../assignInWith.js';
var func = convert('assignInWith', assignInWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
