import convert from './convert.js';
import curry from '../curry.js';
var func = convert('curry', curry);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
