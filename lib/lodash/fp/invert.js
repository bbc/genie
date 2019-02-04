import convert from './convert.js';
import invert from '../invert.js';
var func = convert('invert', invert);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
