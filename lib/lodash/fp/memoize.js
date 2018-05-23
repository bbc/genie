import convert from './convert.js';
import memoize from '../memoize.js';
let func = convert('memoize', memoize);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
