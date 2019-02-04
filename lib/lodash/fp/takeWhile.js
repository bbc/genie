import convert from './convert.js';
import takeWhile from '../takeWhile.js';
var func = convert('takeWhile', takeWhile);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
