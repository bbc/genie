import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import upperCase from '../upperCase.js';
var func = convert('upperCase', upperCase, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
