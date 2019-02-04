import convert from './convert.js';
import includesFrom from '../includes.js';
var func = convert('includesFrom', includesFrom);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
