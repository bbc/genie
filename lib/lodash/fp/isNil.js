import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isNil from '../isNil.js';
var func = convert('isNil', isNil, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
