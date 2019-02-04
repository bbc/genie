import convert from './convert.js';
import indexOf from '../indexOf.js';
var func = convert('indexOf', indexOf);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
