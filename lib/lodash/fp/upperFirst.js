import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import upperFirst from '../upperFirst.js';
var func = convert('upperFirst', upperFirst, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
