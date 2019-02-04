import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import lowerCase from '../lowerCase.js';
var func = convert('lowerCase', lowerCase, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
