import convert from './convert.js';
import assignIn from '../assignIn.js';
var func = convert('assignIn', assignIn);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
