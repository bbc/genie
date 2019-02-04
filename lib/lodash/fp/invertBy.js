import convert from './convert.js';
import invertBy from '../invertBy.js';
var func = convert('invertBy', invertBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
