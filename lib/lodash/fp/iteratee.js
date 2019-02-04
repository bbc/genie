import convert from './convert.js';
import iteratee from '../iteratee.js';
var func = convert('iteratee', iteratee);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
