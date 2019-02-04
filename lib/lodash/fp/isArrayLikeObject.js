import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isArrayLikeObject from '../isArrayLikeObject.js';
var func = convert('isArrayLikeObject', isArrayLikeObject, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
