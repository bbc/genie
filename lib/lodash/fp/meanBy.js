import convert from './convert.js';
import meanBy from '../meanBy.js';
var func = convert('meanBy', meanBy);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
