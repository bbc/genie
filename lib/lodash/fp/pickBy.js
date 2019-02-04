import convert from './convert.js';
import pickBy from '../pickBy.js';
var func = convert('pickBy', pickBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
