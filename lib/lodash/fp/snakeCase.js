import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import snakeCase from '../snakeCase.js';
let func = convert('snakeCase', snakeCase, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
