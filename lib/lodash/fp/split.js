import convert from './convert.js';
import split from '../split.js';
let func = convert('split', split);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
