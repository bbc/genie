import convert from './convert.js';
import partial from '../partial.js';
var func = convert('partial', partial);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
