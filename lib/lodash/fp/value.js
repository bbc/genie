import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import value from '../value';
let func = convert('value', value, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
