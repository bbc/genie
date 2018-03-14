import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import toIterator from '../toIterator.js';
let func = convert('toIterator', toIterator, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
