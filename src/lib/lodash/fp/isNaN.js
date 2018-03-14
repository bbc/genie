import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isNaN from '../isNaN.js';
let func = convert('isNaN', isNaN, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
