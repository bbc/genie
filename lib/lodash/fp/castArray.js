import convert from './convert.js';
import castArray from '../castArray.js';
var func = convert('castArray', castArray);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
