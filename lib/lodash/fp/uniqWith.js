import convert from './convert.js';
import uniqWith from '../uniqWith.js';
var func = convert('uniqWith', uniqWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
