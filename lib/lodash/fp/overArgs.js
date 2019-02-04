import convert from './convert.js';
import overArgs from '../overArgs.js';
var func = convert('overArgs', overArgs);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
