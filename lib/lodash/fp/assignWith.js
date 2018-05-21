import convert from './convert.js';
import assignWith from '../assignWith.js';
let func = convert('assignWith', assignWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
