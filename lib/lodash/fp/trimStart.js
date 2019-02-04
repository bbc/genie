import convert from './convert.js';
import trimStart from '../trimStart.js';
var func = convert('trimStart', trimStart);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
