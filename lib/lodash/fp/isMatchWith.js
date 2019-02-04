import convert from './convert.js';
import isMatchWith from '../isMatchWith.js';
var func = convert('isMatchWith', isMatchWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
