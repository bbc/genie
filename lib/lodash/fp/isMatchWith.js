import convert from './convert.js';
import isMatchWith from '../isMatchWith.js';
let func = convert('isMatchWith', isMatchWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
