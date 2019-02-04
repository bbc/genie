import convert from './convert.js';
import minBy from '../minBy.js';
var func = convert('minBy', minBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
