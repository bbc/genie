import convert from './convert.js';
import forOwnRight from '../forOwnRight.js';
let func = convert('forOwnRight', forOwnRight);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
