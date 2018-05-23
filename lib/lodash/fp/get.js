import convert from './convert.js';
import get from '../get.js';
let func = convert('get', get);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
