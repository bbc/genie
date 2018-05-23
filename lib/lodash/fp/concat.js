import convert from './convert.js';
import concat from '../concat.js';
let func = convert('concat', concat);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
