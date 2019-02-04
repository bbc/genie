import convert from './convert.js';
import getOr from '../get.js';
var func = convert('getOr', getOr);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
