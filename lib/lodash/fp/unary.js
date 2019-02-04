import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import unary from '../unary.js';
var func = convert('unary', unary, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
