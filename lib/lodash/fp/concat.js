import convert from './convert.js';
import concat from '../concat.js';
var func = convert('concat', concat);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
