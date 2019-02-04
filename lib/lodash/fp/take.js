import convert from './convert.js';
import take from '../take.js';
var func = convert('take', take);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
