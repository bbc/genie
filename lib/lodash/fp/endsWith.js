import convert from './convert.js';
import endsWith from '../endsWith.js';
let func = convert('endsWith', endsWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
