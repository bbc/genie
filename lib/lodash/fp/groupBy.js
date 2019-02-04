import convert from './convert.js';
import groupBy from '../groupBy.js';
var func = convert('groupBy', groupBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
