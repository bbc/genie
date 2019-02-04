import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isBuffer from '../isBuffer.js';
var func = convert('isBuffer', isBuffer, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
