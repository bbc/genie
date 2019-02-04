import convert from './convert.js';
import thru from '../thru.js';
var func = convert('thru', thru);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
