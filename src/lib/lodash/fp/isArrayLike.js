import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isArrayLike from '../isArrayLike.js';
let func = convert('isArrayLike', isArrayLike, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
