import convert from './convert.js';
import countBy from '../countBy.js';
var func = convert('countBy', countBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
