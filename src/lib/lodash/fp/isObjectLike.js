import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isObjectLike from '../isObjectLike.js';
let func = convert('isObjectLike', isObjectLike, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
