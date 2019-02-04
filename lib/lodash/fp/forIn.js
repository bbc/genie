import convert from './convert.js';
import forIn from '../forIn.js';
var func = convert('forIn', forIn);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
