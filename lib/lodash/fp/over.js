import convert from './convert.js';
import over from '../over.js';
var func = convert('over', over);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
