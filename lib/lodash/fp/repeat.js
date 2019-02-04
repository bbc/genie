import convert from './convert.js';
import repeat from '../repeat.js';
var func = convert('repeat', repeat);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
