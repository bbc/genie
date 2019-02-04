import convert from './convert.js';
import lte from '../lte.js';
var func = convert('lte', lte);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
