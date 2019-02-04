import convert from './convert.js';
import partialRight from '../partialRight.js';
var func = convert('partialRight', partialRight);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
