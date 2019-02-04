import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import flatten from '../flatten.js';
var func = convert('flatten', flatten, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
