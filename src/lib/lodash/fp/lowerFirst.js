import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import lowerFirst from '../lowerFirst.js';
let func = convert('lowerFirst', lowerFirst, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
