import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import commit from '../commit';
var func = convert('commit', commit, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
