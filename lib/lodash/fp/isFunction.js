import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isFunction from '../isFunction.js';
let func = convert('isFunction', isFunction, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
