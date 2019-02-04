import convert from './convert.js';
import trimEnd from '../trimEnd.js';
var func = convert('trimEnd', trimEnd);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
