import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import deburr from '../deburr.js';
var func = convert('deburr', deburr, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
