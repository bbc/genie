import convert from './convert.js';
import rangeStep from '../range.js';
var func = convert('rangeStep', rangeStep);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
