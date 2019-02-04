import convert from './convert.js';
import forEachRight from '../forEachRight.js';
var func = convert('forEachRight', forEachRight);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
