import convert from './convert.js';
import clamp from '../clamp.js';
var func = convert('clamp', clamp);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
