import convert from './convert.js';
import intersectionBy from '../intersectionBy.js';
let func = convert('intersectionBy', intersectionBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
