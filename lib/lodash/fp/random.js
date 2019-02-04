import convert from './convert.js';
import random from '../random.js';
var func = convert('random', random);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
