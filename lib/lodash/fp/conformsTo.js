import convert from './convert.js';
import conformsTo from '../conformsTo.js';
var func = convert('conformsTo', conformsTo);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
