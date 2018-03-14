import convert from './convert.js';
import fromPairs from '../fromPairs.js';
let func = convert('fromPairs', fromPairs);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
