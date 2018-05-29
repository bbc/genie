import convert from './convert.js';
import attempt from '../attempt.js';
let func = convert('attempt', attempt);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
