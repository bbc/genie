import convert from './convert.js';
import assignAllWith from '../assignWith.js';
var func = convert('assignAllWith', assignAllWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
