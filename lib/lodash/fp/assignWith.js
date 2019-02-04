import convert from './convert.js';
import assignWith from '../assignWith.js';
var func = convert('assignWith', assignWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
