import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isArray from '../isArray.js';
var func = convert('isArray', isArray, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
