import convert from './convert.js';
import random from '../random.js';
let func = convert('random', random);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
