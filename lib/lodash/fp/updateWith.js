import convert from './convert.js';
import updateWith from '../updateWith.js';
var func = convert('updateWith', updateWith);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
