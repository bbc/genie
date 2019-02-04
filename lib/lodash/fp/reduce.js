import convert from './convert.js';
import reduce from '../reduce.js';
var func = convert('reduce', reduce);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
