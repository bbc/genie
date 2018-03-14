import convert from './convert.js';
import intersectionWith from '../intersectionWith.js';
let func = convert('intersectionWith', intersectionWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
