import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isNative from '../isNative.js';
var func = convert('isNative', isNative, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
