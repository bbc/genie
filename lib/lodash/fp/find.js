import convert from './convert.js';
import find from '../find.js';
var func = convert('find', find);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
