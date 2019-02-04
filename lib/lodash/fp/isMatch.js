import convert from './convert.js';
import isMatch from '../isMatch.js';
var func = convert('isMatch', isMatch);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
