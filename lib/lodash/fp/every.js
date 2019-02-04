import convert from './convert.js';
import every from '../every.js';
var func = convert('every', every);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
