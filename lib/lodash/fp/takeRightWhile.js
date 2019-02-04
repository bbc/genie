import convert from './convert.js';
import takeRightWhile from '../takeRightWhile.js';
var func = convert('takeRightWhile', takeRightWhile);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
