import convert from './convert.js';
import sumBy from '../sumBy.js';
let func = convert('sumBy', sumBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
