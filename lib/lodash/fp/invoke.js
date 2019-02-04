import convert from './convert.js';
import invoke from '../invoke.js';
var func = convert('invoke', invoke);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
