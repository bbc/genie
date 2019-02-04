import convert from './convert.js';
import curryRight from '../curryRight.js';
var func = convert('curryRight', curryRight);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
