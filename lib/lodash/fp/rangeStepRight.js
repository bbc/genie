import convert from './convert.js';
import rangeStepRight from '../rangeRight.js';
var func = convert('rangeStepRight', rangeStepRight);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
