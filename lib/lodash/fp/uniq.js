import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import uniq from '../uniq.js';
var func = convert('uniq', uniq, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
