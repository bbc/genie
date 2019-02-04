import convert from './convert.js';
import chunk from '../chunk.js';
var func = convert('chunk', chunk);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
