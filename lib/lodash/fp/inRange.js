import convert from './convert.js';
import inRange from '../inRange.js';
var func = convert('inRange', inRange);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
