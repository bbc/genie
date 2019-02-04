import convert from './convert.js';
import times from '../times.js';
var func = convert('times', times);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
