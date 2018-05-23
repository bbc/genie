import convert from './convert.js';
import ary from '../ary.js';
let func = convert('ary', ary);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
