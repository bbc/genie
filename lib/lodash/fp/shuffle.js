import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import shuffle from '../shuffle.js';
let func = convert('shuffle', shuffle, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
