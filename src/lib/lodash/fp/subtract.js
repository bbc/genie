import convert from './convert.js';
import subtract from '../subtract.js';
let func = convert('subtract', subtract);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
