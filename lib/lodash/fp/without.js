import convert from './convert.js';
import without from '../without.js';
var func = convert('without', without);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
