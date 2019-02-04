import convert from './convert.js';
import includes from '../includes.js';
var func = convert('includes', includes);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
