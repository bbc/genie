import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import next from '../next';
var func = convert('next', next, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
