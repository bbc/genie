import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import toSafeInteger from '../toSafeInteger.js';
let func = convert('toSafeInteger', toSafeInteger, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
