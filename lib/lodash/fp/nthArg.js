import convert from './convert.js';
import nthArg from '../nthArg.js';
var func = convert('nthArg', nthArg);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
