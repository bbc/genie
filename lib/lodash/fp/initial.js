import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import initial from '../initial.js';
let func = convert('initial', initial, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
