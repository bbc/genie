import convert from './convert.js';
import keyBy from '../keyBy.js';
let func = convert('keyBy', keyBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
