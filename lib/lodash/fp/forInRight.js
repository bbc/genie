import convert from './convert.js';
import forInRight from '../forInRight.js';
var func = convert('forInRight', forInRight);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
