import convert from './convert.js';
import forOwn from '../forOwn.js';
var func = convert('forOwn', forOwn);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
