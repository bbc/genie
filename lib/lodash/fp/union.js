import convert from './convert.js';
import union from '../union.js';
var func = convert('union', union);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
