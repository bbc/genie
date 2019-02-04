import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import escape from '../escape.js';
var func = convert('escape', escape, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
