import convert from './convert.js';
import assignInWith from '../assignInWith.js';
let func = convert('assignInWith', assignInWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
