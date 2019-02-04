import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isNull from '../isNull.js';
var func = convert('isNull', isNull, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
