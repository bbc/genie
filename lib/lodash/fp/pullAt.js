import convert from './convert.js';
import pullAt from '../pullAt.js';
var func = convert('pullAt', pullAt);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
