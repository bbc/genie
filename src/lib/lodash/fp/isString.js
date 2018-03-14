import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isString from '../isString.js';
let func = convert('isString', isString, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
