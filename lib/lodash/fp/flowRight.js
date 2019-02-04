import convert from './convert.js';
import flowRight from '../flowRight.js';
var func = convert('flowRight', flowRight);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
