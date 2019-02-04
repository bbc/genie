import convert from './convert.js';
import indexOfFrom from '../indexOf.js';
var func = convert('indexOfFrom', indexOfFrom);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
