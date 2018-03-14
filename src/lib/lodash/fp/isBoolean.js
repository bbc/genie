import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isBoolean from '../isBoolean.js';
let func = convert('isBoolean', isBoolean, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
