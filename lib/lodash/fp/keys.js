import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import keys from '../keys.js';
let func = convert('keys', keys, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
