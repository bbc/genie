import convert from './convert.js';
import orderBy from '../orderBy.js';
var func = convert('orderBy', orderBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
