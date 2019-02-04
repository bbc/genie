import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import flattenDeep from '../flattenDeep.js';
var func = convert('flattenDeep', flattenDeep, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
