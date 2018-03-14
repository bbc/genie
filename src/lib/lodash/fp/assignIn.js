import convert from './convert.js';
import assignIn from '../assignIn.js';
let func = convert('assignIn', assignIn);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
