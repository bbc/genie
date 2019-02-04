import convert from './convert.js';
import reverse from '../reverse.js';
var func = convert('reverse', reverse);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
