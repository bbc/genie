import convert from './convert.js';
import pullAllBy from '../pullAllBy.js';
let func = convert('pullAllBy', pullAllBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
