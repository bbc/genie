import convert from './convert.js';
import ceil from '../ceil.js';
var func = convert('ceil', ceil);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
