import convert from './convert.js';
import take from '../take.js';
let func = convert('take', take);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
