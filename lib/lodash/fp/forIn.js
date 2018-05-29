import convert from './convert.js';
import forIn from '../forIn.js';
let func = convert('forIn', forIn);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
