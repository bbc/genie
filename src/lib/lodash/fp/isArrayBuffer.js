import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isArrayBuffer from '../isArrayBuffer.js';
let func = convert('isArrayBuffer', isArrayBuffer, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
