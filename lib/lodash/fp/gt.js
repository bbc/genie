import convert from './convert.js';
import gt from '../gt.js';
var func = convert('gt', gt);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
