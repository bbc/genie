import convert from './convert.js';
import forEachRight from '../forEachRight.js';
let func = convert('forEachRight', forEachRight);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
