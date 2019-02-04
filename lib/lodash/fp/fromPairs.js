import convert from './convert.js';
import fromPairs from '../fromPairs.js';
var func = convert('fromPairs', fromPairs);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
