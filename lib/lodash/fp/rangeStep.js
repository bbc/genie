import convert from './convert.js';
import rangeStep from '../range.js';
let func = convert('rangeStep', rangeStep);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
