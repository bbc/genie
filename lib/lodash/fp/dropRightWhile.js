import convert from './convert.js';
import dropRightWhile from '../dropRightWhile.js';
var func = convert('dropRightWhile', dropRightWhile);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
