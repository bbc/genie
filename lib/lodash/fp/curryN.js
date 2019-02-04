import convert from './convert.js';
import curryN from '../curry.js';
var func = convert('curryN', curryN);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
