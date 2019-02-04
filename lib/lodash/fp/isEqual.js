import convert from './convert.js';
import isEqual from '../isEqual.js';
var func = convert('isEqual', isEqual);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
