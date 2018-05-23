import convert from './convert.js';
import getOr from '../get.js';
let func = convert('getOr', getOr);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
