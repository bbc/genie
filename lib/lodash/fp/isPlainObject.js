import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isPlainObject from '../isPlainObject.js';
var func = convert('isPlainObject', isPlainObject, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
