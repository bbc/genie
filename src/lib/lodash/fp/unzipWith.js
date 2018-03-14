import convert from './convert.js';
import unzipWith from '../unzipWith.js';
let func = convert('unzipWith', unzipWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
