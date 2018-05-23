import convert from './convert.js';
import after from '../after.js';
let func = convert('after', after);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
