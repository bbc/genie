import convert from './convert.js';
import eq from '../eq.js';
var func = convert('eq', eq);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
