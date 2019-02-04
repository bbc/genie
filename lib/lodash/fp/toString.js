import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import toString from '../toString.js';
var func = convert('toString', toString, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
