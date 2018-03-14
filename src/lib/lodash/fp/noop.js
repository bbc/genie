import convert from './convert.js';
import _falseOptions from './_falseOptions.js';
import noop from '../noop.js';
let func = convert('noop', noop, _falseOptions);

import placeholder from './placeholder.js';
func.placeholder = placeholder
export default func;
