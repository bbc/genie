import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import toFinite from '../toFinite.js';
var func = convert('toFinite', toFinite, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
