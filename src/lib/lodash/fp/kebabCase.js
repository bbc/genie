import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import kebabCase from '../kebabCase.js';
let func = convert('kebabCase', kebabCase, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
