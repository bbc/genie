import convert from './convert.js';
import takeRight from '../takeRight.js';
var func = convert('takeRight', takeRight);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
