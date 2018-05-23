import convert from './convert.js';
import assign from '../assign.js';
let func = convert('assign', assign);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
