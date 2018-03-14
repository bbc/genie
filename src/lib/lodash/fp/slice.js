import convert from './convert.js';
import slice from '../slice.js';
let func = convert('slice', slice);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
