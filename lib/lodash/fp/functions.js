import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import functions from '../functions.js';
let func = convert('functions', functions, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
