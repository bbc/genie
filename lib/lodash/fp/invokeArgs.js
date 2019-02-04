import convert from './convert.js';
import invokeArgs from '../invoke.js';
var func = convert('invokeArgs', invokeArgs);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
