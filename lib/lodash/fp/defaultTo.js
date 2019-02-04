import convert from './convert.js';
import defaultTo from '../defaultTo.js';
var func = convert('defaultTo', defaultTo);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
