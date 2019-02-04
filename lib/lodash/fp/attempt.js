import convert from './convert.js';
import attempt from '../attempt.js';
var func = convert('attempt', attempt);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
