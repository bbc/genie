import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import snakeCase from '../snakeCase.js';
var func = convert('snakeCase', snakeCase, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
