import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import sum from '../sum.js';
var func = convert('sum', sum, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
