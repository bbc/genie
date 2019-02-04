import convert from './convert.js';
import defaults from '../defaults.js';
var func = convert('defaults', defaults);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
