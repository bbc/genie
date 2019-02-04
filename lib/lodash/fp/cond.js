import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import cond from '../cond.js';
var func = convert('cond', cond, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
