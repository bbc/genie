import convert from './convert.js';
import rangeRight from '../rangeRight.js';
let func = convert('rangeRight', rangeRight);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
