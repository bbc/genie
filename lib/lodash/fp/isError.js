import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isError from '../isError.js';
var func = convert('isError', isError, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
