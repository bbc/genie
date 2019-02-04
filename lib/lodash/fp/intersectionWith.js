import convert from './convert.js';
import intersectionWith from '../intersectionWith.js';
var func = convert('intersectionWith', intersectionWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
