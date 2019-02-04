import convert from './convert.js';
import result from '../result.js';
var func = convert('result', result);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
