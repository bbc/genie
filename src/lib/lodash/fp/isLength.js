import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isLength from '../isLength.js';
let func = convert('isLength', isLength, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
