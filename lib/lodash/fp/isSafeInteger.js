import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import isSafeInteger from '../isSafeInteger.js';
let func = convert('isSafeInteger', isSafeInteger, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
