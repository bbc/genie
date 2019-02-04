import convert from './convert.js';
import keyBy from '../keyBy.js';
var func = convert('keyBy', keyBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
